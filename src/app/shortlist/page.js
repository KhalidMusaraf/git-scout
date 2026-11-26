import ScoutFrame from "../../components/ScoutFrame";
import ShortlistView from "../../components/shortlist/ShortlistView";
import styles from "../../components/shortlist/Shortlist.module.css";

export const metadata = { title: "My shortlist · GitScout" };

export default function ShortlistPage() {
  return (
    <ScoutFrame currentPage="shortlist">
      <header className={styles.intro}>
        <h1>My shortlist</h1>
        <p>Issues saved in this browser, newest saves first.</p>
      </header>
      <ShortlistView />
    </ScoutFrame>
  );
}
