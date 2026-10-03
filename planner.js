// Workbook layout and selections. Numeric calculation is deliberately separate.
if(page==='planner') {
  let equipment={};
  try {equipment=validEquipment(JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}'));} catch {}
  const loaded=readBuilds().find(build=>build.id===query.get('build'));
  if(loaded) {equipment=validEquipment(loaded.equipment); $('#build-name').value=loaded.name;}
  const linked=data.items.find(item=>item.id===query.get('item'));
  if(linked) equipment[linked.slot]=linked.id;
  let selected=linked?.slot || 'mainhand';
  const selectors=new Map(), typeSelectors=new Map(), tileButtons=new Map();
  const itemFor=slot=>data.items.find(item=>item.id===equipment[slot]);
  const settings=()=>equipment._settings || (equipment._settings={});
  function field(label,id,options,value,onChange) {
    const wrap=element('div','','workbook-field'), name=element('label',label,'technical'); name.htmlFor=id;
    const select=document.createElement('select'); select.id=id;
    options.forEach(option=>{const node=element('option',option.label);node.value=option.value;node.dataset.kind=option.value;select.append(node);});
    select.value=value;select.dataset.kind=value;select.addEventListener('change',()=>{select.dataset.kind=select.value;onChange(select.value);});wrap.append(name,select);return {wrap,select};
  }
  for(const group of ['Main Equips','Runes','Enchants']) {
    const panel=element('section','','panel controls-panel');panel.append(element('h2',group));
    const grid=element('div','','control-grid');panel.append(grid);
    for(const slot of data.slots.filter(slot=>slot.group===group)) {
      const wrap=element('div','','selection-field'), label=element('label',slot.label,'technical'); label.htmlFor='select-'+slot.id;wrap.append(label);
      const types=[...new Set(data.items.filter(item=>item.slot===slot.id).map(item=>item.kind))];
      if(group==='Main Equips') {
        const type=field('Type for '+slot.label,'type-'+slot.id,[{value:'',label:'All types'},...types.map(x=>({value:x,label:x}))],itemFor(slot.id)?.kind||'',value=>{
          if(itemFor(slot.id)&&itemFor(slot.id).kind!==value&&value)delete equipment[slot.id];
          settings()['type-'+slot.id]=value;updateOptions(slot.id);render();
        });type.select.setAttribute('aria-label',slot.label+' type');typeSelectors.set(slot.id,type.select);wrap.append(type.select);
      }
      const select=document.createElement('select');select.id='select-'+slot.id;
      select.addEventListener('change',()=>{if(select.value)equipment[slot.id]=select.value;else delete equipment[slot.id];selected=slot.id;render();});
      selectors.set(slot.id,select);wrap.append(select);
      if(data.rarities[slot.id]) {
        const rarity=field(slot.label+' rarity','rarity-'+slot.id,data.rarities[slot.id].map(x=>({value:x,label:x})),settings()['rarity-'+slot.id]||data.rarities[slot.id][0],value=>{settings()['rarity-'+slot.id]=value;render();});
        settings()['rarity-'+slot.id]=rarity.select.value;wrap.append(rarity.wrap);
      }
      grid.append(wrap);
    }
    if(group==='Main Equips') {
      const upgrade=field('Accessory upgrades','accessory-upgrades',[{value:'Fully Upgraded',label:'Fully Upgraded'},{value:'No Upgrades',label:'No Upgrades'}],settings()['accessory-upgrades']||'Fully Upgraded',value=>{settings()['accessory-upgrades']=value;render();});settings()['accessory-upgrades']=upgrade.select.value;grid.append(upgrade.wrap);
      const elementField=element('div','','workbook-field');elementField.append(element('span','MH Element','technical'),element('p','Select a mainhand','technical'));elementField.lastChild.id='mainhand-element';grid.append(elementField);
    }
    $('#workbook-controls').append(panel);
  }
  function updateOptions(slotId) {
    const select=selectors.get(slotId), type=typeSelectors.get(slotId)?.value;
    select.replaceChildren();const empty=element('option','Empty slot');empty.value='';select.append(empty);
    data.items.filter(item=>item.slot===slotId&&(!type||item.kind===type)).forEach(item=>{const option=element('option',item.name);option.value=item.id;option.dataset.kind=item.kind;select.append(option);});
    select.value=equipment[slotId]||'';select.dataset.kind=itemFor(slotId)?.kind||'';
  }
  for(const slot of data.slots.filter(slot=>slot.group==='Main Equips')) {
    const tile=element('article','','loadout-tile');tile.dataset.equipmentTile=slot.id;
    tileButtons.set(slot.id,tile);$('#loadout-grid').append(tile);
  }
  data.stats.forEach(stat=>{const row=element('div','','bonus-line');row.append(element('span',stat.label,'technical'));const value=element('span','—','technical');value.dataset.stat=stat.id;row.append(value);$('#bonus-list').append(row);});
  function renderEffects() {
    $('#set-effects').replaceChildren();const counts=new Map();
    Object.keys(equipment).forEach(slot=>{const item=itemFor(slot);if(item?.setName)counts.set(item.setName,(counts.get(item.setName)||0)+1);});
    const poly=Object.keys(equipment).some(slot=>itemFor(slot)?.kind==='Ancient'&&itemFor(slot)?.name==='Poly');
    for(let threshold=2;threshold<=6;threshold++) {
      const block=element('div','','set-threshold');block.append(element('h3',threshold+' pieces','technical'));let matches=0;
      counts.forEach((count,name)=>{
        const effective=count+(poly&&count>=2?1:0),text=data.setEffects[name]?.[threshold];
        if(effective>=threshold&&text){const p=element('p',text);p.prepend(element('strong',name+' · '));block.append(p);matches++;}
      });
      if(!matches)block.append(element('p','No active bonus at this threshold.','quiet'));$('#set-effects').append(block);
    }
    for(const [kind,id] of [['Myth','#myth-effects'],['Ancient','#ancient-effects']]) {
      const items=Object.keys(equipment).map(itemFor).filter(item=>item?.kind===kind&&item.source.startsWith(kind+'-Gear!'));
      $(id).replaceChildren();items.forEach(item=>{const entry=element('div','','effect-entry');entry.append(element('h3',item.name),element('p',item.description));$(id).append(entry);});
      if(!items.length)$(id).append(element('p','Equip '+kind.toLowerCase()+' gear to see its workbook effects.','quiet'));
    }
  }
  function render() {
    selectors.forEach((select,slot)=>{const item=itemFor(slot),type=typeSelectors.get(slot);if(type&&item&&type.value&&type.value!==item.kind)type.value=item.kind;if(type)type.dataset.kind=type.value;updateOptions(slot);});
    document.querySelectorAll('[id^=rarity-]').forEach(select=>select.dataset.kind=select.value);
    tileButtons.forEach((tile,slot)=>{const item=itemFor(slot);tile.dataset.kind=item?.kind||'Empty';tile.replaceChildren(element('span',data.slots.find(x=>x.id===slot).label,'technical'),artwork(item||{name:data.slots.find(x=>x.id===slot).label,image:''},true),element('strong',item?.name||'Empty slot'),element('span',item?.kind||'Empty','type-badge'));});
    $('#equipped-count').textContent=[...tileButtons.keys()].filter(slot=>equipment[slot]).length+' / 9';
    const item=itemFor(selected);$('#detail-slot').textContent=data.slots.find(x=>x.id===selected).label;$('#item-title').textContent=item?.name||'Empty slot';$('#item-description').textContent=item?.description||'Choose an item from the workbook.';$('#remove').disabled=!item;
    // Equipped!C8 uses an exact lookup and defaults to Physical when unmatched.
    $('#mainhand-element').textContent=itemFor('mainhand')?(data.mainhandElements?.[itemFor('mainhand').name]||'Physical'):'Select a mainhand';
    const results=calculate(equipment);document.querySelectorAll('[data-stat]').forEach(node=>node.textContent=statValue(results,node.dataset.stat));
    $('#setup-name').textContent=$('#build-name').value.trim()||'Untitled build';
    $('#setup-extras').replaceChildren();
    for(const group of ['Runes','Enchants']) {
      const section=element('section','','setup-group');section.append(element('h3',group));const list=document.createElement('dl');
      data.slots.filter(slot=>slot.group===group).forEach(slot=>{const row=document.createElement('div'),item=itemFor(slot.id),rarity=item&&settings()['rarity-'+slot.id];row.append(element('dt',slot.label,'technical'),element('dd',(item?.name||'Empty slot')+(rarity?' · '+rarity:'')));list.append(row);});section.append(list);$('#setup-extras').append(section);
    }
    const info=element('section','','setup-group');info.append(element('h3','Build settings'));const list=document.createElement('dl');
    for(const [label,value] of [['Accessory upgrades',settings()['accessory-upgrades']||'Fully Upgraded'],['MH Element',$('#mainhand-element').textContent]]){const row=document.createElement('div');row.append(element('dt',label,'technical'),element('dd',value));list.append(row);}info.append(list);$('#setup-extras').append(info);
    renderEffects();try{localStorage.setItem(DRAFT_KEY,JSON.stringify(equipment));}catch{}
  }
  function chooser() {
    const needle=$('#chooser-search').value.trim().toLowerCase();$('#chooser-results').replaceChildren();
    const items=data.items.filter(item=>item.slot===selected&&(!typeSelectors.get(selected)?.value||typeSelectors.get(selected).value===item.kind)&&item.name.toLowerCase().includes(needle));
    for(const item of items) {const button=element('button',item.name+' · '+item.kind,'chooser-item');button.dataset.kind=item.kind;button.addEventListener('click',()=>{equipment[selected]=item.id;render();$('#item-chooser').close();announce('Item selected. Workbook effects updated.');});$('#chooser-results').append(button);}
    if(!items.length)$('#chooser-results').append(element('p','No matching workbook items.','quiet'));
  }
  $('#change').addEventListener('click',()=>{$('#chooser-title').textContent='Choose '+data.slots.find(x=>x.id===selected).label;$('#chooser-search').value='';chooser();$('#item-chooser').showModal();});
  $('#chooser-search').addEventListener('input',chooser);$('#close-chooser').addEventListener('click',()=>$('#item-chooser').close());
  $('#remove').addEventListener('click',()=>{delete equipment[selected];render();announce('Item removed. Workbook effects updated.');});
  $('#reset').addEventListener('click',()=>{equipment={};selected='mainhand';typeSelectors.forEach(select=>select.value='');document.querySelectorAll('[id^=rarity-]').forEach(select=>{select.value=data.rarities[select.id.replace('rarity-','')][0];settings()[select.id]=select.value;});$('#accessory-upgrades').value='Fully Upgraded';settings()['accessory-upgrades']='Fully Upgraded';$('#build-name').value='';render();announce('Build reset. All item slots are empty.');});
  $('#save').addEventListener('click',()=>{const builds=readBuilds();const build={id:'build-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name:$('#build-name').value.trim()||'Build '+(builds.length+1),equipment:JSON.parse(JSON.stringify(equipment))};if(storeBuilds([...builds,build]))announce('Build saved with equipment, runes, enchants, and upgrade settings.');});
  typeSelectors.forEach((select,slot)=>select.value=settings()['type-'+slot]||itemFor(slot)?.kind||'');render();
  const tabs=[$('#edit-tab'),$('#setup-tab')];
  function activateTab(index) {
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
    $('#edit-panel').hidden=index!==0;$('#setup-panel').hidden=index!==1;$('.build-actions').hidden=index===1;$('#status').hidden=index===1;
    if(index===1)render();
  }
  tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activateTab(index));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight'||event.key==='ArrowLeft')next=1-index;else if(event.key==='Home')next=0;else if(event.key==='End')next=1;else return;event.preventDefault();activateTab(next);tabs[next].focus();});});
  $('#build-name').addEventListener('input',()=>$('#setup-name').textContent=$('#build-name').value.trim()||'Untitled build');
}
