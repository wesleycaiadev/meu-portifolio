"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { caseTabs, type CaseTab, type ProjectCaseData } from "@/data/projectCase";
import type { ProjectCaseController } from "@/lib/three/projectCase";
import { ProjectCaseNavigation } from "./ProjectCaseNavigation";
import { ProjectCaseCaptures } from "./ProjectCaseCaptures";
import { ProjectCaseContent } from "./ProjectCaseContent";
import { ProjectCaseControls } from "./ProjectCaseControls";
import styles from "./ProjectCase.module.scss";
import { useProjectTransition } from "@/components/motion/ProjectTransitionProvider";

export function ProjectCase({ project, preview = false }: { project: ProjectCaseData; preview?: boolean }) {
  const casePath = project.path;
  const transition = useProjectTransition();
  const stage = useRef<HTMLDivElement>(null);
  const editorial = useRef<HTMLElement>(null);
  const controller = useRef<ProjectCaseController | null>(null);
  const readingState = useRef(false);
  const tabButtons = useRef<Partial<Record<CaseTab, HTMLButtonElement | null>>>({});
  const [tab, setTab] = useState<CaseTab>("about");
  const [reading, setReading] = useState(false);
  const [phase, setPhase] = useState("loading");
  const [threeReady, setThreeReady] = useState(false);
  const [status, setStatus] = useState("Preparando as capturas do projeto.");

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const narrow = matchMedia("(max-width: 767px), (pointer: coarse)");
    let disposed = false, generation = 0;
    let appliedPreferences: string | undefined;
    let loadingTimeout: ReturnType<typeof setTimeout> | undefined;
    const clearLoadingTimeout = () => { clearTimeout(loadingTimeout); loadingTimeout = undefined; };
    const showStatic = (text: string) => {
      clearLoadingTimeout();
      setThreeReady(false); setPhase("static"); setStatus(text);
      editorial.current?.style.setProperty("--case-reveal", "1");
      transition.finish(casePath);
    };
    const cinematic = transition.pending(casePath);
    const unbindTransition = transition.bind(casePath, () => {
      if (disposed) return;
      if (controller.current?.completeEntrance()) return;
      generation++; controller.current?.destroy(); controller.current = null;
      showStatic("Explore o projeto pelas capturas estáticas.");
    });
    const reconcile = () => {
      // Some viewport changes emit a media event without changing the layout.
      const preferences = String(narrow.matches);
      if (preferences === appliedPreferences) return;
      appliedPreferences = preferences;
      const ticket = ++generation;
      clearLoadingTimeout();
      controller.current?.destroy(); controller.current = null;
      if (narrow.matches) {
        showStatic("Versão simplificada: explore as capturas por toque ou teclado.");
        return;
      }
      setThreeReady(false); setPhase("loading");
      editorial.current?.style.setProperty("--case-reveal", "0");
      loadingTimeout = setTimeout(() => {
        if (disposed || ticket !== generation) return;
        generation++; controller.current?.destroy(); controller.current = null;
        showStatic("Explore o projeto pelas capturas enquanto a apresentação 3D está indisponível.");
      }, 12000);
      void import("@/lib/three/projectCase").then(({ createProjectCase }) => {
        if (disposed || ticket !== generation) return;
        try {
          controller.current = createProjectCase(element, project.captures, {
            onPhase: value => {
              if (disposed || ticket !== generation) return;
              clearLoadingTimeout();
              setPhase(value); setThreeReady(value !== "error");
              if (value === "ready") controller.current?.setReading(readingState.current);
              if (value === "ready") transition.finish(casePath);
              if (value === "error") showStatic("A apresentação 3D não pôde iniciar. Explore as capturas estáticas.");
              else setStatus(value === "ready" ? "Apresentação aberta. Role sobre a tela para explorar as capturas." : `Abrindo a apresentação do ${project.name}.`);
            },
            onReveal: progress => {
              if (!disposed && ticket === generation) editorial.current?.style.setProperty("--case-reveal", String(progress));
            },
            ...(cinematic ? { onTransferReady: (destination: import("@/lib/motion/projectTransition").ProjectTransitionDestination) => {
              if (disposed || ticket !== generation) return false;
              return transition.connect(casePath, destination);
            } } : {}),
          }, { screenFit: project.screenFit });
        } catch {
          showStatic("WebGL indisponível. Explore as capturas estáticas do projeto.");
        }
      }).catch(() => {
        if (!disposed && ticket === generation) showStatic("A prévia não pôde carregar. As capturas permanecem disponíveis.");
      });
    };
    reconcile(); narrow.addEventListener("change", reconcile);
    return () => {
      disposed = true; generation++; narrow.removeEventListener("change", reconcile);
      unbindTransition();
      clearLoadingTimeout();
      controller.current?.destroy(); controller.current = null;
    };
  }, [transition, project, casePath]);

  const selectTab = (value: CaseTab) => {
    readingState.current = true; setTab(value); setReading(true); controller.current?.setReading(true);
  };
  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, current: CaseTab) => {
    const index = caseTabs.findIndex(item => item.id === current);
    const next = event.key === "ArrowRight" ? (index + 1) % caseTabs.length
      : event.key === "ArrowLeft" ? (index + caseTabs.length - 1) % caseTabs.length
      : event.key === "Home" ? 0 : event.key === "End" ? caseTabs.length - 1 : -1;
    if (next < 0) return;
    const nextTab = caseTabs[next];
    if (!nextTab) return;
    event.preventDefault(); const id = nextTab.id; selectTab(id); tabButtons.current[id]?.focus();
  };
  const overview = () => {
    readingState.current = false;
    setReading(false);
    setTab("about");
    controller.current?.setReading(false);
    // The overview button unmounts; keep keyboard focus on the visible tablist.
    tabButtons.current.about?.focus();
  };
  const replay = () => { readingState.current = false; setReading(false); setTab("about"); controller.current?.replay(); };
  const available = phase === "ready" || phase === "static";

  return (
    <main className={`surface--dark ${styles.page}`} data-project-case-interactive="" data-case-project={project.slug}>
      <ProjectCaseNavigation projectId={project.slug} />
      <div className={styles.composition} data-reading={reading} data-case-composition="">
        <article ref={editorial} className={styles.editorial} aria-labelledby="case-title">
          <p className={`label ${styles.category}`}>{project.category}</p>
          <h1 id="case-title">{project.name}</h1>
          <p className={styles.description}>{project.description}</p>
          <div className={styles.tabs} role="tablist" aria-label={`Informações do ${project.name}`}>
            {caseTabs.map(item => <button key={item.id} type="button" role="tab" id={`case-tab-${item.id}`}
              ref={el => { tabButtons.current[item.id] = el; }}
              disabled={!available} aria-selected={tab === item.id} aria-controls="case-panel"
              tabIndex={tab === item.id ? 0 : -1} onClick={() => selectTab(item.id)} onKeyDown={event => handleTabKey(event, item.id)}>
              {item.label}
            </button>)}
          </div>
          <div className={styles.panel} role="tabpanel" id="case-panel" aria-labelledby={`case-tab-${tab}`} tabIndex={0}>
            {reading ? <div key={tab} className={styles.panelContent}>
              <ProjectCaseContent project={project} tab={tab} />
            </div> : <p className={styles.summary}>{project.summary}</p>}
          </div>
          {reading && <button className={styles.overview} type="button" onClick={overview}>Voltar à visão do projeto</button>}
        </article>
        <section className={styles.visual} aria-label={`Exploração visual do ${project.name}`}>
          <div ref={stage} className={styles.stage} data-case-stage="" data-three-ready={threeReady}
            tabIndex={threeReady ? 0 : -1} role="group" aria-label={`Tela do ${project.name}. Use setas para cima e para baixo, Page Up e Page Down para rolar as capturas.`}
            aria-describedby="case-screen-help">
            <ProjectCaseCaptures project={project} hidden={threeReady || phase === "loading"} />
            {phase === "loading" && <p className={styles.loading} role="status">Carregando a apresentação do {project.name}.</p>}
          </div>
          <p id="case-screen-help" className={styles.screenHelp}>
            {threeReady ? "Role sobre a tela para explorar. Arraste fora dela para ajustar o ângulo."
              : "Role dentro da imagem para explorar as capturas."}
          </p>
          <p className={styles.captureNote}>{project.simulationNote}</p>
        </section>
      </div>
      {process.env.NODE_ENV === "development" && preview && <ProjectCaseControls
        threeReady={threeReady} available={available} status={status} replay={replay}
        reset={() => { overview(); controller.current?.reset(); }} />}
    </main>
  );
}
