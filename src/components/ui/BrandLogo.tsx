import Image from "next/image";
import styles from "./BrandLogo.module.scss";

export function BrandLogo({ variant = "compact", inverse = false }: { variant?: "compact" | "lockup"; inverse?: boolean }) {
  const compact = variant === "compact";
  return <span className={`${styles.brand} ${compact ? styles.compact : styles.lockup}`}>
    <Image src={`/assets/brand/brand-${variant}.svg`} alt="Wesley Caiã"
      width={compact ? 507 : 1232} height={compact ? 58 : 145}
      unoptimized className={styles.image} data-inverse={inverse} />
  </span>;
}
