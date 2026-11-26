import { readIssueFilters } from "../../../lib/issue-filters";
import { isRepositoryPath } from "../../../lib/repositories";
import { getOpenIssuePage } from "../../../lib/issues";

export async function GET(request) {
  const query = new URL(request.url).searchParams;
  const owner = query.get("owner");
  const repo = query.get("repo");
  const pageText = query.get("page") ?? "1";
  const page = Number(pageText);
  const after = query.get("after") ?? "";

  if (!isRepositoryPath(owner, repo) || !/^[1-9]\d*$/.test(pageText) ||
      !Number.isSafeInteger(page) || after.length > 1024) {
    return Response.json({ kind: "error", message: "Invalid repository or page." }, { status: 400 });
  }

  const filters = readIssueFilters(query.get("label"), query.get("sort"));
  const result = await getOpenIssuePage(owner, repo, filters, { page, after });
  return Response.json(result, {
    status: result.kind === "error" ? result.status : 200,
    headers: { "Cache-Control": "no-store" },
  });
}
