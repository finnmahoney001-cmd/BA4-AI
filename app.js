const page = document.body.dataset.page;
const query = new URLSearchParams(location.search);
const localReview = ['localhost','127.0.0.1','[::1]'].includes(location.hostname) || location.protocol === 'file:';
const preview = query.get('preview') === '1' && localReview;
const data = window.BH_DATA;
const $ = selector => document.querySelector(selector);
function element(tag, value, className) {
  const node = document.createElement(tag); node.textContent = value;
  if(className) node.className = className; return node;
}
const announce = message => { if($('#status')) $('#status').textContent = message; };
const route = href => preview ? href + (href.includes('?')?'&':'?') + 'preview=1' : href;
for(const link of document.querySelectorAll('[data-route]')) {
  link.setAttribute('href',route(link.getAttribute('href')));
  if(link.dataset.page===page) link.setAttribute('aria-current','page');
}
let client = null;
let signedIn = false;
const PENDING_SAVE_KEY='bh-pending-save-v1';
const loginReturn=()=>query.get('save')==='1'?'index.html?save=1':'index.html';
function updateAccountControl() {
  const button=$('#logout');
  if(button) button.textContent=signedIn?'Log Out':'Log In';
}
async function authenticate() {
  // Building is public and never waits for an authentication service.
  document.body.hidden=false;
  updateAccountControl();
  const config=window.PUBLIC_SUPABASE || {};
  if(!config.url || !config.key) {
    if(page==='login') announce('Sign-in is not configured yet. You can still build without logging in.');
    return;
  }
  try {
    await new Promise((resolve,reject)=>{
      if(window.supabase) return resolve();
      const script=document.createElement('script'); script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload=resolve; script.onerror=()=>reject(new Error('Sign-in could not load. Check your connection.')); document.head.append(script);
    });
    client=window.supabase.createClient(config.url,config.key);
    const {data:sessionData,error}=await client.auth.getSession(); if(error) throw error;
    signedIn=!!sessionData.session;
    updateAccountControl();
    if(page==='login'&&signedIn) location.replace(loginReturn());
  } catch(error) {
    if(page==='login') announce(error.message);
  }
}
async function requireSaveSession(name,equipment) {
  await authReady;
  if(client) {
    try {
      const {data:sessionData,error}=await client.auth.getSession();
      if(error) throw error;
      signedIn=!!sessionData.session;
      updateAccountControl();
      if(signedIn) return true;
    } catch(error) {announce('Could not verify login. Please log in to save your build.');}
  }
  try {
    localStorage.setItem(DRAFT_KEY,JSON.stringify(equipment));
    sessionStorage.setItem(PENDING_SAVE_KEY,JSON.stringify({name,slot:$('#armory-save-slot')?.value||''}));
  } catch {announce('Browser storage is unavailable. Your draft could not be preserved for login.');return false;}
  location.href='login.html?save=1';
  return false;
}
$('#logout')?.addEventListener('click',async()=>{
  await authReady;
  if(!signedIn) {location.href='login.html';return;}
  if(client) {const {error}=await client.auth.signOut(); if(error) {announce(error.message); return;}}
  location.href='index.html';
});
$('#show-password')?.addEventListener('change',event=>{const password=$('#password');if(password)password.type=event.target.checked?'text':'password';});
$('#auth-form')?.addEventListener('submit',async event=>{
  event.preventDefault(); if(!client) {announce('Sign-in is not available yet. You can continue building without logging in.'); return;}
  const submitter=event.submitter || $('#auth-form button[type=submit]');
  const buttons=[...$('#auth-form').querySelectorAll('button')]; buttons.forEach(b=>b.disabled=true);
  try {
    const {data:result,error}=await client.auth[submitter.value]({email:$('#email').value,password:$('#password').value});
    if(error) throw error; if(result.session) location.href=loginReturn(); else announce('Check your email to confirm your account, then log in.');
  } catch(error) {announce(error.message);} finally {buttons.forEach(b=>b.disabled=false);}
});
if($('#preview-link')) $('#preview-link').hidden=!localReview;
const BUILD_KEY='bh-builds-v1', DRAFT_KEY='bh-draft-v1';
function validEquipment(equipment) {
  equipment=data.normalizeEquipment?data.normalizeEquipment(equipment):equipment;
  const result={};
  for(const slot of data.slots) if(data.items.some(item=>item.id===equipment?.[slot.id]&&item.slot===slot.id)) result[slot.id]=equipment[slot.id];
  if(equipment?._settings && typeof equipment._settings==='object') result._settings={...equipment._settings};
  if(result._settings) {const deferred=['combat-mode','self-hp','target-hp','current-sp','skill-sp','shielded','health-rank','team-state','weapon-type','enemies','allies','first-incoming','first-outgoing','target-shielded','target-status','attack-type'];deferred.forEach(key=>delete result._settings[key]);}
  return result;
}
function readBuilds() {
  try {
    let stored=JSON.parse(localStorage.getItem(BUILD_KEY)||'null');
    if(!Array.isArray(stored)) {
      const legacy=JSON.parse(localStorage.getItem('bh-placeholder-builds-c')||'[]');
      stored=Array.isArray(legacy)?legacy.map((build,i)=>({id:'legacy-'+i,name:'Placeholder build '+(i+1),equipment:Object.fromEntries((Array.isArray(build.slots)?build.slots:[]).map(n=>['slot-'+n,'placeholder-'+n]))})):[];
      if(stored.length) localStorage.setItem(BUILD_KEY,JSON.stringify(stored));
    }
    return stored.filter(build=>typeof build.id==='string').map(build=>({...build,name:String(build.name||'Untitled build'),equipment:validEquipment(build.equipment)}));
  } catch {return [];}
}
function storeBuilds(builds) {
  try {localStorage.setItem(BUILD_KEY,JSON.stringify(builds)); return true;}
  catch {announce('Browser storage is unavailable. The build could not be saved.'); return false;}
}
function calculate(equipment) {
  if(typeof data.calculate!=='function') return null;
  try {return data.calculate(equipment);} catch {return null;}
}
function statValue(results,id) {const value=results?.[id]; return typeof value==='number'&&Number.isFinite(value)?Number(value.toFixed(3))+'%':'—';}
function renderBonusValue(node,summary,stat) {
  node.classList.add('bonus-values');node.replaceChildren();
  const extra=summary.conditional[stat.id];
  if(extra){
    const conditional=element('span','('+Number(extra.toFixed(3))+'%)','conditional-bonus');
    conditional.setAttribute('aria-label','Remaining conditional bonus '+Number(extra.toFixed(3))+' percent');
    conditional.dataset.description='Remaining potential additional '+stat.label+'. Bonuses already included in the displayed value have been subtracted. Conditions may apply at different times.\n'+summary.conditionalSources[stat.id].map(x=>x.source+': '+x.value+'%').join('\n');
    conditional.title=conditional.dataset.description;node.append(conditional);
  }
  const fixed=element('span',statValue(summary.permanent.values,stat.id),'static-bonus');
  fixed.dataset.description='Permanent '+stat.label+'\n'+(summary.permanent.contributions[stat.label]||[]).map(x=>x.source+': '+x.value+'%').join('\n');
  fixed.title=fixed.dataset.description;node.append(fixed);
}
const equipmentName=(equipment,slotId)=>BH_UI.label(data.items.find(item=>item.id===equipment[slotId]));
function artwork(item,compact=false) {
    if(item.image) {const image=document.createElement('img'); image.src=item.image; image.alt=item.imageAlt||item.name; image.className='item-image'; image.loading='lazy'; image.addEventListener('error',()=>{const fallback=element('div','Artwork unavailable','art-placeholder'+(compact?' compact-art':''));fallback.setAttribute('role','img');fallback.setAttribute('aria-label','Missing image for '+item.name);image.replaceWith(fallback);},{once:true}); return image;}
  const art=element('div','[ADD: image of equipment item]','art-placeholder'+(compact?' compact-art':''));
  art.setAttribute('role','img'); art.setAttribute('aria-label','Missing image for '+item.name); return art;
}
if(page==='closet') {
  const selected=new Set(),expanded=new Set();
  function renderCards() {
    const builds=readBuilds(); $('#saved-builds').replaceChildren(); $('#closet-empty').hidden=builds.length>0;
    for(const build of builds) {
      const card=document.createElement('article'); card.className='panel build-card'; card.append(element('h2',build.name));
      const equipped=data.slots.filter(slot=>build.equipment[slot.id]);
      card.append(element('p',equipped.length+' equipped slots','quiet build-count'));
      const details=document.createElement('details');details.className='build-details';details.open=expanded.has(build.id);details.append(element('summary','Bonus %'));details.addEventListener('toggle',()=>{if(details.open)expanded.add(build.id);else expanded.delete(build.id);});
      const mainEquipment=element('dl','','closet-main-equipment');
      ['mainhand','neck','offhand','ring','head','accessory','body','pet','mount'].forEach(slotId=>{
        const slot=data.slots.find(entry=>entry.id===slotId),item=data.items.find(entry=>entry.id===build.equipment[slotId]);
        const row=element('div',''),name=element('dd',item?BH_UI.label(item):'Empty slot');
        if(item){name.dataset.kind=item.kind;BH_UI.describe(name,item,build.equipment._settings?.['rarity-'+slotId],build.equipment._settings||{});}
        row.append(element('dt',slot.label||slot.name||slotId),name);mainEquipment.append(row);
      });
      card.append(mainEquipment);
      const bonuses=document.createElement('dl');bonuses.className='closet-bonuses';
      const bonusSummary=data.bonusSummary(build.equipment);
      data.stats.forEach(stat=>{const row=element('div','','bonus-line'),value=element('dd','','technical');renderBonusValue(value,bonusSummary,stat);row.append(element('dt',stat.label,'technical'),value);bonuses.append(row);});details.append(bonuses);
      if(data.evaluate){const report=data.evaluate(build.equipment);card.append(element('p',report.ctx.enabled?'Snapshot totals · saved combat conditions':'Permanent bonus totals','quiet'));if(report.warnings.length)details.append(element('p',report.warnings.join(' '),'quiet'));}
      card.append(details);
      const actions=document.createElement('div'); actions.className='actions';
      const open=element('a','Load build','button-link'); open.href=route('index.html?build='+encodeURIComponent(build.id));
      const label=document.createElement('label'); label.className='compare-choice';
      const checkbox=document.createElement('input'); checkbox.type='checkbox'; checkbox.checked=selected.has(build.id); checkbox.disabled=selected.size===2&&!checkbox.checked; checkbox.setAttribute('aria-label','Compare '+build.name);
      checkbox.addEventListener('change',()=>{if(checkbox.checked) selected.add(build.id); else selected.delete(build.id); $('#comparison').hidden=true; renderCards(); announce(selected.size+' of 2 builds selected.');}); label.append(checkbox,element('span','Compare'));
      const remove=element('button','Delete build'); remove.type='button';
      remove.addEventListener('click',()=>{if(storeBuilds(readBuilds().filter(entry=>entry.id!==build.id))) {selected.delete(build.id); $('#comparison').hidden=true; renderCards(); announce('Build deleted from this browser.');}});
      actions.append(open,label,remove); card.append(actions); $('#saved-builds').append(card);
    }
    $('#compare-builds').disabled=selected.size!==2; $('#compare-count').textContent=selected.size+' / 2 selected';
  }
  $('#compare-builds').addEventListener('click',()=>{
    const builds=readBuilds().filter(build=>selected.has(build.id)); if(builds.length!==2) return;
    $('#comparison-content').replaceChildren(); const names=document.createElement('div'); names.className='comparison-names'; builds.forEach(build=>names.append(element('h3',build.name))); $('#comparison-content').append(names);
    function comparisonRow(label,values,note,different=false) {
      const row=document.createElement('div'); row.className='comparison-row'+(different?' differs':''); row.append(element('h3',label,'technical'));
      values.forEach((value,i)=>{const p=document.createElement('p'); p.append(element('span',builds[i].name,'mobile-build-label'),element('span',value)); row.append(p);});
      row.append(element('span',note,'difference-label')); $('#comparison-content').append(row); return row;
    }
    data.slots.forEach(slot=>{const different=(builds[0].equipment[slot.id]||'')!==(builds[1].equipment[slot.id]||''); comparisonRow(slot.label,builds.map(build=>equipmentName(build.equipment,slot.id)),different?'Different equipment':'Same equipment',different);});
    const settings=new Set(builds.flatMap(build=>Object.keys(build.equipment._settings||{})));
    settings.forEach(key=>{const values=builds.map(build=>build.equipment._settings?.[key]||'Not set'); comparisonRow(key.replaceAll('-',' '),values,values[0]===values[1]?'Same setting':'Different setting',values[0]!==values[1]);});
    const summaries=builds.map(build=>data.bonusSummary(build.equipment));
    const results=summaries.map(summary=>summary.permanent.values);
    data.stats.forEach(stat=>{
      const a=results[0]?.[stat.id], b=results[1]?.[stat.id]; const known=typeof a==='number'&&typeof b==='number'&&Number.isFinite(a)&&Number.isFinite(b);
      const row=comparisonRow(stat.label,['',''],known?'Permanent difference: '+Number((b-a).toFixed(3)):'Permanent difference unavailable');
      row.classList.add('stat-comparison');
      row.querySelectorAll('p').forEach((cell,i)=>renderBonusValue(cell.lastChild,summaries[i],stat));
      if(known&&b!==a) row.querySelector('.difference-label').classList.add(b>a?'positive':'negative');
      if(summaries.some(summary=>summary.conditional[stat.id])){
        const delta=Number((summaries[1].conditional[stat.id]-summaries[0].conditional[stat.id]).toFixed(3));
        const note=element('span','Conditional difference: '+delta,'difference-label conditional-difference');
        note.title='Difference in potential additional bonuses. Bonuses already included in the displayed value have been subtracted. Conditions may apply at different times.';row.append(note);
      }
    });
    $('#comparison').hidden=false; announce('Comparing two builds. Equipment differences are highlighted; unavailable statistics are not estimated.');
  }); renderCards();
}
if(page==='library') {
  const slotFilter=$('#slot-filter'),kindFilter=$('#kind-filter'),lastAdded=new Map();
  const group=item=>item.slot.startsWith('major-')?'major':item.slot.startsWith('minor-')?'minor':item.slot.startsWith('enchant-')?'enchant':item.slot;
  const categories=[...data.slots.filter(s=>s.group==='Main Equips').map(s=>[s.id,s.label]),['relic','Relic'],['artifact','Artifact'],['minor','Minor Rune'],['major','Major Rune'],['meta','Meta Rune'],['enchant','Enchant']];
  const labels=Object.fromEntries(categories);

  const seen=new Set(),catalog=data.items.filter(item=>{const key=group(item)+'|'+BH_UI.name(item)+'|'+item.kind;if(seen.has(key))return false;seen.add(key);return true;});
  const categoryRules=new Map(),typeRules=new Map();
  function matchesRule(rules,value){return rules.get(value)!=='exclude';}
  function setupFilter(container,entries,rules,allLabel){
    const options=container.querySelector('.filter-options');
    const bulk=element('div','','filter-bulk');
    for(const [mode,label] of [['include','Include all'],['exclude','Exclude all']]){
      const button=element('button',label);button.type='button';button.setAttribute('aria-label',label+(container===slotFilter?' categories':' item types'));
      button.addEventListener('click',()=>{for(const key of rules.keys())rules.set(key,mode);options.querySelectorAll('select').forEach(select=>select.value=mode);updateFilterLabel(container,rules,allLabel);renderLibrary();});bulk.append(button);
    }options.append(bulk);
    entries.forEach(([value,text])=>{const row=element('label','','filter-rule');row.append(element('span',text));const select=document.createElement('select');select.setAttribute('aria-label',(container===slotFilter?'Category: ':'Item type: ')+text+' filter');[['include','Include'],['exclude','Exclude']].forEach(([mode,label])=>{const option=element('option',label);option.value=mode;select.append(option);});select.addEventListener('change',()=>{rules.set(value,select.value);updateFilterLabel(container,rules,allLabel);renderLibrary();});rules.set(value,'include');row.append(select);options.append(row);});
  }
  function updateFilterLabel(container,rules,allLabel){const included=[...rules.values()].filter(mode=>mode==='include').length,excluded=[...rules.values()].filter(mode=>mode==='exclude').length;container.querySelector('summary').textContent=excluded?included+' included / '+excluded+' excluded':allLabel;container.classList.toggle('filter-active',excluded>0);}
  setupFilter(slotFilter,categories,categoryRules,'All categories');
  setupFilter(kindFilter,[...new Set(catalog.map(item=>item.kind))].sort().map(kind=>[kind,kind==='Leg'?'Legendary':kind==='Myth'?'Mythic':kind]),typeRules,'All types');
  function renderLibrary() {
    try{BH_UI.setContext(data.normalizeEquipment(JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}'))._settings);}catch{BH_UI.setContext({});}
    const needle=$('#library-search').value.trim().toLowerCase();
    const items=catalog.filter(item=>matchesRule(categoryRules,group(item))&&matchesRule(typeRules,item.kind)&&(BH_UI.label(item)+' '+item.name+' '+(item.aliases||[]).join(' ')+' '+item.description).toLowerCase().includes(needle));
    $('#library-results').replaceChildren();$('#library-empty').hidden=items.length>0;$('#result-count').textContent=items.length+(items.length===1?' item':' items');
    items.sort(BH_UI.compare).forEach(item=>{
      const card=document.createElement('article');card.className='panel item-card';card.dataset.kind=item.kind;
      let rarity=data.rarities[item.slot]?.[0];
      const description=element('p',BH_UI.description(item,rarity),'quiet');
      BH_UI.describe(card,item,rarity);card.append(artwork(item,true),element('p',labels[group(item)],'technical detail-kicker'),element('h2',BH_UI.label(item)),description,element('p',item.kind,'technical saved-stat'));
      if(data.rarities[item.slot]) {
        const label=element('label','Rarity','field-label'),select=document.createElement('select');select.id='library-rarity-'+item.id;label.htmlFor=select.id;
        data.rarities[item.slot].forEach(value=>{const option=element('option',value==='Myth'?'Mythic':'Legendary');option.value=value;select.append(option);});
        select.value=rarity;select.dataset.kind=rarity;select.setAttribute('aria-label',BH_UI.name(item)+' rarity');
        select.addEventListener('change',()=>{rarity=select.value;select.dataset.kind=rarity;description.textContent=BH_UI.description(item,rarity);BH_UI.describe(card,item,rarity);add.textContent='Use in Planner';});card.append(label,select);
      }
      const add=element('button','Use in Planner','button-link');add.type='button';
      add.addEventListener('click',()=>{
        try {
          const draft=validEquipment(JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}'));
          const compatible=data.slots.filter(slot=>group({slot:slot.id})===group(item)).map(slot=>slot.id);
          if(group(item)==='enchant'){
            const saved=validEquipment(BH_UI.applyAll(draft,compatible,item));
            localStorage.setItem(DRAFT_KEY,JSON.stringify(saved));
            $('#library-status').textContent='Equipped '+BH_UI.name(item)+' in all six enchant slots.';
            add.textContent='Added to Planner';return;
          }
          const slot=BH_UI.nextSlot(compatible,draft,lastAdded.get(group(item)));
          const target=data.items.find(candidate=>candidate.slot===slot&&candidate.kind===item.kind&&BH_UI.name(candidate)===BH_UI.name(item));
          if(!target)throw new Error('No compatible slot found for this item.');
          const previous=data.items.find(candidate=>candidate.id===draft[slot]);
          draft._settings=draft._settings||{};
          if(draft[slot]!==target.id)delete draft._settings['t12-'+slot];
          draft[slot]=target.id;
          if(rarity&&data.rarities[slot]?.includes(rarity))draft._settings['rarity-'+slot]=rarity;
          if(data.slots.find(s=>s.id===slot)?.group==='Main Equips')draft._settings['type-'+slot]=target.kind;
          const saved=validEquipment(draft);localStorage.setItem(DRAFT_KEY,JSON.stringify(saved));lastAdded.set(group(item),slot);
          $('#library-status').textContent='Equipped '+BH_UI.name(target)+(rarity?' ('+(rarity==='Myth'?'Mythic':'Legendary')+')':'')+' in '+data.slots.find(s=>s.id===slot).label+'.'+(previous&&previous.id!==target.id?' Replaced '+BH_UI.name(previous)+'.':'');
          add.textContent='Added to Planner';
        } catch(error) {$('#library-status').textContent='Could not add this item. '+(error.name==='QuotaExceededError'?'Browser storage is full.':error.name==='SyntaxError'?'The current draft could not be read.':error.message);}
      });card.append(add);$('#library-results').append(card);
    });
  }
  $('#library-search').addEventListener('input',renderLibrary);
  $('#library-clear').addEventListener('click',()=>{$('#library-search').value='';for(const key of categoryRules.keys())categoryRules.set(key,'include');for(const key of typeRules.keys())typeRules.set(key,'include');[slotFilter,kindFilter].forEach(container=>container.querySelectorAll('select').forEach(select=>select.value='include'));updateFilterLabel(slotFilter,categoryRules,'All categories');updateFilterLabel(kindFilter,typeRules,'All types');renderLibrary();$('#library-search').focus();});
  document.addEventListener('click',event=>{[slotFilter,kindFilter].forEach(container=>{if(!container.contains(event.target))container.open=false;});});
  [slotFilter,kindFilter].forEach(container=>container.addEventListener('keydown',event=>{if(event.key==='Escape'){container.open=false;container.querySelector('summary').focus();}}));
  renderLibrary();
}

const authReady=authenticate();
