import styles from "./TraceField.module.scss";

export function TraceField() {
  return (
    <div className={styles.field} aria-hidden="true">
      <div className={styles.texture} />
      <div className={styles.grid} />
      <div className={styles.light} data-trace-light />
      <div className={styles.flow} data-trace-flow>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
          <defs>
            <linearGradient id="trace-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a8baad" stopOpacity="0" />
              <stop offset="28%" stopColor="#a8baad" stopOpacity=".55" />
              <stop offset="62%" stopColor="#a8baad" stopOpacity=".68" />
              <stop offset="100%" stopColor="#a8baad" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path stroke="url(#trace-line)" d="M834 -70 C 816 85, 1037 96, 1002 252 S 1123 389, 1478 322" />
          <path stroke="url(#trace-line)" d="M743 589 C 876 495, 1045 548, 1158 612 S 1376 655, 1510 552" />
          <path stroke="url(#trace-line)" d="M1152 -40 C 1205 115, 1113 188, 1244 273 S 1391 413, 1513 449" />
        </svg>
      </div>
    </div>
  );
}
