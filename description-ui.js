// Shared item labels and source-backed descriptions.
window.BH_UI=(()=>{
 const facts=window.BH_MECHANICS;
 const name=item=>!item?'Empty slot':item.kind==='Rune'?({BonikAtkTeam:'Bonik',MullAtkEnemy:'Mull',WullShield:'Wull',BoliSpOnHit:'Boli'}[facts.items[item.id]?.rune]||facts.items[item.id]?.rune||item.name):item.name;
 const itemLabel=item=>name(item)+(item?.tier?(' · '+(item.tier==='All'?'All tiers':'T'+item.tier)):item&&['mainhand','offhand','head','body','neck','ring'].includes(item.slot)?' · Tier unknown':'');
 const compare=(a,b)=>name(a).localeCompare(name(b),undefined,{sensitivity:'base',numeric:true});
 function description(item,rarity='Leg') {
  if(!item)return 'Choose an item for this slot.';
  const meta=facts.items[item.id];
  if(item.kind==='Rune'&&meta?.runeStat&&facts.runeValues[meta.rune])return meta.runeStat+' +'+facts.runeValues[meta.rune][rarity==='Myth'?1:0]+'% ('+(rarity==='Myth'?'Mythic':'Legendary')+').';
  if(item.kind==='Set'&&facts.sets[item.setName])return Object.entries(facts.sets[item.setName].effects).map(([count,effect])=>count+' pieces: '+effect.text).join('\n');
  return item.description||'No effect description in the source data.';
 }
 function describe(node,item,rarity) {
  if(!item){delete node.dataset.description;node.removeAttribute('aria-describedby');return;}
  node.dataset.description=itemLabel(item)+'\n'+description(item,rarity);
  if(!node.matches('button,a,input,select'))node.tabIndex=0;
 }
 function dropdown(select,label,getItem,getRarity) {
  const trigger=document.createElement('button'),list=document.createElement('div');
  trigger.type='button';trigger.className='item-choice';trigger.id='choice-'+select.id;trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label',label);
  list.className='item-choice-list';list.id=trigger.id+'-list';list.role='listbox';list.setAttribute('aria-label',label+' items');list.hidden=true;trigger.setAttribute('aria-controls',list.id);
  select.hidden=true;select.after(trigger,list);select.parentElement.querySelector('label[for="'+select.id+'"]')?.setAttribute('for',trigger.id);
  function close(){list.hidden=true;trigger.setAttribute('aria-expanded','false');}
  function refresh(){trigger.textContent=itemLabel(getItem(select.value));trigger.dataset.kind=getItem(select.value)?.kind||'';describe(trigger,getItem(select.value),getRarity());close();}
  function open(last=false){
   list.replaceChildren();
   for(const option of select.options){
    const item=getItem(option.value),button=document.createElement('button'),title=document.createElement('strong'),detail=document.createElement('small');
    button.type='button';button.role='option';button.tabIndex=-1;button.setAttribute('aria-selected',String(option.selected));button.dataset.kind=item?.kind||'';
    title.textContent=itemLabel(item);button.append(title);if(item&&item.kind!=='Set'){detail.textContent=description(item,getRarity());button.append(detail);describe(button,item,getRarity());}
    button.onclick=()=>{select.value=option.value;close();select.dispatchEvent(new Event('change'));trigger.focus();};list.append(button);
   }
   list.hidden=false;list.style.left='0px';const bounds=list.getBoundingClientRect(),parent=select.parentElement.getBoundingClientRect();if(bounds.right>innerWidth-12)list.style.left=(Math.max(12,innerWidth-bounds.width-12)-parent.left)+'px';trigger.setAttribute('aria-expanded','true');list.children[last?list.children.length-1:Math.max(0,select.selectedIndex)]?.focus();
  }
  trigger.onclick=()=>list.hidden?open():close();
  trigger.onkeydown=e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();open(e.key==='ArrowUp');}};
  list.onkeydown=e=>{const nodes=[...list.children],i=nodes.indexOf(document.activeElement);if(e.key==='Escape'){e.preventDefault();close();trigger.focus();}else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();nodes[e.key==='Home'?0:e.key==='End'?nodes.length-1:(i+(e.key==='ArrowDown'?1:-1)+nodes.length)%nodes.length].focus();}else if(e.key==='Tab')close();};
  document.addEventListener('click',e=>{if(!list.contains(e.target)&&!trigger.contains(e.target))close();});
  document.addEventListener('focusin',e=>{if(!list.contains(e.target)&&e.target!==trigger)close();});
  return {refresh};
 }
 document.addEventListener('DOMContentLoaded',()=>{
  const popup=document.createElement('div');popup.id='item-description-popup';popup.className='description-popup';popup.role='tooltip';popup.hidden=true;document.body.append(popup);let owner;
  function hide(){popup.hidden=true;owner?.removeAttribute('aria-describedby');owner=null;}
  function show(node){if(!node)return;hide();owner=node;popup.textContent=node.dataset.description;popup.hidden=false;node.setAttribute('aria-describedby',popup.id);const r=node.getBoundingClientRect(),box=popup.getBoundingClientRect();popup.style.left=Math.max(8,Math.min(r.left,innerWidth-box.width-8))+'px';popup.style.top=Math.max(8,r.bottom+box.height+12<innerHeight?r.bottom+8:r.top-box.height-8)+'px';}
  document.addEventListener('pointerover',e=>show(e.target.closest('[data-description]')));
  document.addEventListener('pointerout',e=>{if(owner&&!owner.contains(e.relatedTarget))hide();});
  document.addEventListener('focusin',e=>show(e.target.closest('[data-description]')));document.addEventListener('focusout',hide);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});window.addEventListener('scroll',hide,true);
 });
 return {name,label:itemLabel,compare,description,describe,dropdown};
})();
