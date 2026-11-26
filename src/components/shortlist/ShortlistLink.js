"use client";

import Link from "next/link";
import { useShortlist } from "../../lib/shortlist";
import styles from "./Shortlist.module.css";

export default function ShortlistLink({ active }) {
  const { issues, status } = useShortlist();
  return (
    <Link href="/shortlist" aria-current={active ? "page" : undefined}
      aria-label={status === "ready" ? `My shortlist (${issues.length})` : "My shortlist"}
      className={styles.navLink}>
      My shortlist
      {status === "ready" && <span aria-hidden="true" className={styles.badge}>{issues.length}</span>}
    </Link>
  );
}
