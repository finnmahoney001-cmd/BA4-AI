const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},document:{addEventListener(){}}};vm.createContext(ctx);
for(const file of ['data.js','mechanics-data.js','mechanics.js','description-ui.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
const data=ctx.window.BH_DATA,engine=ctx.window.BH_ENGINE,ui=ctx.window.BH_UI;
const report=equipment=>engine.evaluate(equipment);
const pets=data.items.filter(item=>item.slot==='pet');assert.equal(pets.length,50);
for(const pet of pets){
  const result=report({pet:pet.id});
  assert.ok(ui.description(pet).includes('Spread:'),pet.name);
  assert.ok(result.effects.some(effect=>effect.source===pet.name&&effect.text.includes('to do')),pet.name);
  assert.equal(result.raw.Damage||0,0,pet.name+' must not add proc damage to permanent Damage');
  assert.equal(result.raw['Team Enrage']||0,0,pet.name+' must not add triggered enrage to permanent totals');
}
const wing=data.items.find(item=>item.name==='Goldwings Chivalry');assert.ok(wing);
for(const [state,expected] of [['No Upgrades',16],['Fully Upgraded',20]]){
  const result=report({accessory:wing.id,_settings:{'accessory-upgrades':state}});
  assert.equal(result.raw.DR,expected);assert.equal(result.raw.Absorb,8);assert.equal(result.raw.Damage,-4);
}
const mount=data.items.find(item=>item.name==='Peach / Deano / Spomder');
assert.equal(report({mount:mount.id}).raw.Block||0,0);
assert.ok(report({mount:mount.id}).warnings.some(text=>text.includes('No rolled bonus')));
for(const [stat,range] of Object.entries(ctx.window.BH_MECHANICS.items[mount.id].randomMountRoll)){
  for(const value of range){const result=report({mount:mount.id,_settings:{'random-mount-stat':stat,'random-mount-value':String(value)}});const addition=result.contributions[stat].filter(part=>part.source.includes('selected roll'));assert.equal(addition.length,1);assert.equal(addition[0].value,value);}
  for(const value of ['',String(range[0]-0.1),String(range[1]+0.1),'bad']){const result=report({mount:mount.id,_settings:{'random-mount-stat':stat,'random-mount-value':value}});assert.ok(result.warnings.some(text=>text.includes('No rolled bonus')));assert.ok(!(result.contributions[stat]||[]).some(part=>part.source.includes('selected roll')));}
}
assert.ok(data.items.every(item=>!/awaiting formula validation|listed in the supplied workbook/i.test(ui.description(item))), 'No generic placeholders remain');
assert.ok(data.items.every(item=>item.name!=='MythDef'));
console.log('50 pet effect records, accessory upgrades, all random mount ranges, and zero visible placeholders verified.');

const druffo=pets.find(p=>p.name==='Druffo');
assert.ok(ui.description(druffo,undefined,{'pet-upgrades':'No Upgrades'}).includes('Spread: 23% to do 32–76%\nDesignated: Unavailable (requires an upgrade)'));
assert.ok(ui.description(druffo).includes('Spread: 25% to do 32–76%\nDesignated: 50% to do 32–76%'));
assert.ok(report({pet:druffo.id,_settings:{'pet-upgrades':'No Upgrades'}}).effects.some(e=>e.text.includes('Spread: 23%')));
