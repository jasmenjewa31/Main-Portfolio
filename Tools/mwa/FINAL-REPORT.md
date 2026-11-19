# jasmen.asia: MWA technical checks

## Scope

The existing appearance, text, colours, typography, layout, animations and main enquiry flow were preserved. This is a static GitHub Pages export, so pre-deployment checks covered the exported documents, asset references and browser behaviour rather than an application bundling step.

## URLs and compatibility

Seven clean demo entry points now replace working-directory URLs in homepage navigation:

- https://jasmen.asia/demos/industrial/
- https://jasmen.asia/demos/performing-arts/
- https://jasmen.asia/demos/skin-care/
- https://jasmen.asia/demos/fashion-retail/
- https://jasmen.asia/demos/pilates-yoga-gym/
- https://jasmen.asia/demos/dental/
- https://jasmen.asia/demos/content-creators/

The wellness demo retains descriptive `about.html`, `gym.html`, `pilates.html` and `yoga.html` subpages. All 12 sitemap URLs, including the homepage, return HTTP 200. Canonical and Open Graph URLs consistently use `https://jasmen.asia`.

The 11 former demo documents remain as immediate browser forwarding pages. `routes.json` records every mapping. JavaScript forwarding preserves query strings and fragments; meta refresh and a visible fallback link provide a no-JavaScript route to the destination. These compatibility documents return HTTP 200, not server-side 301/308. Arbitrary server redirects are not configurable in this static Pages deployment. Original asset URLs remain available for external references and cached pages; folders were not blindly renamed or removed.

Homepage motion and project-link scripts now load from versioned `/assets/` URLs, removing spaces from those active asset paths. All new demo assets resolve within their clean demo folders. Retained legacy URLs are intentionally not included in the sitemap or primary navigation.

The industrial photography credit for the obsolete `potainus.com` homepage returned 404. Its link now targets [Potain's official manufacturer page](https://www.manitowoc.com/potain), verified HTTP 200, with its visible label unchanged. DirectIndustry returned HTTP 403 to automated requests; that attribution was retained and is not claimed to be fully verified. The other four external credit/license links returned HTTP 200.

## HTTPS and canonical hostname

The GitHub Pages API initially reported `https_enforced: false`. HTTP apex requests returned 200 without upgrading. HTTPS enforcement is now enabled, while the existing `CNAME`, DNS records, branch `main` and publishing path `/` remain unchanged. The certificate covers both `jasmen.asia` and `www.jasmen.asia`.

Twenty live host/protocol test cases passed:

| Starting origin | Behaviour |
| --- | --- |
| `http://jasmen.asia` | HTTP 301 to HTTPS apex |
| `http://www.jasmen.asia` | Permanent redirects to HTTPS apex |
| `https://www.jasmen.asia` | HTTP 301 to HTTPS apex |
| `https://jasmen.asia` | HTTP 200, no hostname loop |

Each origin was tested with the homepage, the old industrial page, the old wellness yoga page, the clean industrial page and the clean wellness yoga page. Deep paths and `?audit=redirect` query strings survived every host/protocol chain. Legacy-to-clean path forwarding is the separate browser-level compatibility mechanism described above.

GitHub documents [HTTPS enforcement](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https) and [custom-domain redirects](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Mobile performance

Lighthouse 12.8.2 mobile-preset lab tests were run against the live site. These are not claimed to be hosted Google PageSpeed Insights reports: the official PageSpeed API request returned HTTP 429 (daily quota exceeded). No real-user CrUX or MWA scoring result is inferred.

| Page | Performance before | Final performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: | ---: |
| Homepage | 100 | 100 | 100 | 96 | 100 |
| Industrial | 81 | 81 | 90 | 100 | 100 |
| Pilates, Yoga & Gym | 60 | 70 | 100 | 100 | 100 |
| Skin Care | 75 | 83 | 100 | 96 | 100 |

All four final audits reported zero cumulative layout shift. The homepage did not regress. Scores are individual lab measurements and can vary with CDN warm-up, external fonts, video transfer timing and device conditions. An interim skincare run scored 60 before its lossless image improvement; that variation was investigated, not hidden.

Wellness: three full-size PNG downloads were replaced with 330/660/1024px lossless WebP choices. The measured page transfer fell from about 6.34 MB to 0.62 MB and LCP from 33.8s to approximately 5.0s. The existing image frames, aspect ratios and animations remain unchanged. Higher-density screens can select larger images to preserve sharpness.

Skin care: the two PNGs totalled 4,847,292 bytes. Full-resolution lossless WebPs total 3,312,756 bytes, saving 1,534,536 bytes (31.7%). Decoded pixels were compared and matched exactly. The film was not re-encoded or removed. Total audit transfer varies with how much of that autoplay film downloads during a run, so the image saving is not presented as a guaranteed reduction in total video-inclusive audit bytes.

Remaining performance constraints include external font requests, substantial demo media, existing animation cost and GitHub Pages' 600-second cache lifetime. No effects were disabled, typography changed, or lossy image changes introduced to chase a higher score.

## Validation and limitations

- Pre-deployment browser checks covered the homepage and all 11 demo pages at 390px and 1440px. No JavaScript errors, failed requested resources or horizontal overflow occurred.
- Parsed body markup was compared with the original documents, allowing route/image-delivery references to differ. No styles or content were redesigned.
- 267 local references passed existence and filename-case checks. Main enquiry, mobile navigation, industrial fleet/dialog and wellness dialog controls were exercised without sending customer data.
- All 11 legacy paths were tested with query strings and fragments. A no-JavaScript forwarding fallback was also checked.
- The published homepage, canonical documents and sitemap were compared with the release files.
- The industrial demo's existing accessibility score is 90, with ARIA structure/name and colour-contrast findings. Colour fixes would violate the no-appearance-change requirement; these findings remain disclosed rather than presented as solved.
- The homepage and skincare demo retain the existing missing favicon request, keeping Best Practices at 96.
- The Lotus registration submission expects `/api/registrations`, which is not supplied by GitHub Pages. This pre-existing demo backend limitation remains; no fake success response was added. The separate main WhatsApp enquiry form remains operational.
- The performing-arts demo needed a longer cold-load timeout because of its substantial imagery. Its first 30-second automated navigation timed out; the longer check loaded successfully. A fast connection is not assumed for every visitor.
- Tests use mobile browser emulation and desktop Edge, not a physical iPhone Safari device. No award eligibility or perfect score on every demo is guaranteed.

## Files changed

- `index.html`: clean, versioned script references; existing visual markup and styles unchanged.
- `sitemap.xml`: 12 canonical URLs using the clean demo routes.
- `Projects/Creative Portfolio/portfolio-sites.js`: clean project destinations; preserved for older cached homepage references.
- Eleven legacy `index.html`/wellness subpage documents: compatibility forwarding pages listed in `routes.json`.
- `demos/industrial/`, `demos/performing-arts/`, `demos/skin-care/`, `demos/fashion-retail/`, `demos/pilates-yoga-gym/`, `demos/dental/`, `demos/content-creators/`: self-contained clean exports, with canonical metadata and updated internal links.
- `assets/portfolio-sites.36d2ed3925a5.js`, `assets/process-background.2f714d1605f1.js`, `assets/site-motion.7fd8a28c8f39.js`: versioned scripts at clean URLs.
- Nine responsive wellness WebPs and two pixel-identical skincare WebPs.
- `.gitattributes`: exact-byte preservation for hashed scripts.
- `Tools/performance/build.mjs`: keeps future homepage builds on the clean motion-script path.
- `Tools/mwa/`: route map, maintenance notes and this report.

Primary implementation commits: `3aebd86` (routing, compatibility and wellness delivery) and `396e51b` (lossless skincare delivery). HTTPS enforcement is a GitHub Pages setting, not a file in a Git commit. Final report/link updates are recorded in subsequent repository history.
