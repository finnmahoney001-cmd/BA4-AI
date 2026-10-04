/* Deterministic bonus evaluation. Fact tables and source boundaries: MECHANICS.md. */
(() => {
  const d=window.BH_DATA, m=window.BH_MECHANICS;
  const gear=['mainhand','offhand','head','body','neck','ring'];
  const byId=new Map(d.items.map(x=>[x.id,x]));
  for(const item of d.items) if(/^Codex/.test(item.name)) {
    item.description='Primordial Codex: bonus and skill depend on the mainhand element and Offensive/Defensive reforge. T12+ base: +5% Damage and +5% DR.';
    m.items[item.id].effects=[item.description];
  }
  const legacy=d.items.filter(x=>m.items[x.id]?.legacyVariant);
  d.items=d.items.filter(x=>!m.items[x.id]?.legacyVariant&&x.name!=='MythDef');
  d.normalizeEquipment=input=>{
    const out={...input,_settings:{...input?._settings}};
    for(const item of d.items){
      const migration=m.items[item.id]?.slotMigration;
      if(migration&&out[migration.from]===item.id){
        delete out[migration.from];
        if(!out[migration.to])out[migration.to]=item.id;
        out._settings['migration-note']=item.name+' belongs in '+migration.to+'. '+(out[migration.to]===item.id?'Moved the saved piece to its correct slot.':'Kept your existing '+migration.to+' item; select this piece again if needed.');
      }
    }
    for(const old of legacy) if(out[old.slot]===old.id || Object.values(out).includes(old.id)) {
      for(const slot of gear) if(out[slot]===old.id) delete out[slot];
      out.ring=d.items.find(x=>m.items[x.id]?.evoMode==='Offense')?.id;
      const facts=m.items[old.id];out._settings['evo-level']=String(facts.upgrades.length);
      facts.upgrades.forEach((text,i)=>out._settings['evo-'+(i+1)]=text);
      out._settings['migration-note']='Moved the old Evolvium variant to its actual ring slot.';
    }
    for(const slot of gear) {const item=byId.get(out[slot]);if(item){if(typeof item.tier==='number'&&item.tier>=12)out._settings['t12-'+slot]='true';else if(out._settings['t12-'+slot]===undefined)out._settings['t12-'+slot]='false';}}
    return out;
  };
  const caps={'Crit Chance':100,Evade:75,Block:100,Barrier:75,Ricochet:75};
  const round=n=>Math.round((n+Number.EPSILON)*10000)/10000;
  const numeric=(x,fallback=0)=>Number.isFinite(Number(x))?Number(x):fallback;
  const bounded=(x,lo,hi,fallback)=>Math.max(lo,Math.min(hi,numeric(x,fallback)));
  const lucky=p=>round(100*(1-Math.pow(1-Math.min(100,Math.max(0,p))/100,2)));
  function active(c,ctx) {
    if(!ctx.enabled)return false;
    return (!c.weapon||c.weapon===ctx.weapon)&&(!c.shielded||ctx.shielded)&&(!c.lowest||ctx.lowest)&&(!c.highest||ctx.highest)&&(!c.allAlive||ctx.allAlive)&&(!c.lastAlive||ctx.lastAlive)&&(!c.spSkill||ctx.spCost>0)&&(!c.selfAbove||ctx.hp>c.selfAbove)&&(!c.selfBelow||ctx.hp<c.selfBelow)&&(!c.targetBelow||ctx.targetHP<c.targetBelow)&&(!c.targetAbove||ctx.targetHP>c.targetAbove)&&(!c.spAbove||ctx.sp>c.spAbove)&&(!c.bleeding||ctx.bleeding);
  }
  function evaluate(input={}) {
    const eq=d.normalizeEquipment(input), settings=eq._settings||{};
    const selected=d.slots.map(s=>byId.get(eq[s.id])).filter(x=>x&&eq[x.slot]===x.id);
    const has=name=>selected.some(x=>m.items[x.id]?.ancient===name);
    const ctx={enabled:settings['combat-mode']==='snapshot',hp:bounded(settings['self-hp'],0,100,100),targetHP:bounded(settings['target-hp'],0,100,100),sp:bounded(settings['current-sp'],0,6,0),spCost:bounded(settings['skill-sp'],0,6,0),shielded:settings.shielded==='yes',lowest:settings['health-rank']==='lowest',highest:settings['health-rank']==='highest',allAlive:settings['team-state']==='all',lastAlive:settings['team-state']==='last',weapon:settings['weapon-type']||'Other',enemies:bounded(settings.enemies,1,5,1),allies:bounded(settings.allies,1,5,1)};
    Object.assign(ctx,{firstIncoming:settings['first-incoming']==='yes',firstOutgoing:settings['first-outgoing']==='yes',targetShielded:settings['target-shielded']==='yes',rooted:settings['target-status']==='rooted',bleeding:settings['target-status']==='bleeding',projectile:settings['attack-type']==='projectile'});
    const raw={},contributions={},effects=[],warnings=[],sets=[];
    const add=(source,bonuses,factor=1)=>Object.entries(bonuses||{}).forEach(([key,value])=>{
      if(!Number.isFinite(value)||!value)return;
      const amount=round(value*factor);raw[key]=round((raw[key]||0)+amount);
      (contributions[key]||(contributions[key]=[])).push({source,value:amount});
    });
    const effect=(source,text)=>{if(text)effects.push({source,text});};
    add('Character base',{'Crit Chance':10,'Crit Dmg':50,Evade:2.5,'Max Shield':50});
    const counts={};selected.forEach(x=>{if(x.setName)counts[x.setName]=(counts[x.setName]||0)+1;});
    const weave=has('Starweave');
    for(const [name,count] of Object.entries(counts)) {
      const set=m.sets[name];if(!set){warnings.push('Unverified set: '+name);continue;}
      const effective=count+(weave&&count>=2&&set.maxPieces>2?1:0);
      for(const [threshold,facts] of Object.entries(set.effects)) if(effective>=Number(threshold)) {
        let multiplier=1;
        const copied=(Number(threshold)===2&&has('W3-4TY (2-piece)'))||(Number(threshold)===3&&has('W3-4TY (3-piece)'));
        // Binary conversions, granted skills, saves and once-only effects don't acquire a second instance.
        const binary=/converts|converted|doubled|prevent.*death|once|gain the .*skill/i.test(facts.text);
        if(copied&&!binary)multiplier=2;
        sets.push({name,count,effective,threshold:Number(threshold),text:facts.text,copied,multiplier});
        add(name+' · '+threshold+' pieces'+(multiplier===2?' · W3-4TY ×2':''),facts.bonuses,multiplier);
        for(const condition of facts.conditional||[]) if(active(condition.when,ctx)) add(name+' · combat condition',condition.bonuses,multiplier*(condition.when.perSP?ctx.sp:1));
        effect(name+' · '+threshold+' pieces',facts.text+(copied?(binary?' · W3-4TY does not stack this effect.':' · Copied by W3-4TY.') :''));
        if(!set.verified)warnings.push('Set wording remains workbook-sourced: '+name);
      }
    }
    const unlocked=(name,threshold)=>sets.some(x=>x.name===name&&x.threshold===threshold);
    const majorMultiplier=has('Elementarium')||unlocked('Apocalypse',5)||(ctx.enabled&&settings['team-position']==='front'&&unlocked('Priyolkian',2))?2:1;
    const enchantMultiplier=unlocked('Witchum',3)||unlocked('Apocalypse',3)||(ctx.enabled&&ctx.highest&&unlocked('Priyolkian',3))?2:1;
    const mountMultiplier=unlocked('Apocalypse',4)?2:1;
    const mythics=selected.filter(x=>gear.includes(x.slot)&&x.kind==='Myth');
    const poly=has('Polychromatic Blaster')&&mythics.length===1;
    const superPoly=has('Supercharged Polychromatic Blaster');
    const MH=byId.get(eq.mainhand),mhElement=d.mainhandElements?.[MH?.name]||'Physical';
    for(const item of selected) {
      const facts=m.items[item.id]||{},name=item.name;
      let factor=(superPoly&&item.kind==='Myth')||(poly&&mythics[0]?.id===item.id)?2:1;
      if(item.kind==='Enchant')factor=enchantMultiplier;
      if(item.slot==='mount')factor*=mountMultiplier;
      let bonuses=facts.bonuses;
      if(item.slot==='accessory'&&settings['accessory-upgrades']==='No Upgrades')bonuses=facts.unupgraded||bonuses;
      add(name+(factor>1?' ×'+factor:''),bonuses,factor);
      if(settings['t12-'+item.slot]==='true'||settings['t12-'+item.slot]===true)add(name+' · T12+',facts.tierBonuses,factor);
      for(const condition of facts.conditional||[])if(active(condition.when,ctx))add(name+' · combat condition',condition.bonuses,factor);
      if(facts.unresolved)warnings.push(facts.unresolved);
      if(facts.randomMountRoll) {
        const stat=settings['random-mount-stat'],range=facts.randomMountRoll[stat],value=settings['random-mount-value'];
        if(range&&value!==undefined&&value!==''&&Number.isFinite(Number(value))&&Number(value)>=range[0]&&Number(value)<=range[1])add(name+' · selected roll',{[stat]:Number(value)},factor);
        else warnings.push(name+': choose the actual rolled bonus type and a value within its Legendary range. No rolled bonus has been added.');
      }
      if(facts.mountRoll) {
        const rollKey=facts.gearRoll?'gear-roll-'+item.slot:'mount-roll';
        const roll=bounded(settings[rollKey],1,8,1);add(name+' · selected roll',{[facts.mountRoll]:roll},factor);
        if(settings[rollKey]===undefined)warnings.push(name+': roll defaults to 1%; set its actual value in Edit Build.');
      }
      if(facts.runeStat) {
        const val=m.runeValues[facts.rune]?.[settings['rarity-'+item.slot]==='Myth'?1:0]||0;
        add(name+' · '+(settings['rarity-'+item.slot]||'Leg')+(majorMultiplier>1?' ×2':''),{[facts.runeStat]:val},majorMultiplier);
      } else if(item.kind==='Rune') {
        const val=m.runeValues[facts.rune]?.[settings['rarity-'+item.slot]==='Myth'?1:0];
        const rune=facts.rune;
        const minor={Dar:'Gold Find',Quindi:'Capture Rate',Vryn:'Item Find',Zyrk:'Experience'};
        if(minor[rune])add(name,{[minor[rune]]:val});
        if(rune==='Sol')add(name,{Redirect:val});
        if(rune==='Erlun')add(name,{'Max Shield':val});
        const descriptions={Vend:val+'% extra Evade on the first incoming attack from each opponent.',Nox:val+'% extra Damage on the first outgoing attack against each opponent.',Yuh:val+'% extra Empower on the first outgoing attack against each opponent.',Kaun:val+'% extra DR on the first incoming attack from each opponent.',Gael:val+'% SP regeneration at full health.',Chet:val+'% SP drain on defeating an opponent.',Kor:(settings['rarity-'+item.slot]==='Myth'?125:100)+'% increased skill healing received below 25% health.',Mayu:val+'% Damage at full health.',Nonik:val+'% DR at full health.',MullAtkEnemy:(settings['rarity-'+item.slot]==='Myth'?6.25:5)+'% chance on hit to reduce the target’s current HP by 10%.',BonikAtkTeam:(settings['rarity-'+item.slot]==='Myth'?6.25:5)+'% chance on hit to reduce enemy team current HP by 6%.',WullShield:(settings['rarity-'+item.slot]==='Myth'?5:4)+'% chance when hit to gain shields equal to 10% current HP.',BoliSpOnHit:(settings['rarity-'+item.slot]==='Myth'?30:25)+'% chance when hit to gain 1 SP.',Telgu:(settings['rarity-'+item.slot]==='Myth'?5:4)+'% chance on hit to ignore defensive bonuses.',Melgu:(settings['rarity-'+item.slot]==='Myth'?5:4)+'% chance when hit to ignore offensive bonuses.'};
        const relicAlias={Mull:'MullAtkEnemy',Bonik:'BonikAtkTeam',Wull:'WullShield',Boli:'BoliSpOnHit'};
        effect(name,facts.runeTemplate?facts.runeTemplate.replaceAll('{value}',String(val)):descriptions[relicAlias[rune]||rune]||(!minor[rune]&&rune!=='Sol'?'Rune effect: see source.':''));
        const condition=facts.runeCondition;
        if(condition&&ctx.enabled&&active(condition,ctx)&&(!condition.fullHealth||ctx.hp===100)&&(!condition.firstIncoming||ctx.firstIncoming))
          add(name+' · combat condition',{[condition.stat]:val*(condition.perSP?ctx.sp:1)});
        if(ctx.enabled&&ctx.hp===100) {
          if(rune==='Mayu')add(name,{'Damage':val});if(rune==='Nonik')add(name,{DR:val});if(rune==='Gael')add(name,{'SP Regen':val});
        }
        if(ctx.enabled&&ctx.hp<25&&rune==='Kor')add(name,{'Healing Received':settings['rarity-'+item.slot]==='Myth'?125:100});
        if(ctx.enabled&&ctx.firstIncoming){if(rune==='Vend')add(name+' · first incoming',{Evade:val});if(rune==='Kaun')add(name+' · first incoming',{DR:val});}
        if(ctx.enabled&&ctx.firstOutgoing){if(rune==='Nox')add(name+' · first outgoing',{Damage:val});if(rune==='Yuh')add(name+' · first outgoing',{Empower:val});}
      }
      if(facts.ancient==='Evolvium') {
        const levels=m.evolvium[facts.evoMode],level=bounded(settings['evo-level'],0,4,0);
        for(let i=0;i<level;i++) {
          const allowed=levels[i].slice(1),choice=allowed.includes(settings['evo-'+(i+1)])?settings['evo-'+(i+1)]:allowed[0];
          const match=choice.match(/^\+?(\d+(?:\.\d+)?)% (.+)$/),reverse=choice.match(/^(Adrenaline|Revitalize) (\d+)%$/);
          const keys={'Damage Reduction':'DR','Block Chance':'Block','Evade Chance':'Evade','Absorb Chance':'Absorb','Max shields':'Max Shield','Empower Chance':'Empower','SP Regeneration':'SP Regen'};
          if(match)add('Evolvium +'+(i+1),{[keys[match[2]]||match[2]]:Number(match[1])});
          else if(reverse)add('Evolvium +'+(i+1),{[reverse[1]]:Number(reverse[2])});
          effect('Evolvium +'+(i+1),choice);
        }
      }
      if(facts.ancient==='Heart of Escarium')warnings.push('Heart of Escarium: source pages disagree about the amplifier trigger; the overview’s 15% Redirect is used.');
      if(/^Primordial Codex|^Codex/.test(facts.ancient||name)) {
        const offensive=/Offense/.test(name);
        const b=offensive?{'Physical':{'Dual Strike':6},Fire:{'Combustion Damage':35},Earth:{Oxidize:35},Air:{Adrenaline:3},Electric:{'Shock Damage':35},Water:{'Freeze stacks':-1}}:{Physical:{Purification:25},Earth:{Barrier:10},Water:{Vampirism:10},Air:{Revitalize:10},Electric:{Bolster:10}};
        add(name+' · '+mhElement,b[mhElement]);
        if(!offensive&&mhElement==='Fire'){effect(name,'2% DR for each current SP (Patience).');if(ctx.enabled)add(name+' · current SP',{DR:2*ctx.sp});}
      }
      if(/^Sacramentum/.test(facts.ancient||'')) {
        const variant=settings.sacramentum||'Offensive';
        if(variant==='Support') {add('Sacramentum Support',{'Team Health':10,'Team Life Steal':15});effect(name,'Fastest ally’s first attack gains 100% Braveheart and +20% Damage.');}
        if(variant==='Defensive'){add('Sacramentum Defensive',{'Team Armor':7});effect(name,'35% chance to Curse the attacker. Overview limits this to the first two turns; source disagreement remains.');}
        if(variant==='Offensive'){add('Sacramentum Offensive',{'Team Accuracy':7});effect(name,'First attack reduces enemy current HP by 15%; 35% chance to apply Deathmark on hit.');}
      }
      if(m.amplifiers[facts.ancient]) {
        const options=m.amplifiers[facts.ancient];const choice=options.find((row,i)=>String(i)===settings['amplifier-'+item.slot])||options[0];
        effect(name+' · '+(choice[0]||'SP / Shield'),choice[1]);
      }
      if(/of Escarium$/.test(facts.ancient||'')&&item.slot==='mainhand')add(name,{'Max SP':2,'SP per Turn':1});
      const gearCounts=kind=>selected.filter(x=>gear.includes(x.slot)&&x.kind===kind).length;
      if(name==='Nebuleye')add(name+' · Legendary gear',{Damage:gearCounts('Leg'),DR:gearCounts('Leg')},factor);
      if(name==='Ataraxia')add(name+' · Set gear',{Damage:gearCounts('Set')},factor);
      if(name==='Radiance')add(name+' · Mythic gear',{Damage:.75*gearCounts('Myth'),DR:.75*gearCounts('Myth')},factor);
      // Curated snapshot bonuses; stacks and random proc damage remain in effects.
      if(ctx.enabled) {
        const rules={
          'Quetzal Gift':[{'Evade':5},{lowest:true}], 'Thorstein Crown':[{Absorb:5},{lowest:true}],
          'Kaijin Reminder':[{Damage:25},{targetBelow:30}], 'Hood of Menace':[{Evade:5},{selfAbove:75}],
          'Frozen Beads':[{Deflect:5},{shielded:true}], 'Dewey Decal':[{Damage:5},{allAlive:true}],
          'Timeweaver Garments':[{DR:5},{allAlive:true}], 'Phoenix Ravager':[{DR:5},{selfAbove:99.999}],
          'Hydragar Stone':[{Absorb:5},{selfAbove:50}], 'Nephilim Casque':[{Speed:5},{selfAbove:40}],
          'Boreas Meteor':[{Barrier:10},{highest:true}], 'Night Visage':[{Damage:5},{selfAbove:99.999}],
          'Bassault':[{DR:5},{shielded:true}], 'Vile Focus':[{Absorb:3},{selfAbove:50}],
          'Sleipnir':[{Damage:5},{selfAbove:50}], 'Huntress Savior':[{'Healing Bonus':20},{spSkill:true}],
          'Thorstein Talisman':[{'Healing Bonus':20},{spSkill:true}], 'Exothermic Saw':[{Damage:10},{spSkill:true}],
          'Frostybite':[{Damage:5},{spSkill:true}], 'Battleplate':[{Damage:5},{spSkill:true}]
        };
        const rule=rules[name];if(rule&&active(rule[1],ctx))add(name+' · combat condition',rule[0],factor);
        if(name==="Demon's Garments"&&ctx.lastAlive)add(name+' · last alive',{Damage:10,DR:10},factor);
        const scale={'Tau Bless':['Damage',4.5,true],'Hysteria':['Damage',10,false],'Windstalker':['Damage',6,true],'Vortex Band':['DR',4.5,true],'Quetzal Scaled Vest':['DR',10,false],'Uxonium Ring':['Empower',10,true]};
        if(scale[name]){const [key,max,up]=scale[name];add(name+' · HP scaling',{[key]:max*(up?ctx.hp:100-ctx.hp)/100},factor);}
        if(name==='Kaijin Fang')add(name+' · Patience',{DR:Math.min(8,ctx.sp*2)},factor);
        if(name==='Nephilim Girdle')add(name+' · team alive',{Empower:1.25*ctx.allies},factor);
        if(name==='Leonidas Honor')add(name+' · team alive',{Barrier:3.5*ctx.allies},factor);
        if(name==='Leonidas Strength')add(name+' · enemies alive',{'Quad Strike':.5*ctx.enemies},factor);
      }
      if(item.kind!=='Set'&&item.kind!=='Rune')for(const text of (facts.petTrigger?[petDescription(item,settings)]:facts.effects||[]))effect(name,text+(factor===2&&item.kind==='Myth'?' · Polychromatic bonus doubling is active; triggered effects remain separate from permanent totals.':''));
    }
    const setCondition=(name,threshold,bonuses)=>{const entry=sets.find(x=>x.name===name&&x.threshold===threshold);if(entry)add(name+' · combat condition',bonuses,entry.multiplier);};
    if(ctx.enabled){
      if(ctx.targetHP>75||ctx.targetHP<25)setCondition('Arsenal',3,{Damage:10});
      setCondition('Arsenal',4,{Damage:30*ctx.targetHP/100});
      setCondition('Polaris',4,{DR:20*ctx.hp/100});
      setCondition('Pyroc',2,{Empower:2*ctx.enemies});
      if(!ctx.targetShielded)setCondition('Pyroc',3,{'Fire Dmg':15});
      if(ctx.enemies>=3)setCondition('Raiju',2,{'Electric Dmg':10});
      if(ctx.hp<70)setCondition('Saywite',4,{'Water Res':25});
      if(ctx.rooted)setCondition('Elcorvo',3,{'Dual Strike':15});
      if(ctx.bleeding)setCondition('Poshima',3,{Empower:15});
      if(ctx.targetShielded)setCondition('Wrightbros',3,{Empower:15});
      if(ctx.projectile)setCondition('Conduction',2,{Damage:5});
      if(ctx.enemies===1)setCondition('Conduction',4,{Damage:25});
      setCondition('Hector',2,{Ricochet:2.5*ctx.enemies});
      setCondition('Protoplague',2,{'Dual Strike':5*ctx.allies});
      setCondition('DragonSkull',2,{Damage:Math.floor((100-ctx.targetHP)/10)});
      setCondition('BlackArrow',2,{Absorb:.5*Math.floor((100-ctx.hp)/10)});
    }
    if(unlocked('Akiho',4))add('Akiho · Redirect conversion',{Evade:Math.min(25,Math.floor((raw.Redirect||0)/5)*2.5)},sets.find(x=>x.name==='Akiho'&&x.threshold===4).multiplier);
    for(const item of selected){
      const conversion=m.items[item.id]?.resistanceConversion;
      if(!conversion)continue;
      const factor=(superPoly&&item.kind==='Myth')||(poly&&mythics[0]?.id===item.id)?2:1;
      add(item.name+' · Resistance conversion',{[conversion.to]:(raw[conversion.from]||0)*conversion.rate},factor);
    }
    for(const item of selected){
      const conversion=m.items[item.id]?.bonusConversion;
      if(!conversion)continue;
      const factor=(superPoly&&item.kind==='Myth')||(poly&&mythics[0]?.id===item.id)?2:1;
      add(item.name+' · Bonus conversion',{[conversion.to]:Math.min(conversion.cap??Infinity,(raw[conversion.from]||0)*conversion.rate)},factor);
    }
    const values={};d.stats.forEach(x=>{const key=x.label;values[x.id]=round(Math.min(key==='DR'?75:caps[key]??Infinity,Math.max(key==='DR'||key==='Damage'||key==='Speed'?-Infinity:0,raw[key]||0)));});
    const luck={};if(has('64-bit Clover'))for(const key of ['Crit Chance','Evade','Block','Absorb','Deflect','Dual Strike','Empower','Quad Strike','Redirect','Barrier','Ricochet'])luck[key]=lucky(Math.min(caps[key]??100,raw[key]||0));
    const elements=['Physical','Fire','Earth','Air','Electric','Water'];
    const weak={Fire:'Water',Earth:'Fire',Air:'Earth',Electric:'Air',Water:'Electric'};
    const weight=(source,target)=>source===target?1:weak[source]===target?0:.75;
    const elemental={};for(const target of elements) {
      let damage=0,dr=0;for(const source of elements){damage+=(raw[source==='Physical'?'Damage':source+' Dmg']||0)*weight(source,target);dr+=(raw[source==='Physical'?'DR':source+' Res']||0)*weight(source,target);}
      elemental[target]={damage:round(damage),dr:round(Math.min(75,dr))};
    }
    return {values,raw,contributions,effects,sets,ctx,luck,elemental,warnings:[...new Set(warnings)],multipliers:{poly,superPoly,major:majorMultiplier,enchant:enchantMultiplier,mount:mountMultiplier},mhElement};
  }
  d.evaluate=evaluate;d.calculate=input=>evaluate(input).values;
  function petDescription(item,settings={}) {
    const pet=window.BH_MECHANICS.items[item.id]?.petTrigger;if(!pet)return item.description;
    const upgraded=settings['pet-upgrades']!=='No Upgrades',chance=pet.base+(upgraded?4*pet.increment:0);
    const designated=!pet.reforgable?'Unavailable (cannot reforge)':Number((chance*2).toFixed(3))+'%'+(upgraded?'':' (requires an upgrade before reforging)');
    return 'Spread: '+Number(chance.toFixed(3))+'%; Designated: '+designated+'. '+(upgraded?'Fully upgraded (+4).':'No upgrades.')+' Effect: '+pet.action+'; power '+pet.power+'. Reforging selects one trigger; effect power stays the same.';
  }
  window.BH_ENGINE={evaluate,lucky,petDescription};
})();

