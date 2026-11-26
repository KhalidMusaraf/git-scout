import Link from "next/link";
import ScoutFrame from "../../../../components/ScoutFrame";
import styles from "../../../page.module.css";

export default function RepositoryNotFound() {
  return (
    <ScoutFrame>
      <section className={styles.panel}>
        <h1>Repository unavailable</h1>
        <p>Check the owner and repository name, and make sure the repository is public.</p>
        <Link className={styles.button} href="/">Choose another repository</Link>
      </section>
    </ScoutFrame>
  );
}
