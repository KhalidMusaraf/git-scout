# GitScout · Save and remove issues

Install this ZIP on GitScout with Features 1–3 already in place. **Save** on an issue card adds it to **My shortlist**. The same card then offers **Remove**. The header shows the number of saved issues across all repositories.

## Install on Windows

1. In the VS Code terminal, stop the development server with `Ctrl+C`.
2. Extract the ZIP to a temporary folder. Copy its `src` folder into your existing `git-scout` folder beside `package.json`. Merge the folders. Accept replacements for the two files listed below, merging any personal edits you made to them.
3. Run `npm run dev` from the project root and open the local URL printed in the terminal. Your existing Next.js and React packages are sufficient.

## Quick acceptance test

1. Open a public repository such as `cli/cli` and select **Save** on an issue. The button changes to **Remove** and the header count increases.
2. Open a second repository such as `microsoft/vscode` and save another issue. You can also save directly from filtered results and from rows added by **Load more**.
3. Select **My shortlist**. Both issues appear, with their repository names and the newest save first. Click a title to view the GitHub issue, or its repository name to return to the explorer.
4. Refresh the shortlist. Both entries should still be there. Remove one, refresh again, and confirm the other remains.
5. Remove the final entry. The empty shortlist includes a link back to the repository form.

## File changes

| Action | File in the project | Purpose |
| --- | --- | --- |
| Replace | src/components/ScoutFrame.js | Adds shortlist navigation to the existing header |
| Replace | src/components/issues/IssueCard.js | Adds Save or Remove to every issue card |
| Add | src/app/shortlist/page.js | Implements the /shortlist route |
| Add | src/components/shortlist/ShortlistView.js | Displays saved issue titles, repositories, dates, and an empty state |
| Add | src/components/shortlist/ShortlistLink.js | Displays the shared shortlist link and count |
| Add | src/components/shortlist/SaveIssueButton.js | Handles saving, removing, and storage errors |
| Add | src/components/shortlist/Shortlist.module.css | Styles the actions, navigation, and shortlist page |
| Add | src/lib/shortlist.js | Keeps React views in sync after a save, removal, or change in another tab |
| Add | src/lib/shortlist-storage.js | Persists one record per GitHub issue ID in localStorage |

## How it works

The issue card passes its existing issue object to the button. GitScout stores the GitHub ID, issue number, repository, title, and save time on this device. The ID prevents duplicate entries and distinguishes issues with the same number in different repositories.

The shortlist uses the title and repository as they were when you saved the issue. Opening the title takes you to GitHub for its latest details. Saving and removing are local actions and require no account or API key. They leave the issue on GitHub untouched.

Use the same browser profile and local address (including the port) to reopen your shortlist. Clearing site data clears saved issues.
