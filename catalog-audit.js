// Reviewed corrections from the complete 4 October 2026 source-row audit.
(() => {
 const d=window.BH_DATA,m=window.BH_MECHANICS,r=window.BH_CATALOG_REPAIRS;
 const wiki='https://bit-heroes.fandom.com/wiki/';
 const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 function add(name,slot,kind,description,facts={},extra={}){
  const id='audit-'+slug(name)+'-'+slot;
  if(d.items.some(i=>i.name===name&&i.slot===slot))return;
  d.items.push({id,name,slot,kind,description,image:'',source:facts.source,setName:'',bonuses:null,...extra});
  m.items[id]={bonuses:{},effects:[description],...facts};
 }
 for(const [id,names] of Object.entries(r.aliases)){
  const item=d.items.find(i=>i.id===id);if(item)item.aliases=[...new Set([...(item.aliases||[]),...names])];
 }
 const fyssas=d.items.find(i=>i.id===r.fyssasId);
 fyssas.slot='neck';m.items[fyssas.id].slotMigration={from:'ring',to:'neck'};
 m.sets.Thonderstriker={verified:true,maxPieces:4,effects:{
  2:{text:'Gain 10% Barrier while above 50% health. Gain 5% Absorb while below 50% health.',bonuses:{},conditional:[{when:{selfAbove:50},bonuses:{Barrier:10}},{when:{selfBelow:50},bonuses:{Absorb:5}}],source:wiki+'Equipment/Set'},
  3:{text:'Gain 12% Absorb while below 50% health. Gain 40% Block while above 50% health.',bonuses:{},conditional:[{when:{selfBelow:50},bonuses:{Absorb:12}},{when:{selfAbove:50},bonuses:{Block:40}}],source:wiki+'Equipment/Set'},
  4:{text:'50% chance to deal 10% Electric Damage to yourself when receiving skill healing. 50% chance to spread shield and heal for 30% when hit. Gain 30% Barrier while above 50% health.',bonuses:{},conditional:[{when:{selfAbove:50},bonuses:{Barrier:30}}],source:wiki+'Equipment/Set'}
 }};
 for(const name of ['Boomsmasher','Hazmatt','Thonderstriker'])d.setEffects[name]=Object.fromEntries(Object.entries(m.sets[name].effects).map(([n,e])=>[n,e.text]));
 for(const item of r.setAdditions)add(item.name,item.slot,'Set',item.name+' set.',{source:wiki+'Equipment/Set'},
  {setName:item.name,tier:item.tier,aliases:[item.piece]});
 const mythFacts={
  'Boomsmasher Piphammer':{bonuses:{Block:10}},
  'Boomsmasher Mutant Core':{bonuses:{Deflect:3}},
  'Kolunus Doctor Suit':{bonuses:{Barrier:25,'Healing Bonus':-15}},
  'Kolunus Fried Suit':{bonuses:{'Max Shield':25}},
  'Gomoloid Bolt Helmet':{conditional:[{when:{selfAbove:50},bonuses:{Block:20}},{when:{selfBelow:50},bonuses:{Absorb:8}}]},
  'Gomoloid Feather Ring':{conditional:[{when:{bleeding:true},bonuses:{'Air Dmg':15}}]},
  'Hazmatt Blob':{bonusConversion:{from:'Earth Dmg',to:'Healing Bonus',rate:.5,cap:25}}
 };
 const statKeys={'Damage Reduction':'DR','Damage Bonus':'Damage','Empower Chance':'Empower','Evade Chance':'Evade','Block Chance':'Block',
  'Crit Damage':'Crit Dmg','Crit Chance':'Crit Chance','SP Regeneration':'SP Regen','Team Enrage':'Team Enrage',
  'Ricochet Chance':'Ricochet','Absorb Chance':'Absorb','Deflect Chance':'Deflect','Water Resist':'Water Res','Air Resistance':'Air Res','Earth Resistance':'Earth Res',
  'Fire Resistance':'Fire Res','Electric Resistance':'Electric Res','Air Damage':'Air Dmg','Earth Damage':'Earth Dmg',
  'Fire Damage':'Fire Dmg','Water Damage':'Water Dmg','Electric Damage':'Electric Dmg'};
 function flat(text){
  const bonuses={};for(const clause of text.replace(/\[\d+\]/g,'').split(/,|\band\b/)){
   const match=clause.trim().match(/^\+?(-?\d+(?:\.\d+)?)%\s+([A-Za-z ]+)\.?$/);
   if(match){const name=match[2].trim();bonuses[statKeys[name]||name]=Number(match[1]);}
  }return bonuses;
 }
 for(const item of r.mythAdditions){
  const [unique,element='']=item.description.split(/Element Bonus:\s*/);
  add(item.name,item.slot,'Myth',item.description,{source:wiki+'Equipment/Mythic',tierBonuses:flat(element),...(mythFacts[item.name]||{})},{tier:item.tier});
 }
 for(const item of r.accessoryAdditions){
  const base=flat(item.base),increment=flat(item.upgrade),full={...base};
  for(const [key,value] of Object.entries(increment))full[key]=(full[key]||0)+4*value;
  const unknown=item.upgrade==='TBD';
  const description=item.base+'. '+(unknown?'Upgrade increments are not published in the wiki; totals use the verified base values.':'Each upgrade: '+item.upgrade+'.');
  add(item.name,'accessory',item.kind,description,{source:wiki+'Accessories',bonuses:full,unupgraded:base,
   ...(unknown?{unresolved:item.name+': upgrade increments are unverified; base bonuses are included.'}:{})});
 }
 for(const item of r.petAdditions){
  const match=item.description.match(/^(\d+(?:\.\d+)?)% chance (?:to )?(.*)/);
  const action=match[2].replace(/ per turn, when you get hit, and when you hit an enemy/,'');
  add(item.name,'pet',item.kind,item.description+'; power '+item.power+'. Cannot reforge.',{source:wiki+'Pets',
   petTrigger:{base:Number(match[1]),increment:Number(item.upgrade.replace(/[^\d.]/g,'')),action,power:item.power,reforgable:false}});
 }
 for(const item of r.mountAdditions){
  const bonus=item.description.split('. Skill: ')[0];
  add(item.name,'mount',item.kind,item.description,{source:wiki+'Mounts',bonuses:flat(bonus)});
 }
 for(const item of r.mountVerified){
  const existing=d.items.find(i=>i.name===item.name&&i.slot==='mount');
  existing.description=item.description;existing.source=wiki+'Mounts';
  m.items[existing.id]={source:wiki+'Mounts',bonuses:flat(item.description.split('. Skill: ')[0]),effects:[item.description]};
 }
 // Complete the wiki's sixteen supported bonus types in all six Mythic enchant slots.
 const single={Block:5,Damage:2.5,'Dmg Enrage':2.5,DR:2.5,Deflect:1.4,'Dual Strike':2.5,Empower:2.5,Evade:2.5,
  Health:2.5,'Life Steal':2.5,Speed:2.5,Absorb:1.4,Barrier:2.5,Accuracy:2.5,Ricochet:2.5,'Team Enrage':1.4};
 const stats=Object.keys(single).sort();
 for(let slot=1;slot<=6;slot++){
  const slotId='enchant-'+slot;
  const combinations=new Set(d.items.filter(i=>i.slot===slotId&&i.kind==='Enchant').map(i=>i.name.split(',').map(s=>s.trim()).sort().join('|')));
  for(let a=0;a<stats.length;a++)for(let b=a;b<stats.length;b++){
   const keys=a===b?[stats[a]]:[stats[a],stats[b]],identity=keys.join('|');if(combinations.has(identity))continue;
   const bonuses=Object.fromEntries(keys.map(k=>[k,single[k]/keys.length]));
   add(keys.join(', '),slotId,'Enchant',Object.entries(bonuses).map(([k,v])=>k+' +'+v+'%').join(', ')+'. Mythic enchant.',{source:wiki+'Enchants',bonuses});
  }
  const notice='Feral: the January 8, 2026 official update confirms this Mythic enchant, but does not publish its corrected bonuses. Values require verification; no guessed bonus is included.';
  add('Feral',slotId,'Enchant',notice,{source:'https://www.bitheroesquest.com/updates',unresolved:notice});
 }
 // Search canonical rune names as well as workbook-specific labels.
 const invasion='https://store.steampowered.com/news/posts/?appids=666860&enddate=1765989044&feed=steam_community_announcements';
 add('Sardinex Alterator','ring','Myth','Your familiars deal 10% more damage.',{source:invasion},{});
 const chocNotice='Chocodrifter: confirmed as a mount in the January 8, 2026 official update. Rarity, skill and bonus values require verification; no guessed bonus is included.';
 add('Chocodrifter','mount','Unverified rarity',chocNotice,{source:'https://www.bitheroesquest.com/updates',unresolved:chocNotice});
 for(const item of d.items.filter(i=>i.kind==='Ancient')){
  const canonical=item.name.startsWith('Codex (')?'Primordial Codex':item.name.replace(/ \((?:Offense|Defense|2-piece|3-piece)\)$/,'');
  item.aliases=[...new Set([...(item.aliases||[]),canonical])];
 }
 for(const item of d.items.filter(i=>i.kind==='Rune')){
  const rune=m.items[item.id]?.rune;
  const canonical={MullAtkEnemy:'Mull',BonikAtkTeam:'Bonik',WullShield:'Wull',BoliSpOnHit:'Boli'}[rune]||rune;
  if(canonical)item.aliases=[...new Set([...(item.aliases||[]),canonical])];
 }
})();
