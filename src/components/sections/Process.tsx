"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { processSteps } from "@/data/process";
import { ProcessVisual } from "./ProcessVisual";
import styles from "./Process.module.scss";
import type { ProcessMotionController } from "@/lib/motion/processMotion";
import { endSectionPreview } from "@/lib/motion/sectionPreview";

export function Process() {
  const [selected, setSelected] = useState(0);
  const section = useRef<HTMLElement>(null);
  const controller = useRef<ProcessMotionController | null>(null);
  const currentStep = processSteps[selected] ?? processSteps[0];

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = matchMedia("(min-width: 64rem) and (pointer: fine)");
    let preview = process.env.NODE_ENV === "development" && new URLSearchParams(location.search).get("motion") === "preview";
    const lifetime = new AbortController();
    let disposed = false, generation = 0;
    const eligible = () => viewport.matches && (preview || !preference.matches);
    const reconcile = () => {
      const version = ++generation;
      controller.current?.destroy(); controller.current = null;
      element.dataset.processMotion = "static";
      element.dataset.motionPreview = String(preview);
      if (!eligible()) return;
      void import("@/lib/motion/processMotion").then(async ({ createProcessMotion }) => {
        await document.fonts.ready;
        if (disposed || version !== generation || !eligible()) return;
        controller.current = createProcessMotion(element, setSelected);
      }).catch(() => { if (!disposed) element.dataset.processMotion = "unavailable"; });
    };
    preference.addEventListener("change", reconcile, { signal: lifetime.signal });
    viewport.addEventListener("change", reconcile, { signal: lifetime.signal });
    window.addEventListener("section-motion-preview-end", () => { preview = false; reconcile(); }, { signal: lifetime.signal });
    reconcile();
    return () => { disposed = true; generation++; lifetime.abort(); controller.current?.destroy(); controller.current = null; };
  }, []);

  const select = (index: number) => {
    if (controller.current) controller.current.select(index);
    else setSelected(index);
  };

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const direction = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (direction === undefined && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? processSteps.length - 1
      : (index + direction! + processSteps.length) % processSteps.length;
    const target = processSteps[next];
    if (target) {
      event.currentTarget.closest("ol")?.querySelector<HTMLButtonElement>(`[data-process-step="${target.id}"]`)?.focus({ preventScroll: true });
      select(next);
    }
  }

  return <section ref={section} id="processo" className={`surface--light ${styles.section}`} aria-labelledby="processo-titulo" data-process="" data-selected-step={currentStep.id} tabIndex={-1}>
    <div className={styles.threshold} aria-hidden="true" data-section-threshold="" />
    <div className="container">
      {process.env.NODE_ENV === "development" && <p className={styles.previewNote}>Prévia de motion em desenvolvimento. <button type="button" onClick={endSectionPreview}>Voltar à preferência do sistema</button></p>}
      <header className={styles.header}>
        <p className={styles.label}>Processo</p>
        <h2 id="processo-titulo" className={styles.heading}>Da primeira ideia<br />ao <em>último detalhe.</em></h2>
        <p className={styles.intro}>Uma experiência digital ganha forma em decisões que conectam intenção, estrutura e acabamento.</p>
      </header>
      <div className={styles.composition} data-process-composition="">
        <div className={styles.editorial}>
          <ol className={styles.steps} role="list" aria-label="Etapas do processo">
            {processSteps.map((step, index) => <li key={step.id}>
              <button type="button" data-process-step={step.id} aria-pressed={selected === index} aria-controls="processo-visual" onFocus={() => { if (!controller.current) setSelected(index); }} onClick={() => select(index)} onKeyDown={event => navigate(event, index)}>
                <span className={styles.number}>{step.number}</span>
                <span className={styles.stepCopy}><span className={styles.stepTitle}>{step.title}</span><span className={styles.stepDescription}>{step.description}</span></span>
              </button>
            </li>)}
          </ol>
          <div className={styles.progress} role="progressbar" aria-label="Etapas do processo" aria-valuemin={1} aria-valuemax={4} aria-valuenow={selected + 1} aria-valuetext={`Etapa ${selected + 1} de 4: ${currentStep.title}`}>
            <span>{currentStep.number} / 04</span>
            <div aria-hidden="true">{processSteps.map((step, index) => <i key={step.id} data-complete={index <= selected} />)}</div>
          </div>
          <p className={styles.mobileDescription} aria-live="polite">{currentStep.description}</p>
        </div>
        <div className={styles.visualColumn}>
          <p className={`${styles.instruction} ${styles.manualInstruction}`}>Selecione uma etapa para acompanhar a evolução.</p>
          <p className={`${styles.instruction} ${styles.scrollInstruction}`}>Role ou selecione uma etapa para acompanhar a evolução.</p>
          <ProcessVisual state={currentStep.id} />
          <p className={styles.visualNote}>Estudo visual de uma interface. Cada etapa transforma a mesma composição.</p>
        </div>
      </div>
      <noscript><div className={styles.noScript}><p>A visualização mostra o estado inicial.</p><dl>{processSteps.map(step => <div key={step.id}><dt>{step.number} — {step.title}</dt><dd>{step.description}</dd></div>)}</dl></div></noscript>
    </div>
  </section>;
}
