import Image from "next/image";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { projects } from "@/data/site";

export function Projects() {
  return (
    <section id="projetos" className="section projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-heading"><h2 id="projects-title">Projetos selecionados</h2><p>Projetos reais e decisões digitais fundamentadas em performance, fluidez e impacto.</p></div>
        <div className="projects__list">
          {projects.map((project, index) => (
            <article className={`project ${index % 2 ? "project--reverse" : ""}`} key={project.name}>
              <div className="project__image"><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 760px) 100vw, 56vw" /></div>
              <div className="project__content">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <ul className="project__stack" aria-label="Tecnologias e disciplinas">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
                <button className="project__link" type="button" disabled title="Estudo de caso em preparação">Explorar projeto <ArrowIcon /></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
