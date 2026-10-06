"use client";

import { useEffect, useRef } from "react";
import styles from "./ProjectTrail.module.scss";
import type { ProjectId } from "@/data/projects";

export function ProjectTrail({ onSelect }: { onSelect: (id: ProjectId) => void }) {
  const surface = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = surface.current;
    const section = svg?.closest<HTMLElement>("[data-projects]");
    const path = svg?.querySelector("path");
    if (!svg || !section || !path) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 64rem)");
    const lifetime = new AbortController();
    const previewMode = process.env.NODE_ENV === "development"
      && new URLSearchParams(location.search).get("wc-preview") === "1";
    const concept = process.env.NODE_ENV === "development"
      && new URLSearchParams(location.search).get("projects-concept") === "1";
    let disposed = false;
    let loading = false;
    let release: (() => void) | undefined;
    const eligible = () => desktop.matches && (previewMode
      ? document.documentElement.dataset.wcMotionPreview === "enabled"
      : !reduced.matches);
    const reconcile = () => {
      if (!eligible()) { release?.(); release = undefined; return; }
      if (disposed || loading || release) return;
      loading = true;
      const controller = concept ? import("@/lib/motion/projectConcept") : import("@/lib/motion/projectTrail");
      void controller.then(module => {
        loading = false;
        if (disposed || !eligible()) return;
        const create = "createProjectConcept" in module ? module.createProjectConcept : module.createProjectTrail;
        release = create(section, svg, path, onSelect);
      }).catch(error => {
        loading = false;
        console.error("Project trail could not initialize.", error);
      });
    };
    reduced.addEventListener("change", reconcile, { signal: lifetime.signal });
    desktop.addEventListener("change", reconcile, { signal: lifetime.signal });
    if (process.env.NODE_ENV === "development") {
      window.addEventListener("wc-motion-preview", reconcile, { signal: lifetime.signal });
    }
    reconcile();
    return () => { disposed = true; lifetime.abort(); release?.(); };
  }, [onSelect]);

  return (
    <svg ref={surface} className={styles.surface} aria-hidden="true" focusable="false" data-project-trail="">
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path data-project-connector="" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path data-project-lettering="" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
