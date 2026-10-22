# Portfolio check and GitHub publishing guide

## What was checked

The root index.html redirects to Projects/Creative Portfolio/index.html. Its seven project links resolve to TERAS, Jayshree Jewa, AURA, ELARA, Lotus, Aurelle, and Maitreyi. The main page's two images and two scripts exist. Relative paths support a GitHub Pages repository subdirectory and a future custom domain, provided the directory structure is preserved.

Fixed two asset references in Projects/Content Creators/Maitreyi/index.html and its matching Content Creator Portfolio/exports/Maitreyi-GitHub-Ready/index.html copy:

- editorial-assets/css/cover.css → assets/css/editorial-cover.css
- vibe-assets/images/portrait.png → assets/images/vibe-portrait.png

After fixes, 168 static local references in the active site passed existence and filename capitalization checks. Across all folders, 596 references were checked; nine broken references remain in Jayshree Jewa Website/backups/index-before-refinement.html. That preserved backup expects files beside itself which are in its parent folder. It is not linked from the main portfolio.

This is a static path audit, not a visual browser test or proof that external services, forms, shopping carts, email delivery, or JavaScript interactions work. JavaScript-generated paths, srcset, and arbitrary image strings are not exhaustively checked. No Git repository or GitHub remote is configured in this folder. About 602 MB of working files, exports, and duplicates are present. The largest file is about 37 MB.

## Which files to edit

| Change | File or folder |
| --- | --- |
| Main page text, design, and contact details | Projects/Creative Portfolio/index.html |
| Project names and destinations | Projects/Creative Portfolio/portfolio-sites.js |
| Main background animation | Projects/Creative Portfolio/process-background.js |
| Shared portfolio images | Media/Images |
| TERAS | Projects/Industrial/industrial-site/dist |
| Jayshree Jewa | Deliverables/exports/Jayshree-Jewa-Portfolio |
| AURA | Projects/Skin Care/AURA |
| ELARA | Projects/Fashion/ELARA |
| Lotus | Projects/Lotus Life Style/Working Project/dist |
| Aurelle | Projects/Dental/Aurelle |
| Maitreyi | Projects/Content Creators/Maitreyi |

The similarly named top-level folders are separate copies. Editing them does not update the linked project automatically. The root index.html is just the entry redirect. Freelancers and TikTok intentionally show “New projects coming soon.”

## One-time setup

1. Install Git and GitHub Desktop and sign in to your GitHub account. Node.js is already available here and runs the checker.
2. Create a dedicated publishing folder, preferably outside OneDrive, so your working archive stays separate. Copy root index.html plus the folders in the table above, keeping their exact relative paths. Include the Media files they use. Copy Tools/check-links.cjs for future checks. Do not flatten folders or move only index.html.
3. In GitHub Desktop, create a new repository in that publishing folder. Use USERNAME.github.io for your account's main site, replacing USERNAME with your GitHub username; or use a project name such as portfolio.
4. Check the files listed in GitHub Desktop. Include only the site content you intend to publish. Commit the initial files and click Publish repository. Choose public for the straightforward GitHub Free Pages setup.
5. On GitHub, open the repository → Settings → Pages. Select Deploy from a branch, main, and /(root), then Save. Wait for the deployment to complete and open the displayed site URL.
6. Check the homepage and all seven project links on desktop and mobile. Check images, menus, buttons, and forms separately.

GitHub Pages serves static files. A form needs an actual submission service or backend to deliver messages; appearance alone does not establish that it works.

## Repeatable editing and automatic commit workflow

Automatic editing still needs an instruction describing what you want changed. Files do not need to be edited individually: open the publishing repository as your workspace and ask your coding assistant to update every affected HTML, CSS, JavaScript, and asset reference together. Keep one publishing copy as the source of truth.

1. Open the publishing repository, not an old export. Fetch and pull any remote changes before editing.
2. Describe the change, for example: “Change my contact details throughout the active portfolio, update every affected file, check local paths, then commit and push the completed change to this repository.”
3. Run the path check from the repository folder:

   ```powershell
   node Tools/check-links.cjs --live
   ```

4. Preview the affected pages and review the changes. A coding assistant can perform the checks and commit/push when instructed and when Git authentication is configured.
5. For a manual fallback, GitHub Desktop → enter a summary → Commit to main → Push origin.
6. GitHub Pages automatically republishes after the push. Confirm the deployment succeeded before checking the live URL.

For terminal use, the equivalent sequence is:

```powershell
node Tools/check-links.cjs --live
if ($LASTEXITCODE -ne 0) { throw 'Fix the reported paths before publishing.' }
git diff --stat
git add --all
git commit -m "Update portfolio"
git push origin main
```

Run this only inside the dedicated publishing repository: git add --all includes every change there. Stop if any Git command fails. If no files changed, no new commit is needed. Never force push to resolve a synchronization error; fetch and reconcile changes first. This sequence is a completed-edit publishing workflow, not an unattended save watcher. A GitHub workflow cannot commit unsaved local edits on your PC.

Reusable instruction:

> Apply my requested changes throughout this publishing repository. Update related HTML, CSS, JavaScript, and image paths together. Run the local link checker and check the affected pages. If checks pass, commit only the changes for this request with a descriptive message and push to the configured main branch. Report the result. Stop and explain any failed checks or conflicts.

## Connect your own domain later

1. Verify the domain with GitHub, then add it under repository Settings → Pages → Custom domain.
2. Configure the DNS records at your domain provider using GitHub's current domain instructions. For www, use a CNAME pointing to USERNAME.github.io without a repository path. Apex/root domains use the documented A/ALIAS/ANAME configuration.
3. Wait for DNS and certificate setup, then enable Enforce HTTPS when available.
4. If publishing from a branch, GitHub creates a CNAME file. Pull that commit into your local repository and preserve the file in future updates.

## Official references

- Publishing: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Commit and push: https://docs.github.com/en/desktop/making-changes-in-a-branch/pushing-changes-to-github-from-github-desktop
- Custom domain: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
