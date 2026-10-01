import Link from "next/link";
import styles from "./TemporaryHeader.module.scss";

export function TemporaryHeader() {
  return (
    <header className={styles.header}>
      <div className="container editorial-grid">
        <div className={styles.identity}>
          <span className={styles.name}>Wesley Caia</span>
          <span className="label text-secondary">Header temporário</span>
        </div>
        <nav className={styles.navigation} aria-label="Navegação principal">
          <ul>
            <li><Link href="/#projetos">Projetos</Link></li>
            <li><Link href="/#sobre">Sobre</Link></li>
            <li><Link href="/#contato">Contato</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
