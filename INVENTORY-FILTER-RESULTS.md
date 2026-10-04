# Inventory, saved bonuses and filters
- Updated DESIGN.md and SPEC.md before implementation.
- Full Setup: Mainhand/Head/Body/Offhand left; Neck/Ring/Accessory/Pet right; Mount centered below. Verified tile positions at desktop and 390px phone width.
- Closet: full 30-row Bonus % list replaces equipment and raw settings in the expanded card. All 30 displayed values matched the same saved build in Full Setup. Values align right in cyan. Compact collapsed cards remain.
- Library: multiple Category and Item type rules, each Any/Include/Exclude. Verified combined Mainhand/Neck includes with Mythic excluded; category exclusion narrowed results; Major/Minor Rune includes with Rune type returned only those records. Search and rules survived background equip. Clear restored 723 records. Phone popup stayed within viewport.
- app.js and planner.js syntax valid. All 30 existing mechanics checks pass when run inside this site folder. No mechanics or authentication changes.
- Upload: extract the patch and replace its matching repository files. No image upload needed.
