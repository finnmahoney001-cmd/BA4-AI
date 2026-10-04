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
async function authenticate() {
  if(preview) { document.body.hidden=false; return; }
  const config=window.PUBLIC_SUPABASE || {};
  if(!config.url || !config.key) {
    if(page!=='login') {location.replace('login.html'); return;}
    document.body.hidden=false; announce('Sign-in needs the public Supabase URL and key. Local design preview is available below.'); return;
  }
  try {
    await new Promise((resolve,reject)=>{
      if(window.supabase) return resolve();
      const script=document.createElement('script'); script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload=resolve; script.onerror=()=>reject(new Error('Sign-in could not load. Check your connection.')); document.head.append(script);
    });
    client=window.supabase.createClient(config.url,config.key);
    const {data:sessionData,error}=await client.auth.getSession(); if(error) throw error;
    if(page!=='login'&&!sessionData.session) {location.replace('login.html'); return;}
    if(page==='login'&&sessionData.session) {location.replace('index.html'); return;}
    document.body.hidden=false;
  } catch(error) {
    if(page!=='login') {location.replace('login.html'); return;}
    document.body.hidden=false; announce(error.message);
  }
}
$('#logout')?.addEventListener('click',async()=>{
  if(client) {const {error}=await client.auth.signOut(); if(error) {announce(error.message); return;}}
  location.href='login.html';
});
$('#auth-form')?.addEventListener('submit',async event=>{
  event.preventDefault(); if(!client) {announce('Sign-in is not configured yet. Use the local design preview.'); return;}
  const submitter=event.submitter || $('#auth-form button[type=submit]');
  const buttons=[...$('#auth-form').querySelectorAll('button')]; buttons.forEach(b=>b.disabled=true);
  try {
    const {data:result,error}=await client.auth[submitter.value]({email:$('#email').value,password:$('#password').value});
    if(error) throw error; if(result.session) location.href='index.html'; else announce('Check your email to confirm your account, then log in.');
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
const equipmentName=(equipment,slotId)=>BH_UI.label(data.items.find(item=>item.id===equipment[slotId]));
function artwork(item,compact=false) {
    if(item.image) {const image=document.createElement('img'); image.src=item.image; image.alt=item.imageAlt||item.name; image.className='item-image'; image.loading='lazy'; image.addEventListener('error',()=>{const fallback=element('div','Artwork unavailable','art-placeholder'+(compact?' compact-art':''));fallback.setAttribute('role','img');fallback.setAttribute('aria-label','Missing image for '+item.name);image.replaceWith(fallback);},{once:true}); return image;}
  const art=element('div','[ADD: image of equipment item]','art-placeholder'+(compact?' compact-art':''));
  art.setAttribute('role','img'); art.setAttribute('aria-label','Missing image for '+item.name); return art;
}
if(page==='closet') {
  const selected=new Set();
  function renderCards() {
    const builds=readBuilds(); $('#saved-builds').replaceChildren(); $('#closet-empty').hidden=builds.length>0;
    for(const build of builds) {
      const card=document.createElement('article'); card.className='panel build-card'; card.append(element('h2',build.name));
      const list=document.createElement('dl'); list.className='build-equipment';
      data.slots.filter(slot=>build.equipment[slot.id]).forEach(slot=>{const row=document.createElement('div'); row.append(element('dt',slot.group==='Enchants'?'Enchant '+slot.label:slot.label),element('dd',equipmentName(build.equipment,slot.id))); list.append(row);});
      Object.entries(build.equipment._settings||{}).filter(([key])=>!key.startsWith('type-')).forEach(([key,value])=>{const row=document.createElement('div');row.append(element('dt',key.replaceAll('-',' ')),element('dd',String(value)));list.append(row);}); card.append(list);
      const results=calculate(build.equipment); data.stats.slice(0,3).forEach(stat=>card.append(element('p',stat.label+': '+statValue(results,stat.id),'technical saved-stat')));
      if(data.evaluate){const report=data.evaluate(build.equipment);card.append(element('p',report.ctx.enabled?'Snapshot totals · saved combat conditions':'Permanent bonus totals','quiet'));if(report.warnings.length)card.append(element('p',report.warnings.join(' '),'quiet'));}
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
    const results=builds.map(build=>calculate(build.equipment));
    data.stats.forEach(stat=>{
      const a=results[0]?.[stat.id], b=results[1]?.[stat.id]; const known=typeof a==='number'&&typeof b==='number'&&Number.isFinite(a)&&Number.isFinite(b);
      const row=comparisonRow(stat.label,results.map(result=>statValue(result,stat.id)),known?'Difference: '+(b-a):'Difference unavailable');
      row.classList.add('stat-comparison');
      if(known&&b!==a) row.querySelector('.difference-label').classList.add(b>a?'positive':'negative');
    });
    $('#comparison').hidden=false; announce('Comparing two builds. Equipment differences are highlighted; unavailable statistics are not estimated.');
  }); renderCards();
}
if(page==='library') {
  const slotFilter=$('#slot-filter'),kindFilter=$('#kind-filter');
  const group=item=>item.slot.startsWith('major-')?'major':item.slot.startsWith('minor-')?'minor':item.slot.startsWith('enchant-')?'enchant':item.slot;
  const categories=[...data.slots.filter(s=>s.group==='Main Equips').map(s=>[s.id,s.label]),['relic','Relic'],['artifact','Artifact'],['minor','Minor Rune'],['major','Major Rune'],['meta','Meta Rune'],['enchant','Enchant']];
  const labels=Object.fromEntries(categories);
  categories.forEach(([value,label])=>{const option=element('option',label);option.value=value;slotFilter.append(option);});
  const seen=new Set(),catalog=data.items.filter(item=>{const key=group(item)+'|'+BH_UI.name(item)+'|'+item.kind;if(seen.has(key))return false;seen.add(key);return true;});
  function updateKinds(){const selected=kindFilter.value;kindFilter.replaceChildren(element('option','All types'));kindFilter.firstChild.value='';const kinds=[...new Set(catalog.filter(item=>!slotFilter.value||group(item)===slotFilter.value).map(item=>item.kind))].filter(k=>!['Rune','Enchant'].includes(k)).sort();kinds.forEach(kind=>{const option=element('option',kind==='Leg'?'Legendary':kind==='Myth'?'Mythic':kind);option.value=kind;kindFilter.append(option);});kindFilter.value=kinds.includes(selected)?selected:'';kindFilter.disabled=!kinds.length;}
  function renderLibrary() {
    const needle=$('#library-search').value.trim().toLowerCase();
    const items=catalog.filter(item=>(!slotFilter.value||group(item)===slotFilter.value)&&(!kindFilter.value||item.kind===kindFilter.value)&&(BH_UI.label(item)+' '+item.name+' '+item.description).toLowerCase().includes(needle));
    slotFilter.classList.toggle('filter-active',Boolean(slotFilter.value));$('#library-results').replaceChildren();$('#library-empty').hidden=items.length>0;$('#result-count').textContent=items.length+(items.length===1?' item':' items');
    items.sort(BH_UI.compare).forEach(item=>{
      const card=document.createElement('article');card.className='panel item-card';card.dataset.kind=item.kind;
      BH_UI.describe(card,item);card.append(artwork(item,true),element('p',labels[group(item)],'technical detail-kicker'),element('h2',BH_UI.label(item)),element('p',BH_UI.description(item),'quiet'),element('p',item.kind,'technical saved-stat'));
      const link=element('a','Use in planner','button-link');link.href=route('index.html?item='+encodeURIComponent(item.id));card.append(link);$('#library-results').append(card);
    });
  }
  $('#library-search').addEventListener('input',renderLibrary);slotFilter.addEventListener('change',()=>{updateKinds();renderLibrary();});kindFilter.addEventListener('change',renderLibrary);
  $('#library-clear').addEventListener('click',()=>{$('#library-search').value='';slotFilter.value='';kindFilter.value='';updateKinds();renderLibrary();$('#library-search').focus();});updateKinds();renderLibrary();
}

authenticate();
