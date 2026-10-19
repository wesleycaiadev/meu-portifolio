"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { aiDevelopmentApproach, expertiseGroups, expertiseTechnologies, technologyProjects, type ExpertiseTechnology } from "@/data/expertise";
import { TechnologyLogo } from "./TechnologyLogo";
import { endSectionPreview } from "@/lib/motion/sectionPreview";
import styles from "./Expertise.module.scss";

function TechnologyDetails({ technology }: { technology: ExpertiseTechnology }) {
  const projects = technologyProjects(technology.icon);
  return <>
    <div className={styles.detailIdentity}>
      <TechnologyLogo technology={technology} />
      <h3>{technology.name}</h3>
    </div>
    <p className={styles.description}>{technology.description}</p>
    {projects.length > 0 && <div className={styles.applications}>
      <p>Aplicada em</p>
      <ul role="list">{projects.map(project => <li key={project.href}>
        <Link href={project.href}>{project.label}<span aria-hidden="true">↗</span></Link>
      </li>)}</ul>
    </div>}
  </>;
}

export function Expertise() {
  const section = useRef<HTMLElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [engaged, setEngaged] = useState(false);
  const technology = expertiseTechnologies.find(item => item.icon === selected);
  const select = (icon: string | null) => { setSelected(icon); setEngaged(icon !== null); };

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const viewport = matchMedia("(min-width: 48rem) and (pointer: fine)");
    let preview = process.env.NODE_ENV === "development" && new URLSearchParams(location.search).get("motion") === "preview";
    const lifetime = new AbortController();
    let disposed = false, generation = 0;
    let release: (() => void) | undefined;
    const eligible = () => viewport.matches;
    const reconcile = () => {
      const version = ++generation;
      release?.(); release = undefined;
      element.dataset.expertiseMotion = "static";
      element.dataset.motionPreview = String(preview);
      if (!eligible()) return;
      void import("@/lib/motion/expertiseMotion").then(async ({ createExpertiseMotion }) => {
        await document.fonts.ready;
        if (disposed || version !== generation || !eligible()) return;
        release = createExpertiseMotion(element);
      }).catch(() => { if (!disposed) element.dataset.expertiseMotion = "unavailable"; });
    };
    viewport.addEventListener("change", reconcile, { signal: lifetime.signal });
    window.addEventListener("section-motion-preview-end", () => { preview = false; reconcile(); }, { signal: lifetime.signal });
    reconcile();
    return () => { disposed = true; generation++; lifetime.abort(); release?.(); };
  }, []);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, icon: string) {
    if (event.key === "Escape") { select(null); return; }
    const index = expertiseTechnologies.findIndex(item => item.icon === icon);
    const direction = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (direction === undefined && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? expertiseTechnologies.length - 1
      : (index + direction! + expertiseTechnologies.length) % expertiseTechnologies.length;
    const target = expertiseTechnologies[next];
    if (target) event.currentTarget.closest("section")?.querySelector<HTMLButtonElement>(`[data-technology="${target.icon}"]`)?.focus();
  }

  return (
    <section ref={section} id="expertise" className={`surface--dark ${styles.section}`} aria-labelledby="expertise-titulo" data-expertise="" data-selected-technology={selected ?? ""} tabIndex={-1}>
      <div className="container">
        {process.env.NODE_ENV === "development" && <p className={styles.previewNote}>Prévia de motion em desenvolvimento. <button type="button" onClick={endSectionPreview}>Voltar à preferência do sistema</button></p>}
        <header className={styles.header}>
          <p className={styles.label}>Expertise</p>
          <h2 id="expertise-titulo" className={styles.heading}>Entre estrutura,<br />interface e <em>movimento.</em></h2>
          <p className={styles.intro}>Combino ferramentas de desenvolvimento, design e interação para construir experiências digitais com identidade, consistência e atenção aos detalhes.</p>
        </header>
        <div className={styles.workbench} data-engaged={engaged}>
          <div className={styles.atlas} data-expertise-atlas="">
            {!technology && <p className={styles.mobileInstruction}>Selecione uma tecnologia para conhecer sua função e onde foi aplicada.</p>}
            {expertiseGroups.map(group => (
              <div key={group.id} className={styles.group} data-expertise-group={group.id}>
                <h3 className={styles.groupTitle}>{group.title}</h3>
                <ul className={styles.symbols} role="list">
                  {group.technologies.map(item => (
                    <li key={item.icon}>
                      <button type="button" className={styles.technology} data-technology={item.icon} aria-pressed={selected === item.icon} aria-controls={`expertise-detalhe expertise-detalhe-${group.id}`}
                        onFocus={() => select(item.icon)} onClick={() => select(item.icon)} onKeyDown={event => navigate(event, item.icon)}
                        onPointerMove={event => {
                          if (event.pointerType !== "mouse") return;
                          const previous = pointer.current;
                          if (!previous || previous.x !== event.clientX || previous.y !== event.clientY) {
                            pointer.current = { x: event.clientX, y: event.clientY }; select(item.icon);
                          }
                        }}>
                        <TechnologyLogo technology={item} />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div id={`expertise-detalhe-${group.id}`} className={styles.inlineDetail} aria-live="polite" aria-atomic="true">
                  {technology && group.technologies.some(item => item.icon === selected) && <TechnologyDetails technology={technology} />}
                </div>
                {group.id === "design" && <div className={styles.approach}>
                  <h4>{aiDevelopmentApproach.title}</h4>
                  <p>{aiDevelopmentApproach.description}</p>
                </div>}
              </div>
            ))}
          </div>
          <aside className={styles.detail} id="expertise-detalhe" aria-label="Tecnologia selecionada" aria-live="polite" aria-atomic="true">
            {technology ? <TechnologyDetails technology={technology} />
              : <p className={styles.instruction}>Selecione uma tecnologia<br />para conhecer sua função.</p>}
          </aside>
        </div>
        <noscript><dl className={styles.staticDetails}>
          {expertiseTechnologies.map(item => <div key={item.icon}><dt>{item.name}</dt><dd>{item.description}{technologyProjects(item.icon).length > 0 && ` Usada em: ${technologyProjects(item.icon).map(project => project.label).join(", ")}.`}</dd></div>)}
        </dl></noscript>
      </div>
    </section>
  );
}
