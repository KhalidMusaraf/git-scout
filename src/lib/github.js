// Requests to GitHub run on the Next.js server.
function repositoryEndpoint(owner, repo) {
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
}

async function readGitHub(url) {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "GitScout" },
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });

    if (response.status === 404) return { kind: "missing" };

    if (!response.ok) {
      const limited = response.status === 429 || (response.status === 403 &&
        (response.headers.get("x-ratelimit-remaining") === "0" || response.headers.has("retry-after")));
      if (limited) {
        return { kind: "error", status: 429, message: "GitHub’s request limit was reached. Please try again later." };
      }
      if (response.status === 403) {
        return { kind: "error", status: 403, message: "GitHub declined this request. Please try again later." };
      }
      return { kind: "error", status: 502, message: "GitHub could not complete the request. Please try again." };
    }

    return { kind: "found", data: await response.json(), link: response.headers.get("link") };
  } catch {
    return { kind: "error", status: 502, message: "GitScout couldn’t reach GitHub. Check your connection and try again." };
  }
}

export async function getRepository(owner, repo) {
  const result = await readGitHub(repositoryEndpoint(owner, repo));
  if (result.kind !== "found") return result;

  const data = result.data;
  return {
    kind: "found",
    repository: {
      fullName: data.full_name,
      description: data.description,
      url: data.html_url,
      language: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
      branch: data.default_branch,
      issuesEnabled: data.has_issues,
    },
  };
}

export function getRepositoryIssues(owner, repo, position, filters) {
  const url = new URL(repositoryEndpoint(owner, repo) + "/issues");
  url.search = new URLSearchParams({
    state: "open",
    sort: filters.sort,
    direction: "desc",
    per_page: "30",
    page: String(position.page),
  }).toString();
  // The issues endpoint interprets commas as separators. For a label that
  // contains a comma, issues.js checks exact label names as it reads each page.
  if (filters.label && !filters.label.includes(",")) url.searchParams.set("labels", filters.label);
  if (position.after) url.searchParams.set("after", position.after);
  return readGitHub(url);
}


export async function getRepositoryLabels(owner, repo, page) {
  const url = new URL(repositoryEndpoint(owner, repo) + "/labels");
  url.search = new URLSearchParams({ per_page: "100", page: String(page) }).toString();
  const result = await readGitHub(url);
  if (result.kind !== "found") {
    return {
      message: result.message ?? "GitHub could not load this repository’s labels.",
      status: result.status ?? 404,
    };
  }

  return {
    names: result.data.map(label => label.name),
    nextPage: result.link?.includes('rel="next"') ? page + 1 : null,
  };
}
