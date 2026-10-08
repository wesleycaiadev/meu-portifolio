"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { spaObjectContent } from "@/data/projectObject";
import type { ProjectObjectController, ProjectObjectView } from "@/lib/three/projectObject";
import styles from "./ProjectObjectPlayground.module.scss";

export function ProjectObjectPlayground() {
  const stage = useRef<HTMLDivElement>(null);
  const controller = useRef<ProjectObjectController | null>(null);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [previewMotion, setPreviewMotion] = useState(false);
  const [view, setView] = useState<ProjectObjectView>("front");
  const [message, setMessage] = useState("Carregando a estrutura e as capturas do SpaSmooth.");

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let generation = 0;
    const reconcile = () => {
      const ticket = ++generation;
      controller.current?.destroy(); controller.current = null;
      setReady(false);
      setReducedMotion(reduced.matches);
      if (reduced.matches && !previewMotion) {
        setReady(false);
        setMessage("Movimento reduzido: captura estática do projeto.");
        return;
      }
      void import("@/lib/three/projectObject").then(({ createProjectObject }) => {
        if (disposed || ticket !== generation) return;
        try {
          controller.current = createProjectObject(element, spaObjectContent, {
            onStatus: (available, text) => { if (!disposed) { setReady(available); setMessage(text); } },
            onView: value => { if (!disposed) setView(value); },
          });
        } catch {
          setReady(false); setMessage("WebGL indisponível: captura estática do projeto.");
        }
      }).catch(() => {
        if (!disposed) { setReady(false); setMessage("Não foi possível iniciar o 3D. A captura permanece disponível."); }
      });
    };
    reconcile();
    reduced.addEventListener("change", reconcile);
    return () => {
      disposed = true; generation++; reduced.removeEventListener("change", reconcile);
      controller.current?.destroy(); controller.current = null;
    };
  }, [previewMotion]);

  const select = (value: ProjectObjectView) => controller.current?.setView(value);

  return (
    <main className={`surface--dark ${styles.page}`}>
      <header className={styles.header}>
        <div><p className="label text-secondary">TASK 09 · Protótipo isolado</p><h1>Estrutura editorial articulada</h1></div>
        <Link href="/">Voltar ao portfólio</Link>
      </header>
      <div className={styles.workspace}>
        <section className={styles.viewer} aria-labelledby="objeto-titulo">
          <h2 id="objeto-titulo" className={styles.caption}>SpaSmooth</h2>
          <div ref={stage} className={styles.stage} tabIndex={0} role="group"
            aria-label="Explorar o objeto 3D. Arraste ou use as setas. Escape restaura a visão frontal."
            aria-describedby="objeto-instrucoes" data-project-object="" data-object-ready={ready}>
            <div className={styles.fallback} hidden={ready}>
              <Image src={spaObjectContent.main.src} width={spaObjectContent.main.width} height={spaObjectContent.main.height}
                alt="Captura real do Hero desktop do SpaSmooth" sizes="(max-width: 767px) 90vw, 70vw" priority />
            </div>
          </div>
          <p id="objeto-instrucoes" className={styles.instructions}>Arraste para explorar a profundidade. Use as setas para girar e Escape para restaurar.</p>
        </section>
        <aside className={styles.controls} aria-label="Controles do protótipo">
          <p className="label text-secondary">Câmera e articulação</p>
          <div className={styles.buttons}>
            {reducedMotion && <button type="button" aria-pressed={previewMotion}
              onClick={() => setPreviewMotion(value => !value)}>
              {previewMotion ? "Respeitar movimento reduzido" : "Ativar 3D para avaliação"}
            </button>}
            <button type="button" disabled={!ready} aria-pressed={view === "front"} onClick={() => select("front")}>A · Frontal</button>
            <button type="button" disabled={!ready} aria-pressed={view === "quarter"} onClick={() => select("quarter")}>B · Três quartos</button>
            <button type="button" disabled={!ready} aria-pressed={view === "expanded"} onClick={() => select("expanded")}>C · Expandido</button>
            <button type="button" disabled={!ready} onClick={() => controller.current?.demonstrate()}>Demonstrar articulação</button>
            <button type="button" disabled={!ready} onClick={() => controller.current?.reset()}>Reset</button>
          </div>
          <p className={styles.status} role="status" aria-live="polite">{message}</p>
          {reducedMotion && <p className={styles.instructions}>A ativação é opcional e vale somente nesta prévia. A preferência do sistema permanece igual.</p>}
          <dl>
            <div><dt>Superfícies</dt><dd>5 painéis com espessura e dobradiças.</dd></div>
            <div><dt>Conteúdo real</dt><dd>Hero desktop, Hero mobile e localização.</dd></div>
            <div><dt>Estrutura</dt><dd>Diagonais e curvas em torno de um núcleo central.</dd></div>
          </dl>
          <p className="label text-secondary">Ambiente de desenvolvimento. Sem integração com a home.</p>
        </aside>
      </div>
    </main>
  );
}
