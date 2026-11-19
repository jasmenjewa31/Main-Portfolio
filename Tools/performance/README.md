# Homepage performance build

The website is static; GitHub Pages serves the checked-in production files without running this build.

To edit homepage styles, update `homepage.source.css`, then run the following from this directory using a supported Node.js version:

```sh
npm install
npm run build
```

The build regenerates lossless responsive collage/logo WebPs, minifies the homepage and WhatsApp CSS, hashes generated asset filenames, and updates the homepage references. Commit the resulting production files along with source edits. Do not edit minified inline CSS directly.

`REPORT.md` records the local pre-deployment test results and remaining hosting limits. `asset-manifest.json` lists generated filenames and sizes; `verification.json` records the responsive comparisons. Full test screenshots and Lighthouse JSON reports were retained locally rather than published as website assets.

No domain, route, or sitemap changes are part of this release. Cache lifetimes remain controlled by GitHub Pages.
