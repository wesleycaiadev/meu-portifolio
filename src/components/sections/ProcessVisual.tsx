import { processSteps, type ProcessState } from "@/data/process";
import styles from "./Process.module.scss";

// One stable composition: a future ScrollTrigger controller can interpolate its layers.
// All explanatory information remains in HTML outside the decorative illustration.
export function ProcessVisual({ state }: { state: ProcessState }) {
  return <figure className={styles.figure} id="processo-visual" aria-labelledby="processo-legenda" data-process-state={state}>
    <div className={styles.drawing} aria-hidden="true">
      <svg className={styles.guides} data-process-guides="" viewBox="0 0 600 440" preserveAspectRatio="none" focusable="false">
        <path d="M28 0V440M572 0V440M0 36H600M0 404H600M320 0V440M0 110H600M0 348H600" />
      </svg>
      <div className={styles.interface} data-process-layer="frame">
        <div className={styles.interfaceHeader} data-process-layer="navigation">
          <span className={styles.brand}>Wesley Caiã</span><span className={styles.navigation}>Projetos <span>Contato</span></span>
        </div>
        <div className={styles.interfaceBody}>
          <div className={styles.interfaceCopy} data-process-layer="content">
            <div className={styles.wireTitle} data-process-wire="title"><i /><i /><i /></div>
            <p className={styles.interfaceTitle}>Experiências<br />com <em>identidade.</em></p>
            <div className={styles.wireText} data-process-wire="text"><i /><i /><i /></div>
            <p className={styles.interfaceText}>Estrutura, interface e movimento em uma mesma direção.</p>
            <span className={styles.interfaceLink}>Conheça o trabalho <span>↗</span></span>
          </div>
          <div className={styles.interfaceImage} data-process-layer="identity">
            <div className={styles.imageGuides} />
            <svg className={styles.mark} viewBox="300 440 420 230" focusable="false">
              <defs><filter id="process-wc-matte" filterUnits="userSpaceOnUse" x="300" y="440" width="420" height="230" colorInterpolationFilters="sRGB">
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.2126 -0.7152 -0.0722 0 1" />
                <feComponentTransfer><feFuncA type="linear" slope="1.111111" intercept="-0.111111" /></feComponentTransfer>
              </filter></defs>
              <image href="/assets/brand/logo-symbol.svg" width="1080" height="1080" filter="url(#process-wc-matte)" />
            </svg>
          </div>
        </div>
        <div className={styles.interfaceFooter} data-process-layer="detail"><span>Design e desenvolvimento</span><span>Wesley Caiã</span></div>
      </div>
      <span className={styles.corner} data-corner="start" /><span className={styles.corner} data-corner="end" />
    </div>
    <figcaption id="processo-legenda">{processSteps.map(step => <div key={step.id} className={styles.caption} data-process-caption={step.id} data-active={state === step.id} aria-hidden={state !== step.id}>
      <span>{step.number} — {step.title}</span><p>{step.visualDescription}</p>
    </div>)}</figcaption>
  </figure>;
}
