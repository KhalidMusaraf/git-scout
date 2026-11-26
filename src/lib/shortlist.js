"use client";

import { useSyncExternalStore } from "react";
import { isShortlistKey, readSavedIssues, writeSavedIssue } from "./shortlist-storage";

const initial = { status: "loading", issues: [] };
const listeners = new Set();
let current = initial;

function refresh() {
  try {
    current = { status: "ready", issues: readSavedIssues() };
  } catch {
    current = { status: "unavailable", issues: [] };
  }
  for (const notify of listeners) notify();
}

function onStorage(event) {
  if (isShortlistKey(event.key)) refresh();
}

function subscribe(notify) {
  listeners.add(notify);
  if (listeners.size === 1) {
    window.addEventListener("storage", onStorage);
    refresh();
  }
  return () => {
    listeners.delete(notify);
    if (!listeners.size) window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() { return current; }
function getServerSnapshot() { return initial; }

export function useShortlist() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setIssueSaved(issue, shouldSave) {
  // A failed write leaves the last confirmed state visible to the user.
  writeSavedIssue(issue, shouldSave);
  refresh();
}
