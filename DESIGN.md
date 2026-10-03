# Bit Heroes Build Planner

## Selected direction
Scheme 3 (Command deck) is the single website design. Promote its homepage to root index.html and use the same visual system for closet.html, library.html, and login.html. Remove the scheme-a, scheme-b, and scheme-c folders after promotion. Keep synced sources/ read-only.

## Concept and references
A dark, compact equipment planning tool for existing Bit Heroes players. Use an organized equipment manifest, clear item details, and immediate build results. Borrow broad inventory-management ideas only; do not copy proprietary game artwork, exact layouts, logos, or fonts. Avoid marketing, corporate dashboard styling, decorative animation, and background information unrelated to the active tool.

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
Keep the selected scheme 3 hierarchy: title/description and save/reset actions, results strip first, equipment manifest beside selected-item details. Support selecting a slot, opening an item chooser, choosing/changing/removing an item, immediate result-state updates, searching slots, resetting the build, naming/saving locally, and loading a saved build from the closet. Images are gray framed placeholders with descriptive accessible text until supplied. Show unavailable statistics as a dash with an explicit explanation; never guess formulas.

## Build Closet — closet.html
Display saved build cards with build name, equipment, unavailable stat placeholders, load/delete controls, and a clear compare selection. Allow exactly two selected builds; expose a comparison panel with build identities, side-by-side equipment/stat data, and explicit same/different or unavailable states. On phones stack the two build summaries and comparison entries. Mark actual equipment-selection differences; do not invent numerical differences or rank builds. Show a useful empty state linking to the planner.

## Library — library.html
Prominent search, visible grouped filters, clear-filters control, item result cards, item name, image placeholder, relevant available information, and an empty state. Search and filters combine and update immediately. With no supplied game data, use labeled demonstration placeholder records only. Filter the placeholder records by their three numbered placeholder slot labels; these are layout samples, not claims about real game equipment categories. Derive future categories only from supplied data. Allow opening an item's details and choosing it for the planner. Never show fictional real item names, bonuses, rarities, tiers, or formulas.

## Log In — login.html
A dark page with one centered panel: site name, one-line description, email/password fields, Log In, Sign Up, and a status/error area. No artwork or marketing. Load Supabase from its CDN, use public browser settings only, check signed-in sessions on normal application URLs, and redirect signed-out visitors here. Redirect to index.html after a successful authenticated session; show confirmation instructions if email confirmation is required. Log Out returns here. Never create database tables or visitor profiles.

## Data and review boundary
The user approved placeholders because no workbook, verified equipment data, formulas, images, or public Supabase settings are available. Provide the complete page structures and data-independent interactions now. Keep clearly labeled placeholder records and calculation states separate from real data. Real stat calculation and actual authentication cannot be verified until their inputs are supplied.

Keep ?preview=1 as an explicit local design-review mode only on localhost, loopback, or file URLs. A hosted page cannot bypass authentication using the preview query. Normal root application URLs are gated. No account information is saved by application code; only build selections are stored locally. Preserve previously saved scheme 3 placeholder builds when migrating storage.

## Assets and delivery
Plain HTML, CSS, and JavaScript only; no framework, package manager, or build step. All website links and local assets are relative. Put user item images under images/. Every page has a title, a one-line description, and shared locally authored share artwork. Never generate fake game assets. No decorative transitions or animated counters. Document remaining data/auth requirements in README.md and verify desktop and phone layouts before delivery.

