# GitScout

GitScout helps developers choose their next open-source contribution. Browse open issues in a public GitHub repository, narrow them down by label, and keep promising issues from different projects in one personal shortlist.

**[Try GitScout](https://trygitscout.vercel.app/)** · [Explore React issues](https://trygitscout.vercel.app/explore/facebook/react)

## Features

- **Open a repository.** Paste a GitHub URL or enter `owner/repo`, such as `facebook/react`. The repository overview shows its description, primary language, stars, forks, and default branch.
- **Browse open issues.** View issue titles, labels, authors, and comment counts. Load more results as you go, or open an issue on GitHub to read the discussion. GitScout filters pull requests out of the issue list.
- **Filter and sort.** Choose a repository label and sort by **Newest created** or **Recently updated**. The URL preserves your selection so you can share a filtered view.
- **Save and remove issues.** Select **Save** beside an issue to bookmark it. Visit your shortlist to revisit or remove saved issues. Bookmarks stay in the same browser between visits using `localStorage`.

## Tech stack

React, Next.js App Router, JavaScript, and CSS Modules. GitScout fetches repository data from the GitHub REST API and runs on Vercel.

## Run locally

Use Node.js 22 LTS and npm.

```bash
git clone https://github.com/KhalidMusaraf/git-scout.git
cd git-scout
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000) and enter a public repository. You can run the app without a GitHub account, API key, or database.

| Command         | Purpose                                           |
| --------------- | ------------------------------------------------- |
| `npm run dev`   | Start the local development server                |
| `npm run lint`  | Check the source with ESLint                      |
| `npm run build` | Create a production build                         |
| `npm start`     | Serve the production build locally after building |

## How it works

The Next.js server requests repository details, labels, and open issues from GitHub. It follows GitHub’s pagination links when loading additional results. If GitHub’s unauthenticated request limit is reached, GitScout displays a message so the user knows to try again later.

React handles the filter controls and shortlist. Saving an issue writes its repository, title, issue number, and save date to the browser. Clearing the site’s browser data also clears the shortlist.

| Directory                              | Responsibility                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| [`src/app/`](./src/app/)               | Pages and API route handlers for the repository explorer and shortlist                |
| [`src/components/`](./src/components/) | Repository form, issue list, filter controls, and shortlist UI                        |
| [`src/lib/`](./src/lib/)               | Repository input parsing, GitHub API requests, issue pagination, and bookmark storage |
