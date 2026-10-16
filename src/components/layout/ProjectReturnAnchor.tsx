"use client";

import { useEffect } from "react";
import { selectedProjects } from "@/data/projects";
import { isMotionReduced } from "@/lib/motion/preference";

// Correct only an explicit case return; browser Back keeps its own saved scroll position.
export function ProjectReturnAnchor() {
  useEffect(() => {
    if (location.hash !== "#projetos") return;
    try {
      const project = sessionStorage.getItem("portfolio-project-case-return");
      if (!selectedProjects.some(item => item.id === project)) return;
    } catch { return; }
    const target = document.getElementById("projetos");
    if (!target) return;
    let disposed = false, frame = 0;
    let removeRefresh: (() => void) | undefined;
    let getStart: (() => number | undefined) | undefined;
    const lifetime = new AbortController();
    const place = (fallback = false) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed) return;
        const pinned = getStart?.();
        const expectsPin = matchMedia("(min-width: 64rem)").matches && !isMotionReduced();
        if (expectsPin && pinned === undefined && !fallback) return;
        const y = pinned ?? target.getBoundingClientRect().top + scrollY;
        if (Math.abs(scrollY - y) > 1) scrollTo({ top: y, behavior: "instant" });
        target.focus({ preventScroll: true });
        target.dataset.caseReturn = "settled";
        try { sessionStorage.removeItem("portfolio-project-case-return"); } catch { /* Navigation already completed. */ }
      });
    };
    const refresh = () => place();
    const observer = new ResizeObserver(refresh); observer.observe(document.body);
    const stop = () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); removeRefresh?.(); lifetime.abort(); clearTimeout(timeout);
    };
    // Once the visitor takes over, late asset/refresh events must not pull the page back.
    const userTakesOver = () => {
      try { sessionStorage.removeItem("portfolio-project-case-return"); } catch { /* Keep native scrolling. */ }
      stop();
    };
    for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) window.addEventListener(event, userTakesOver, { once: true, passive: true, signal: lifetime.signal });
    const timeout = setTimeout(() => { place(true); setTimeout(stop, 100); }, 8000);
    void document.fonts.ready.then(() => { if (!disposed) place(); });
    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (disposed) return;
      getStart = () => ScrollTrigger.getById("project-concept-hold")?.start;
      ScrollTrigger.addEventListener("refresh", refresh);
      removeRefresh = () => ScrollTrigger.removeEventListener("refresh", refresh);
      place();
    }).catch(() => { if (!disposed) place(true); });
    return stop;
  }, []);
  return null;
}
