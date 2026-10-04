// Workbook layout and selections; shared researched mechanics drive all results.
if(page==='planner') {
  let equipment={};
  try {equipment=validEquipment(JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}'));} catch {}
  const loaded=readBuilds().find(build=>build.id===query.get('build'));
  if(loaded) {equipment=validEquipment(loaded.equipment); $('#build-name').value=loaded.name;}
  const linked=data.items.find(item=>item.id===query.get('item'));
  if(linked) {equipment[linked.slot]=linked.id;delete equipment._settings?.['t12-'+linked.slot];}
  let selected=linked?.slot || 'mainhand';
  const tierChecks=new Map(), dropdowns=new Map(), selectors=new Map(), typeSelectors=new Map(), tileButtons=new Map(), selectionArt=new Map();
  const itemFor=slot=>data.items.find(item=>item.id===equipment[slot]);
  const settings=()=>equipment._settings || (equipment._settings={});
  const mechanicsPanel=element('section','','panel mechanics-controls');
  mechanicsPanel.append(element('h2','Equipment options'));
  const ancientControls=element('div','','control-grid');mechanicsPanel.append(ancientControls);
  function setting(label,key,options,defaultValue,parent=ancientControls) {
    const control=field(label,key,options.map(value=>({value,label:value})),settings()[key]||defaultValue,value=>{settings()[key]=value;render();});
    parent.append(control.wrap);return control;
  }
  function field(label,id,options,value,onChange) {
    const wrap=element('div','','workbook-field'), name=element('label',label,'technical'); name.htmlFor=id;
    const select=document.createElement('select'); select.id=id;
    options.forEach(option=>{const node=element('option',option.label);node.value=option.value;node.dataset.kind=option.value;select.append(node);});
    select.value=value;select.dataset.kind=value;select.addEventListener('change',()=>{select.dataset.kind=select.value;onChange(select.value);});wrap.append(name,select);return {wrap,select};
  }
  for(const group of ['Main Equips','Runes','Enchants']) {
    const panel=element('section','','panel controls-panel');panel.append(element('h2',group));
    const grid=element('div','','control-grid');grid.dataset.group=group;panel.append(grid);
    for(const slot of data.slots.filter(slot=>slot.group===group)) {
      const wrap=element('div','','selection-field'), label=element('label',slot.label,'technical'); label.htmlFor='select-'+slot.id;wrap.dataset.slot=slot.id;wrap.append(label);
      const types=[...new Set(data.items.filter(item=>item.slot===slot.id).map(item=>item.kind))];
      if(group==='Main Equips') {
        const type=field('Type for '+slot.label,'type-'+slot.id,[{value:'',label:'All types'},...types.map(x=>({value:x,label:x}))],itemFor(slot.id)?.kind||'',value=>{
          if(itemFor(slot.id)&&itemFor(slot.id).kind!==value&&value)delete equipment[slot.id];
          settings()['type-'+slot.id]=value;updateOptions(slot.id);render();
        });type.select.setAttribute('aria-label',slot.label+' type');typeSelectors.set(slot.id,type.select);wrap.append(type.select);
      }
      const select=document.createElement('select');select.id='select-'+slot.id;
      select.addEventListener('change',()=>{delete settings()['t12-'+slot.id];if(select.value)equipment[slot.id]=select.value;else delete equipment[slot.id];selected=slot.id;render();});
      selectors.set(slot.id,select);wrap.append(select);dropdowns.set(slot.id,BH_UI.dropdown(select,slot.label,id=>data.items.find(item=>item.id===id),()=>settings()['rarity-'+slot.id]||'Leg',group==='Enchants'));
      if(group!=='Runes') {const art=element('div','','selection-art');selectionArt.set(slot.id,art);wrap.prepend(art);}
      if(data.rarities[slot.id]) {
        const rarity=field(slot.label+' rarity','rarity-'+slot.id,data.rarities[slot.id].map(x=>({value:x,label:x})),settings()['rarity-'+slot.id]||data.rarities[slot.id][0],value=>{settings()['rarity-'+slot.id]=value;render();});
        settings()['rarity-'+slot.id]=rarity.select.value;wrap.insertBefore(rarity.wrap,select);
      }
      if(['mainhand','offhand','head','body','neck','ring'].includes(slot.id)) {
        const tierLabel=element('label','','tier-check'),tick=document.createElement('input');tick.type='checkbox';tick.id='t12-'+slot.id;tick.setAttribute('aria-label',slot.label+' T12+');tierLabel.append(tick,element('span','T12+','technical'));tick.addEventListener('change',()=>{settings()['t12-'+slot.id]=String(tick.checked);render();});wrap.append(tierLabel);tierChecks.set(slot.id,{tick,tierLabel});
      }
      grid.append(wrap);
    }
    if(group==='Main Equips') {
      const upgrade=field('Accessory upgrades','accessory-upgrades',[{value:'Fully Upgraded',label:'Fully Upgraded'},{value:'No Upgrades',label:'No Upgrades'}],settings()['accessory-upgrades']||'Fully Upgraded',value=>{settings()['accessory-upgrades']=value;render();});settings()['accessory-upgrades']=upgrade.select.value;grid.append(upgrade.wrap);
      const elementField=element('div','','workbook-field');elementField.append(element('span','MH Element','technical'),element('p','Select a mainhand','technical'));elementField.lastChild.id='mainhand-element';grid.append(elementField);
    }
    $('#workbook-controls').append(panel);
  }
  $('#workbook-controls').after(mechanicsPanel);
  function renderAncientOptions() {
    ancientControls.replaceChildren();
    const ring=itemFor('ring'),meta=ring&&window.BH_MECHANICS.items[ring.id];
    if(meta?.evoMode) {
      setting('Evolvium upgrades','evo-level',['0','1','2','3','4'],'0',ancientControls);
      window.BH_MECHANICS.evolvium[meta.evoMode].forEach((row,i)=>{
        if(i<Number(settings()['evo-level']||0))setting('Evolvium '+row[0],'evo-'+(i+1),row.slice(1),row[1],ancientControls);
      });
    }
    if(meta?.ancient==='Sacramentum')setting('Sacramentum reforge','sacramentum',['Offensive','Defensive','Support'],'Offensive',ancientControls);
    for(const slot of ['head','body']) {
      const item=itemFor(slot),facts=item&&window.BH_MECHANICS.items[item.id],options=window.BH_MECHANICS.amplifiers[facts?.ancient];
      if(options) {
        const control=field(item.name+' amplifier','amplifier-'+slot,options.map((row,i)=>({value:String(i),label:(row[0]||'SP / Shield')+' · '+row[1]})),settings()['amplifier-'+slot]||'0',value=>{settings()['amplifier-'+slot]=value;render();});ancientControls.append(control.wrap);
      }
    }
    const mount=itemFor('mount');if(mount&&window.BH_MECHANICS.items[mount.id]?.mountRoll)setting('Mount rolled bonus %','mount-roll',['1','2','3','4','5','6','7','8'],'1',ancientControls);
    for(const slot of ['mainhand','offhand','head','body','neck','ring']) {const item=itemFor(slot);if(item&&window.BH_MECHANICS.items[item.id]?.gearRoll)setting(item.name+' rolled bonus %','gear-roll-'+slot,['1','2','3','4','5','6','7','8'],'1',ancientControls);}
    if(!ancientControls.childElementCount)ancientControls.append(element('p','Equip Evolvium, an amplifier Ancient, Sacramentum or a rolled mount to choose its bonuses.','quiet'));
  }
  function updateOptions(slotId) {
    const select=selectors.get(slotId), type=typeSelectors.get(slotId)?.value;
    select.replaceChildren();const empty=element('option','Empty slot');empty.value='';select.append(empty);
    data.items.filter(item=>item.slot===slotId&&(!type||item.kind===type)).sort(BH_UI.compare).forEach(item=>{const option=element('option',BH_UI.name(item));option.value=item.id;option.dataset.kind=item.kind;select.append(option);});
    select.value=equipment[slotId]||'';select.dataset.kind=itemFor(slotId)?.kind||'';dropdowns.get(slotId).refresh();
  }
  for(const slot of data.slots.filter(slot=>slot.group==='Main Equips')) {
    const tile=element('article','','loadout-tile');tile.dataset.equipmentTile=slot.id;
    tileButtons.set(slot.id,tile);$('#loadout-grid').append(tile);
  }
  data.stats.forEach(stat=>{const row=element('div','','bonus-line');row.append(element('span',stat.label,'technical'));const value=element('span','—','technical');value.dataset.stat=stat.id;row.append(value);$('#bonus-list').append(row);});
  function renderEffects(report) {
    $('#set-effects').replaceChildren();
    for(let threshold=2;threshold<=6;threshold++) {
      const block=element('div','','set-threshold');block.append(element('h3',threshold+' pieces','technical'));let matches=0;
      report.sets.filter(set=>set.threshold===threshold).forEach(set=>{
        const p=element('p',set.text);p.prepend(element('strong',set.name+' · '+set.count+' equipped'+(set.effective>set.count?' + Starweave':'')+(set.copied?' · W3-4TY':'' )+' · '));block.append(p);matches++;
      });
      if(!matches)block.append(element('p','No active bonus at this threshold.','quiet'));$('#set-effects').append(block);
    }
    for(const [kind,id] of [['Myth','#myth-effects'],['Ancient','#ancient-effects']]) {
      const items=Object.keys(equipment).map(itemFor).filter(item=>item?.kind===kind&&item.source.startsWith(kind+'-Gear!'));
      $(id).replaceChildren();items.forEach(item=>{const entry=element('div','','effect-entry');entry.append(element('h3',BH_UI.label(item)),element('p',item.description));$(id).append(entry);});
      if(!items.length)$(id).append(element('p','Equip '+kind.toLowerCase()+' gear to see its unique effects.','quiet'));
    }
  }
  function render() {
    equipment=data.normalizeEquipment(equipment);
    tierChecks.forEach(({tick,tierLabel},slot)=>{const item=itemFor(slot);tierLabel.hidden=!item||(typeof item.tier==='number'&&item.tier>=12);tick.checked=settings()['t12-'+slot]==='true';const bonuses=window.BH_MECHANICS.items[itemFor(slot)?.id]?.tierBonuses||{};tierLabel.dataset.description=Object.entries(bonuses).map(([k,v])=>k+' +'+v+'%').join('\n')||'No additional tier bonus recorded for this item.';});
    selectionArt.forEach((holder,slot)=>{const item=itemFor(slot);holder.replaceChildren();holder.hidden=!item?.image;if(item?.image)holder.append(artwork(item,true));});
    selectors.forEach((select,slot)=>{const item=itemFor(slot),type=typeSelectors.get(slot);if(type&&item&&type.value&&type.value!==item.kind)type.value=item.kind;if(type)type.dataset.kind=type.value;updateOptions(slot);});
    document.querySelectorAll('[id^=rarity-]').forEach(select=>select.dataset.kind=select.value);
    tileButtons.forEach((tile,slot)=>{const item=itemFor(slot);BH_UI.describe(tile,item);tile.dataset.kind=item?.kind||'Empty';tile.replaceChildren(element('span',data.slots.find(x=>x.id===slot).label,'technical'),artwork(item||{name:data.slots.find(x=>x.id===slot).label,image:''},true),element('strong',BH_UI.label(item)),element('span',(item?.kind||'Empty')+(item&&['mainhand','offhand','head','body','neck','ring'].includes(slot)?(settings()['t12-'+slot]==='true'?' · T12+':' · Below T12'):''),'type-badge'));});
    $('#equipped-count').textContent=[...tileButtons.keys()].filter(slot=>equipment[slot]).length+' / 9';
    // Equipped!C8 uses an exact lookup and defaults to Physical when unmatched.
    const report=data.evaluate(equipment),results=report.values;
    $('#mainhand-element').textContent=itemFor('mainhand')?report.mhElement:'Select a mainhand';
    document.querySelectorAll('[data-stat]').forEach(node=>{
      node.textContent=statValue(results,node.dataset.stat);
      const label=data.stats.find(x=>x.id===node.dataset.stat).label;
      node.title=(report.contributions[label]||[]).map(x=>x.source+': '+x.value+'%').join('\n')||'No bonuses in this category.';
    });
    $('#calculation-status').textContent=report.ctx.enabled?'Snapshot totals include supported selected conditions.':'Permanent totals. Combat conditions and proc effects are listed separately.';
    renderAncientOptions();
    $('#setup-name').textContent=$('#build-name').value.trim()||'Untitled build';
    $('#setup-extras').replaceChildren();
    for(const group of ['Runes','Enchants']) {
      const section=element('section','','setup-group');section.append(element('h3',group));const list=document.createElement('dl');list.dataset.group=group;
      data.slots.filter(slot=>slot.group===group).forEach(slot=>{const row=document.createElement('div');row.dataset.slot=slot.id;const item=itemFor(slot.id),rarity=item&&settings()['rarity-'+slot.id];row.append(element('dt',slot.label,'technical'));if(item?.image)row.append(artwork(item,true));row.append(element('dd',BH_UI.name(item)+(rarity?' · '+rarity:'')));BH_UI.describe(row,item,rarity);list.append(row);});section.append(list);$('#setup-extras').append(section);
    }
    const info=element('section','','setup-group');info.append(element('h3','Build settings'));const list=document.createElement('dl');
    for(const [label,value] of [['Accessory upgrades',settings()['accessory-upgrades']||'Fully Upgraded'],['MH Element',$('#mainhand-element').textContent]]){const row=document.createElement('div');row.append(element('dt',label,'technical'),element('dd',value));list.append(row);}info.append(list);$('#setup-extras').append(info);
    renderEffects(report);renderMechanics(report);try{localStorage.setItem(DRAFT_KEY,JSON.stringify(equipment));}catch{}
  }
  function renderMechanics(report) {
    const root=$('#mechanics-summary');root.replaceChildren();
    function details(label){const box=element('details','','mechanics-details');box.append(element('summary',label));root.append(box);return box;}
    const breakdown=details('Bonus contributions');
    for(const [label,entries] of Object.entries(report.contributions)) {
      const row=element('section','','contribution');row.append(element('h3',label+' · '+Number((report.raw[label]||0).toFixed(3))+'%','technical'));
      entries.forEach(entry=>row.append(element('p',entry.source+' · '+(entry.value>0?'+':'')+entry.value+'%')));breakdown.append(row);
    }
    const elemental=details('Elemental damage & resistance');elemental.append(element('p','Weighted totals by attack element. DR caps at 75% after weighting.','quiet'));
    for(const [name,values] of Object.entries(report.elemental))elemental.append(element('p',name+' · Damage '+values.damage+'% · DR '+values.dr+'%','technical'));
    if(Object.keys(report.luck).length) {
      const luck=details('Clover · effective combat chances');luck.append(element('p','Two favorable rolls. Gear bonuses remain visible in the bonus list.','quiet'));
      Object.entries(report.luck).forEach(([name,value])=>luck.append(element('p',name+' · '+value+'%','technical')));
    }
    const effects=details('All active effects & special bonuses');
    report.effects.forEach(entry=>{const p=element('p',entry.text);p.prepend(element('strong',entry.source+' · '));effects.append(p);});
    Object.entries(report.raw).filter(([key])=>!data.stats.some(x=>x.label===key)).forEach(([key,value])=>effects.append(element('p',key+' · '+value+(['Max SP','SP per Turn','Freeze stacks'].includes(key)?'':'%'),'technical')));
    const notes=details('Calculation coverage');notes.append(element('p','Personal bonus percentages, T12+ Ancient passives, matched Mythic elemental bonuses, active set thresholds, rune rarities and Mythic enchants. Equipment base Power/Stamina/Agility, unspecified random rolls and a full battle simulation are outside these totals.','quiet'));
    report.warnings.forEach(text=>notes.append(element('p',text,'quiet')));
    if(settings()['migration-note'])notes.append(element('p',settings()['migration-note'],'quiet'));
    if(report.warnings.length){notes.open=true;$('#calculation-status').textContent+=' '+report.warnings.length+' source/roll notice(s) — see Calculation coverage.';}
  }
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
