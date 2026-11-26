# GitScout · Filter and sort

This update adds two controls above the existing Open issues list. **Label** offers names from the repository you opened. **Sort by** lets you choose the newest creations or the most recent updates. Both orders show the newest dates first.

## Install in your existing project

1. Start with the GitScout project that has Features 1 and 2. In the VS Code terminal, press **Ctrl+C** to stop the development server before copying files.
2. Extract the ZIP to a temporary folder. Copy its `src` folder into your existing `git-scout` folder beside `package.json`. Merge the folders and accept the six replacements below. If you customized one of those files, merge your edits first.
3. Run `npm run dev` and open the local address shown in the terminal.

This feature uses your existing dependencies and public GitHub API access.

## Try it

1. Open `cli/cli`. In the explorer, choose the **bug** label and **Recently updated**. Check the labels and update dates on the cards.
2. Select **Load more** below the issue list. The extra rows use the same label and order. A different label or sort starts a fresh first page.
3. Refresh the page or copy its URL into a new tab. Both selections come from the URL. For example, open [the filtered local explorer](http://localhost:3000/explore/cli/cli?label=bug&sort=updated) if your server uses port 3000.
4. Select **Clear label**. All open issues become eligible and **Recently updated** stays selected. Browser Back restores the previous view.
5. On a repository with over 100 labels, **Load more labels** extends the dropdown by up to 100 names. **Load more** beneath the issue list extends the results.

## File changes

| Action | Path relative to git-scout | Purpose |
| --- | --- | --- |
| Add | src/components/issues/IssueFilters.js | Renders the controls and updates the explorer URL |
| Add | src/app/api/labels/route.js | Returns a page of label names for the selected public repository |
| Add | src/lib/issue-filters.js | Interprets label and sort consistently for initial and subsequent requests |
| Replace | src/app/explore/[owner]/[repo]/page.js | Reads the URL, displays controls, and starts fresh results on a selection change |
| Replace | src/app/api/issues/route.js | Forwards the selected settings and pagination cursor |
| Replace | src/lib/github.js | Builds GitHub requests for labels and sorted, filtered issues |
| Replace | src/lib/issues.js | Applies the same filter to every page and keeps pull requests out |
| Replace | src/components/issues/IssueList.js | Keeps filters during pagination and retries, and shows a message for zero matches |
| Replace | src/components/issues/Issues.module.css | Styles desktop and mobile controls using the GitScout theme |

## Trace one request

With the **bug** label and **Recently updated** selected, the web address ends in `?label=bug&sort=updated`. GitScout sends GitHub a request such as [open issues in cli/cli with the bug label](https://api.github.com/repos/cli/cli/issues?state=open&labels=bug&sort=updated&direction=desc&per_page=30).

GitHub sorts the whole result set before returning a page. **Load more** carries those parameters and the next-page position. GitScout checks exact label membership and removes pull requests before displaying the cards. A literal comma in a label needs special handling because GitHub treats commas as label separators. For this case GitScout reads sorted pages and checks the whole label name on each issue.
