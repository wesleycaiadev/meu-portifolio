import { caseTabs, spaCase } from "@/data/projectCase";
import { ProjectCaseNavigation } from "./ProjectCaseNavigation";
import { ProjectCaseCaptures } from "./ProjectCaseCaptures";
import { ProjectCaseContent } from "./ProjectCaseContent";
import styles from "./ProjectCase.module.scss";

// Essential content and native disclosure navigation remain usable without hydration.
export function ProjectCaseNoScript() {
  return <noscript>
    <style>{"[data-project-case-interactive] { display: none !important; }"}</style>
    <main className={`surface--dark ${styles.page}`}>
      <ProjectCaseNavigation />
      <div className={styles.composition}>
        <article className={styles.editorialStatic} aria-labelledby="case-static-title">
          <p className={`label ${styles.category}`}>{spaCase.category}</p>
          <h1 id="case-static-title">{spaCase.name}</h1>
          <p className={styles.description}>{spaCase.description}</p>
          <div className={styles.panel}>
            {caseTabs.map(tab => <details key={tab.id} className={styles.staticDetail} open={tab.id === "about"}>
              <summary>{tab.label}</summary><ProjectCaseContent tab={tab.id} />
            </details>)}
          </div>
        </article>
        <section className={styles.visual} aria-label="Exploração visual do SpaSmooth">
          <div className={styles.stage}><ProjectCaseCaptures /></div>
          <p className={styles.screenHelp}>Role dentro da imagem para explorar as capturas.</p>
          <p className={styles.captureNote}>Prévia visual em capturas. Apresentação, localização e dúvidas frequentes.</p>
        </section>
      </div>
    </main>
  </noscript>;
}
