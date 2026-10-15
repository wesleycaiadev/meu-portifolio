import Image from "next/image";
import type { CSSProperties } from "react";
import { technologyColors, type ExpertiseTechnology } from "@/data/expertise";
import styles from "./Expertise.module.scss";

export function TechnologyLogo({ technology }: { technology: ExpertiseTechnology }) {
  const source = `/assets/technologies/${technology.icon}.svg`;
  return <span className={styles.logo} aria-hidden="true" style={{
    "--technology-color": technologyColors[technology.icon] ?? "var(--text-primary)",
    "--technology-mask": `url("${source}")`,
  } as CSSProperties}>
    <Image src={source} alt="" width={64} height={64} className={styles.monochrome} />
    {technology.multicolor ? <Image src={source} alt="" width={64} height={64} className={styles.brandColor} />
      : <span className={`${styles.brandColor} ${styles.colorMask}`} />}
  </span>;
}
