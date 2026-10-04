# Bit Heroes Build Planner Specification

## What the Site Is
Bit Heroes Build Planner is a web-based tool for experimenting with Bit Heroes equipment and seeing the resulting build without requiring the user to own every item in the game.

It is primarily for the creator and for existing Bit Heroes players. It may also be usable by less experienced players, but it assumes familiarity with Bit Heroes terminology and systems.

The goal is to make complicated build information efficient, understandable, and intuitive.

## Pages

### login.html
Purpose:
Provide the temporary authentication gate for the entire site.

Content:
Site name.
One-line explanation of the tool.
Email input.
Password input.
Log In control.
Sign Up control.
Authentication errors and confirmation messages.

This page is never gated.

The login page is expected to be removed in a later version, but it is required for the current assignment.

### index.html
Page name:
Build Planner

Purpose:
Allow users to assemble a hypothetical Bit Heroes equipment build and immediately see its calculated results.

Content:
Equipment slots.
Item-selection controls.
Current selected equipment.
Calculated build statistics.
Relevant item information needed to understand the build.
Access to searching or choosing available equipment.
Clear controls for changing or removing equipment.

The page should update calculated statistics whenever equipment changes.

Do not fill the page with background information from the existing spreadsheet unless that information is directly useful while building.

### closet.html
Page name:
Build Closet

Purpose:
Hold builds created by the user and allow two builds to be compared.

Content:
Saved build cards.
Key statistics for each build.
Equipment shown for each build.
Controls for selecting builds.
Comparison mode for two selected builds.
Side-by-side stat comparison on larger screens.
Stacked comparison on phones.
Clear indication of which values differ.

The first version may store builds locally in the browser if needed. Do not create database tables for builds.

### library.html
Page name:
Library

Purpose:
Allow users to browse the Bit Heroes item information used by the planner.

Content:
Search input.
Item results.
Item images where available.
Item names.
Relevant item statistics.
Filters in addition to search.
Controls for clearing filters.
A useful empty state when no results match.

Filters should make it possible to narrow the library using only categories supported by the real data provided for the project.

Do not invent filter categories that are not supported by the provided data.

## Existing Content
An existing Excel workbook contains much of the source information and calculations for the tool.

Most workbook sheets contain background information used to organize and compile the data.

The front page of the workbook is the main reference for what the website's active build-planning experience should contain.

Additional information may come from official or existing Bit Heroes websites and from the game itself.

Do not automatically expose all spreadsheet data in the user interface.

## Content Rule
Never invent facts, dimensions, dates, item names, statistics, formulas, categories, or other game information that has not been provided or verified.

Ask instead.

When actual item information has not yet been supplied, use placeholders rather than made-up game data.

## Authentication
Use Supabase authentication.

Visitors can:
Sign up with an email and password.
Log in with an email and password.
Log out.

login.html is never gated.

index.html is the home page.

Every page except login.html must check whether the visitor is signed in.

If a visitor is signed out, immediately send them to login.html.

After successful log-in or sign-up, send the visitor to index.html.

Every signed-in page must have a Log Out control.

After logging out, send the visitor to login.html.

Do not create any application database tables.

Do not store information about visitors beyond their Supabase authentication account.

Never place a Supabase secret or service-role key in the website files.

Use only the public Supabase project URL and public anon or publishable key intended for browser use.

All site links must be relative.

Examples:
index.html
closet.html
library.html
login.html
images/item-name.png

Do not use absolute local file paths.

## How It Is Built
Use plain HTML, CSS, and JavaScript files only.

No frameworks.

No npm.

No package manager.

No build step.

Load Supabase using its CDN script tag.

index.html must sit at the top level of the project folder.

Shared styling may be stored in a CSS file.

Shared authentication, navigation, item, or utility logic may be stored in JavaScript files.

The site must work on a phone.

The project is published from GitHub to Vercel.

## Responsive Behaviour
The Build Planner must remain usable on a narrow phone screen.

Wide multi-column layouts should stack when there is not enough room.

Inputs and buttons must remain large enough to tap.

Do not require hover for essential information.

Do not create page-level horizontal scrolling for the normal phone layout.

Dense comparison information may restructure or use a contained horizontal region only where necessary to keep the comparison understandable.

## Search and Filters
Library search should update item results based on the entered text.

Filters should work together with search.

Changing a filter should update the results.

Clearing filters should return to the unfiltered library.

The selected state of every filter must be visually obvious.

Do not hide all filters behind an unclear icon.

## Build Calculations
Use the existing spreadsheet and supplied game information as the source for calculation logic.

Calculations should update as equipment is changed.

Do not independently guess formulas from displayed game values.

If a formula or interaction is missing from the provided material, ask for it.

## Build Closet
The Build Closet should prioritize quickly recognizing builds rather than storing extensive notes about them.

Users should be able to choose two builds and compare them.

Comparison should show actual differences rather than merely displaying two unrelated cards.

Positive and negative visual indicators may be used where mathematically appropriate.

Do not label one build as objectively better unless the supplied game logic defines that conclusion.

## Images
User-provided image files go inside:

images/

Use those files when they exist.

Where an image does not exist, use a plain grey box with a label describing what is missing.

Example:

[ADD: image of equipment item]

Do not invent or generate fake game screenshots as substitutes for missing assets.

Every image must have alt text.

## Out of Scope
Payments.

Subscriptions.

Advertising systems.

Analytics requiring visitor profiles.

Storing anything about visitors beyond their log-in.

Database tables.

Social features.

Public profiles.

Chat systems.

Invented game data.

## Done When
- [ ] Works on a phone.
- [ ] The menu reaches every page.
- [ ] Sign up, log in and log out work.
- [ ] Typing a page address ending in .html while signed out sends me to login.html.
- [ ] Every image has alt text.
- [ ] The live link opens in a new tab or window.

## Selection and tier revision — 4 October 2026
Set dropdown choices show only names and original tiers; no expanded set descriptions or hover popups inside the set list. Individual effects remain visible for Mythics, Ancients, runes and other items. Type/rarity comes before the item selector throughout. Keep alphabetical sorting.
Use the existing Library; consolidate Minor Rune, Major Rune and Enchant filters and duplicate records across equivalent slots. Retain the nine gear slot filters and add a relevant type filter. Original source tiers appear as TXX next to equipment names; all-tier items are marked All tiers, and missing source tiers remain explicitly unknown.
Show a T12+ checkbox only for ordinary gear that starts below T12, or has an all-tier or unknown original tier; these start unchecked. Items whose original tier is T12 or higher have no checkbox and always receive their researched tier bonuses, even when an older saved build says unchecked. Save editable choices, show tier state in Full Setup and use the same rules in Closet comparisons. Separate researched tier bonuses from unique effects: Ancient +5% Damage/+5% DR, Expedition/Invasion Mythic +3% Damage/+3% DR, and explicit Mythic elemental clauses. Checking does not invent extra set bonuses. Legacy builds without a checkbox use their original tier.

## Batch additions and inline enchant search
Library Use in Planner adds the item to the current draft without navigating or rebuilding the result list. Keep search, category, type, scroll and focus unchanged. Confirm the destination slot and any replacement in a visible live status. Ordinary gear uses its matching slot; repeated rune/enchant categories use the first empty compatible slot, replacing the first compatible slot only when all are occupied. Preserve other items/settings and reset only the newly changed slot’s type/tier state. Report storage errors without claiming success.
Each planner enchant slot has an inline search field. Typing narrows only that slot’s alphabetical choices, prioritizing name prefixes. Focusing opens choices; typing on the slot button starts a query. Arrow keys navigate, Enter equips, Escape dismisses; no query automatically replaces a selection. Include Empty slot when browsing all choices and a useful no-match message. Clear the search after choosing, and preserve the selected item on dismissal.

## Library rune rarities
Each rune card offers the supported Legendary/Mythic rarities from its slot data. Changing rarity updates its description and hover popup without resetting filters. Use in Planner equips that rarity into the destination slot. Cover Major, Minor, Meta, Relic and Artifact runes with descriptions from the existing mechanics tables/evaluator; show one card per rune, not duplicate slot records. Gear and enchants retain their existing types and descriptions.
