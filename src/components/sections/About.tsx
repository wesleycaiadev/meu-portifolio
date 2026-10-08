import Image from "next/image";
import { AboutReveal } from "@/components/motion/AboutReveal";
import { RevealText } from "@/components/ui/reveal-text";
import styles from "./About.module.scss";

export function About() {
  return (
    <AboutReveal className={`surface--dark ${styles.about}`}>
      <div className={`container ${styles.composition}`}>
        <div className={styles.copy}>
          {/* Copy supplied by Wesley for TASK 06.1. */}
          <RevealText
            as="h2" id="sobre-titulo" className={styles.heading} data-about-heading=""
            mode="characters" range={[0.10, 0.84]} itemSpan={0.14} yOffset={12} blur={6}
            mobile={{ range: [0.10, 0.84], yOffset: 8, blur: 4 }}
          >
            Transformo ideias em experiências digitais que ganham forma entre design,
            {" "}código e <span className="editorial-emphasis">movimento</span>.
          </RevealText>
          <RevealText
            as="p" className={styles.description} data-about-description=""
            mode="characters" range={[0.58, 0.98]} itemSpan={0.10} yOffset={6} blur={3}
            mobile={{ range: [0.58, 0.98], blur: 2 }}
          >
            Meu nome é Wesley Caiã. Gosto de partir de uma ideia ainda solta e construir,
            etapa por etapa, uma interface com identidade pensando no visual, na experiência
            e em como tudo funciona quando chega às mãos de quem vai usar.
          </RevealText>
        </div>
        <figure className={styles.portrait} data-about-portrait="">
          <Image
            className={styles.image}
            src="/assets/photos/portrait-about.webp?v=2"
            alt="Retrato de Wesley Caiã usando uma blusa verde, sobre um fundo escuro."
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
