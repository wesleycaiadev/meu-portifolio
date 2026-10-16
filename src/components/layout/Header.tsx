import styles from "./Header.module.scss";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Header({ heading = false }: { heading?: boolean }) {
  const Identity = heading ? "h1" : "p";

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Identity className={styles.identity}><BrandLogo /></Identity>
      </div>
    </header>
  );
}
