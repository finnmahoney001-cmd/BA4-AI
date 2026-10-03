# Bit Heroes Build Planner

One website using the selected Command deck design (scheme 3), promoted to the project root. The other design folders have been removed. The synced `sources/` reference files remain untouched.

## Open the site

Open `login.html`, then choose **Open local design preview** to review the pages without configuring authentication. Alternatively, open `index.html?preview=1` on a local server or as a file URL. The site needs no installation, package manager, or build step.

- `index.html`: equipment planner, item chooser, removal/reset, naming/saving, and saved-build loading.
- `closet.html`: local saved builds, equipment/stat displays, two-build comparison, load and delete controls.
- `library.html`: item records, combined search and visible slot filters, reset filters, empty states, and selection into the planner.
- `login.html`: email/password login and sign-up form, confirmation/errors, and the authentication gate.

## Fonts

Both supplied TTF fonts are included locally and need no system installation or external font service. **Edit Undo** is used for titles, descriptions, item/build names, and ordinary interface text. **Amiga Forever** is used for technical identifiers, bonuses, statistics, and comparison data. Original filenames and original readmes are retained under `fonts/`.

The supplied Amiga Forever readme permits personal non-commercial use and requires contacting the creator before redistribution. Review its license before publicly publishing/distributing that font. Edit Undo's original readme is also included.

## Data and authentication

The user approved labeled placeholders. `data.js` contains three demonstration records and three numbered slot placeholders; they are not game facts or real categories. Replace these records and provide a verified `calculate` function only when workbook data and formulas are supplied. Calculations and numerical differences currently show unavailable states rather than invented values. Item images go in `images/`.

The user-supplied public Supabase project URL and publishable key are configured in `config.js`. The app loads Supabase from its CDN, redirects signed-out visitors to login, and redirects successful sessions to the root planner. No database tables or visitor profiles are created. Live sign-up/sign-in still need verification with a user account. In Supabase Authentication URL Configuration, set Site URL to the published website address so confirmation emails return to the correct site. `?preview=1` works only on local/file URLs, not on a published host.

Builds are saved to browser storage. Previously saved scheme 3 placeholder builds migrate automatically when present. No account information is stored by application code. A draft is retained between planner visits.

## Review

Desktop and phone rendering, requested font roles, chooser/remove controls, library filters, saving/loading, comparison, and signed-out redirects were checked. Evidence is in `verification/`. Sharing includes local SVG artwork; some messaging platforms may require raster artwork and published metadata URLs before deployment.

This is a good point to commit the single website. No upload, deployment, or commit was performed automatically. The workspace root AGENTS.md preserves the local mirror rules; the downloadable website ZIP uses the supplied project AGENTS.md.
