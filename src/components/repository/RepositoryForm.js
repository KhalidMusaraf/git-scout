"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { parseRepositoryInput } from "../../lib/repositories";
import styles from "./RepositoryForm.module.css";

export default function RepositoryForm() {
  const router = useRouter();
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;

    const repository = parseRepositoryInput(inputRef.current.value);
    if (!repository) {
      setError("Enter owner/repository or a GitHub repository URL, such as https://github.com/facebook/react.");
      inputRef.current.focus();
      return;
    }

    setError("");
    const { owner, repo } = repository;
    startTransition(() => router.push(`/explore/${owner}/${repo}`));
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <label className={styles.label} htmlFor="repository">Open a repository</label>
      <p id="repository-hint" className={styles.hint}>Paste a public GitHub URL or enter owner/repository.</p>
      <div className={styles.row}>
        <input
          id="repository" name="repository" ref={inputRef} type="text" required
          placeholder="e.g. facebook/react" autoCapitalize="none"
          autoComplete="off" spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "repository-hint repository-error" : "repository-hint"}
          onChange={() => { if (error) setError(""); }}
        />
        <button type="submit" disabled={pending}>
          {pending ? "Opening…" : "Open repository"} <span aria-hidden="true">→</span>
        </button>
      </div>
      {error && <p id="repository-error" role="alert" className={styles.error}>{error}</p>}
    </form>
  );
}
