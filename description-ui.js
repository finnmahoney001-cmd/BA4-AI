// Shared item labels and source-backed descriptions.
window.BH_UI=(()=>{
 const facts=window.BH_MECHANICS; let context={}; const setContext=settings=>{context=settings||{};};
 const name=item=>!item?'Empty slot':item.kind==='Rune'?({BonikAtkTeam:'Bonik',MullAtkEnemy:'Mull',WullShield:'Wull',BoliSpOnHit:'Boli'}[facts.items[item.id]?.rune]||facts.items[item.id]?.rune||item.name):item.name;
 const itemLabel=item=>name(item)+(item?.tier?(' · '+(item.tier==='All'?'All tiers':'T'+item.tier)):item&&['mainhand','offhand','head','body','neck','ring'].includes(item.slot)?' · Tier unknown':'');
 const compare=(a,b)=>name(a).localeCompare(name(b),undefined,{sensitivity:'base',numeric:true});
 function description(item,rarity='Leg',settings=context) {
  if(!item)return 'Choose an item for this slot.';
  const meta=facts.items[item.id];
  if(item.slot==='pet')return window.BH_ENGINE.petDescription(item,settings);
  if(item.slot==='accessory'&&Object.keys(meta?.bonuses||{}).length){
   const bonuses=window.BH_ENGINE.accessoryBonuses(item,settings);
   const values=Object.entries(bonuses).map(([stat,value])=>value+'% '+stat).join(', ');
   const special=(meta.effects||[]).flatMap(text=>text.split(/[,|]/)).map(text=>text.trim()).filter(text=>/when |overkill|chance to |up to|first |once /i.test(text)&&!/Each upgrade|Fully upgraded/i.test(text));
   return values+(special.length?'\n'+special.join(', '):'')+(meta.unresolved?'\n'+meta.unresolved:'');
  }
  if(item.kind==='Rune') {
   const stat=meta?.runeStat||({Dar:'Gold Find',Quindi:'Capture Rate',Vryn:'Item Find',Zyrk:'Experience',Sol:'Redirect',Erlun:'Max Shield'}[meta?.rune]);
   const rarityName=rarity==='Myth'?'Mythic':'Legendary';
   if(stat&&facts.runeValues[meta.rune])return stat+' +'+facts.runeValues[meta.rune][rarity==='Myth'?1:0]+'% ('+rarityName+').';
   const effects=window.BH_ENGINE.evaluate({[item.slot]:item.id,_settings:{['rarity-'+item.slot]:rarity}}).effects.filter(effect=>effect.source===item.name).map(effect=>effect.text);
   if(effects.length)return effects.join('\n')+' ('+rarityName+').';
  }
  if(item.kind==='Set'&&facts.sets[item.setName])return Object.entries(facts.sets[item.setName].effects).map(([count,effect])=>count+' pieces: '+effect.text).join('\n');
  return item.description||'No effect description in the source data.';
 }
 function describe(node,item,rarity,settings=context) {
  if(!item){delete node.dataset.description;node.removeAttribute('aria-describedby');return;}
  node.dataset.description=itemLabel(item)+'\n'+description(item,rarity,settings);
  if(!node.matches('button,a,input,select'))node.tabIndex=0;
 }
 function dropdown(select,label,getItem,getRarity,searchable=false) {
  const trigger=document.createElement('button'),list=document.createElement('div'),search=searchable?document.createElement('input'):null;
  trigger.type='button';trigger.className='item-choice';trigger.id='choice-'+select.id;trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label',label);
  list.className='item-choice-list';list.id=trigger.id+'-list';list.role='listbox';list.setAttribute('aria-label',label+' items');list.hidden=true;trigger.setAttribute('aria-controls',list.id);
  select.hidden=true;select.after(trigger);document.body.append(list);select.parentElement.querySelector('label[for="'+select.id+'"]')?.setAttribute('for',trigger.id);
  const searchType=/rune/i.test(label)?'runes':/slot [1-6]|enchants/i.test(label)?'enchants':'items';
  if(search){search.type='search';search.className='enchant-search';search.id='search-'+select.id;search.placeholder='Search '+searchType+'…';search.autocomplete='off';search.setAttribute('aria-label','Search '+searchType+' for '+label);search.role='combobox';search.setAttribute('aria-autocomplete','list');search.setAttribute('aria-controls',list.id);search.setAttribute('aria-expanded','false');trigger.before(search);}
  function close(){list.hidden=true;trigger.setAttribute('aria-expanded','false');search?.setAttribute('aria-expanded','false');}
  function refresh(){trigger.textContent=getItem(select.value)?itemLabel(getItem(select.value)):(select.selectedOptions[0]?.textContent||'Empty slot');trigger.dataset.kind=getItem(select.value)?.kind||'';describe(trigger,getItem(select.value),getRarity());if(search)search.value='';close();}
  const buttons=()=>[...list.querySelectorAll('button[role="option"]')];
  function position(){
   const rect=trigger.getBoundingClientRect(),gap=5,margin=8;
   const width=Math.min(Math.max(rect.width,280),innerWidth-margin*2);list.style.width=width+'px';
   list.style.left=Math.max(margin,Math.min(rect.left,innerWidth-width-margin))+'px';
   const below=Math.max(0,innerHeight-rect.bottom-gap-margin),above=Math.max(0,rect.top-gap-margin),up=below<Math.min(340,list.scrollHeight)&&above>below;
   list.style.maxHeight=Math.min(340,up?above:below)+'px';
   list.style.top=(up?Math.max(margin,rect.top-gap-list.getBoundingClientRect().height):rect.bottom+gap)+'px';
  }
  window.addEventListener('resize',()=>{if(!list.hidden)position();});
  window.addEventListener('scroll',event=>{if(!list.hidden&&!list.contains(event.target))close();},true);
  function open(last=false,keepFocus=false){
   list.replaceChildren();const query=search?.value.trim().toLowerCase()||'';
   let options=[...select.options].filter(option=>!query||(option.value&&name(getItem(option.value)).toLowerCase().includes(query)));
   if(query)options.sort((a,b)=>Number(!name(getItem(a.value)).toLowerCase().startsWith(query))-Number(!name(getItem(b.value)).toLowerCase().startsWith(query)));
   for(const option of options){
    const item=getItem(option.value),button=document.createElement('button'),title=document.createElement('strong'),detail=document.createElement('small');
    button.type='button';button.role='option';button.tabIndex=-1;button.setAttribute('aria-selected',String(option.selected));button.dataset.kind=item?.kind||'';
    title.textContent=item?itemLabel(item):option.textContent;button.append(title);if(item&&item.kind!=='Set'){detail.textContent=description(item,getRarity());button.append(detail);describe(button,item,getRarity());}
    button.onclick=()=>{select.value=option.value;close();select.dispatchEvent(new Event('change'));trigger.focus();};list.append(button);
   }
   if(!options.length){const empty=document.createElement('p');empty.className='choice-empty';empty.role='status';empty.textContent='No matching '+searchType+'. Try another name.';list.append(empty);}
   list.hidden=false;position();trigger.setAttribute('aria-expanded','true');search?.setAttribute('aria-expanded','true');
   if(!keepFocus){const nodes=buttons();(last?nodes.at(-1):nodes.find(n=>n.getAttribute('aria-selected')==='true')||nodes[0])?.focus();}
  }
  trigger.onclick=()=>list.hidden?open():close();
  trigger.onkeydown=e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();open(e.key==='ArrowUp');}else if(search&&e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();search.value=e.key;search.focus();open(false,true);}};
  if(search){
   search.onfocus=()=>open(false,true);search.oninput=()=>open(false,true);
   search.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();close();trigger.focus();}else if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();open(e.key==='ArrowUp');}else if(e.key==='Enter'){e.preventDefault();if(list.hidden)open(false,true);buttons()[0]?.click();}else if(e.key==='Tab')close();};
  }
  list.onkeydown=e=>{const nodes=buttons(),i=nodes.indexOf(document.activeElement);if(e.key==='Escape'){e.preventDefault();close();trigger.focus();}else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)&&nodes.length){e.preventDefault();nodes[e.key==='Home'?0:e.key==='End'?nodes.length-1:(i+(e.key==='ArrowDown'?1:-1)+nodes.length)%nodes.length].focus();}else if(e.key==='Tab')close();else if(search&&e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();search.value+=e.key;search.focus();open(false,true);}};
  document.addEventListener('click',e=>{if(!list.contains(e.target)&&!trigger.contains(e.target)&&e.target!==search)close();});
  document.addEventListener('focusin',e=>{if(!list.contains(e.target)&&e.target!==trigger&&e.target!==search)close();});
  return {refresh};
 }
 document.addEventListener('DOMContentLoaded',()=>{
  const popup=document.createElement('div');popup.id='item-description-popup';popup.className='description-popup';popup.role='tooltip';popup.hidden=true;document.body.append(popup);let owner;
  function hide(){popup.hidden=true;owner?.removeAttribute('aria-describedby');owner=null;}
  function show(node){if(!node)return;hide();owner=node;popup.textContent=node.dataset.description;popup.hidden=false;node.setAttribute('aria-describedby',popup.id);const host=document.querySelector('.character-overlay:not([hidden])')||document.body;if(popup.parentElement!==host)host.append(popup);const r=node.getBoundingClientRect(),box=popup.getBoundingClientRect();popup.style.left=Math.max(8,Math.min(r.left,innerWidth-box.width-8))+'px';popup.style.top=Math.max(8,r.bottom+box.height+12<innerHeight?r.bottom+8:r.top-box.height-8)+'px';}
  document.addEventListener('pointerover',e=>show(e.target.closest('[data-description]')));
  document.addEventListener('pointerout',e=>{if(owner&&!owner.contains(e.relatedTarget))hide();});
  document.addEventListener('focusin',e=>show(e.target.closest('[data-description]')));document.addEventListener('focusout',hide);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});window.addEventListener('scroll',hide,true);
 });
 const nextSlot=(slots,equipment,previous)=>slots.find(slot=>!equipment[slot])||slots[(slots.indexOf(previous)+1)%slots.length];
 const applyAll=(equipment,slots,item,rarity)=>{
  const targets=slots.map(slot=>item?window.BH_DATA.items.find(candidate=>candidate.slot===slot&&candidate.kind===item.kind&&name(candidate)===name(item)):null);
  if(item&&targets.some(target=>!target))throw new Error('This item is not available in every target slot.');
  const out={...equipment,_settings:{...equipment._settings}};
  slots.forEach((slot,index)=>{if(item)out[slot]=targets[index].id;else delete out[slot];if(rarity)out._settings['rarity-'+slot]=rarity;});return out;
 };
 return {name,label:itemLabel,compare,description,describe,dropdown,nextSlot,setContext,applyAll};
})();
