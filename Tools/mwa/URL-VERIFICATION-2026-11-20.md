# URL verification follow-up — 20 November 2026

The starting `main` commit was `fd1111fdf2f8952c8f0d75e91a6b618dde8a1629`. The clean demo pages, eleven demo redirects, project navigation and canonical-only sitemap were already present in commits `3aebd86` and `396e51b`; this follow-up retains that implementation.

## Changes

- The former creative portfolio homepage now uses `/` for its JavaScript, meta-refresh and visible-link destinations, including when JavaScript is disabled. Its forwarding script still preserves query strings and fragments.
- The route manifest now includes that homepage, covering twelve legacy documents and twelve canonical destinations.
- Added the missing homepage Open Graph URL matching its existing canonical.
- Fixed `Tools/check-links.cjs --live` to cover `demos/` and shared assets, resolve root-relative links from the repository root, check static responsive image candidates, and reject directory destinations without an index document. Dynamic template URLs remain browser-check responsibilities.
- Added `Tools/mwa/check-routes.cjs` for canonical/Open Graph consistency, sitemap membership, project navigation and forwarding/fallback behaviour.
- Replaced the obsolete publishing guide that instructed editors to modify legacy exports.

## Local verification

- 253 static local references passed existence and filename-case checks.
- Twelve canonical documents, twelve legacy forwarding scripts, seven project links and the sitemap passed the route contract check.
- Edge browser checks loaded all twelve canonical documents at 390px and 1440px: 24 page views, no page JavaScript errors, failed same-origin resources, broken loaded images or horizontal overflow. Pages were scrolled to request lazy-loaded imagery, and mobile screenshots were visually reviewed.
- Twenty legacy URL variants (explicit documents and directory-style index aliases) forwarded correctly with `?source=legacy&value=%2F#section-2` intact.
- All twelve legacy documents forwarded to their canonical destination with JavaScript disabled. Meta-refresh fallbacks are tested for the destination path; query/fragment retention is provided by JavaScript.
- Checked homepage navigation and WhatsApp dialog, TERAS fleet/specification dialog/language switch, Lotus registration dialog, Maitreyi project/enquiry dialogs, ELARA menu/look/appointment dialogs, AURA theme/routine/bag, Aurelle discipline tabs/form presence, and Jayshree Jewa information dialog/gallery filter. No customer enquiry, appointment or registration was submitted.
- All twelve canonical document bodies match the starting commit. Demo HTML, CSS, JavaScript, images, sitemap and CNAME were not modified in this follow-up.
- `git diff --check` passed.

## Deployment and limitations

Publishing remains `main` at repository root, custom domain `jasmen.asia`; HTTPS settings are unchanged. After pushing, verify the Pages run for the resulting commit and compare the live homepage, legacy documents, canonical documents and sitemap with that commit. Post-deployment observations are reported in the delivery message rather than pre-recorded here.

Legacy path forwarding uses static HTML and browser navigation, returning HTTP 200 rather than server-side 301/308. The pre-existing Lotus `/api/registrations` backend dependency is not supplied by GitHub Pages. Browser tests emulate mobile sizes in Edge; they do not establish physical iPhone/Safari behaviour or actual delivery by external services.
