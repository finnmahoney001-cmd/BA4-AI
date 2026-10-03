# Bit Heroes Build Planner

## Selected direction
Scheme 3 (Command deck) is the single website design. Promote its homepage to root index.html and use the same visual system for closet.html, library.html, and login.html. Remove the scheme-a, scheme-b, and scheme-c folders after promotion. Keep synced sources/ read-only.

## Concept and references
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
A dark page with one centered panel: site name, one-line description, email/password fields, Log In, Sign Up, and a status/error area. No artwork or marketing. Load Supabase from its CDN, use public browser settings only, check signed-in sessions on normal application URLs, and redirect signed-out visitors here. Redirect to index.html after a successful authenticated session; show confirmation instructions if email confirmation is required. Log Out returns here. Never create database tables or visitor profiles.

## Data and review boundary
The supplied Bit Heroes Builder (2).xlsx and its PDF export now provide layout, equipment names, effects, controls, and formulas. Forty-three ordinary formula cells contain broken #REF! references, and additional logic requires validation before porting numerical totals. Use the audited mechanics tables and evaluator, retain uncertainty notices, and preserve the original workbook. The user supplied public Supabase settings; live authentication still requires verification with a user account and deployment URL settings.

Keep ?preview=1 as an explicit local design-review mode only on localhost, loopback, or file URLs. A hosted page cannot bypass authentication using the preview query. Normal root application URLs are gated. No account information is saved by application code; only build selections are stored locally. Preserve previously saved scheme 3 placeholder builds when migrating storage.

## Assets and delivery
Plain HTML, CSS, and JavaScript only; no framework, package manager, or build step. All website links and local assets are relative. Put user item images under images/. Every page has a title, a one-line description, and shared locally authored share artwork. Never generate fake game assets. No decorative transitions or animated counters. Document remaining data/auth requirements in README.md and verify desktop and phone layouts before delivery.


## Mechanics revision — 3 October 2026
Research official Bit Heroes support and the supplied community wiki. Correct Ancient descriptions by canonical item identity; repair Evolvium variants imported into mainhand/offhand/head/body and migrate their old IDs to one ring with selectable upgrades. Starweave requires two real pieces and does not stack with itself. Elementarium doubling applies once; Poly counts only the six ordinary gear slots. Apply unlocked set thresholds cumulatively and copy eligible W3-4TY effects with explicit non-stacking exceptions. Use T12+ Ancient 5% damage/DR and sourced elemental Mythic bonuses. Enchants use the workbook Mythic single/dual stat combinations.

Keep the approved rune board. Enchants use a rectangular 3 by 2 arrangement. Full Setup remains read-only; combat assumptions and Ancient options belong in Edit Build. Permanent totals are the default, with conditional effects listed alongside. Provide optional HP/SP/shield/target conditions for supported conditional bonuses. No full combat simulation or invented proc averages. Missing rolls/source ambiguity must be visible. Save these choices with each build and calculate Closet comparisons with the same engine.
