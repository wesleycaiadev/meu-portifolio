"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function AboutReveal({ children, className }: { children: ReactNode; className: string }) {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const previewMode = process.env.NODE_ENV === "development"
      && new URLSearchParams(location.search).get("wc-preview") === "1";
    const lifetime = new AbortController();
    let disposed = false;
    let loading = false;
    let release: (() => void) | undefined;
    const eligible = () => !previewMode || document.documentElement.dataset.wcMotionPreview === "enabled";
    const reconcile = () => {
      if (!eligible()) { release?.(); release = undefined; element.dataset.aboutMotion = "static"; return; }
      if (disposed || release || loading) return;
      loading = true;
      element.dataset.aboutMotion = "loading";
      void import("@/lib/motion/aboutReveal").then(async ({ createAboutReveal }) => {
        await document.fonts.ready;
        loading = false;
        if (disposed || !eligible()) return;
        release = createAboutReveal(element);
        element.dataset.aboutMotion = "ready";
      }).catch(error => {
        loading = false;
        element.dataset.aboutMotion = "unavailable";
        console.error("About reveal could not initialize.", error);
      });
    };
    if (process.env.NODE_ENV === "development") {
      window.addEventListener("wc-motion-preview", reconcile, { signal: lifetime.signal });
    }
    reconcile();
    return () => { disposed = true; lifetime.abort(); release?.(); delete element.dataset.aboutMotion; };
  }, []);

  // Static HTML is already visible and sharp. Animation is progressive enhancement.
  return (
    <section ref={section} id="sobre" className={className} aria-labelledby="sobre-titulo" tabIndex={-1} data-about="">
      {children}
    </section>
  );
}
