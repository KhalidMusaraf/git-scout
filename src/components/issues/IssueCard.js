import SaveIssueButton from "../shortlist/SaveIssueButton";
import shortlistStyles from "../shortlist/Shortlist.module.css";
import styles from "./Issues.module.css";

const dateFormat = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export default function IssueCard({ issue }) {
  return (
    <li className={`${styles.card} ${shortlistStyles.issueRow}`}>
      <div className={styles.issueHeading}>
        <span className={styles.openIcon} aria-label="Open issue" role="img" />
        <h3>
          <a href={issue.url}>{issue.title}</a>
        </h3>
      </div>
      <div className={styles.meta}>
        <span className={styles.number}>#{issue.number}</span>
        {issue.author && <span>@{issue.author}</span>}
        <span>
          Updated{" "}
          <time dateTime={issue.updatedAt}>
            {dateFormat.format(new Date(issue.updatedAt))}
          </time>
        </span>
        <span>
          {issue.comments} {issue.comments === 1 ? "comment" : "comments"}
        </span>
      </div>
      {issue.labels.length > 0 && (
        <ul aria-label="Issue labels" className={styles.labels}>
          {issue.labels.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      )}
      <SaveIssueButton issue={issue} />
    </li>
  );
}
