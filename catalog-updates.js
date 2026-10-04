// Reviewed additions. Load after data/mechanics facts and before the evaluator.
(() => {
  const d=window.BH_DATA,m=window.BH_MECHANICS;
  const runeSource='https://bit-heroes.fandom.com/wiki/Runes';
  const updates='https://www.bitheroesquest.com/updates';
  const season='https://www.bitheroesquest.com/';
  const boss='https://www.bitheroesquest.com/2026-world-boss';
  const preview='https://steamcommunity.com/games/666860/announcements/detail/516362619486997049';
  const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  function add(name,slot,kind,description,facts={},extra={}) {
    if(d.items.some(i=>i.name===name&&i.slot===slot))return;
    const id='update-'+slug(name)+'-'+slot;
    d.items.push({id,name,slot,kind,description,image:'',source:facts.source||updates,setName:'',bonuses:null,...extra});
    m.items[id]={bonuses:{},effects:description?[description]:[],...facts};
  }
  const majors={Anjo:['Ricochet',2.5,3],Fehu:['Barrier',2.5,3],Renaz:['Team Enrage',1.25,1.5],Uriz:['Accuracy',2.5,3]};
  for(const [name,[stat,leg,myth]] of Object.entries(majors)) {
    m.runeValues[name]=[leg,myth];
    for(const slot of ['major-1','major-2','major-3','major-4'])
      add(name,slot,'Rune',stat+' bonus.',{source:runeSource,rune:name,runeStat:stat,effects:[]});
  }
  // value is the selected rarity's percentage, never an unconditional proc average.
  const runes={
    meta:{
      Berthro:[12.5,15,'Gain {value}% Damage while above 75% health.',{stat:'Damage',selfAbove:75}],
      Erlun:[20,25,'Maximum shields +{value}%.'],
      Gejo:[25,30,'Gain {value}% Block while above 75% health.',{stat:'Block',selfAbove:75}],
      Gerou:[12.5,15,'Gain {value}% Absorb while below 25% health.',{stat:'Absorb',selfBelow:25}],
      Grunak:[20,25,'{value}% chance for a skill to spend no SP.'],
      Hannaz:[12.5,15,'The first attack from each opponent has an extra {value}% chance to be deflected.',{stat:'Deflect',firstIncoming:true}],
      Maelir:[12.5,15,'Gain {value}% Deflect while below 25% health.',{stat:'Deflect',selfBelow:25}],
      Murnack:[4,5,'Gain {value}% Empower for each current SP.',{stat:'Empower',perSP:true}],
      Nauthuz:[12.5,15,'Gain {value}% damage reduction while above 75% health.',{stat:'DR',selfAbove:75}],
      Nekth:[50,60,'{value}% of overkill damage ricochets.'],
      Sowaz:[12.5,15,'The first attack from each opponent has an extra {value}% chance to be absorbed.',{stat:'Absorb',firstIncoming:true}],
      Trofik:[7.5,10,'Teammates behind you gain {value}% Damage.'],
      Velbur:[85,100,'Convert {value}% of overhealing into shields.'],
      Yevra:[25,30,'Deal {value}% extra damage to enemies above 75% health.',{stat:'Damage',targetAbove:75}],
      Zunil:[7.5,10,'Teammates behind you gain {value}% damage reduction.']
    },
    relic:{
      Argiz:[2,3,'50% chance when hit to gain {value}% damage reduction, stacking up to five times.'],
      Dagala:[6,7.5,'{value}% chance when hit to heal yourself for 10% of current health.'],
      Dralvik:[4,5,'Revitalize: spread heal for {value}% when you hit an enemy.'],
      Filbur:[12.5,17.5,'{value}% chance when you hit an enemy to remove 1 SP from them.'],
      Hleffin:[2,2.5,'{value}% chance when you hit an enemy to gain shields equal to 10% of current health.'],
      Kofra:[4,5,'Bolster: spread shield for {value}% when you hit an enemy.']
    },
    artifact:{
      Harnok:[8,10,'Gain {value}% damage reduction if you have the lowest health in your team.',{stat:'DR',lowest:true}],
      Huyrale:[4,5,'Gain {value}% Deflect at full health.',{stat:'Deflect',fullHealth:true}],
      Othale:[8,10,'Gain {value}% Empower at full health.',{stat:'Empower',fullHealth:true}],
      Tach:[4,5,'Gain {value}% Evade at full health.',{stat:'Evade',fullHealth:true}],
      Thork:[8,10,'Gain {value}% Dual Strike at full health.',{stat:'Dual Strike',fullHealth:true}],
      Ulnaed:[8,10,'Gain {value}% damage reduction while shielded.',{stat:'DR',shielded:true}]
    }
  };
  for(const [slot,group] of Object.entries(runes))for(const [name,[leg,myth,text,condition]] of Object.entries(group)) {
    m.runeValues[name]=[leg,myth];
    add(name,slot,'Rune',text,{source:runeSource,rune:name,runeTemplate:text,runeCondition:condition,effects:[]},
      name==='Gerou'?{aliases:['Georu']}:name==='Murnack'?{aliases:['Murnak']}:{});
  }
  // Releases establish these names/categories, but do not publish full stat tables.
  function announced(names,slot,kind,date) {
    for(const name of names) {
      const notice=name+': '+date+' official announcement confirms this item. Its bonus, trigger and upgrade values still need verification; no unsupported bonus is included in totals.';
      add(name,slot,kind,notice,{source:updates,unresolved:notice});
    }
  }
  announced(['Minignis','Altumbis','Cinyx','Gorbonbon'],'pet','Myth','June 11, 2026');
  announced(['Abyss Tablet','EMW Shield','Volstar Wings','Extorcus'],'accessory','Myth','June 11, 2026');
  announced(['Mewshi','Yorm','Comically Misplaced Vehicle','Nousic'],'mount','Myth','June 11, 2026');
  for(const [date,pets,accessories] of [
    ['April 2026',['Sblorpi'],['Model-200 BBE']],
    ['May 2026',['Jamo','Freako'],['Nik-ON','Can-ON']],
    ['June 2026',['Shain','Bawl'],['Godhand','Gilded Foot']],
    ['July 2026',['Jaggy','Opaladin'],['Pickasso','Mohs Def']],
    ['August 2026',['Pawncer','Pawnstopper'],["Rook 'n Load",'Board Stiff']]
  ]) {
    // Weekly notes identify category, not rarity. Avoid assigning Legendary by assumption.
    announced(pets,'pet','Unverified rarity',date);announced(accessories,'accessory','Unverified rarity',date);
  }
  add('Fondanten','pet','Leg','Damage the enemy team for 27% and heal your team for 27%. Trigger chance and upgrade scaling are not specified in the announcement.',
    {source:season,unresolved:'Fondanten: trigger chance and upgrade scaling require verification.'});
  for(const [name,text,bonuses] of [
    ["Piece o' Cake",'8% Quad Strike.',{'Quad Strike':8}],
    ['Bang Up Job','10% Absorb and 7% Deflect.',{Absorb:10,Deflect:7}]
  ])add(name,'accessory','Leg',text+' Published seasonal values; upgrade scaling is not specified.',
    {source:season,bonuses,unresolved:name+': published bonus is shown; base versus upgraded values require verification.'});
  const definitions={
    Cyberprawn:{tier:7,slots:['mainhand','offhand','ring','neck'],effects:{
      2:{text:'Your team gains 3% Damage.',bonuses:{Damage:3}},
      3:{text:'Your team gains 10% SP regeneration.',bonuses:{'SP Regen':10}},
      4:{text:'Gain 5% Healing Power for each teammate alive.',bonuses:{},conditional:[]}
    }},
    Neuralizer:{tier:14,slots:['head','body','neck','ring'],effects:{
      2:{text:'Deflect the first hit against you.',bonuses:{}},
      3:{text:'Begin battle with shields equal to 50% of maximum shielding.',bonuses:{}},
      4:{text:'Gain 30% Electric Resistance while shielded.',bonuses:{},conditional:[{when:{shielded:true},bonuses:{'Electric Res':30}}]}
    }},
    Priyolkian:{tier:21,slots:['head','body','ring','offhand'],effects:{
      2:{text:'Double major rune bonuses while in the front position.',bonuses:{}},
      3:{text:'Double enchant bonuses while you have the highest health.',bonuses:{}},
      4:{text:'You and enemies deal 25% less damage until your first turn.',bonuses:{}}
    }}
  };
  for(const [name,def] of Object.entries(definitions)) {
    m.sets[name]={verified:true,maxPieces:4,effects:Object.fromEntries(Object.entries(def.effects).map(([n,e])=>[n,{source:boss,conditional:[],...e}]))};
    d.setEffects[name]=Object.fromEntries(Object.entries(def.effects).map(([n,e])=>[n,e.text]));
    for(const slot of def.slots)add(name,slot,'Set','Gallus Apotheosis '+name+' set.',{source:preview},{setName:name,tier:def.tier});
  }
  for(const [name,slot,tier,text,bonuses] of [
    ['Cyberprawn Suit','body',7,'2% Empower and 2% Speed.',{Empower:2,Speed:2}],
    ['Cyberprawn Scanner','head',7,'Gain Engage: spend 1 SP to Enrage a target ally. Official sources disagree on power (137% versus 342%); power is unverified.',{}],
    ['Neuralizer Neutralizer','mainhand',14,'Gain full shielding the first time your health drops below 30%.',{}],
    ['Neuralizer Container','offhand',14,'25% Electric Resistance and -15% Speed.',{'Electric Res':25,Speed:-15}],
    ['Priyolkian Splitter','mainhand',21,'30% chance when hit to heal yourself for 12.5%.',{}],
    ['Priyolkian Battery','neck',21,'25% Barrier until your first turn.',{}]
  ])add(name,slot,'Myth',text,{source:boss,bonuses,...(name==='Cyberprawn Scanner'?{unresolved:text}:{})}, {tier});
  for(const slot of ['mainhand','offhand'])add('Supercharged Polychromatic Blaster',slot,'Ancient',
    'Double bonuses of all equipped Mythic equipment. Available as mainhand or offhand at T21.',
    {source:preview,ancient:'Supercharged Polychromatic Blaster',tierBonuses:{Damage:5,DR:5},
      unresolved:'Supercharged Polychromatic Blaster: published equipment bonuses are doubled; rune/enchant rarity interactions and unverified item values are not assumed.'},{tier:21});
})();
