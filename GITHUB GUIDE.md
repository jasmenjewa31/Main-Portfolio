# Portfolio editing and GitHub publishing guide

The published site is **https://jasmen.asia/**, from `jasmenjewa31/Main-Portfolio`, branch `main`, repository root. The root `index.html` is the actual homepage. The former `Projects/Creative Portfolio/index.html` forwards visitors to `/`.

## Which files to edit

| Change | Published file or folder |
| --- | --- |
| Homepage text and markup | `index.html` |
| Homepage styles and generated assets | See `Tools/performance/README.md` |
| Project destinations | `assets/portfolio-sites.36d2ed3925a5.js` and matching `Projects/Creative Portfolio/portfolio-sites.js` |
| TERAS | `demos/industrial/` |
| Jayshree Jewa | `demos/performing-arts/` |
| AURA | `demos/skin-care/` |
| ELARA | `demos/fashion-retail/` |
| Lotus and its four subpages | `demos/pilates-yoga-gym/` |
| Aurelle | `demos/dental/` |
| Maitreyi | `demos/content-creators/` |
| Canonical URL inventory | `sitemap.xml` and `Tools/mwa/routes.json` |

When changing a content-hashed script, give it a new filename based on its SHA-256 prefix and update the homepage reference. Keep the unversioned compatibility script in sync. Freelancers and TikTok intentionally show “New projects coming soon.”

## Legacy links and SEO

Keep the old HTML paths listed in `Tools/mwa/routes.json`. They forward through JavaScript, preserve query strings and fragments, and include meta-refresh and visible-link fallbacks. These static compatibility pages return HTTP 200; they are **not server-side 301 redirects**. Do not add `_redirects` or `.htaccess` rules expecting GitHub Pages to process them.

Keep original asset folders for cached pages and external references. Edit the published demo folders rather than old exports. Canonicals, Open Graph URLs, active project links and the sitemap use the lowercase destinations. The sitemap excludes legacy forwarding pages.

## Publish an update

1. Fetch and pull the latest `main` before editing. Review any existing local changes.
2. Make the requested edits and update affected references together.
3. From the repository root, run:

   ```powershell
   node Tools/check-links.cjs --live
   node Tools/mwa/check-routes.cjs
   ```

4. Preview affected pages on desktop and mobile. Check menus, project links, dialogs and legacy forwarding. Static checks do not prove every interaction or external service works.
5. Review the diff, commit only the intended files, and push to `origin main`. Never force push to resolve a synchronization error.
6. Wait for the GitHub Pages deployment to succeed, then verify the published pages, old URLs and sitemap against the committed files.

GitHub Pages serves the checked-in production files without running the optional homepage build. Preserve `CNAME` (`jasmen.asia`) and the existing HTTPS enforcement and Pages publishing settings.

The Lotus demo's registration endpoint `/api/registrations` requires a separate backend unavailable on static Pages. Its dialog remains a demo; do not claim successful registration delivery. The homepage WhatsApp enquiry is a separate flow.

See `Tools/mwa/README.md` for route maintenance and `Tools/mwa/FINAL-REPORT.md` for historical release checks.
