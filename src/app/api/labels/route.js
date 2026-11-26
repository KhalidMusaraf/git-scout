import { isRepositoryPath } from "../../../lib/repositories";
import { getRepositoryLabels } from "../../../lib/github";

export async function GET(request) {
  const query = new URL(request.url).searchParams;
  const owner = query.get("owner");
  const repo = query.get("repo");
  const pageText = query.get("page") ?? "1";
  const page = Number(pageText);
  if (!isRepositoryPath(owner, repo) || !/^[1-9]\d*$/.test(pageText) || !Number.isSafeInteger(page)) {
    return Response.json({ message: "Invalid repository or label page." }, { status: 400 });
  }
  const result = await getRepositoryLabels(owner, repo, page);
  return Response.json(result, {
    status: result.status ?? 200,
    headers: { "Cache-Control": "no-store" },
  });
}
