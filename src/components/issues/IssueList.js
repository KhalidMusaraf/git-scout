"use client";

import { useEffect, useRef, useState } from "react";
import IssueCard from "./IssueCard";
import styles from "./Issues.module.css";

export default function IssueList({ repository, filters, initial }) {
  const [issues, setIssues] = useState(initial.issues ?? []);
  const [position, setPosition] = useState(initial.next ?? initial.retry ?? null);
  const [error, setError] = useState(initial.message ?? "");
  const [busy, setBusy] = useState(false);
  const active = useRef(null);

  useEffect(() => () => active.current?.abort(), []);

  async function loadMore() {
    if (!position || active.current) return;
    const controller = new AbortController();
    active.current = controller;
    setBusy(true);
    setError("");

    try {
      const [owner, repo] = repository.split("/");
      const query = new URLSearchParams({ owner, repo, sort: filters.sort, page: String(position.page) });
      if (filters.label) query.set("label", filters.label);
      if (position.after) query.set("after", position.after);
      const response = await fetch(`/api/issues?${query}`, {
        cache: "no-store", signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.retry) setPosition(data.retry);
        setError(data.message || "Couldn’t load issues. Please try again.");
        return;
      }

      setIssues(previous => {
        const seen = new Set(previous.map(issue => issue.id));
        return [...previous, ...data.issues.filter(issue => !seen.has(issue.id))];
      });
      setPosition(data.next);
    } catch {
      if (!controller.signal.aborted) setError("Couldn’t load issues. Check your connection and try again.");
    } finally {
      active.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="issues-title">
      <header className={styles.header}>
        <h2 id="issues-title">Open issues</h2>
        <span className={styles.count} aria-live="polite">{issues.length} shown</span>
      </header>
      {issues.length > 0 && (
        <ul className={styles.list}>
          {issues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
        </ul>
      )}
      {!issues.length && !error && !busy && (
        <p className={styles.notice}>
          {position ? "No matching open issues on these pages. Load more to keep browsing." :
            filters.label ? `No open issues match “${filters.label}”.` : "This repository has no open issues."}
        </p>
      )}
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {position && (
        <div className={styles.footer}>
          <button type="button" onClick={loadMore} disabled={busy} className={styles.button}>
            {busy ? "Loading issues…" : error ? "Retry loading issues" : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
