"use client";

import Link from "next/link";
import { useRef } from "react";
import { useShortlist } from "../../lib/shortlist";
import SaveIssueButton from "./SaveIssueButton";
import styles from "./Shortlist.module.css";

const formatDate = new Intl.DateTimeFormat("en", {
  month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
});

export default function ShortlistView() {
  const { issues, status } = useShortlist();
  const panel = useRef(null);

  function focusAfterRemoval(index) {
    requestAnimationFrame(() => {
      const buttons = panel.current?.querySelectorAll("li button");
      const target = buttons?.[index] ?? buttons?.[index - 1] ?? panel.current?.querySelector("a");
      target?.focus();
    });
  }

  return (
    <section className={styles.collection} ref={panel} aria-labelledby="saved-title">
      <header className={styles.listHead}>
        <h2 id="saved-title">Saved issues</h2>
        <span role="status">{status === "ready" && `${issues.length} saved`}</span>
      </header>
      {status === "loading" && <p className={styles.message}>Loading shortlist…</p>}
      {status === "unavailable" && <p role="alert" className={styles.message}>Browser storage is unavailable. Allow site storage and refresh to open your shortlist.</p>}
      {status === "ready" && (issues.length ? (
        <ul className={styles.list}>
          {issues.map((issue, index) => (
            <li key={issue.id} className={styles.row}>
              <div className={styles.details}>
                <Link href={`/explore/${issue.repository}`} prefetch={false}
                  className={styles.repo}>{issue.repository}</Link>
                <h3><a href={`https://github.com/${issue.repository}/issues/${issue.number}`}>{issue.title}</a></h3>
                <p className={styles.meta}>#{issue.number} · Saved <time dateTime={new Date(issue.savedAt).toISOString()}>{formatDate.format(issue.savedAt)}</time></p>
              </div>
              <SaveIssueButton issue={issue} onRemoved={() => focusAfterRemoval(index)} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <h3>Your shortlist is empty</h3>
          <p>Select Save beside an issue to keep it here.</p>
          <Link href="/" className={styles.emptyLink}>Open a repository →</Link>
        </div>
      ))}
    </section>
  );
}
