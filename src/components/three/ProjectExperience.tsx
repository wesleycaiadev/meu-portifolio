"use client";

import { useEffect, useRef } from "react";
import { motionQuery } from "@/lib/motion/preference";
import { projects } from "@/data/site";

export function ProjectExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = document.getElementById("projetos");
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const media = window.matchMedia(motionQuery("(min-width: 761px)"));
    let near = false;
    let disposed = false;
    let generation = 0;
    let stop: (() => void) | null = null;

    const sync = async () => {
      const current = ++generation;
      if (!media.matches) {
        stop?.();
        stop = null;
        return;
      }
      if (!near || stop) return;

      // Three.js is downloaded only as Projects approaches the viewport.
      try {
        const { createProjectCanvas } = await import("./projectCanvas");
        if (disposed || current !== generation || !near || !media.matches) return;
        stop = createProjectCanvas(canvas, root, projects);
      } catch {
        // The HTML screenshots remain in place on unsupported devices.
        stop = null;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      void sync();
    }, { rootMargin: "300px 0px" });
    observer.observe(root);
    const onMediaChange = () => { void sync(); };
    media.addEventListener("change", onMediaChange);

    return () => {
      disposed = true;
      generation++;
      observer.disconnect();
      media.removeEventListener("change", onMediaChange);
      stop?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="project-canvas" aria-hidden="true" data-project-canvas />;
}
