import type { CSSProperties } from "react";
import styles from "./TraceField.module.scss";

export function TraceField() {
  return <div className={styles.field} aria-hidden="true" />;
}

// Deterministic geometry: no random values or client-side regeneration.
const paths = Array.from({ length: 10 }, (_, index) => {
  const gap = index * 23;
  return `M ${790 + gap} -100 C ${660 + gap} 115, ${1270 + gap} 130, ${1190 + gap} 365 S ${900 + gap} 540, ${1040 + gap} 710 S ${1430 + gap} 790, ${1510 + gap} 1000`;
});

export function SignalPaths() {
  return (
    <div className={styles.heroField} aria-hidden="true">
      <div className={styles.grid} data-signal-grid />
      <div className={styles.light} data-signal-light />
      <div className={styles.flow} data-signal-flow>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" focusable="false">
          {paths.map((d, index) => (
            <path key={index} d={d} style={{
              "--duration": `${18 + index}s`,
              "--delay": `${-index * 4.3}s`,
              opacity: .12 + (index % 3) * .035,
            } as CSSProperties} />
          ))}
        </svg>
      </div>
    </div>
  );
}
