import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import type { ProjectCaseData } from "@/data/projectCase";
import styles from "./ProjectCase.module.scss";

export function ProjectCaseCaptures({ project, hidden = false }: { project: ProjectCaseData; hidden?: boolean }) {
  return <div className={styles.staticScreen} hidden={hidden} tabIndex={hidden ? -1 : 0}
    role="region" aria-label={`Capturas roláveis do ${project.name}`}>
    {project.captures.map((capture, index) => <picture key={capture.src}>
      <ResponsiveImage src={capture.src} width={capture.width} height={capture.height} alt={`${project.name}: ${capture.label}`}
        mobile={index === 0 ? { ...project.mobile, media: "(max-width: 767px)" } : undefined}
        sizes="(max-width: 767px) 90vw, 65vw" unoptimized loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : undefined} />
    </picture>)}
  </div>;
}
