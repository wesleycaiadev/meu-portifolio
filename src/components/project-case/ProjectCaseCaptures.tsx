import Image from "next/image";
import { spaCase } from "@/data/projectCase";
import styles from "./ProjectCase.module.scss";

export function ProjectCaseCaptures({ hidden = false }: { hidden?: boolean }) {
  return <div className={styles.staticScreen} hidden={hidden} tabIndex={hidden ? -1 : 0}
    role="region" aria-label="Capturas roláveis do SpaSmooth">
    {spaCase.captures.map((capture, index) => <picture key={capture.src}>
      {index === 0 && <source media="(max-width: 767px)" srcSet={spaCase.mobile.src} />}
      <Image src={capture.src} width={capture.width} height={capture.height} alt={`SpaSmooth: ${capture.label}`}
        sizes="(max-width: 767px) 90vw, 65vw" unoptimized priority={index === 0} />
    </picture>)}
  </div>;
}
