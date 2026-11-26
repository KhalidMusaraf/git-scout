import Link from "next/link";
import ShortlistLink from "./shortlist/ShortlistLink";
import shortlistStyles from "./shortlist/Shortlist.module.css";
import styles from "../app/page.module.css";

export default function ScoutFrame({ children, currentPage = "explore" }) {
  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#content">Skip to content</a>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link className={styles.brand} href="/" aria-label="GitScout home">
            <span className={styles.mark} aria-hidden="true" />
            <span>Git<span className={styles.green}>Scout</span></span>
          </Link>
          <nav aria-label="Main navigation" className={shortlistStyles.nav}>
            <Link className={styles.explore} href="/">Explore</Link>
            <ShortlistLink active={currentPage === "shortlist"} />
          </nav>
        </div>
      </header>
      <main id="content" tabIndex={-1} className={styles.main}>{children}</main>
    </div>
  );
}
