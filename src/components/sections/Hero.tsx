import { ShinyButton } from "@/components/ui/shiny-button";
import { WcIdentity } from "@/components/three/WcIdentity";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section id="inicio" className={`container ${styles.hero}`} aria-label="Início">
      <div className={styles.brandStage}>
        <WcIdentity />
      </div>
      <nav className={styles.navigation} aria-label="Navegação principal">
        <ul>
          <li><ShinyButton href="#projetos">Projetos</ShinyButton></li>
          <li><ShinyButton href="#sobre">Sobre</ShinyButton></li>
          <li><ShinyButton href="#contato">Contato</ShinyButton></li>
        </ul>
      </nav>
    </section>
  );
}
