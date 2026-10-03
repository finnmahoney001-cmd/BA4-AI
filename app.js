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
  const result={};
  for(const slot of data.slots) if(data.items.some(item=>item.id===equipment?.[slot.id]&&item.slot===slot.id)) result[slot.id]=equipment[slot.id];
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
function statValue(results,id) {const value=results?.[id]; return typeof value==='number'&&Number.isFinite(value)?String(value):'—';}
const equipmentName=(equipment,slotId)=>data.items.find(item=>item.id===equipment[slotId])?.name || 'Empty slot';
function artwork(item,compact=false) {
  if(item.image) {const image=document.createElement('img'); image.src=item.image; image.alt=item.name; image.className='item-image'; return image;}
  const art=element('div','[ADD: image of equipment item]','art-placeholder'+(compact?' compact-art':''));
  art.setAttribute('role','img'); art.setAttribute('aria-label','Missing image for '+item.name); return art;
}
if(page==='planner') {
  let equipment={'slot-1':'placeholder-1'};
  try {const draft=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null'); if(draft) equipment=validEquipment(draft);} catch {}
  const loaded=readBuilds().find(build=>build.id===query.get('build'));
  if(loaded) {equipment={...loaded.equipment}; $('#build-name').value=loaded.name;}
  const linked=data.items.find(item=>item.id===query.get('item')); if(linked) equipment[linked.slot]=linked.id;
  let selected=linked?.slot || data.slots[0].id;
  const rows=[...document.querySelectorAll('[data-slot]')];
  function render() {
    rows.forEach(row=>{row.setAttribute('aria-pressed',String(row.dataset.slot===selected)); row.querySelector('.slot-state').textContent=equipmentName(equipment,row.dataset.slot);});
    $('#detail-slot').textContent=data.slots.find(slot=>slot.id===selected).label;
    const item=data.items.find(item=>item.id===equipment[selected]);
    $('#item-title').textContent=item?.name || 'No equipment selected';
    $('#item-description').textContent=item?.description || 'Choose an item for this equipment slot.';
    $('#item-art').replaceChildren(artwork(item || {name:'equipment item',image:''}));
    $('#remove').disabled=!item; $('#change').textContent=item?'Change equipment':'Choose equipment';
    const results=calculate(equipment);
    document.querySelectorAll('[data-stat]').forEach(node=>node.textContent=statValue(results,node.dataset.stat));
    $('#calculation-status').textContent=results?'Results updated for the current equipment.':'Values need the supplied workbook and verified formulas.';
    try {localStorage.setItem(DRAFT_KEY,JSON.stringify(equipment));} catch {}
  }
  rows.forEach(row=>row.addEventListener('click',()=>{selected=row.dataset.slot; announce(''); render();}));
  $('#change').addEventListener('click',()=>{
    $('#chooser-results').replaceChildren();
    const available=data.items.filter(item=>item.slot===selected);
    available.forEach(item=>{
      const button=element('button',item.name,'chooser-item'); button.type='button';
      button.addEventListener('click',()=>{equipment[selected]=item.id; render(); $('#item-chooser').close(); announce('Equipment selected. Calculation state updated.');});
      $('#chooser-results').append(button);
    });
    if(!available.length) $('#chooser-results').append(element('p','No items supplied for this slot.','quiet'));
    $('#item-chooser').showModal();
  });
  $('#close-chooser').addEventListener('click',()=>$('#item-chooser').close());
  $('#remove').addEventListener('click',()=>{delete equipment[selected]; render(); announce('Equipment removed. Calculation state updated.');});
  $('#reset').addEventListener('click',()=>{equipment={}; selected=data.slots[0].id; $('#build-name').value=''; render(); announce('Build reset. All equipment slots are empty.');});
  $('#save').addEventListener('click',()=>{
    const builds=readBuilds();
    const build={id:'build-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name:$('#build-name').value.trim()||'Build '+(builds.length+1),equipment:{...equipment}};
    if(storeBuilds([...builds,build])) announce('Build saved locally. Open Build Closet to view or compare it.');
  });
  const search=$('#search');
  function filter() {let count=0; rows.forEach(row=>{row.hidden=!row.textContent.toLowerCase().includes(search.value.trim().toLowerCase()); if(!row.hidden) count++;}); $('#empty-search').hidden=count!==0;}
  search.addEventListener('input',filter); $('#clear-search').addEventListener('click',()=>{search.value=''; filter(); search.focus();}); render();
}
if(page==='closet') {
  const selected=new Set();
  function renderCards() {
    const builds=readBuilds(); $('#saved-builds').replaceChildren(); $('#closet-empty').hidden=builds.length>0;
    for(const build of builds) {
      const card=document.createElement('article'); card.className='panel build-card'; card.append(element('h2',build.name));
      const list=document.createElement('dl'); list.className='build-equipment';
      data.slots.forEach(slot=>{const row=document.createElement('div'); row.append(element('dt',slot.label),element('dd',equipmentName(build.equipment,slot.id))); list.append(row);}); card.append(list);
      const results=calculate(build.equipment); data.stats.forEach(stat=>card.append(element('p',stat.label+': '+statValue(results,stat.id),'technical saved-stat')));
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
  const slotFilter=$('#slot-filter'); data.slots.forEach(slot=>{const option=element('option',slot.label); option.value=slot.id; slotFilter.append(option);});
  function renderLibrary() {
    const needle=$('#library-search').value.trim().toLowerCase();
    const items=data.items.filter(item=>(!slotFilter.value||item.slot===slotFilter.value)&&(item.name+' '+item.description).toLowerCase().includes(needle));
    slotFilter.classList.toggle('filter-active',Boolean(slotFilter.value)); $('#library-results').replaceChildren(); $('#library-empty').hidden=items.length>0; $('#result-count').textContent=items.length+' placeholder records';
    items.forEach(item=>{
      const card=document.createElement('article'); card.className='panel item-card';
      card.append(artwork(item,true),element('p',data.slots.find(slot=>slot.id===item.slot)?.label||'','technical detail-kicker'),element('h2',item.name),element('p',item.description,'quiet'),element('p','Bonuses: not supplied','technical saved-stat'));
      const link=element('a','Use in planner','button-link'); link.href=route('index.html?item='+encodeURIComponent(item.id)); card.append(link); $('#library-results').append(card);
    });
  }
  $('#library-search').addEventListener('input',renderLibrary); slotFilter.addEventListener('change',renderLibrary);
  $('#library-clear').addEventListener('click',()=>{$('#library-search').value=''; slotFilter.value=''; renderLibrary(); $('#library-search').focus();}); renderLibrary();
}
authenticate();
