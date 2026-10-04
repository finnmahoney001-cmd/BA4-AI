# Placeholder descriptions and binary filters
- Audited 53 original records. Replaced placeholders for all 52 visible items: 50 pets, Goldwings Chivalry and the grouped Peach/Deano/Spomder mount. MythDef is a workbook heading already excluded from choices.
- Read current wiki pet, accessory and mount tables in the browser. Sources and matched table rows are in verification/description-audit.json and MECHANICS.md.
- Goldwings base/upgraded calculations were already correct. Repaired descriptions and canonical name while preserving its ID and artwork.
- Pet proc descriptions are now available in Library cards, selection options, tooltips and Full Setup effects. Triggered damage/healing/shields/enrage remain effects rather than flat permanent character bonuses.
- Added selection of the grouped Legendary mount's actual rolled bonus type/value. Range validation rejects unspecified/invalid rolls without adding fabricated bonuses. Confirmed Block roll 7.5% changed final Block from 30% to 37.5%, persisted to saved Closet, and matched there.
- Include and Exclude are the only Library rule options. All values start included; Clear filters restores them. Verified exclusion and clearing.
- All 30 existing mechanics checks passed. Added and passed checks for all 50 pet records, both Goldwings upgrade states, every random mount range boundary, invalid/missing rolls and absence of generic placeholders.
- Verified desktop Goldwings card/popup and phone layout (390px, no horizontal overflow). Authentication unchanged. No deployment or Git upload performed.
- Extract this patch and overwrite matching files in your repository. No image upload required.
