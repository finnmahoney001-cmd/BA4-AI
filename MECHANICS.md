# Bit Heroes mechanics audit

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
