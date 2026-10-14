"use client";

import Link from "next/link";
import styles from "./ProjectCase.module.scss";
import type { ProjectId } from "@/data/projects";

export function ProjectCaseNavigation({ projectId }: { projectId: ProjectId }) {
  return <header className={styles.header}>
    <Link href="/">Wesley Caiã</Link>
    <Link href="/#projetos" onNavigate={() => {
      try { sessionStorage.setItem("portfolio-project-case-return", projectId); } catch { /* Native anchor remains available. */ }
    }}>Voltar aos projetos</Link>
  </header>;
}

