"use client";

import { useSyncExternalStore } from "react";
import { isMotionReduced, observeMotionPreference, setMotionPreference } from "@/lib/motion/preference";
import styles from "./MotionControl.module.scss";

const serverSnapshot = () => null;

export function MotionControl() {
  const reduced = useSyncExternalStore<boolean | null>(observeMotionPreference, isMotionReduced, serverSnapshot);
  if (reduced === null) return null;

  return <div className={styles.control}>
    <button type="button" onClick={() => setMotionPreference(reduced ? "full" : "reduced")}>
      <span className={styles.indicator} aria-hidden="true" data-active={!reduced} />
      {reduced ? "Ativar animações" : "Reduzir movimento"}
    </button>
    <span className={styles.status} role="status">{reduced ? "Movimento reduzido neste site." : "Animações ativadas neste site."}</span>
  </div>;
}
