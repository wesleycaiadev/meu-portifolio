import { contact } from "@/data/contact";
import { FooterYear } from "./FooterYear";
import { BrandLogo } from "@/components/ui/BrandLogo";
import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={`surface--dark ${styles.footer}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.identity}><p className={styles.name}><BrandLogo variant="lockup" inverse /></p><p className={styles.role}>{contact.role}</p></div>
        <p className={styles.year}><FooterYear initialYear={new Date().getFullYear()} /></p>
        <a href="#conteudo" className={styles.top}>Voltar ao início</a>
      </div>
    </footer>
  );
}
