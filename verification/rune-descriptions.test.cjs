const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{},document:{addEventListener(){}}};vm.createContext(context);
for(const file of ['data.js','mechanics-data.js','mechanics.js','description-ui.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
const d=context.window.BH_DATA,ui=context.window.BH_UI;
const runes=d.items.filter(item=>item.kind==='Rune');
for(const item of runes)for(const rarity of d.rarities[item.slot]){
 const text=ui.description(item,rarity);
 assert.ok(text.includes(rarity==='Myth'?'Mythic':'Legendary'),item.name+' rarity');
 assert.ok(!/undefined|NaN|see source|Values follow/.test(text),item.name+' description');
}
const vex=runes.find(i=>ui.name(i)==='Vex');assert.equal(ui.description(vex,'Leg'),'Dual Strike +2.5% (Legendary).');assert.equal(ui.description(vex,'Myth'),'Dual Strike +3% (Mythic).');
console.log('PASS '+runes.length+' rune records in both supported rarities; Vex values match mechanics.');

const slots=['major-1','major-2','major-3','major-4'];
assert.equal(ui.nextSlot(slots,{'major-1':'a'},undefined),'major-2');
const filled=Object.fromEntries(slots.map(slot=>[slot,'a']));
assert.equal(ui.nextSlot(slots,filled,undefined),'major-1');
assert.equal(ui.nextSlot(slots,filled,'major-1'),'major-2');
assert.equal(ui.nextSlot(slots,filled,'major-4'),'major-1');
assert.equal(ui.nextSlot(slots,{'major-1':'a','major-2':'a','major-4':'a'},'major-4'),'major-3');
console.log('PASS empty-first additions, occupied slot cycling and wraparound.');
