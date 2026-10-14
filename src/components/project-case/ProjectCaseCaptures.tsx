import Image from "next/image";
import type { ProjectCaseData } from "@/data/projectCase";
import styles from "./ProjectCase.module.scss";

export function ProjectCaseCaptures({ project, hidden = false }: { project: ProjectCaseData; hidden?: boolean }) {
  return <div className={styles.staticScreen} hidden={hidden} tabIndex={hidden ? -1 : 0}
    role="region" aria-label={`Capturas roláveis do ${project.name}`}>
    {project.captures.map((capture, index) => <picture key={capture.src}>
      {index === 0 && <source media="(max-width: 767px)" srcSet={project.mobile.src} />}
      <Image src={capture.src} width={capture.width} height={capture.height} alt={`${project.name}: ${capture.label}`}
        sizes="(max-width: 767px) 90vw, 65vw" unoptimized preload={index === 0} />
    </picture>)}
  </div>;
}
