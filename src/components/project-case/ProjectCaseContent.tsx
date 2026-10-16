import Image from "next/image";
import type { CaseTab, ProjectCaseData } from "@/data/projectCase";
import styles from "./ProjectCase.module.scss";

export function ProjectCaseContent({ project, tab }: { project: ProjectCaseData; tab: CaseTab }) {
  const content = project.content[tab];
  return <>
    <h2>{content.title}</h2>
    {content.paragraphs.map(text => <p key={text}>{text}</p>)}
    {tab === "about" && <p>{project.participation}</p>}
    {content.items.length > 0 && <ul>{content.items.map(text => <li key={text}>{text}</li>)}</ul>}
    {content.principles && <dl className={styles.designSystem}>
      {content.principles.map(principle => <div key={principle.label}>
        <dt>{principle.label}</dt><dd>{principle.description}</dd>
      </div>)}
    </dl>}
    {tab === "technologies" && <ul className={styles.technologyList}>
      {project.technologies.map(technology => <li key={technology.name}>
        <Image src={`/assets/technologies/${technology.icon}.svg`} alt="" width={24} height={24} />
        <div><span className={styles.technologyName}>{technology.name}</span><span>{technology.role}</span></div>
      </li>)}
    </ul>}
    {tab === "about" && project.links.length > 0 && <ul>
      {project.links.map(link => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a></li>)}
    </ul>}
  </>;
}
