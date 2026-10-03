# Bit Heroes Build Planner

## Concept
A dark, compact build-planning tool for Bit Heroes players who already understand the game's basic systems and want to experiment with equipment they may not own. The interface should make complicated build information easy to scan without flattening it into a generic or overly simple website.

## References
Bit Heroes is the primary visual reference. Borrow only broad system-level ideas such as compact inventory organization, game-like panels, item-focused presentation, and the feeling of navigating a game utility.

Do not copy Bit Heroes names beyond necessary game terminology, logos, interface graphics, proprietary artwork, exact layouts, text, images, or fonts.

Modern web applications are a secondary reference. Borrow their clear hierarchy, predictable navigation, searchable databases, readable stat displays, and immediate button feedback.

The final design should feel influenced by Bit Heroes without looking like a recreation of the game interface.

## Colour Palette
The palette is intentionally dark and digital rather than directly copying Bit Heroes.

Background: #101318
Used for the main page background.

Panel: #181D24
Used for primary tool panels, equipment areas, search areas, and navigation surfaces.

Raised Panel: #222934
Used for selected items, comparison cards, filter sections, and visually raised controls.

Primary Text: #F2F4F7
Used for headings, important stats, labels, and primary content.

Secondary Text: #AAB2BF
Used for descriptions, secondary statistics, and supporting information.

Accent: #5BC0EB
Used for selected states, active navigation, important actions, and focused controls.

Positive: #66D17A
Used where a stat or comparison represents an increase.

Negative: #E46B6B
Used where a stat or comparison represents a decrease.

Border: #343D49
Used for panel outlines, separators, item slots, and input borders.

The accent colour may later be adjusted toward a Bit Heroes-inspired colour after seeing the site with actual game assets.

## Typefaces
Use free Google Fonts only.

Display and major headings: Bungee
Used sparingly to give major page headings and important tool labels a game-like character without making the entire interface difficult to read.

Page title: 32px desktop, 26px mobile.
Section heading: 20px.
Small game-style labels: 14px to 16px.

Body and interface: Inter

Body text: 16px.
Buttons: 15px, medium or semibold.
Item names: 15px, semibold.
Secondary information: 13px to 14px.
Large calculated statistics: 22px to 28px, semibold.

Most of the site should use Inter. Bungee should be limited to places where the extra character is useful.

## Layout and Grid
Use a compact, structured interface inspired by inventory and character-management screens.

Desktop pages use a responsive 12-column grid.

Primary content should remain readable rather than stretching indefinitely across very large screens.

Panels should align consistently and share clear edges.

Build Planner should prioritize equipment selection and calculated statistics at the same time. On wide screens these can sit beside each other. On phones they stack vertically.

Build Closet should use a repeatable card system for saved builds. Comparison mode should clearly place two selected builds beside each other on desktop and stack them on mobile.

Library should use a searchable and filterable layout. Search remains prominent. Filters are grouped clearly instead of hidden inside complicated menus.

Spacing should be compact but not cramped:
4px for tiny internal separations.
8px for related controls.
16px for standard panel padding.
24px between major sections.
32px to 48px between major page regions.

## Image Treatment
Item artwork should normally appear inside framed slots rather than full-bleed.

Frames should have simple dark borders and consistent dimensions.

Do not turn the site into a collage.

Game images should remain recognizable and should not receive heavy visual effects.

Where an image has not yet been provided, use the required grey placeholder:
[ADD: image of ...]

Every image must have descriptive alt text.

## Movement
Do not use page transitions or decorative animation.

Navigation should feel immediate.

Buttons should clearly change state when hovered, focused, pressed, or selected, but should not animate between pages.

Live stat changes should update immediately without animated counters.

## Log-In Page
login.html is a temporary front door and may be removed later.

Use a very dark background with one centered login panel.

The page should contain:
Site name.
Short one-line description.
Email field.
Password field.
Log In button.
Sign Up button or clear Sign Up option.
Small area for authentication errors.

Keep decoration minimal.

Do not place game artwork, complicated previews, marketing sections, or unnecessary information here.

After successful authentication, send the user directly to index.html.

## Menu
Use persistent navigation on every signed-in page.

Primary links:
Build Planner
Build Closet
Library

The current page should be visually obvious.

Log Out should remain visible but secondary to the main navigation.

Desktop navigation may sit across the top of the interface.

On phones, use a compact menu that still exposes all three main pages without making navigation difficult to find.

## Buttons
Buttons should be rectangular or slightly rounded rather than heavily pill-shaped.

Primary actions use the accent colour.

Secondary actions use the raised panel colour and clear borders.

Selected item or filter buttons should have an obvious persistent selected state.

Avoid oversized buttons.

Every button should clearly communicate where it goes or what it changes.

## Tone of Voice
Direct, compact, and written for players who already understand Bit Heroes.

Do not over-explain common game concepts.

Labels should prioritize recognizable game terminology and clear numbers.

Help text should exist where needed but stay secondary to the actual tool.

Avoid marketing language.

## Five Never Rules
1. Never make the interface look like a generic corporate dashboard.
2. Never hide important navigation or filters behind unclear interactions.
3. Never add decorative transitions, loading theatrics, or unnecessary animation.
4. Never overwhelm a page with background information that is not required to build, compare, or find items.
5. Never copy Bit Heroes interface artwork, exact layouts, branding, proprietary fonts, or visual identity.
