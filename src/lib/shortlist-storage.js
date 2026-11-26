import { isRepositoryPath } from "./repositories";

const prefix = "gitscout:shortlist:v1:";

function isSavedIssue(value) {
  if (!value || typeof value.repository !== "string") return false;
  const parts = value.repository.split("/");
  return parts.length === 2 && isRepositoryPath(...parts) &&
    Number.isSafeInteger(value.id) && value.id > 0 &&
    Number.isSafeInteger(value.number) && value.number > 0 &&
    typeof value.title === "string" &&
    Number.isSafeInteger(value.savedAt) && value.savedAt > 0 &&
    Number.isFinite(new Date(value.savedAt).getTime());
}

export function isShortlistKey(key) {
  return key === null || key.startsWith(prefix);
}

function readEntry(storage, key) {
  const text = storage.getItem(key);
  if (text === null) return null;
  try {
    const entry = JSON.parse(text);
    return isSavedIssue(entry) && key === prefix + entry.id ? entry : null;
  } catch {
    return null;
  }
}

export function readSavedIssues() {
  const storage = window.localStorage;
  const issues = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (key?.startsWith(prefix)) {
      const entry = readEntry(storage, key);
      if (entry) issues.push(entry);
    }
  }
  return issues.sort((a, b) => b.savedAt - a.savedAt || b.id - a.id);
}

// One key per GitHub issue ID lets two tabs save different issues independently.
export function writeSavedIssue(issue, shouldSave) {
  const storage = window.localStorage;
  const key = prefix + issue.id;
  if (!shouldSave) {
    storage.removeItem(key);
    return;
  }
  if (readEntry(storage, key)) return;

  const { id, number, title, repository } = issue;
  storage.setItem(key, JSON.stringify({ id, number, title, repository, savedAt: Date.now() }));
}
