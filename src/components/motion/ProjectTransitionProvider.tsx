"use client";

import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import type { PreviewSnapshot } from "@/lib/motion/projectPreview";
import { projectiveMatrix, type ProjectTransitionDestination, type TransitionQuad } from "@/lib/motion/projectTransition";
import styles from "./ProjectTransition.module.scss";
import { isMotionReduced, observeMotionPreference } from "@/lib/motion/preference";

type TransitionAPI = {
  begin: (snapshot: PreviewSnapshot, href: string, navigate: () => void) => boolean;
  pending: (href: string) => boolean;
  bind: (href: string, abort: () => void) => () => void;
  connect: (href: string, destination: ProjectTransitionDestination) => boolean;
  finish: (href: string) => void;
};
const idle: TransitionAPI = { begin: () => false, pending: () => false, bind: () => () => {}, connect: () => false, finish: () => {} };
const ProjectTransitionContext = createContext<TransitionAPI>(idle);
export const useProjectTransition = () => useContext(ProjectTransitionContext);

type Session = {
  href: string; origin: string; snapshot: PreviewSnapshot; sourceVisibility: string;
  originQuad: TransitionQuad; navigationStarted: boolean; connected: boolean;
  abort?: (() => void) | undefined; timeout: ReturnType<typeof setTimeout>;
  departure?: gsap.core.Timeline; transfer?: gsap.core.Timeline;
};

export function ProjectTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const layer = useRef<HTMLDivElement>(null), backdrop = useRef<HTMLDivElement>(null), surface = useRef<HTMLDivElement>(null);
  const session = useRef<Session | null>(null);

  const api = useMemo(() => {
    const clear = (interrupted = false) => {
      const active = session.current;
      if (!active) return;
      session.current = null;
      clearTimeout(active.timeout); active.departure?.kill(); active.transfer?.kill();
      active.snapshot.sourceElement.style.visibility = active.sourceVisibility;
      active.snapshot.sourceElement.closest<HTMLElement>("[data-projects]")?.removeAttribute("data-project-navigating");
      if (layer.current) { layer.current.hidden = true; delete layer.current.dataset.phase; delete layer.current.dataset.project; }
      if (surface.current) { surface.current.replaceChildren(); gsap.set(surface.current, { clearProps: "all" }); }
      if (backdrop.current) gsap.set(backdrop.current, { clearProps: "opacity" });
      delete document.documentElement.dataset.projectTransition;
      if (interrupted) active.abort?.();
    };
    const controller: TransitionAPI = {
      begin: (snapshot, href, navigate) => {
        // A repeated ordinary click cannot restart the animation or push history twice.
        if (session.current) return true;
        if (!layer.current || !backdrop.current || !surface.current
          || document.hidden || isMotionReduced()
          || matchMedia("(max-width: 767px), (pointer: coarse)").matches
          || (snapshot.activeProject.transitionSource === "desktop"
            && snapshot.asset.src !== snapshot.activeProject.preview.desktop.src)
          || !snapshot.sourceElement.complete || !snapshot.sourceElement.naturalWidth
          || snapshot.bounds.width < 1 || snapshot.bounds.height < 1) return false;
        const { x, y, width, height } = snapshot.bounds;
        if (y >= innerHeight || y + height <= 0) return false;
        const originQuad: TransitionQuad = [{ x, y }, { x: x + width, y }, { x: x + width, y: y + height }, { x, y: y + height }];
        const image = document.createElement("img"); image.src = snapshot.currentSrc; image.alt = "";
        surface.current.replaceChildren(image);
        Object.assign(surface.current.style, { width: `${width}px`, height: `${height}px`, opacity: "1", transform: projectiveMatrix(originQuad, width, height) });
        const active: Session = { href, origin: location.pathname, snapshot, originQuad,
          sourceVisibility: snapshot.sourceElement.style.visibility, navigationStarted: false, connected: false,
          timeout: setTimeout(() => clear(true), 5000) };
        session.current = active;
        snapshot.sourceElement.style.visibility = "hidden";
        snapshot.sourceElement.closest<HTMLElement>("[data-projects]")?.setAttribute("data-project-navigating", "true");
        layer.current.hidden = false; layer.current.dataset.phase = "selection";
        layer.current.dataset.project = snapshot.activeProject.id;
        document.documentElement.dataset.projectTransition = "selection";
        // Warm the existing engine while the source still owns the viewport.
        void import("@/lib/three/projectCase").catch(() => {});
        active.departure = gsap.timeline({ onComplete: () => {
          if (session.current !== active) return;
          active.navigationStarted = true;
          if (layer.current) layer.current.dataset.phase = "navigation";
          document.documentElement.dataset.projectTransition = "navigation";
          navigate();
        } }).to(backdrop.current, { opacity: 1, duration: .28, ease: "power2.inOut" });
        return true;
      },
      pending: href => session.current?.href === href,
      bind: (href, abort) => {
        const active = session.current;
        if (!active || active.href !== href) return () => {};
        active.abort = abort;
        return () => { if (active.abort === abort) active.abort = undefined; };
      },
      connect: (href, destination) => {
        const active = session.current, sheet = surface.current, background = backdrop.current;
        if (!active || active.href !== href || !sheet || !background || active.connected) return false;
        active.connected = true;
        if (layer.current) layer.current.dataset.phase = "transfer";
        document.documentElement.dataset.projectTransition = "transfer";
        const progress = { value: 0 };
        const { width, height } = active.snapshot.bounds;
        destination.play();
        active.transfer = gsap.timeline()
          .to(background, { opacity: 0, duration: .36, ease: "power2.out" }, 0)
          .to(progress, { value: 1, duration: .78, ease: "power3.inOut", onUpdate: () => {
            const points = active.originQuad.map((point, i) => ({
              x: point.x + (destination.surface[i]!.x - point.x) * progress.value,
              y: point.y + (destination.surface[i]!.y - point.y) * progress.value,
            })) as unknown as TransitionQuad;
            sheet.style.transform = projectiveMatrix(points, width, height);
          } }, 0)
          .to(sheet, { opacity: 0, duration: .28, ease: "power2.inOut" }, .68);
        return true;
      },
      finish: href => { if (session.current?.href === href) clear(); },
    };
    // Keep interruption handling available to the provider without expanding its public API.
    return { ...controller, cancel: () => clear(true) };
  }, []);

  useEffect(() => {
    const active = session.current;
    if (active && pathname !== active.origin && pathname !== active.href) api.cancel();
    if (active && active.connected && pathname === active.origin) api.cancel();
  }, [pathname, api]);
  useEffect(() => {
    const lifetime = new AbortController();
    const cancel = () => api.cancel();
    const hide = () => { if (document.hidden) cancel(); };
    const reduce = () => { if (isMotionReduced()) cancel(); };
    const preventScroll = (event: WheelEvent | TouchEvent) => { if (session.current) event.preventDefault(); };
    window.addEventListener("popstate", cancel, { signal: lifetime.signal });
    window.addEventListener("pagehide", cancel, { signal: lifetime.signal });
    window.addEventListener("resize", cancel, { signal: lifetime.signal });
    window.addEventListener("wheel", preventScroll, { passive: false, signal: lifetime.signal });
    window.addEventListener("touchmove", preventScroll, { passive: false, signal: lifetime.signal });
    document.addEventListener("visibilitychange", hide, { signal: lifetime.signal });
    observeMotionPreference(reduce, lifetime.signal);
    document.addEventListener("click", event => {
      const active = session.current;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (active && link && new URL(link.href, location.href).pathname !== active.href) cancel();
    }, { capture: true, signal: lifetime.signal });
    window.addEventListener("keydown", event => {
      if (event.key === "Escape") cancel();
      else if (session.current && ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) event.preventDefault();
    }, { signal: lifetime.signal });
    return () => { lifetime.abort(); api.cancel(); };
  }, [api]);

  return <ProjectTransitionContext.Provider value={api}>
    {children}
    <div ref={layer} className={styles.layer} hidden aria-hidden="true" data-project-transition-layer="">
      <div ref={backdrop} className={styles.backdrop} />
      <div ref={surface} className={styles.surface} />
    </div>
  </ProjectTransitionContext.Provider>;
}
