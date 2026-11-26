"use client";

import { useState } from "react";
import { setIssueSaved, useShortlist } from "../../lib/shortlist";
import styles from "./Shortlist.module.css";

export default function SaveIssueButton({ issue, onRemoved }) {
  const { issues, status } = useShortlist();
  const [error, setError] = useState("");
  const saved = issues.some(item => item.id === issue.id);
  const action = saved ? "Remove" : "Save";
  const label = `${action} ${issue.repository}#${issue.number} ${saved ? "from" : "to"} shortlist`;

  function handleClick() {
    setError("");
    try {
      setIssueSaved(issue, !saved);
    } catch {
      setError("Couldn’t update your shortlist. Check browser storage and try again.");
      return;
    }
    if (saved) onRemoved?.();
  }

  return (
    <div className={styles.action}>
      <button type="button" onClick={handleClick} disabled={status !== "ready"}
        className={styles.saveButton} data-saved={saved} aria-label={label}
        title={status === "unavailable" ? "Browser storage is unavailable" : label}>
        {action}
      </button>
      {error && <span className={styles.error} role="alert">{error}</span>}
    </div>
  );
}
