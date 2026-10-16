"use client";

import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { selectedProjects, sharedPreviewAspect, type ProjectId } from "@/data/projects";
import type { ProjectPreviewController } from "@/lib/motion/projectPreview";
import styles from "./Projects.module.scss";
import { ProjectTrail } from "@/components/motion/ProjectTrail";
import { useRouter } from "next/navigation";
import { useProjectTransition } from "@/components/motion/ProjectTransitionProvider";

const desktopSizes = "(min-width: 1600px) 796px, (min-width: 1024px) 50vw, 90vw";
const mobileSizes = "(min-width: 768px) 560px, (max-width: 444px) calc(100vw - 40px), 91vw";

export function Projects() {
  const router = useRouter();
  const transition = useProjectTransition();
  const section = useRef<HTMLElement>(null);
  const preview = useRef<ProjectPreviewController | null>(null);
  const requested = useRef<ProjectId>(selectedProjects[0].id);
  const [activeProject, setActiveProject] = useState<ProjectId>(selectedProjects[0].id);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    let disposed = false;
    void import("@/lib/motion/projectPreview").then(({ createProjectPreview }) => {
      if (disposed) return;
      preview.current = createProjectPreview(element, setActiveProject, setAnnouncement);
      preview.current.select(requested.current);
    }).catch(error => {
      if (!disposed) setAnnouncement("A prévia interativa não pôde iniciar.");
      console.error("Project preview could not initialize.", error);
    });
    return () => { disposed = true; preview.current?.destroy(); preview.current = null; };
  }, []);

  const select = useCallback((id: ProjectId) => {
    if (section.current?.dataset.projectNavigating === "true") return;
    requested.current = id;
    preview.current?.select(id);
  }, []);

  return (
    <section
      ref={section} id="projetos" className={`surface--dark ${styles.projects}`}
      aria-labelledby="projetos-titulo" tabIndex={-1} data-projects=""
      data-active-project={activeProject}
    >
      <div className={styles.conceptIntro} data-project-intro="" aria-hidden="true" />
      <div className="container" data-project-stage="">
        <h2 id="projetos-titulo" className={`label ${styles.label}`}>Projetos selecionados</h2>
        <p id="projetos-instrucoes" className={styles.assistive}>
          O foco seleciona a prévia. SpaSmooth e MF Consultoria abrem seus estudos de caso.
        </p>
        <ol className={styles.list} role="list" style={{ "--preview-aspect": sharedPreviewAspect } as CSSProperties}>
          {selectedProjects.map((project, index) => {
            const { desktop, mobile } = project.preview;
            const selectProps = {
              id: `projeto-${project.id}`, className: styles.select,
              "aria-controls": `preview-${project.id}`, "aria-describedby": "projetos-instrucoes",
              "data-project-select": project.id,
              onPointerEnter: (event: PointerEvent<HTMLElement>) => {
                if (section.current?.dataset.trailSelection !== "scroll"
                  && event.pointerType !== "touch"
                  && matchMedia("(min-width: 64rem) and (hover: hover) and (pointer: fine)").matches) select(project.id);
              },
              onFocus: () => select(project.id),
            };
            const label = <><span className={`label ${styles.index}`} aria-hidden="true">{project.index}</span><span>{project.title}</span></>;
            return (
              <li key={project.id} className={styles.item} style={{
                "--project-row": index + 1, "--mobile-aspect": `${mobile.width} / ${mobile.height}`,
                "--desktop-aspect": `${desktop.width} / ${desktop.height}`,
              } as CSSProperties}>
                <h3 className={styles.title}>
                  <Link {...selectProps} href={project.casePath}
                    aria-label={`Conhecer o projeto ${project.title}`} data-active={activeProject === project.id}
                    onNavigate={event => {
                      if (!project.cinematicTransition) return;
                      if (section.current?.dataset.projectNavigating === "true") { event.preventDefault(); return; }
                      const snapshot = preview.current?.freeze(project.id);
                      if (snapshot && transition.begin(snapshot, project.casePath, () => router.push(project.casePath))) event.preventDefault();
                    }}>{label}</Link>
                </h3>
                <figure id={`preview-${project.id}`} className={styles.preview} data-project-preview={project.id}>
                  <picture>
                    <ResponsiveImage {...desktop} mobile={{ ...mobile, media: "(max-width: 1023px)", sizes: mobileSizes }} alt={project.alt} sizes={desktopSizes} className={styles.image} />
                  </picture>
                </figure>
              </li>
            );
          })}
        </ol>
        <p className={styles.assistive} role="status" aria-live="polite">{announcement}</p>
      </div>
      <ProjectTrail onSelect={select} />
    </section>
  );
}
