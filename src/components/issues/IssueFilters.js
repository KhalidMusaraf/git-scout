"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Issues.module.css";

export default function IssueFilters({ repository, filters }) {
  const pathname = usePathname();
  const router = useRouter();
  const [navigating, startTransition] = useTransition();
  const [names, setNames] = useState([]);
  const [request, setRequest] = useState({ page: 1 });
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadLabels() {
      try {
        const [owner, repo] = repository.split("/");
        const query = new URLSearchParams({ owner, repo, page: String(request.page) });
        const response = await fetch(`/api/labels?${query}`, { signal: controller.signal });
        const result = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok) {
          setError(result.message || "Couldn’t load repository labels.");
          return;
        }
        setNames(previous => [...new Set([...previous, ...result.names])]);
        setNextPage(result.nextPage);
      } catch {
        if (!controller.signal.aborted) setError("Couldn’t load labels. Check your connection and try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadLabels();
    return () => controller.abort();
  }, [repository, request]);

  function requestLabels(page) {
    setError("");
    setLoading(true);
    setRequest({ page });
  }

  function changeFilters(label, sort) {
    const query = new URLSearchParams(window.location.search);
    if (label) query.set("label", label);
    else query.delete("label");
    if (sort === "updated") query.set("sort", sort);
    else query.delete("sort");
    const search = query.toString();
    startTransition(() => router.push(search ? `${pathname}?${search}` : pathname, { scroll: false }));
  }

  // A shared link may select a label from a later page of the catalogue.
  const options = [...new Set([filters.label, ...names].filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "en"));

  return (
    <section className={styles.filters} aria-label="Issue filters">
      <div className={styles.controls}>
        <label>
          <span>Label</span>
          <select value={filters.label} onChange={e => changeFilters(e.target.value, filters.sort)}
            disabled={navigating || options.length === 0}>
            <option value="">All labels</option>
            {options.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
        <label>
          <span>Sort by</span>
          <select value={filters.sort} onChange={e => changeFilters(filters.label, e.target.value)}
            disabled={navigating}>
            <option value="created">Newest created</option>
            <option value="updated">Recently updated</option>
          </select>
        </label>
        {filters.label && (
          <button type="button" className={styles.textButton} disabled={navigating}
            onClick={() => changeFilters("", filters.sort)}>Clear label</button>
        )}
      </div>
      {loading && <p role="status" className={styles.filterNote}>Loading repository labels…</p>}
      {navigating && <p role="status" className={styles.filterNote}>Updating issues…</p>}
      {!loading && !error && !names.length && <p className={styles.filterNote}>This repository has no labels.</p>}
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {!loading && (error || nextPage) && (
        <button type="button" className={styles.textButton} onClick={() => requestLabels(error ? request.page : nextPage)}>
          {error ? "Retry loading labels" : "Load more labels"}
        </button>
      )}
    </section>
  );
}
