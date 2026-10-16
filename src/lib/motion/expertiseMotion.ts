import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createSectionAnchor } from "./sectionAnchor";

export function createExpertiseMotion(section: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const groups = [...section.querySelectorAll<HTMLElement>("[data-expertise-group]")];
  const offsets = [[-18, 24], [22, 34], [-12, 30], [16, 40], [-10, 22]];
  const bounds = section.getBoundingClientRect();
  const travel = bounds.height + innerHeight * .7;
  // Each entrance begins when that group approaches the reading area. Lower rows
  // must not finish their reveal while they are still below the viewport.
  const entrances = groups.map(group => Math.max(.04, Math.min(.64,
    (group.getBoundingClientRect().top - bounds.top + innerHeight * .08) / travel)));
  const entranceDuration = Math.max(.14, Math.min(.24, innerHeight * .48 / travel));
  let active = true, frame = 0;
  const context = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        id: "expertise-sequence", trigger: section, start: "top 90%", end: "bottom 20%",
        scrub: true, refreshPriority: -30, invalidateOnRefresh: true,
        onRefresh: trigger => { section.dataset.expertiseStart = String(trigger.start); section.dataset.expertiseEnd = String(trigger.end); },
        onUpdate: trigger => { section.dataset.expertiseProgress = trigger.progress.toFixed(4); },
      },
    });
    groups.forEach((group, index) => {
      const [x, y] = offsets[index % offsets.length]!;
      const strength = () => innerWidth >= 1024 ? 1 : .55;
      timeline.fromTo(group, { x: () => x! * strength(), y: () => y! * strength(), opacity: .74 },
        { x: 0, y: 0, opacity: 1, ease: "sine.inOut", duration: Math.min(entranceDuration, .84 - entrances[index]!) }, entrances[index]!);
      timeline.to(group, { x: () => x! * strength() * -.22, y: () => y! * strength() * -.18, opacity: 1, duration: .1, ease: "none" }, .9);
    });
    section.dataset.expertiseMotion = "active";
  }, section);
  // Tablet selection inserts its description in the group. Refresh positions after that
  // real layout change, without linking the scroll timeline to React's selection state.
  const resize = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => { if (active) ScrollTrigger.refresh(); });
  });
  resize.observe(section);
  const releaseAnchor = createSectionAnchor(section);
  ScrollTrigger.refresh();
  return () => {
    active = false; cancelAnimationFrame(frame); resize.disconnect(); releaseAnchor(); context.revert();
    for (const key of ["expertiseStart", "expertiseEnd", "expertiseProgress"]) delete section.dataset[key];
    section.dataset.expertiseMotion = "static";
  };
}
