import { BorderLink } from "@/components/ui/BorderLink";
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
          <li><BorderLink href="#projetos">Projetos</BorderLink></li>
          <li><BorderLink href="#sobre">Sobre</BorderLink></li>
          <li><BorderLink href="#contato">Contato</BorderLink></li>
        </ul>
      </nav>
    </section>
  );
}
