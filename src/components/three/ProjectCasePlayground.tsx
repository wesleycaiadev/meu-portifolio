"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { caseTabs, spaCase, type CaseTab } from "@/data/projectCase";
import type { ProjectCaseController } from "@/lib/three/projectCase";
import styles from "./ProjectCasePlayground.module.scss";

export function ProjectCasePlayground() {
  const stage = useRef<HTMLDivElement>(null);
  const editorial = useRef<HTMLElement>(null);
  const controller = useRef<ProjectCaseController | null>(null);
  const readingState = useRef(false);
  const tabButtons = useRef<Partial<Record<CaseTab, HTMLButtonElement | null>>>({});
  const [tab, setTab] = useState<CaseTab>("about");
  const [reading, setReading] = useState(false);
  const [phase, setPhase] = useState("loading");
  const [threeReady, setThreeReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [previewMotion, setPreviewMotion] = useState(false);
  const [status, setStatus] = useState("Preparando as capturas do projeto.");

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = matchMedia("(max-width: 767px), (pointer: coarse)");
    let disposed = false, generation = 0;
    let appliedPreferences: string | undefined;
    const showStatic = (text: string) => {
      setThreeReady(false); setPhase("static"); setStatus(text);
      editorial.current?.style.setProperty("--case-reveal", "1");
    };
    const reconcile = () => {
      // Some viewport changes emit a media event without changing either preference.
      const preferences = `${preference.matches}:${narrow.matches}`;
      if (preferences === appliedPreferences) return;
      appliedPreferences = preferences;
      const ticket = ++generation;
      controller.current?.destroy(); controller.current = null;
      setReduced(preference.matches);
      if (narrow.matches || (preference.matches && !previewMotion)) {
        showStatic(narrow.matches ? "Versão simplificada: explore as capturas por toque ou teclado." : "Movimento reduzido: capturas roláveis e conteúdo editorial disponíveis.");
        return;
      }
      setThreeReady(false); setPhase("loading");
      editorial.current?.style.setProperty("--case-reveal", "0");
      void import("@/lib/three/projectCase").then(({ createProjectCase }) => {
        if (disposed || ticket !== generation) return;
        try {
          controller.current = createProjectCase(element, spaCase.captures, {
            onPhase: value => {
              if (disposed || ticket !== generation) return;
              setPhase(value); setThreeReady(value !== "error");
              if (value === "ready") controller.current?.setReading(readingState.current);
              if (value === "error") showStatic("A apresentação 3D não pôde iniciar. Explore as capturas estáticas.");
              else setStatus(value === "ready" ? "Apresentação aberta. Role sobre a tela para explorar as capturas." : "Abrindo a apresentação do SpaSmooth.");
            },
            onReveal: progress => {
              if (!disposed && ticket === generation) editorial.current?.style.setProperty("--case-reveal", String(progress));
            },
          });
        } catch {
          showStatic("WebGL indisponível. Explore as capturas estáticas do projeto.");
        }
      }).catch(() => {
        if (!disposed && ticket === generation) showStatic("A prévia não pôde carregar. As capturas permanecem disponíveis.");
      });
    };
    reconcile(); preference.addEventListener("change", reconcile); narrow.addEventListener("change", reconcile);
    return () => {
      disposed = true; generation++; preference.removeEventListener("change", reconcile); narrow.removeEventListener("change", reconcile);
      controller.current?.destroy(); controller.current = null;
    };
  }, [previewMotion]);

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
  const overview = () => { readingState.current = false; setReading(false); controller.current?.setReading(false); };
  const replay = () => { readingState.current = false; setReading(false); setTab("about"); controller.current?.replay(); };
  const content = spaCase.content[tab];
  const available = phase === "ready" || phase === "static";

  return (
    <main className={`surface--dark ${styles.page}`}>
      <header className={styles.header}><Link href="/">Wesley Caiã</Link><Link href="/#projetos">Voltar aos projetos</Link></header>
      <div className={styles.composition} data-reading={reading} data-case-composition="">
        <article ref={editorial} className={styles.editorial} aria-labelledby="case-title">
          <p className={`label ${styles.category}`}>{spaCase.category}</p>
          <h1 id="case-title">{spaCase.name}</h1>
          <p className={styles.description}>{spaCase.description}</p>
          <div className={styles.tabs} role="tablist" aria-label="Informações do SpaSmooth">
            {caseTabs.map(item => <button key={item.id} type="button" role="tab" id={`case-tab-${item.id}`}
              ref={el => { tabButtons.current[item.id] = el; }}
              disabled={!available} aria-selected={tab === item.id} aria-controls="case-panel"
              tabIndex={tab === item.id ? 0 : -1} onClick={() => selectTab(item.id)} onKeyDown={event => handleTabKey(event, item.id)}>
              {item.label}
            </button>)}
          </div>
          <div className={styles.panel} role="tabpanel" id="case-panel" aria-labelledby={`case-tab-${tab}`} tabIndex={0}>
            {reading ? <div key={tab} className={styles.panelContent}>
              <h2>{content.title}</h2>
              {content.paragraphs.map(text => <p key={text}>{text}</p>)}
              {content.items.length > 0 && <ul>{content.items.map(text => <li key={text}>{text}</li>)}</ul>}
              {"principles" in content && <dl className={styles.designSystem}>
                {content.principles.map(principle => <div key={principle.label}>
                  <dt>{principle.label}</dt><dd>{principle.description}</dd>
                </div>)}
              </dl>}
              {tab === "technologies" && <ul className={styles.technologyList}>
                {spaCase.technologies.map(technology => <li key={technology.name}>
                  <Image src={`/assets/technologies/${technology.icon}.svg`} alt="" width={24} height={24} />
                  <div><span className={styles.technologyName}>{technology.name}</span><span>{technology.role}</span></div>
                </li>)}
              </ul>}
            </div> : <p className={styles.summary}>{spaCase.summary}</p>}
          </div>
          {reading && <button className={styles.overview} type="button" onClick={overview}>Voltar à visão do projeto</button>}
        </article>
        <section className={styles.visual} aria-label="Exploração visual do SpaSmooth">
          <div ref={stage} className={styles.stage} data-case-stage="" data-three-ready={threeReady}
            tabIndex={threeReady ? 0 : -1} role="group" aria-label="Tela do SpaSmooth. Use setas para cima e para baixo, Page Up e Page Down para rolar as capturas."
            aria-describedby="case-screen-help">
            <div className={styles.staticScreen} hidden={threeReady || phase === "loading"} tabIndex={threeReady || phase === "loading" ? -1 : 0}
              role="region" aria-label="Capturas roláveis do SpaSmooth">
              {spaCase.captures.map((capture, index) => <picture key={capture.src}>
                {index === 0 && <source media="(max-width: 767px)" srcSet={spaCase.mobile.src} />}
                <Image src={capture.src} width={capture.width} height={capture.height} alt={`SpaSmooth: ${capture.label}`}
                  sizes="(max-width: 767px) 90vw, 65vw" unoptimized priority={index === 0} />
              </picture>)}
            </div>
          </div>
          <p id="case-screen-help" className={styles.screenHelp}>
            {threeReady ? "Role sobre a tela para explorar. Arraste fora dela para ajustar o ângulo." : "Role dentro da imagem para explorar as capturas."}
          </p>
          <p className={styles.captureNote}>Apresentação, localização e dúvidas frequentes.</p>
        </section>
      </div>
      {process.env.NODE_ENV === "development" && <details className={styles.development} open={reduced}>
        <summary>Controles da prévia</summary>
        <div className={styles.devActions}>
          {reduced && <button type="button" aria-pressed={previewMotion} onClick={() => setPreviewMotion(value => !value)}>
            {previewMotion ? "Respeitar movimento reduzido" : "Ativar abertura 3D nesta prévia"}
          </button>}
          <button type="button" disabled={!threeReady} onClick={replay}>Repetir entrada</button>
          <button type="button" disabled={!available} onClick={() => { overview(); controller.current?.reset(); }}>Resetar exploração</button>
        </div>
        <p role="status">{status}</p>
        <p>Protótipo isolado de desenvolvimento. A ativação opcional não altera a preferência do sistema. Mobile usa a apresentação estática rolável.</p>
      </details>}
    </main>
  );
}
