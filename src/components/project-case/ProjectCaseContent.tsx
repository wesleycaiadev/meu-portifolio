import Image from "next/image";
import { spaCase, type CaseTab } from "@/data/projectCase";
import styles from "./ProjectCase.module.scss";

export function ProjectCaseContent({ tab }: { tab: CaseTab }) {
  const content = spaCase.content[tab];
  return <>
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
  </>;
}
