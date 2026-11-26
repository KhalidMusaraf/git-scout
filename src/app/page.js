import Link from "next/link";
import ScoutFrame from "../components/ScoutFrame";
import RepositoryForm from "../components/repository/RepositoryForm";
import styles from "./page.module.css";

export const metadata = { title: "GitScout · Open a repository" };

const examples = [
  { path: "facebook/react", name: "React", description: "A library for user interfaces" },
  { path: "vercel/next.js", name: "Next.js", description: "The React framework for the web" },
  { path: "vitejs/vite", name: "Vite", description: "Frontend tooling and builds" },
];

export default function HomePage() {
  return (
    <ScoutFrame>
      <section className={styles.hero}>
        <div>
          <h1>Find your next<br /><span className={styles.green}>contribution.</span></h1>
          <p>Start by exploring a public GitHub repository.</p>
        </div>
        <div className={styles.art} aria-hidden="true">
          <div className={styles.stack}>
            <i /><i /><i><b>&lt;/&gt;</b></i>
          </div>
        </div>
      </section>
      <RepositoryForm />
      <section aria-labelledby="examples-title">
        <h2 id="examples-title" className={styles.subheading}>Try an example</h2>
        <div className={styles.examples}>
          {examples.map(({ path, name, description }) => (
            <Link key={path} href={`/explore/${path}`} prefetch={false} className={styles.example}>
              <strong>{name} <span aria-hidden="true">→</span></strong>
              <code>{path}</code>
              <span>{description}</span>
            </Link>
          ))}
        </div>
      </section>
    </ScoutFrame>
  );
}
