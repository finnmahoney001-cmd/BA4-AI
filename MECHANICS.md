# Bit Heroes mechanics audit

## Guest entry and save authentication — 4 October 2026

Planner and Library open immediately without login. Save checks the current session, preserves the equipment draft and build name, and prompts login. Successful authentication resumes the pending save once; guest preview cannot bypass saving authentication. Logout returns to the guest planner. Regression checks cover guest entry, unavailable auth, preview, session expiry, authenticated save, draft preservation and login return. Browser checks confirmed guest entry, the Save login prompt and Akiho 20% conditional Evade at 0% Redirect. Live sign-in completion requires a real account and was not exercised.

## Remaining conditional bonuses and Myth Effects scope — 4 October 2026

Bonus summaries subtract the displayed evaluation's contributions from the potential evaluation, including conditions already active in a supported snapshot. Akiho's conversion uses actual Redirect: 2.5% Evade per complete 5% Redirect, capped at 25%, without doubling or assuming the maximum. With 35% Redirect, 17.5% Evade is already included and no additional conversion remains. With 0% Redirect, conversion is 0%. Separate lowest-health (+5%) and shielded (+15%) conditions contribute 20% potential Evade; an already shielded, lowest-health snapshot has none remaining. Hover text explicitly identifies remaining sources and subtraction. This supersedes previous summary notes assuming an always-permanent baseline.

Myth Effects is restricted to Mainhand, Offhand, Head, Body, Neck and Ring. Pet, accessory and mount calculations and descriptions remain in their appropriate sections. Upgrade cards now share full width and equal grid-row height. Browser checks measured identical dimensions for both cards and confirmed Boreas Fire Eye appeared while equipped Druffo did not appear in Myth Effects. Regression tests cover partial Akiho conversion, active-condition subtraction and independent sources; the 30 mechanics checks and bulk-upgrade tests also passed. Screenshot: verification/equal-upgrades.png.

## Compare and Library action correction — 4 October 2026

Compare now reads the shared bonusSummary for both builds. Each percentage retains its permanent value with potential conditional additions in teal parentheses. Permanent and conditional differences are reported separately as second build minus first; potential conditions are not assumed to happen together. Existing source hover descriptions are retained.

Library Use in Planner on an enchant now calls the same compatible-slot bulk operation as the planner. It replaces all six enchant slots at once and preserves other equipment, settings and Library filters. Pet upgrades now appear directly below Accessory upgrades inside a single grid cell, with both existing framed controls preserved.

Browser regression checks applied Evade through the Library and confirmed Evade in all six planner slots. Comparing a Mythic Gerou build with an otherwise matching build without Gerou showed (15%) beside permanent 0%, permanent difference 0 and conditional difference -15 for Absorb. Both upgrade controls share the same horizontal position, with Pet below Accessory. Bulk-upgrade and conditional-bonus calculation tests and JavaScript syntax checks passed. Screenshots: verification/compare-conditional-fix.png and verification/upgrade-stack-fix.png.

## Bulk selection and upgrade ticks — 4 October 2026

Category and item-type menus now provide Include all and Exclude all controls. They preserve the current search. Planner bulk selectors apply an enchant to all six slots or a major rune and rarity to all four slots, resolving each slot's own catalog ID. Individual slot choices remain available.

Pet and accessory upgrade controls now use integer sliders from 0 through 4. Older No Upgrades and Fully Upgraded saved values map to 0 and 4. Pet trigger chances use the researched base chance plus the per-upgrade increment. Descriptions show separate Spread and Designated chance/power lines and the effect action, without maximum-upgrade prose. Designated remains unavailable for pets that cannot reforge or have no upgrades.

Accessory bonuses interpolate the researched base and +4 values across the four upgrades. Entries whose upgrade increments are unverified retain their verified values and uncertainty notice. This supersedes historical binary upgrade-control descriptions below.

Bulk/upgrades, placeholder-effects, mechanics, conditional-bonuses and catalog-audit tests passed. Browser checks confirmed six matching enchants, four Mythic major runes, pet upgrade 2 descriptions, and both bulk filter menus returning the searched result after switching off and on. Screenshots: verification/upgrade-ticks.png and verification/library-bulk-filters.png.

## Conditional bonus display — 4 October 2026

The Bonus % list now shows permanent values on the right and potential additional conditional values in teal parentheses to their left. bonusSummary evaluates permanent rules and a separate potential preview without modifying saved settings or the ordinary combat evaluator. Existing researched HP/SP/first-hit/health-rank/team/enemy rules use their supported upper bounds. Conditional multipliers and downstream conversions are included; Argiz uses its published maximum of five DR stacks. These are additional source sums, not an active combat snapshot or a capped combined chance. Opposing health/team conditions may apply at different times. Proc healing/damage and unsupported temporary rules stay in effects. Hover lists source contributions.

Saved-build cards replace their Damage/Health/Speed strip with nine always-visible equipment slots. The expandable Bonus % section contains only bonus rows. Conditional, existing mechanics and full-catalog tests passed. Browser verification showed Gerou's (15%) beside static 0%, nine equipment rows outside the saved bonus dropdown, and no summary stat boxes. Verification screenshots: verification/conditional-bonuses.png and verification/closet-conditional-bonuses.png.

Researched 3 October 2026. The workbook remains the item-selection starting point. These are bonus-percentage calculations, not a battle simulator or a calculation of equipment Power, Stamina and Agility.

## Calculation order

1. Validate one item per slot and the saved upgrade/rarity choices.
2. Count actual set pieces, then apply Starweave eligibility and unlock each threshold cumulatively.
3. Resolve eligible W3-4TY copies and the enchant, mount and major-rune doubling flags.
4. Add character bases, item modifiers, selected upgrades, runes, enchants and unlocked set modifiers by category. Poly applies to one Mythic among the six ordinary gear slots.
5. In Snapshot mode, add supported modifiers for the selected HP, SP, weapon, shield, opponent and team conditions.
6. Preserve the uncapped contribution sums; cap displayed probabilities and compute Clover effective chances separately.
7. Compute elemental damage and resistance by attack element, applying the DR cap after weighting.

Planner and Closet use the same evaluator. Full Setup remains read-only. Bonus contributions show the source of every added number; other bonuses and triggered effects are available in the expandable summaries.

## Sources and findings

### Ancients

T12+ Ancients contribute 5% damage and 5% DR per equipped piece. The workbook's Ancient descriptions were shifted relative to their item names; the site now maps effects by identity. Elementarium doubles major runes once. Starweave requires two real pieces from a set larger than two pieces. Evolvium is a ring; its upgrade choices are selectable rather than additional equipment slots. Ancient amplifiers and Sacramentum variants are selectable and saved.

Sources: [Ancient overview](https://bit-heroes.fandom.com/wiki/Equipment/Ancient), [Elementarium](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Elementarium), [Starweave](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Starweave), [Evolvium](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Evolvium).

Poly's triggered effects receive independent rolls rather than having their probability combined into one roll. Its gear count excludes mounts, pets and accessories following the documented patch. W3-4TY copies active two- or three-piece effects; binary conversions, one-time skills and base enchant doubling are not reapplied multiplicatively.

Sources: [Polychromatic Blaster](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Polychromatic_Blaster), [2020 patch notes](https://bit-heroes.fandom.com/wiki/Patch_Notes/2020), [W3-4TY](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/W3-4TY).

Clover changes a favorable combat probability `p` into `1 - (1 - p)^2`. It does not multiply damage or item-find bonuses. Pet effects and Backstab are excluded. Nevermore and Evermore also explicitly exclude Clover. Effective probabilities are separate from the gear bonus list.

Source: [64-bit Clover](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/64-bit_Clover).

The three Escarium mainhands add two maximum SP and one SP per turn; their skills differ. Codex uses the mainhand element and its reforge. Offensive Physical adds Dual Strike; Defensive Earth and Water add Barrier and Vampirism. Fire Defensive Patience requires current SP. Amplifier payloads are effects, not permanent elemental damage percentages.

Sources: [Shield](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Shield_of_Escarium), [Sword](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Sword_of_Escarium), [Spear](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Spear_of_Escarium), [Codex](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Primordial_Codex), [Firium](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Firium_Helmet), [Flamium](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Flamium_Protector), [Soul](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Soul_of_Escarium), [Heart](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Heart_of_Escarium), [Sacramentum](https://bit-heroes.fandom.com/wiki/Equipment/Ancient/Sacramentum).

### Sets, Mythics, runes and enchants

All active set thresholds are retained. Permanent modifiers enter the bonus list; triggered attacks, skills, conversions and temporary stacks remain effects. Supported conditional modifiers require explicit Snapshot conditions. Witchum and Apocalypse enchant doubling is a single doubling flag; Elementarium and Apocalypse major doubling likewise does not compound.

Sources: [Set equipment](https://bit-heroes.fandom.com/wiki/Equipment/Set), [Mythic equipment](https://bit-heroes.fandom.com/wiki/Equipment/Mythic).

One rune is active per slot. Major rune values depend on rarity. Mythic Voik uses the reference's 1.5%, correcting the workbook's 1.4%. Minor runes add find/capture/XP bonuses separately. Meta, relic and artifact effects retain their trigger restrictions. A first-attack modifier does not become a permanent modifier.

Sources: [Official rune help](https://bitheroes.zendesk.com/hc/en-us/articles/360038947952-What-are-Runes), [Rune tables](https://bit-heroes.fandom.com/wiki/Runes).

Enchants use the workbook's Mythic combinations. A single ordinary bonus contributes 2.5%; dual bonuses contribute 1.25% each. Block uses 5%/2.5%; Absorb and Deflect use 1.4%/0.7%. Accessory upgrades use four upgrade pips for Fully Upgraded, or their base bonuses for No Upgrades. Variable gear and mount rolls must be chosen explicitly.

Sources: [Enchant tables](https://bit-heroes.fandom.com/wiki/Enchants), [Accessories](https://bit-heroes.fandom.com/wiki/Equipment/Accessory), [Mounts](https://bit-heroes.fandom.com/wiki/Mounts).

### Combat percentages

Character defaults include 10% critical chance, 50% critical damage and 2.5% evade. The reported caps are 100% critical chance and block, and 75% evade, barrier and ricochet. Damage enrage storage capacity is not a cap on its acquisition percentage. Different defensive rolls remain separate; they are not added into one avoidance number.

Source: [Mechanics](https://bit-heroes.fandom.com/wiki/Mechanics).

Element matching contributes 100%, weakness contributes zero, and other relationships contribute 75%. Physical is neutral to the five elements. DR is capped at 75% after the weighted sum. Elemental summaries show the build's damage and DR by attack element; they do not assume an opponent's defenses or simulate a hit.

Sources: [Official elemental FAQ](https://bitheroes.zendesk.com/hc/en-us/articles/360039253311-Elemental-Gear-FAQ), [Mechanics](https://bit-heroes.fandom.com/wiki/Mechanics).

## Coverage and unresolved evidence

- No cached spreadsheet totals or broken formulas are used. Literal data and verified effect rules drive new totals.
- The catalog contains workbook gear plus verified Nevermore, Evermore and Supercharged Harvester entries. It is not a complete current-game catalog. The [official Supercharged Ancient announcement](https://bitheroes.zendesk.com/hc/en-us/articles/45627293971469-Supercharged-Ancient-Gear) includes Supercharged Poly, but its numerical rules were not available in the inspected tables; no values were invented.
- Temporary stacking from hits, kills, explosions, spent SP and received healing is displayed as an effect rather than simulated. Random skill damage and weighted random modifiers are not converted into fake permanent averages.
- Personal bonuses and team-granted bonuses remain separate. Team buffs from other players and pet damage/heal calculations need a team/encounter model.
- Base equipment stats, enchant stat rolls, equipment tier/upgrade scaling, and individual set-piece innate elemental bonuses are outside the imported bonus data. Elemental summaries therefore cover the sourced elemental modifiers currently represented, not every stat on an in-game equipment card.
- Heart of Escarium's overview and detailed page disagree on wording of its trigger. The overview's 15% Redirect is used; amplifier behavior is listed explicitly. Sacramentum's pages disagree on the Defensive variant's two-turn restriction; this ambiguity is stated with the effect.
- Thunderstriker's workbook label is misspelled and its wording remains workbook-sourced. Unmatched data and defaulted variable rolls produce visible notices.
- Source pages are community-maintained; some explicitly mark content as incomplete. Live character-screen comparisons are still needed to validate edge-case stacking and the newest content.

## Validation

Run `verification/mechanics.test.cjs` with Node. The checks cover bases, Ancient passives, set thresholds, Starweave, Poly gear counts, Elementarium non-stacking, W3-4TY exceptions, enchant combinations, upgrade changes, caps, Clover probabilities, Evolvium migration, conditional snapshots and elemental weighting. Browser verification checks live totals and the read-only setup layout. Authentication was not changed.

## Deferred interface
The optional combat snapshot is deferred. The site uses permanent totals and ignores old saved combat assumptions; the engine retains conditional calculations for a future return. Existing Evolvium upgrade choices remain available. Item choices are alphabetical and display source-backed descriptions.

## Item tier controls
Original tier labels come from the captured Set/Mythic/Ancient wiki tables; All tiers is not a guessed numeric tier. T12+ is stored per ordinary gear slot and used in drafts, saved builds and comparisons. Missing old settings initialize to the source tier. Ancient +5% Damage/DR and Expedition/Invasion Mythic +3% Damage/DR have moved out of unconditional item bonuses. Explicit Mythic Element Bonus clauses are separately gated by T12+. Unique effects and set thresholds remain intact. Source: https://bit-heroes.fandom.com/wiki/Equipment/Mythic and https://bit-heroes.fandom.com/wiki/Equipment/Ancient .


## Placeholder audit — 4 October 2026
Audited all 53 placeholder records: 50 pets, Goldwings Chivalry, the grouped Peach/Deano/Spomder mount and the hidden MythDef workbook heading. Every visible placeholder now has source-backed wording. Sources: [Pets](https://bit-heroes.fandom.com/wiki/Pets), [Accessories](https://bit-heroes.fandom.com/wiki/Accessories), [Mounts](https://bit-heroes.fandom.com/wiki/Mounts). Table captures and matched records are under verification/.

Goldwings calculations were already correct; its missing description and duplicated negative-damage name suffix were repaired. Base: DR 16%, Absorb 8%, Damage -4%; fully upgraded: DR 20%, Absorb 8%, Damage -4%. Pet effects show base unreforged trigger chance, power and upgrade increments. They remain triggered effects rather than permanent Damage/Healing/Enrage totals. Eligibility is required for pet reforging. No upgrade level or reforge is assumed.

The grouped Legendary mount now accepts an actual bonus type/value, validated against the wiki ranges (Block 7–8%, Deflect 1.8–2%, and other listed stats 3.5–4%). Unknown or out-of-range rolls add nothing and display a specific notice. Apocalypse mount doubling uses the same contribution factor. Saved choices feed Planner and Closet through the shared engine. Each named mount skill is described separately and is not added to permanent damage/healing.


## Pet upgrade control and trigger descriptions
Sources: https://bit-heroes.fandom.com/wiki/Pets and https://bit-heroes.fandom.com/wiki/Smithy/Upgrade (reviewed 4 October 2026).
The user calls the default three-trigger state Spread and a reforged single-trigger state Designated. Legendary/Set/Mythic pets have four upgrades. Pet upgrades offers Fully Upgraded (+4) or No Upgrades; defaults to Fully Upgraded, matching the accessory control. At the selected state, chance = base + upgrades * increment; designated chance = 2 * chance. Zero-upgrade descriptions explicitly say that reforging requires one upgrade. All Mythic/Set pets and only explicitly listed Legendary pets can reforge. Effect power remains unchanged. Triggered effects never add permanent stats. Descriptions use the selected state in planner choices, hover popups, effects and saved-build equipment; Library previews are labeled fully upgraded.

## Catalog expansion — 4 October 2026

`catalog-updates.js` extends the existing workbook catalog before the evaluator initializes. It adds 31 rune identities / 43 compatible-slot entries, 33 announced pets/accessories/mounts, 12 set pieces, six associated Mythics and two Supercharged Polychromatic forms: 96 records total. Existing IDs and saved builds are preserved. No images were added.

Runes use Legendary/Mythic values from https://bit-heroes.fandom.com/wiki/Runes . All four major positions offer Anjo, Fehu, Renaz and Uriz. Meta/relic/artifact effects interpolate the selected rarity into their descriptions. Permanent Erlun and major stat bonuses enter totals; low-health, full-health, shielded, first-hit and SP conditions remain engine-supported but their UI remains deferred. Team-position effects, chance-based stacks, proc healing and damage are described rather than averaged into permanent totals. Gerou has searchable Georu alias; Murnack has Murnak alias. The official October 2025 announcement establishes twelve additions without a complete textual name list, so no separate speculative duplicates were added.

Gallus sources: https://www.bitheroesquest.com/2026-world-boss and https://steamcommunity.com/games/666860/announcements/detail/516362619486997049 . Set choices use family names, consistent with the workbook. Set thresholds are cumulative. Cyberprawn supplies team Damage/SP Regen; its live-teammate healing stays conditional. Neuralizer starting shields and first-hit protection are effects, not permanent Max Shield/Deflect. Priyolkian front-position/highest-health doubling remains conditional; no position or combat assumption is silently enabled. Its before-first-turn effects remain descriptions.

Supercharged Polychromatic Blaster supports both ordinary weapon slots. It doubles verified bonuses for equipped Myth-kind equipment without the original exactly-one restriction, once even with both forms equipped. It does not assume doubling of rune/enchant rarity bonuses. Native T21 Ancient Damage/DR uses the existing tier logic. Pet triggers and timed/proc effects remain descriptions rather than fabricated permanent stats.

June/seasonal existence sources: https://www.bitheroesquest.com/updates . Current Kongiversary values: https://www.bitheroesquest.com/ . Items with unavailable full stat tables remain selectable and generate a specific coverage warning. Seasonal items whose rarity was not published use Unverified rarity instead of an invented rarity. Fondanten's published 27% team damage/heal is retained, with unknown trigger/upgrades stated. Piece o' Cake's 8% Quad Strike and Bang Up Job's 10% Absorb/7% Deflect are published preview values; base/full upgrade separation is unresolved. Cyberprawn Scanner has conflicting 137%/342% skill power, retained as a conflict without choosing a number. Elemental bonuses not published for new Mythic gear were not guessed. Mohs Def's corrected Block number and Feral Mythic Enchant's corrected stat table still need evidence; no guessed values were applied.

Validation: run verification/catalog-expansion.test.cjs plus the existing mechanics, rune-description and placeholder tests. Browser verified Georu search, Mythic Gerou description, background library equip without losing search, and restored Mythic selection in the Planner. Verification/catalog-runes.png records the Library result. Images and mobile-layout changes are outside this update.

Protoplague correction (4 October 2026): added the missing four T21 selectable set records and two associated Mythics. Heartwood triggers remain descriptive effects; the living-teammate Dual Strike bonus uses the existing snapshot rule. Protoplague Trinket converts equipped Air Resistance to Earth Damage after other bonuses are accumulated (0.5% per 1%), with Polychromatic doubling applied. Catalog expansion now contains 102 added records.

Full catalog audit (4 October 2026): catalog-audit-data.js and catalog-audit.js add 406 compatible-slot records: 12 set pieces, 17 Mythics, four accessories, eight pets, five mounts, and 360 enchants. The wiki-row coverage test checks all 334 set-slot rows, 171 Mythics, supported Ancient identities, every wiki rune identity in each compatible position, Legendary/Mythic accessory and pet tables, and all 136 single/dual enchant combinations per slot. Canonical aliases preserve workbook IDs while making individual piece names searchable. Fyssas Lyrics moves from ring to neck; saved placement migrates without overwriting an occupied neck.

Thonderstriker has source-reviewed effects. Gomoloid Bolt Helmet and Feather Ring use explicit combat conditions. Hazmatt Blob converts Earth Damage to Healing Bonus with a 25% cap before Polychromatic doubling. Proc damage/healing, teammate-only effects and timed stacks remain descriptions. Sardinex Alterator's familiar damage effect stays descriptive rather than changing player Damage. Chocodrifter and Feral remain selectable with explicit verification warnings because official notes confirm existence without publishing their stat tables. Three new accessories use verified base bonuses pending unknown upgrade increments. Four previously announced Mythic mounts now use verified wiki bonuses. No new images were added.

Validation: verification/catalog-audit.test.cjs passed; existing mechanics, expansion, rune-description and placeholder-effect suites passed. Browser verified six Boomsmasher search results and successful background mainhand equip with search retained. Detailed scope and sources: verification/CATALOG-AUDIT-RESULTS.md.


## Conditional audit — 8 October 2026

Reviewed all 91 selectable set families and 207 ordinary Mythic/Ancient gear entries, including variants, against the captured wiki rows and freshly checked source wording. The detailed evaluated ledger is verification/full-conditional-audit.json. Source descriptions of procs, SP grants, shield/heal amounts, enemy debuffs and turn manipulation are retained separately from stat bonuses.

Pompadour 4-piece: up to +10% Accuracy and +40% Empower after four SP-spend increments. Additional bounded stacks and combat conditions now contribute to the same shared bonusSummary used in Planner, Closet and Compare. Ironbark and Meteor Blaster add only their remaining increment, not their already-counted baseline. Chance stacks with no stated stack count use the 100% roll ceiling; Raiju's accompanying damage loss has no published finite bound and remains an explicit effect warning. Evermore's ambiguous offensive-modifier scaling remains an explicit warning rather than invented additive values.

Numeric modifiers that previously existed only in raw totals now have bonus rows: Healing Bonus, Healing Received, Ricochet, Armor, Max Shield, SP Regen and team modifiers. Combat damage/healing procs are not percentage stat increases. Simultaneous conditions are not assumed.

Sources: https://bit-heroes.fandom.com/wiki/Equipment/Set ; https://bit-heroes.fandom.com/wiki/Equipment/Mythic ; https://bit-heroes.fandom.com/wiki/Equipment/Ancient ; https://bit-heroes.fandom.com/wiki/Mechanics/Catalogue
