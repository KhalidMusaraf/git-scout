import { getRepositoryIssues } from "./github";

// GitHub may include an opaque "after" cursor alongside the page number.
function nextPosition(link, currentPage) {
  const match = link?.match(/<([^>]+)>;\s*rel="next"/);
  if (!match) return null;
  const params = new URL(match[1]).searchParams;
  return { page: Number(params.get("page")) || currentPage + 1, after: params.get("after") ?? "" };
}

function toIssue(item, repository) {
  return {
    id: item.id,
    number: item.number,
    title: item.title,
    url: item.html_url,
    repository,
    author: item.user?.login ?? null,
    updatedAt: item.updated_at,
    comments: item.comments,
    labels: item.labels.map(label => typeof label === "string" ? label : label.name),
  };
}

// Recent activity can be all pull requests. Look ahead a few pages per click,
// then let the reader continue without spending the entire GitHub request quota.
export async function getOpenIssuePage(owner, repo, filters, start = { page: 1, after: "" }) {
  let position = start;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const result = await getRepositoryIssues(owner, repo, position, filters);
    if (result.kind !== "found") {
      return {
        kind: "error",
        status: result.status ?? 404,
        message: result.message ?? "The repository’s issues are unavailable on GitHub.",
        retry: position,
      };
    }

    const issues = result.data
      .filter(item => item.state === "open" && !item.pull_request)
      .map(item => toIssue(item, `${owner}/${repo}`))
      .filter(issue => !filters.label || issue.labels.some(name =>
        name.toLowerCase() === filters.label.toLowerCase()));
    const next = nextPosition(result.link, position.page);
    if (issues.length || !next || attempt === 3) return { kind: "found", issues, next };
    position = next;
  }
}
