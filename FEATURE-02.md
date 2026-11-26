# GitScout · Browse open issues

Install this update on the GitScout project that already has Feature 1, Open a repository. It adds an Open issues panel below the repository overview. Each title links to its GitHub issue. The count shows how many issues you have loaded.

## Install on Windows

1. Extract the ZIP to a temporary folder.
2. Copy its `src` folder into your existing `git-scout` project, alongside `package.json`. Merge the folders and confirm the two file replacements below. If you edited either of those files yourself, merge your edits first.
3. Refresh your local site. If the server is stopped, run `npm run dev` from the project root and open the local address printed in the terminal.

No additional packages, API key, or project configuration are required.

## File changes

| Action | Path from git-scout | Purpose |
| --- | --- | --- |
| Replace | src/app/explore/[owner]/[repo]/page.js | Keeps the repository overview and loads the issue list below it |
| Replace | src/lib/github.js | Shares GitHub request handling between repository metadata and issue requests |
| Add | src/lib/issues.js | Skips pull requests, maps issue fields, and reads GitHub’s next-page position |
| Add | src/app/api/issues/route.js | Handles Load more and retry requests for the selected repository |
| Add | src/components/issues/IssueList.js | Tracks loaded issues, prevents overlapping loads, and supports retries |
| Add | src/components/issues/IssueCard.js | Displays a linked issue title, number, author, update date, comments, and labels |
| Add | src/components/issues/Issues.module.css | Styles the responsive issue panel using the Feature 1 theme |

## Quick test

1. Open `microsoft/vscode` from the homepage. The repository overview appears first. Under Open issues, click an issue title to see that issue on GitHub.
2. Return to GitScout and select **Load more**. Older issues appear below the existing ones. The button disappears when there are no more pages.
3. Open a repository with zero open issues. Its overview still works, and the issue panel shows an empty message. A repository with its issue tracker disabled has a separate message.

## Follow the API call

For the first batch, the explorer calls `getOpenIssuePage()` on the Next.js server. To see a sample response for the same repository, open [GitHub’s issue endpoint](https://api.github.com/repos/microsoft/vscode/issues?state=open&sort=created&direction=desc&per_page=30&page=1).

GitHub sends up to 30 entries per API page, including pull requests. GitScout displays open issues and follows GitHub’s next-page link and cursor. If a page contains only pull requests, it checks up to three pages per action. When more pages remain, you can continue with **Load more**.

The first batch comes from the server-rendered page. For later batches, the button calls the local `/api/issues` route, which uses the same GitHub logic. A failed request leaves the loaded issues visible so you can retry.
