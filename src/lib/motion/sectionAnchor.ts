import { ScrollTrigger } from "gsap/ScrollTrigger";

// Initial native hash navigation precedes async upstream pin creation. Correct only
// this section's explicit initial anchor, and relinquish control on the first input.
export function createSectionAnchor(section: HTMLElement) {
  if (location.hash !== `#${section.id}`) return () => {};
  const lifetime = new AbortController();
  let active = true, frame = 0;
  const place = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (!active || document.hidden) return;
      const target = section.getBoundingClientRect().top + scrollY;
      if (Math.abs(scrollY - target) > 1) scrollTo({ top: target, behavior: "instant" });
      section.dataset.sectionAnchor = "settled";
    });
  };
  const observer = new ResizeObserver(place);
  const stop = () => {
    active = false; cancelAnimationFrame(frame); observer.disconnect(); lifetime.abort();
    ScrollTrigger.removeEventListener("refresh", place); clearTimeout(timeout);
    section.dataset.sectionAnchor = "released";
  };
  for (const event of ["wheel", "touchstart", "pointermove", "pointerdown", "keydown"]) window.addEventListener(event, stop, { once: true, passive: true, signal: lifetime.signal });
  const timeout = setTimeout(stop, 4000);
  observer.observe(document.body);
  ScrollTrigger.addEventListener("refresh", place);
  place();
  return stop;
}
