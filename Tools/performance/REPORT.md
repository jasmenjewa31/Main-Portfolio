# jasmen.asia performance optimisation

Pre-deployment test record, 19 November 2026. This report describes the local test stage before the release was committed and published. Consult GitHub commit/deployment history for release status.

## Results

Local Lighthouse 12.8.2 tests in headless Microsoft Edge, using standard mobile and desktop presets:

| Category | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | ---: | ---: | ---: | ---: |
| Performance | 99 | 100 | 100 | 100 |
| Accessibility | 100 | 100 | 100 | 100 |
| Best Practices | 96 | 96 | 96 | 96 |
| SEO | 100 | 100 | 100 | 100 |
| Layout shift (CLS) | 0 | 0 | 0 | 0 |

Mobile non-composited animation diagnostics: five before, none after. CSS minification diagnostics pass after the change. Mobile measured total resource weight fell from 2,731,766 to 1,282,789 bytes (53%); these are the resources captured during the audit, not the size of the entire repository.

These are local lab results, not a deployed Google PageSpeed Insights result or real-user field data. Network, device, browser, and audit timing affect results; this does not guarantee future scores or an MWA award.

## Design and functionality checks

- Compared before/after screenshots and element geometry at 320, 390, 720, 721, and 1440px. Measured positions, sizes, typography, and colours matched. Image resizing introduces small sampling differences, but no layout or intentional appearance changes were made.
- Preserved the mobile collage frame and crop, its alt text and dimensions, and all desktop collage source choices.
- Compared the gold background at three matching animation phases. Mean channel difference was approximately 0.008 on a 0-255 scale, consistent with negligible rendering variation.
- Verified moving mobile backgrounds, desktop rendering, reduced-motion switching, mobile menu navigation, and seven project links.
- Existing enquiry tests passed desktop, mobile, small-mobile, and landscape layouts; validation, keyboard focus, generated WhatsApp messages, and no-JavaScript fallback passed. Tests intercepted outgoing messages; none were sent.
- No page JavaScript errors occurred in these tests. Git whitespace checks passed.
- Domain, routing, sitemap, SEO metadata, header media, and hero playback behaviour were not changed. The pre-existing unpublished mobile menu changes were preserved.

Evidence: `verification.json`, `before-*-lighthouse.json`, `after-*-lighthouse.json`, and before/after screenshots in this folder.

## Image delivery

The mobile collage previously downloaded the 2,103,062-byte PNG. It now uses responsive lossless WebP with `srcset` and `sizes`, preserving the original source aspect ratio. Existing CSS still controls the visible crop. Below-fold lazy loading and explicit dimensions remain intact.

| Collage width | Bytes | Smaller than original PNG |
| --- | ---: | ---: |
| 330px | 176,782 | 91.6% |
| 660px | 682,478 | 67.5% |
| 1023px | 1,518,278 | 27.8% |

The 330px version was selected at 320px and 390px in 1x browser tests. The mobile Lighthouse device selected 660px. High-density displays can select 1023px to preserve sharpness. Desktop image selection remains unchanged.

The navigation logo now has lossless WebP versions at 56, 112, and 168px: 2,844, 7,908, and 14,180 bytes respectively, versus its original 25,973-byte PNG.

The hero remains eagerly loaded with its existing high priority/preload, not lazy-loaded. Its poster, animation, video, and timing are untouched.

## Animation and CSS implementation

The five mobile canvas background-position animations have been replaced by clipped, transform-animated pseudo-element layers with matching gradients, stacking, speeds, and tile distances. Desktop pointer-responsive canvas rendering remains unchanged. In mobile CSS-animation mode, unused canvas backing stores are reduced to 1x1; changing breakpoints or motion preferences restores the appropriate canvas dimensions.

Production inline CSS is minified from 32,814 to 21,432 bytes. The WhatsApp stylesheet is separately minified to 4,656 bytes. Comments and safe duplicates are removed, while interactive, responsive, and accessibility rules remain. CSS was not blindly removed based on a single initial-page coverage run.

## Production files changed

Paths below are relative to `C:/Users/jasme/OneDrive/Desktop/My Portfolio/.publish/Main-Portfolio`.

Modified:
- `index.html`: responsive image references, gold animation layers/styles, minified inline styles, versioned CSS/JS references. Includes preserved pre-existing mobile navigation edits.
- `Projects/Creative Portfolio/process-background.js`: mobile canvas memory reduction and motion/breakpoint resize handling.

Added:
- `Media/Images/collage-mobile-330.aa88b1686b77.webp`
- `Media/Images/collage-mobile-660.7ea597573568.webp`
- `Media/Images/collage-mobile-1023.b9bd89a5286f.webp`
- `assets/jasmen-logo-56.5d1a5f1e0832.webp`
- `assets/jasmen-logo-112.cb34318bad1c.webp`
- `assets/jasmen-logo-168.baa050ec44ad.webp`
- `assets/whatsapp-enquiry.min.54f757e878ff.css`
- `Projects/Creative Portfolio/process-background.2f714d1605f1.js`

Original image and stylesheet assets are retained. Newly generated production files use content hashes, so future changed versions have distinct URLs.

## Hosting limits and remaining diagnostics

- Live GitHub Pages responses were observed with `Cache-Control: max-age=600`. GitHub Pages does not offer repository-configurable custom cache headers. Long-lived immutable caching was therefore not enabled. It would require a separately approved CDN/hosting configuration; no DNS or hosting changes were made, and no ineffective `_headers` or `.htaccess` file was added.
- Best Practices remains 96 because the existing favicon request returns 404. A favicon was not introduced as part of this appearance-preserving optimisation.
- A residual mobile image-sizing diagnostic remains for the collage and hero poster. Lossless encoding, high-density source choices, and the existing crop were prioritised over more aggressive compression or cropping. Desktop image-sizing diagnostics pass.
- The existing 2.12MB desktop hero video and mobile animated WebP were not re-encoded or replaced, to avoid changing the approved film or playback appearance.
- Native iPhone Safari and a deployed PageSpeed Insights run were not tested in this pass. Responsive verification used browser emulation, not a physical phone.
- At the time of these local tests no deployment had occurred; these measurements are not live PageSpeed Insights results.

## Maintenance files

Local tooling is in `C:/Users/jasme/OneDrive/Desktop/My Portfolio/Tools/performance`:
- `homepage.source.css`: readable source for the minified homepage styles. Edit this, not the generated inline CSS.
- `build.mjs`: regenerates responsive assets, minifies styles, updates hashed references, and writes `asset-manifest.json`.
- `audit.mjs`: baseline/current Lighthouse runs with a temporary local server.
- `verify.mjs`: responsive visual, geometry, and interaction checks.
- `package.json` and `package-lock.json`: pinned test/build dependencies.

The repository now includes a portable build in `Tools/performance`; follow its README to install dependencies and rebuild. The original local audit helpers and full screenshots are working artefacts, not website assets.
