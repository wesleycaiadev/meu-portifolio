"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./HeroTakeover.module.scss";
import { isMotionReduced, observeMotionPreference } from "@/lib/motion/preference";

export function HeroTakeover({ children }: { children: ReactNode }) {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const previewMode = process.env.NODE_ENV === "development"
      && new URLSearchParams(location.search).get("wc-preview") === "1";
    const lifetime = new AbortController();
    let disposed = false;
    let loading = false;
    let release: (() => void) | undefined;
    const eligible = () => previewMode
      ? document.documentElement.dataset.wcMotionPreview === "enabled"
      : !isMotionReduced();
    const reconcile = () => {
      if (!eligible()) { release?.(); release = undefined; return; }
      if (disposed || release || loading) return;
      loading = true;
      void import("@/lib/motion/wcTakeover").then(({ createWcTakeover }) => {
        loading = false;
        if (disposed || !eligible()) return;
        release = createWcTakeover(element);
      }).catch(() => { loading = false; });
    };
    observeMotionPreference(reconcile, lifetime.signal);
    if (process.env.NODE_ENV === "development") {
      window.addEventListener("wc-motion-preview", reconcile, { signal: lifetime.signal });
    }
    reconcile();
    return () => { disposed = true; lifetime.abort(); release?.(); };
  }, []);

  return (
    <div ref={scene} className={styles.scene} data-wc-scene="">
      {children}
    </div>
  );
}
