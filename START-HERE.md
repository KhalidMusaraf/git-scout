# GitScout · Feature 1 · Open a repository

For an existing Next.js App Router project using JavaScript and a src directory. This feature uses React, Next.js and CSS Modules. Your existing dependencies are sufficient.

## Install in VS Code on Windows

1. Extract the ZIP into a temporary folder.
2. Copy the extracted `src` folder into your `git-scout` folder, beside `package.json`. Merge the folders and accept replacement for the two starter files listed below. If you customized either file, keep a copy of your edits first.
3. In the VS Code terminal at the project root, run `npm run dev`. If the server is already running, refresh the page.
4. Open the local address printed in the terminal, usually `http://localhost:3000`.

## Files

All paths in this table are relative to the project root.

| Action | File | Purpose |
| --- | --- | --- |
| Replace | src/app/page.js | Homepage and example repository links |
| Replace | src/app/page.module.css | Shared GitScout theme and page styles |
| Add | src/components/ScoutFrame.js | Branded header and main content area |
| Add | src/components/repository/RepositoryForm.js | Form, validation feedback and navigation |
| Add | src/components/repository/RepositoryForm.module.css | Responsive form styles |
| Add | src/lib/repositories.js | Parse a repository URL or owner/repo and validate route segments |
| Add | src/lib/github.js | Fetch public repository metadata from GitHub |
| Add | src/app/explore/[owner]/[repo]/page.js | Repository overview and recoverable errors |
| Add | src/app/explore/[owner]/[repo]/loading.js | Loading feedback |
| Add | src/app/explore/[owner]/[repo]/not-found.js | Missing or private repository feedback |

Keep the brackets in the two dynamic folder names. The final homepage file should be at `git-scout/src/app/page.js`. Your existing root layout and global CSS continue to load normally.

## Try it

| Input or action | Expected result |
| --- | --- |
| Enter `vercel/next.js` and press Enter | The URL ends in /explore/vercel/next.js. The page shows its name, available description, language, stars, forks, default branch and a GitHub link. |
| Enter `https://github.com/vercel/next.js/` | The same explorer page opens. |
| Paste `facebook/react` | The explorer shows the current repository name returned by GitHub. GitHub follows repository renames and transfers. |
| Enter `https://gitlab.com/example/project` or a blank value | The form explains the accepted format. |
| Enter `octocat/gitscout-does-not-exist-648290` | The explorer explains that the repository is unavailable and offers a link back. |
| Refresh a working explorer URL | The same repository opens directly. |

## Follow the code

1. The form passes the text to `parseRepositoryInput()`. This extracts the owner and repository name.
2. A valid submission navigates to `/explore/{owner}/{repo}`. GitScout shows input errors before making a GitHub request.
3. The explorer reads its route parameters and calls `getRepository()` on the Next.js server.
4. The server sends a GET request to `https://api.github.com/repos/{owner}/{repo}`. Public repository metadata can be read without a token. Internet access to GitHub is needed.
5. The explorer displays GitHub’s response. A missing repository, a request limit, or a network failure has its own feedback.

Feature 2 will add the issue list to this explorer page.
