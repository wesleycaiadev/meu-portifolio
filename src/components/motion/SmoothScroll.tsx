"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { getMotion } from "@/lib/motion/gsap";
import { isMotionPreview, motionQuery } from "@/lib/motion/preference";

const DESKTOP_POINTER = "(min-width: 701px) and (hover: hover) and (pointer: fine)";

export function SmoothScroll() {
  useEffect(() => {
    const { gsap, ScrollTrigger } = getMotion();
    const preview = isMotionPreview();
    const media = window.matchMedia(motionQuery(DESKTOP_POINTER));
    if (preview) document.documentElement.dataset.motionPreview = "";
    let lenis: Lenis | null = null;
    let active = true;
    let tick: ((time: number) => void) | null = null;

    const updateTrigger = () => ScrollTrigger.update();

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor || anchor.classList.contains("skip-link")) return;

      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;

      const id = decodeURIComponent(url.hash.slice(1));
      const target = document.getElementById(id);
      if (!target || !lenis) return;

      event.preventDefault();
      if (window.location.hash !== url.hash) window.history.pushState(null, "", url.hash);

      lenis.scrollTo(id === "inicio" ? 0 : target, {
        offset: id === "inicio" ? 0 : -24,
        onComplete: () => {
          if (document.activeElement !== anchor && document.activeElement !== document.body) return;
          const alreadyFocusable = target.hasAttribute("tabindex");
          if (!alreadyFocusable) target.tabIndex = -1;
          target.focus({ preventScroll: true });
          if (!alreadyFocusable) target.removeAttribute("tabindex");
        },
      });
    };

    const disable = () => {
      document.removeEventListener("click", onAnchorClick);
      if (tick) gsap.ticker.remove(tick);
      tick = null;
      lenis?.off("scroll", updateTrigger);
      lenis?.destroy();
      lenis = null;
      gsap.ticker.lagSmoothing(500, 33);
      ScrollTrigger.refresh();
    };

    const sync = () => {
      if (!media.matches) {
        if (lenis) disable();
        return;
      }
      if (lenis) return;

      lenis = new Lenis({
        autoRaf: false,
        lerp: .14,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
      });
      lenis.on("scroll", updateTrigger);
      tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.addEventListener("click", onAnchorClick);
      ScrollTrigger.refresh();
    };

    const refresh = () => ScrollTrigger.refresh();
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("load", refresh);
    void document.fonts.ready.then(() => { if (active) refresh(); });

    return () => {
      active = false;
      media.removeEventListener("change", sync);
      window.removeEventListener("load", refresh);
      if (lenis) disable();
      if (preview) delete document.documentElement.dataset.motionPreview;
    };
  }, []);

  return null;
}
