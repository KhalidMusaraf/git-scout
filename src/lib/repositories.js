// Used by both the form and the explorer (which can be visited directly).
export function isRepositoryPath(owner, repo) {
  return typeof owner === "string" && typeof repo === "string" &&
    /^[a-z0-9][a-z0-9_-]*$/i.test(owner) &&
    /^[a-z0-9_.-]+$/i.test(repo) && repo !== "." && repo !== "..";
}

export function parseRepositoryInput(value) {
  const input = value.trim();
  const githubPrefix = /^(?:https?:\/\/)?(?:www\.)?github\.com\//i;
  const isLink = githubPrefix.test(input);
  const path = isLink
    ? input.replace(githubPrefix, "").split(/[?#]/, 1)[0]
    : input;

  const parts = path.replace(/\/$/, "").split("/");
  if (parts.length !== 2) return null;

  const [owner, name] = parts;
  const repo = name.replace(/\.git$/i, "");
  if (!isRepositoryPath(owner, repo)) return null;

  return { owner, repo };
}
