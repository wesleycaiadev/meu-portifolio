import Image from "next/image";
import { AboutReveal } from "@/components/motion/AboutReveal";
import styles from "./About.module.scss";

export function About() {
  return (
    <AboutReveal className={`surface--dark ${styles.about}`}>
      <div className={`container ${styles.composition}`}>
        <div className={styles.copy}>
          {/* Revisable editorial copy: direction for review, not a factual biography. */}
          <h2 id="sobre-titulo" className={styles.heading} data-about-heading="">
            Eu transformo ideias em experiências digitais que unem estrutura,
            {" "}<span className="editorial-emphasis" data-about-emphasis="">identidade</span>
            {" "}e movimento.
          </h2>
          <p className={styles.description} data-about-description="">
            Da primeira ideia ao último ajuste, o processo conecta intenção,
            forma e interação. Sempre com espaço para experimentar e refinar.
          </p>
        </div>
        <figure className={styles.portrait} data-about-portrait="">
          <Image
            className={styles.image}
            src="/assets/photos/portrait-about.webp?v=2"
            alt="Retrato de Wesley Caia usando uma blusa verde, sobre um fundo escuro."
            width={896}
            height={1195}
            // Serve the lossless asset directly, preserving the supplied resolution.
            unoptimized
            data-about-image=""
          />
        </figure>
      </div>
    </AboutReveal>
  );
}
