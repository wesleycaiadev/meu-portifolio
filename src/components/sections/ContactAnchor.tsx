"use client";

import { useEffect } from "react";

// A direct deep link can precede asynchronous pin creation in earlier sections.
// Reuse the bounded anchor correction; native links retain history and focus.
export function ContactAnchor() {
  useEffect(() => {
    if (location.hash !== "#contato") return;
    let disposed = false;
    let release: (() => void) | undefined;
    void import("@/lib/motion/sectionAnchor").then(({ createSectionAnchor }) => {
      const section = document.getElementById("contato");
      if (disposed || !section || location.hash !== "#contato") return;
      release = createSectionAnchor(section);
      section.focus({ preventScroll: true });
    }).catch(() => { /* The native anchor remains available if motion cannot load. */ });
    return () => { disposed = true; release?.(); };
  }, []);
  return null;
}
