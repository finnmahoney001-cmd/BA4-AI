# Bit Heroes Build Planner

## Guest entry and saving — 4 October 2026

Open the planner immediately for signed-out visitors. Library and draft editing remain available. Show Log In for guests and Log Out for signed-in visitors. Save build requires a verified Supabase session, even in local preview. Preserve the draft and name while prompting login, then finish the requested save once after successful authentication. Continue building returns to the preserved draft. Saved builds still use browser storage; no cloud database is added. This replaces earlier whole-site authentication gating.

## Remaining bonuses and effect scope

Pet and Accessory upgrade cards stretch to the same full stack width. Myth Effects includes only mainhand, offhand, head, body, neck and ring. Parentheses show remaining potential above the displayed value, subtracting contributions already included; hover identifies each remaining source. Akiho uses normal set values and converts only Redirect supplied by the build, without an assumed maximum or doubling.

## Compare and Library bulk correction

Compare uses the same permanent and conditional bonus display as saved builds. Show separate permanent and conditional differences; do not combine conditional potential into the permanent value. Stack Pet upgrades immediately underneath Accessory upgrades in one grid cell. Library Use in Planner applies an enchant to all six slots while preserving the Library page and filters.

## Bulk controls and upgrade ticks

Category and Item type dropdowns start with Include all / Exclude all buttons. Planner Enchants and Major Runes have a separate searchable Apply to all selector; Major Runes includes a rarity selector. Individual slots stay editable. Pet and Accessory upgrades use a compact integer slider with labeled 0–4 ticks. Pet hover text shows two lines: Spread: X% to do A–B%; Designated: X% to do A–B%. Keep the effect action underneath, without upgrade/reforging explanation.

## Conditional bonus display

Bonus rows show potential additional conditional percentages in parentheses immediately left of the permanent percentage. Use pale teal #A9E4DF for conditional values and retain the existing cream static value and right alignment. Hide parentheses when no supported conditional bonus exists. Apply to Full Setup and saved-build bonus lists. Hover explains the combat dependency and that conditions need not be active simultaneously.

Saved-build cards show the compact nine main equipment slots directly below their equipped count. Remove the Damage/Health/Speed summary boxes. Keep only the Bonus % list in the expandable section.

## Approved catalog expansion — 4 October 2026

The full source audit fills missing supported catalog entries in the existing selectors and Library. Keep alphabetical order, compact layout, source descriptions, current rarity colors and saved item identities. Make canonical wiki names searchable for abbreviated workbook entries. No image or layout changes.

Expose the missing Protoplague T21 set entries in all four supported slots, sorted alphabetically between Priyolkian and Pyroc, with matching Library cards and set effects. Add its two associated Mythics with the existing rarity treatment. No layout or image changes.

Extend the existing selectors and Library with the reviewed missing runes and 2026 equipment. Preserve the Enchanted Tavern palette, compact layouts, alphabetical order, rarity controls and descriptions. Images are deferred. Show specific missing-value notices for newly announced equipment where official releases supply names without complete bonus/upgrade tables. Do not use old workbook-validation placeholder wording or hide missing coverage behind a zero bonus.

## Selected direction
Scheme 3 (Command deck) is the single website design. Promote its homepage to root index.html and use the same visual system for closet.html, library.html, and login.html. Remove the scheme-a, scheme-b, and scheme-c folders after promotion. Keep synced sources/ read-only.

## Concept and references
The user has authorized real equipment artwork from the Bit Heroes wiki. Keep the user's six upload batches under 1/ through 6/ at the repository root. Each batch stays below 100 files. Reference each sprite by its exact numbered-folder path. Download verified item sprites into these numbered folders, map each by its name and equipment slot, and include the files in the upload ZIP. Use the same local sprites in Full Setup, Library and the rune/enchant boards where an exact asset is available. Preserve transparent backgrounds, use crisp pixel rendering and descriptive alt text. Keep a labeled fallback for genuinely unavailable art; never substitute an unrelated item. Record source URLs and unmatched records in IMAGE-SOURCES.md.
A dark, compact equipment planning tool for existing Bit Heroes players. Use an organized equipment manifest, clear item details, and immediate build results. Borrow broad inventory-management ideas only; do not copy proprietary game artwork, exact layouts, logos, or fonts. Avoid marketing, corporate dashboard styling, decorative animation, and background information unrelated to the active tool.

## Reference-image styling revision
Apply the user's seven game screenshots as visual references now. Keep the workbook arrangement and existing interactions. Translate their silver window frames, dark recessed interiors, title plaques, raised colored buttons, square dropdown arrows, and framed inventory tiles into original CSS. Use the equipment screen for tile framing, the familiars screen for the Library/chooser grid, and settings for grouped controls. Do not embed or crop screenshots into website artwork or fabricate a character portrait. Keep the reference PNGs under references/game-screenshots outside the published site bundle.

Use layered light/dark borders and static inset shadows for metal edges. Major page titles sit on dark plaques with silver surrounds. Panel headings are distinct dark bars; field groups sit on recessed dark surfaces. Cyan identifies primary navigation/login actions, orange Save, purple item selection, and green comparison. Keep text labels and keyboard focus, so color is never the only cue. Match the user's supplied type-label screenshots: Set cyan, Myth/Mythic pink-red, Ancient gold. Apply these colors to the selected type text, dropdown options where supported by the browser, selected item names/options, chooser labels, and inventory frames/badges. Type colors update on selection, saved-build loading, and reset. All types and empty selections remain neutral. Legendary/Leg uses the yellow from the supplied label. Internal workbook values remain unchanged. Style all four pages and the item chooser consistently, including small phone screens. No new animation, copied assets, external fonts, or libraries.

## Palette
Background #101318; panel #181D24; raised panel #222934; primary text #F2F4F7; secondary text #AAB2BF; accent #5BC0EB; border #343D49; positive #66D17A; negative #E46B6B. Cyan marks actions, selections, and keyboard focus. Positive/negative colors apply only to known numerical differences, not judgments that one build is better.

## Typography
Use the two user-supplied local fonts instead of Google Fonts. Unzip the archives without changing the original font filenames; retain their original readme files.

- Edit Undo (editundo.ttf): page titles, section headings, item/build names, descriptions, explanatory text, and ordinary interface copy. Display titles 32px desktop and 26px mobile; body/descriptions 18px with generous line height. Use the regular solid version, not Line or Dot.
- Amiga Forever (amiga4ever.ttf): equipment-slot identifiers, statistics, bonus fields, calculated values, comparison data, technical metadata, and small technical labels. Technical text 12px or 16px; large results 24px. Use the standard variant from the archive.

Load the TTF files with @font-face from fonts/edit-undo/ and fonts/amiga-forever/. Fonts work locally without a network connection or system installation. Avoid synthetic bold. Font archives are assets, not instructions to install software. Keep both font readmes with the font files. Amiga Forever's supplied license permits personal non-commercial use and requires the creator's consent before redistribution; review it before publishing or distributing the font publicly.

## Layout and navigation
Desktop: fixed left navigation rail, 222px wide (190px on smaller desktops). Build Planner, Build Closet, and Library remain visible. Log Out sits at the bottom of the rail. Current page has a cyan border and left selection marker. Main area uses a responsive 12-column grid, square panels, restrained rules, and compact padding. Constrain maximum content width.

Phone: convert the rail into a top header with all three navigation links visible. Stack the work panels, comparison cards, and equipment details. On phones, the statistics strip becomes three compact rows with each technical label beside its value. Keep controls at least 44px high, strong text contrast, descriptive labels, and visible keyboard focus. No page-level horizontal scrolling.

## Build Planner — index.html
Separate the planner into Edit Build and Full Setup tabs. Edit Build contains selectors, Ancient reforge/upgrade choices, build naming, save, and reset. Remove the old bottom selected-item card and its redundant chooser; Empty slot removes an item. Full Setup is a read-only overview of the current draft: bonuses left, nine static equipped-item tiles plus rune/enchant/upgrade/element summaries in the middle, and effects right. No clickable equipment tiles, selected-item outline, selectors, or edit/save/reset controls appear in Full Setup. Switching tabs reflects current selections immediately without changing them. Use accessible tab semantics and arrow/Home/End keyboard navigation. Keep the workbook layout on desktop and stacked panels on phones. Match Legendary/Leg text, options, and inventory borders to the yellow label supplied by the user; retain internal Leg values.

Use the supplied workbook's Equipped sheet as the planner structure within the selected Command deck palette and font system. Main Equips, Runes, and six Enchants sit above the working results. Main Equips includes Mainhand, Offhand, Head, Body, Mount, Neck, Ring, Accessory, Pet, accessory upgrade state, and Mainhand Element. Runes includes Relic, Artifact, Minor 1/2, Major 1–4, Meta, and each slot's supported Leg/Myth choices from the workbook. Below the controls, place the full 30-row Bonus % list on the left, nine equipped-item image/details tiles in the middle, and Set Effects at thresholds 2–6 followed by Myth Effects and Ancient Effects on the right. On phones stack controls, bonuses, equipment, and effects. Keep save, load, reset, removal and comparison functional for every selection and setting.

Import names and source effect descriptions directly from the workbook's Set-Gear, Myth-Gear, Ancient-Gear, accessory, pet, rune and enchant tables. Use source-supported type filtering, searchable item choosers, and clear empty selections. Keep equipment image placeholders until item image assets are supplied; use the user's game screenshots for the approved CSS styling revision. Show matching workbook effect descriptions immediately as equipment changes. Calculate sourced permanent bonuses and explicitly selected combat conditions using the shared mechanics engine. Show a contribution breakdown, effective luck chances and elemental totals separately. Keep proc damage, skills, temporary stacks and unidentified rolls in an effects list, never silently treat them as permanent bonuses. Never treat the workbook's saved example totals as the calculation for a new build. Do not guess missing element or rune behavior. State the workbook's T12+ assumption near the planner controls.

## Build Closet — closet.html
Display saved build cards with build name, equipment, calculated bonus percentages, load/delete controls, and a clear compare selection. Allow exactly two selected builds; expose a comparison panel with build identities, side-by-side equipment/stat data, and explicit same/different or source coverage notices. On phones stack the two build summaries and comparison entries. Mark actual equipment-selection differences; do not invent numerical differences or rank builds. Show a useful empty state linking to the planner.

## Library — library.html
Search and slot filters use imported workbook records. Show source type and effect descriptions where present, images as missing, and a use-in-planner link. Search and filters combine, clear together, and have an empty state. Categories come from the workbook; never invent game records or numerical bonuses.

## Log In — login.html
A dark page with one centered panel: site name, one-line description, email/password fields, Log In, Sign Up, and a status/error area. No artwork or marketing. Load Supabase from its CDN, use public browser settings only, check signed-in sessions on normal application URLs, and allow signed-out visitors to build; prompt login only when saving. Redirect to index.html after a successful authenticated session; show confirmation instructions if email confirmation is required. Log Out returns to the planner in guest mode. Never create database tables or visitor profiles.

## Data and review boundary
The supplied Bit Heroes Builder (2).xlsx and its PDF export now provide layout, equipment names, effects, controls, and formulas. Forty-three ordinary formula cells contain broken #REF! references, and additional logic requires validation before porting numerical totals. Use the audited mechanics tables and evaluator, retain uncertainty notices, and preserve the original workbook. The user supplied public Supabase settings; live authentication still requires verification with a user account and deployment URL settings.

Keep ?preview=1 as an explicit local design-review mode only on localhost, loopback, or file URLs. A hosted page cannot bypass authentication using the preview query. Normal root application URLs open in guest mode. Saving requires a verified Supabase session; local preview does not bypass this requirement. No account information is saved by application code; only build selections are stored locally. Preserve previously saved scheme 3 placeholder builds when migrating storage.

## Assets and delivery
Plain HTML, CSS, and JavaScript only; no framework, package manager, or build step. All website links and local assets are relative. Put user item images under images/. Every page has a title, a one-line description, and shared locally authored share artwork. Never generate fake game assets. No decorative transitions or animated counters. Document remaining data/auth requirements in README.md and verify desktop and phone layouts before delivery.


## Mechanics revision — 3 October 2026
Research official Bit Heroes support and the supplied community wiki. Correct Ancient descriptions by canonical item identity; repair Evolvium variants imported into mainhand/offhand/head/body and migrate their old IDs to one ring with selectable upgrades. Starweave requires two real pieces and does not stack with itself. Elementarium doubling applies once; Poly counts only the six ordinary gear slots. Apply unlocked set thresholds cumulatively and copy eligible W3-4TY effects with explicit non-stacking exceptions. Use T12+ Ancient 5% damage/DR and sourced elemental Mythic bonuses. Enchants use the workbook Mythic single/dual stat combinations.

Keep the approved rune board. Enchants use a rectangular 3 by 2 arrangement. Full Setup remains read-only; combat assumptions and Ancient options belong in Edit Build. Permanent totals are the default, with conditional effects listed alongside. Provide optional HP/SP/shield/target conditions for supported conditional bonuses. No full combat simulation or invented proc averages. Missing rolls/source ambiguity must be visible. Save these choices with each build and calculate Closet comparisons with the same engine.

## Deferred combat snapshot and descriptions

Keep the current Evolvium and other upgrade controls in Edit Build. Remove the Optional Combat Snapshot controls and their explanatory paragraph for now. Use permanent totals for drafts and saved builds, ignoring previously saved snapshot assumptions. Keep the calculation implementation for a future return to this feature; do not add the proposed Ancient Options tab.

Show short canonical rune names, such as Dej rather than DejEvade. Keep item IDs, workbook names and calculation records unchanged. Provide readable description popups when hovering or focusing selected items, rune/enchant summaries and item choices inside the selection list. Use a custom item dropdown so descriptions work while selecting, with arrow-key navigation, Escape dismissal and tap-friendly descriptions. Effect descriptions and values must come from the existing source data and calculation engine.

Keep Empty slot first, then sort item choices alphabetically by displayed canonical name, ignoring case. Apply the same order to the Library. Leave numeric upgrade levels and progression choices in their meaningful order.

## Selection and tier revision — 4 October 2026
Set dropdown choices show only names and original tiers; no expanded set descriptions or hover popups inside the set list. Individual effects remain visible for Mythics, Ancients, runes and other items. Type/rarity comes before the item selector throughout. Keep alphabetical sorting.
Use the existing Library; consolidate Minor Rune, Major Rune and Enchant filters and duplicate records across equivalent slots. Retain the nine gear slot filters and add a relevant type filter. Original source tiers appear as TXX next to equipment names; all-tier items are marked All tiers, and missing source tiers remain explicitly unknown.
Show a T12+ checkbox only for ordinary gear that starts below T12, or has an all-tier or unknown original tier; these start unchecked. Items whose original tier is T12 or higher have no checkbox and always receive their researched tier bonuses, even when an older saved build says unchecked. Save editable choices, show tier state in Full Setup and use the same rules in Closet comparisons. Separate researched tier bonuses from unique effects: Ancient +5% Damage/+5% DR, Expedition/Invasion Mythic +3% Damage/+3% DR, and explicit Mythic elemental clauses. Checking does not invent extra set bonuses. Legacy builds without a checkbox use their original tier.

## Batch additions and inline enchant search
Library Use in Planner adds the item to the current draft without navigating or rebuilding the result list. Keep search, category, type, scroll and focus unchanged. Confirm the destination slot and any replacement in a visible live status. Ordinary gear uses its matching slot; repeated rune/enchant categories use the first empty compatible slot, cycling through compatible occupied slots in order once all are occupied. Preserve other items/settings and reset only the newly changed slot’s type/tier state. Report storage errors without claiming success.
Each planner enchant slot has an inline search field. Typing narrows only that slot’s alphabetical choices, prioritizing name prefixes. Focusing opens choices; typing on the slot button starts a query. Arrow keys navigate, Enter equips, Escape dismisses; no query automatically replaces a selection. Include Empty slot when browsing all choices and a useful no-match message. Clear the search after choosing, and preserve the selected item on dismissal.

## Library rune rarities
Each rune card offers the supported Legendary/Mythic rarities from its slot data. Changing rarity updates its description and hover popup without resetting filters. Use in Planner equips that rarity into the destination slot. Cover Major, Minor, Meta, Relic and Artifact runes with descriptions from the existing mechanics tables/evaluator; show one card per rune, not duplicate slot records. Gear and enchants retain their existing types and descriptions.

## Slot cycling, dropdown visibility and compact Closet
Repeated Library additions fill empty compatible slots first, then cycle replacements across every slot in that category. Advance only after a successful save; keep filters and selected rarity. Item dropdowns float above page panels, stay inside the viewport, and open upward when space below is limited, with internal scrolling and existing keyboard controls. Build Closet uses compact responsive cards with name, equipment count, three key stats and actions visible. Expand Bonus % for the full 30-row final bonus list calculated from that saved build with the planner engine. Match the planner list: technical labels on the left, cyan percentages on the right, alternating dark rows. Show the main nine equipment slots above the bonuses; keep raw settings and secondary slots in saved data and comparison. Preserve expanded cards when comparison selection rerenders them.


## Equipped inventory orientation
Full Setup places Mainhand, Offhand, Head and Body down the left; Neck, Ring, Accessory and Pet down the right; Mount centered underneath. Keep this display order separate from calculation and selection slot identities.


## Library include and exclude filters
Category and Item type each open a dropdown with an Include or Exclude choice for every supported value. Allow multiple included and excluded values; every value starts included, exclusions remove matching values, and both groups combine with search. Include Rune and Enchant item types. Show active counts on the dropdown summaries. Keep choices and the open dropdown intact while adding items. Clear filters includes every category/type again and clears search.


## Source description audit
Replace generic formula-validation placeholders with researched accessory, pet and mount descriptions across cards, selection lists, hover popups and Full Setup. Preserve item IDs and saved builds. Goldwings Chivalry uses 16% DR, 8% Absorb and -4% Damage at base, +1% DR for each of four upgrades. Pet descriptions show base unreforged trigger chance, effect power range and each upgrade increment; triggered damage, shields, healing and enrage remain effects, never permanent character stats. The grouped Peach/Deano/Spomder mount lists each distinct skill and offers a choice of its actual rolled bonus type/value within the verified Legendary ranges. No random bonus is assumed until selected. Keep the non-equipment MythDef workbook heading excluded. Record source URLs and audit results.


## Enchanted Tavern and compact saved equipment
Use the chosen Enchanted Tavern palette: deep brown #211813, walnut panels #3B2B24, amber actions #F2B544, moss highlights #87A85B and cream text #F5E6CC. Retain the supplied rarity colors and existing pixel borders, fonts and interactions. Add a small “by albacoreprism” credit beneath Build Planner in the brand. Replace the equipment-options empty hint with generic wording. Saved-build dropdowns show only the main nine equipment slots in a compact inventory order above the full final Bonus % list; no raw settings or rune/enchant rows. Pet descriptions use Spread for the default three-trigger chance and Designated for a reforged single trigger. Show the chosen Pet upgrades state, not a base-to-full range. Reforging doubles chance without changing power. Show unavailable for pets that cannot reforge; list power separately.

Pet upgrade revision: add Pet upgrades beside Accessory upgrades, with Fully Upgraded and No Upgrades choices, default Fully Upgraded. Save and restore the choice. Show only trigger chances at the chosen state: Spread: X%; Designated: Y%. At zero upgrades show designated chance as requiring an upgrade. Keep effect power separately. Apply the same choice to dropdowns, hover descriptions, effects and saved-build summaries.
