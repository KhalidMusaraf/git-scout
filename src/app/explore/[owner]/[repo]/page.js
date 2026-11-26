import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScoutFrame from "../../../../components/ScoutFrame";
import { isRepositoryPath } from "../../../../lib/repositories";
import { getRepository } from "../../../../lib/github";
import IssueFilters from "../../../../components/issues/IssueFilters";
import { readIssueFilters } from "../../../../lib/issue-filters";
import IssueList from "../../../../components/issues/IssueList";
import { getOpenIssuePage } from "../../../../lib/issues";
import issueStyles from "../../../../components/issues/Issues.module.css";
import styles from "../../../page.module.css";

export const metadata = { title: "Repository · GitScout" };

function IssueNotice({ children }) {
  return (
    <section className={issueStyles.panel} aria-label="Open issues">
      <header className={issueStyles.header}><h2>Open issues</h2></header>
      <p className={issueStyles.notice} role="status">{children}</p>
    </section>
  );
}

async function RepositoryIssues({ repository, filters }) {
  const [owner, repo] = repository.split("/");
  const first = await getOpenIssuePage(owner, repo, filters);
  return <IssueList repository={repository} filters={filters} initial={first} />;
}

export default async function RepositoryPage({ params, searchParams }) {
  const [{ owner, repo }, query] = await Promise.all([params, searchParams]);
  const filters = readIssueFilters(query.label, query.sort);
  if (!isRepositoryPath(owner, repo)) notFound();

  const result = await getRepository(owner, repo);
  if (result.kind === "missing") notFound();

  if (result.kind === "error") {
    return (
      <ScoutFrame>
        <section className={styles.panel}>
          <h1>Couldn’t open {owner}/{repo}</h1>
          <p role="alert">{result.message}</p>
          <a className={styles.button} href="">Try again</a>
          <Link className={styles.back} href="/">Choose another repository</Link>
        </section>
      </ScoutFrame>
    );
  }

  const { repository } = result;
  const number = new Intl.NumberFormat("en-US");
  return (
    <ScoutFrame>
      <Link className={styles.crumb} href="/">← Open another repository</Link>
      <section className={styles.panel}>
        <h1>{repository.fullName}</h1>
        {repository.description && <p>{repository.description}</p>}
        <dl className={styles.stats}>
          <div><dt>Language</dt><dd>{repository.language ?? "Unspecified"}</dd></div>
          <div><dt>Stars</dt><dd>{number.format(repository.stars)}</dd></div>
          <div><dt>Forks</dt><dd>{number.format(repository.forks)}</dd></div>
          <div><dt>Default branch</dt><dd>{repository.branch ?? "Unspecified"}</dd></div>
        </dl>
        <a className={styles.button} href={repository.url}>View on GitHub <span aria-hidden="true">→</span></a>
      </section>
      {repository.issuesEnabled ? (
        <>
          <IssueFilters key={repository.fullName} repository={repository.fullName} filters={filters} />
          <Suspense key={JSON.stringify([repository.fullName, filters.label, filters.sort])}
            fallback={<IssueNotice>Loading issues…</IssueNotice>}>
            <RepositoryIssues repository={repository.fullName} filters={filters} />
          </Suspense>
        </>
      ) : (
        <IssueNotice>Issues are disabled for this repository.</IssueNotice>
      )}
    </ScoutFrame>
  );
}
