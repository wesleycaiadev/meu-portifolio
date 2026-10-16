"use client";

import { useEffect, useRef } from "react";
import styles from "./WcIdentity.module.scss";
import { isMotionReduced, observeMotionPreference } from "@/lib/motion/preference";

export function WcIdentity() {
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;

    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    const lifetime = new AbortController();
    let disposed = false;
    let inView = false;
    let loading = false;
    let release: (() => void) | undefined;
    let releasePreview: (() => void) | undefined;
    let previewEnabled = false;
    const previewMode = process.env.NODE_ENV === "development"
      && new URLSearchParams(location.search).get("wc-preview") === "1";
    const eligible = () => pointer.matches && (previewMode ? previewEnabled : !isMotionReduced());

    const reconcile = () => {
      if (!eligible()) {
        release?.();
        release = undefined;
        return;
      }
      if (disposed || release || loading || !inView || document.hidden) return;

      loading = true;
      // Coarse pointers and the visitor's reduced-motion choice avoid Three.js.
      void import("@/lib/three/wcDeformation").then(({ createWcDeformation }) => {
        loading = false;
        if (disposed || !eligible() || !inView || document.hidden) return;
        release = createWcDeformation(element, styles.canvas ?? "");
      }).catch(() => {
        loading = false;
        // The original HTML identity remains visible on import/context failure.
      });
    };

    const intersection = new IntersectionObserver(([entry]) => {
      inView = !!entry?.isIntersecting && entry.intersectionRatio > 0;
      reconcile();
    });
    intersection.observe(element.closest("#inicio") ?? element);
    pointer.addEventListener("change", reconcile, { signal: lifetime.signal });
    observeMotionPreference(reconcile, lifetime.signal);
    document.addEventListener("visibilitychange", reconcile, { signal: lifetime.signal });

    if (process.env.NODE_ENV === "development" && previewMode) {
      void import("@/lib/three/wcMotionPreview").then(({ createWcMotionPreview }) => {
        if (disposed) return;
        releasePreview = createWcMotionPreview(element, enabled => {
          previewEnabled = enabled;
          document.documentElement.dataset.wcMotionPreview = enabled ? "enabled" : "disabled";
          reconcile();
          window.dispatchEvent(new Event("wc-motion-preview"));
        });
      }).catch(() => { /* A failed preview control never bypasses reduced motion. */ });
    }

    return () => {
      disposed = true;
      lifetime.abort();
      intersection.disconnect();
      release?.();
      releasePreview?.();
      if (previewMode) {
        delete document.documentElement.dataset.wcMotionPreview;
        window.dispatchEvent(new Event("wc-motion-preview"));
      }
    };
  }, []);

  return (
    <div ref={frame} className={styles.frame} data-wc-identity="" aria-hidden="true">
      {/* Original approved viewing window and matte remain the HTML fallback. */}
      <svg className={styles.fallback} viewBox="300 440 420 230" focusable="false">
        <defs>
          <filter id="wc-transparent-background" filterUnits="userSpaceOnUse" x="300" y="440" width="420" height="230" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.2126 -0.7152 -0.0722 0 1" />
            <feComponentTransfer><feFuncA type="linear" slope="1.111111" intercept="-0.111111" /></feComponentTransfer>
          </filter>
        </defs>
        <image href="/assets/brand/logo-symbol.svg" width="1080" height="1080" filter="url(#wc-transparent-background)" />
      </svg>
    </div>
  );
}
