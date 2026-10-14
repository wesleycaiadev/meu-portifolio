"use client";

import Link from "next/link";
import styles from "./ProjectCase.module.scss";

export function ProjectCaseNavigation() {
  return <header className={styles.header}>
    <Link href="/">Wesley Caiã</Link>
    <Link href="/#projetos" onNavigate={() => {
      try { sessionStorage.setItem("portfolio-project-case-return", "spasmooth"); } catch { /* Native anchor remains available. */ }
    }}>Voltar aos projetos</Link>
  </header>;
}

