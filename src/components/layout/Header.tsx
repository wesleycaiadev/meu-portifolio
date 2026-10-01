import styles from "./Header.module.scss";

export function Header({ heading = false }: { heading?: boolean }) {
  const Identity = heading ? "h1" : "p";

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Identity className={styles.identity}>Wesley Caia</Identity>
      </div>
    </header>
  );
}
