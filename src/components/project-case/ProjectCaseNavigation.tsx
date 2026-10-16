"use client";

import Link from "next/link";
import styles from "./ProjectCase.module.scss";
import type { ProjectId } from "@/data/projects";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function ProjectCaseNavigation({ projectId }: { projectId: ProjectId }) {
  return <header className={styles.header}>
    <Link href="/" aria-label="Wesley Caiã — início"><BrandLogo inverse /></Link>
    <Link href="/#projetos" onNavigate={() => {
      try { sessionStorage.setItem("portfolio-project-case-return", projectId); } catch { /* Native anchor remains available. */ }
    }}>Voltar aos projetos</Link>
  </header>;
}

