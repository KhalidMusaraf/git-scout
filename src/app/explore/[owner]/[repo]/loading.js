import ScoutFrame from "../../../../components/ScoutFrame";
import styles from "../../../page.module.css";

export default function Loading() {
  return (
    <ScoutFrame>
      <section className={styles.panel} role="status">
        <h1>Opening repository…</h1>
        <p>Loading repository details from GitHub.</p>
      </section>
    </ScoutFrame>
  );
}
