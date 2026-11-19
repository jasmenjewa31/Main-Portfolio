# MWA technical routing checks

## Public routes

The homepage links to seven demos under `/demos/`: `industrial`, `performing-arts`, `skin-care`, `fashion-retail`, `pilates-yoga-gym`, `dental`, and `content-creators`.

`routes.json` maps the 11 former demo document URLs plus the former creative portfolio homepage to their canonical destinations. The wellness demo also has `about.html`, `gym.html`, `pilates.html`, and `yoga.html`.

Run `node Tools/check-links.cjs --live` and `node Tools/mwa/check-routes.cjs` from the repository root before publishing. The link checker covers the published demos, shared assets and legacy files, including static `srcset` references and Linux filename case. Dynamic template URLs require browser checks. The route checker covers canonical/Open Graph URLs, sitemap membership, all 12 legacy forwarding scripts with query strings/fragments, refresh/link fallbacks, and the seven homepage project links.

## Compatibility and maintenance

- Old HTML documents are immediate browser forwarding pages with canonical links, meta-refresh fallbacks, and visible fallback links. JavaScript preserves query strings and fragments.
- These are compatible redirects on static hosting, not HTTP 301/308 responses. GitHub Pages does not provide repository-defined arbitrary server redirects. Do not add ineffective `_redirects` or `.htaccess` rules.
- Original asset folders remain available for cached pages and external references. Clean demos are self-contained copies with relative local assets; do not delete the legacy assets during routine cleanup.
- Clean HTML documents declare `https://jasmen.asia` canonical URLs and Open Graph URLs. The sitemap contains only the canonical pages, not the legacy documents.
- Homepage routing and motion scripts now load from versioned `/assets/` URLs. Original scripts remain for compatibility.
- No styles, text, animations, interactions, or layout were redesigned. The wellness pictures use lossless responsive WebP while preserving the CSS image frame and source aspect ratio.
- The skincare demo's two large PNGs now use full-resolution lossless WebP. Decoded pixels were verified identical, reducing their combined size from 4,847,292 to 3,312,756 bytes. The original film, poster framing, colours and animation remain unchanged.

GitHub Pages configuration was checked through the GitHub API. HTTPS enforcement was enabled without changing `CNAME`, DNS, or the publishing branch. Host/protocol redirects are provided by GitHub Pages, separately from the browser-based legacy path forwarding above.

## Pre-deployment checks

- All 11 clean demo documents and homepage tested at 390px and 1440px.
- Body markup compared against original documents, allowing only route/image delivery attributes to differ.
- No browser JavaScript errors, missing requested resources, or horizontal overflow in these checks.
- All 11 legacy routes preserve query strings and fragments; a no-JavaScript meta-refresh fallback was tested.
- 267 local references checked, including filename case for Linux hosting.
- Homepage enquiry dialog, mobile navigation, industrial fleet/dialog controls, and wellness registration dialog were checked without sending customer data.

## Known limits

- The Lotus demo's registration submission expects `/api/registrations`, a pre-existing backend dependency not available on static GitHub Pages. The dialog and its error handling are retained, not replaced with a fake success message. Connecting an actual registration service is a separate task requiring destination/privacy decisions.
- The main jasmen.asia WhatsApp enquiry form is separate and remains operational.
- GitHub Pages controls static cache lifetimes. Third-party fonts/media and existing demo performance issues remain relevant.
- Mobile checks use browser emulation, not a physical iPhone. Lighthouse lab scores can vary and do not guarantee PageSpeed field metrics or an award outcome.
