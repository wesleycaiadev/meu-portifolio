"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { selectedProjects, sharedPreviewAspect, type ProjectId } from "@/data/projects";
import type { ProjectPreviewController } from "@/lib/motion/projectPreview";
import styles from "./Projects.module.scss";

const desktopSizes = "(min-width: 1600px) 728px, (min-width: 1024px) 45.5vw, 90vw";
const mobileSizes = "(min-width: 768px) 560px, (max-width: 444px) calc(100vw - 40px), 91vw";

export function Projects() {
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

  const select = (id: ProjectId) => {
    requested.current = id;
    preview.current?.select(id);
  };

  return (
    <section
      ref={section} id="projetos" className={`surface--dark ${styles.projects}`}
      aria-labelledby="projetos-titulo" tabIndex={-1} data-projects=""
      data-active-project={activeProject}
    >
      <div className="container">
        <h2 id="projetos-titulo" className={`label ${styles.label}`}>Projetos selecionados</h2>
        <p id="projetos-instrucoes" className={styles.assistive}>
          Estes controles selecionam a prévia de cada projeto. Os estudos de caso ainda não estão disponíveis.
        </p>
        <ol className={styles.list} role="list" style={{ "--preview-aspect": sharedPreviewAspect } as CSSProperties}>
          {selectedProjects.map((project, index) => {
            const { desktop, mobile } = project.preview;
            const { props: { srcSet: mobileSrcSet } } = getImageProps({ ...mobile, alt: project.alt, sizes: mobileSizes });
            return (
              <li key={project.id} className={styles.item} style={{
                "--project-row": index + 1, "--mobile-aspect": `${mobile.width} / ${mobile.height}`,
                "--desktop-aspect": `${desktop.width} / ${desktop.height}`,
              } as CSSProperties}>
                <h3 className={styles.title}>
                  <button
                    id={`projeto-${project.id}`} type="button" className={styles.select}
                    aria-label={`Selecionar prévia de ${project.title}`}
                    aria-pressed={activeProject === project.id}
                    aria-controls={`preview-${project.id}`} aria-describedby="projetos-instrucoes"
                    data-project-select={project.id}
                    onPointerEnter={event => {
                      if (event.pointerType !== "touch" && matchMedia("(min-width: 64rem) and (hover: hover) and (pointer: fine)").matches) select(project.id);
                    }}
                    onFocus={() => select(project.id)}
                    onClick={() => {
                      select(project.id);
                      setAnnouncement(`Prévia de ${project.title} selecionada. Estudo de caso ainda não disponível.`);
                    }}
                  >
                    <span className={`label ${styles.index}`} aria-hidden="true">{project.index}</span>
                    <span>{project.title}</span>
                  </button>
                </h3>
                <figure id={`preview-${project.id}`} className={styles.preview} data-project-preview={project.id}>
                  <picture>
                    <source media="(max-width: 1023px)" srcSet={mobileSrcSet} sizes={mobileSizes} />
                    <Image {...desktop} alt={project.alt} sizes={desktopSizes} className={styles.image} />
                  </picture>
                </figure>
              </li>
            );
          })}
        </ol>
        <p className={styles.assistive} role="status" aria-live="polite">{announcement}</p>
      </div>
    </section>
  );
}
