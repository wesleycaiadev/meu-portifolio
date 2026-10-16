import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/data/process";
import { createSectionAnchor } from "./sectionAnchor";

export type ProcessMotionController = { select: (index: number) => void; destroy: () => void };

export function createProcessMotion(section: HTMLElement, onStage: (index: number) => void): ProcessMotionController {
  gsap.registerPlugin(ScrollTrigger);
  const composition = section.querySelector<HTMLElement>("[data-process-composition]")!;
  const figure = section.querySelector<HTMLElement>("[data-process-state]")!;
  const frame = section.querySelector<HTMLElement>("[data-process-layer='frame']")!;
  const navigation = section.querySelector<HTMLElement>("[data-process-layer='navigation']")!;
  const content = section.querySelector<HTMLElement>("[data-process-layer='content']")!;
  const identity = section.querySelector<HTMLElement>("[data-process-layer='identity']")!;
  const detail = section.querySelector<HTMLElement>("[data-process-layer='detail']")!;
  if (!composition || !figure || !frame || !navigation || !content || !identity || !detail) throw new Error("Missing process layers");
  // Classes stay local to the visual module; these semantic selectors don't depend on
  // generated CSS Module names. React owns only stage labels and accessible selection.
  const guides = figure.querySelector<SVGElement>("[data-process-guides]")!;
  const mark = identity.querySelector<SVGElement>("svg")!;
  const imageGuides = identity.querySelector<HTMLElement>("div")!;
  const wireTitle = content.querySelector<HTMLElement>("[data-process-wire='title']")!;
  const wireText = content.querySelector<HTMLElement>("[data-process-wire='text']")!;
  const realText = [...content.querySelectorAll<HTMLElement>("p, :scope > span")];
  const labels = [...navigation.querySelectorAll<HTMLElement>(":scope > span"), ...detail.querySelectorAll<HTMLElement>("span")];
  const captions = [...figure.querySelectorAll<HTMLElement>("[data-process-caption]")];
  const link = content.querySelector<HTMLElement>(":scope > span")!;
  const css = getComputedStyle(section);
  const color = (name: string) => css.getPropertyValue(`--color-${name}`).trim();
  let context: gsap.Context | undefined, trigger: ScrollTrigger | undefined;
  const lifetime = new AbortController();
  let active = true, isPinned = false, lastStage = -1, refreshFrame = 0;
  const canPin = () => composition.getBoundingClientRect().height <= innerHeight - 48;

  function build() {
    isPinned = canPin();
    section.dataset.processMotion = "active";
    section.dataset.processPinned = String(isPinned);
    figure.dataset.processMotion = "active";
    context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "none" }, paused: true });
      gsap.set(frame, { borderColor: "transparent", backgroundColor: "transparent", scale: .975, transformOrigin: "50% 50%" });
      gsap.set(navigation, { xPercent: -3, yPercent: -18, borderColor: "transparent" });
      gsap.set(content, { xPercent: -9, yPercent: 10 });
      gsap.set(identity, { xPercent: 9, yPercent: -8, backgroundColor: "transparent" });
      gsap.set(detail, { yPercent: 35, borderColor: "transparent" });
      gsap.set(labels, { color: "transparent", backgroundColor: color("line-light") });
      gsap.set(realText, { opacity: 0 });
      gsap.set(link, { borderColor: color("line-light") });
      gsap.set([wireTitle, wireText, imageGuides], { opacity: 1 });
      gsap.set(mark, { opacity: 0, scale: .86, filter: "invert(0)", transformOrigin: "50% 50%" });
      gsap.set(guides, { opacity: .75 });
      gsap.set(captions, { opacity: 0 }); gsap.set(captions[0]!, { opacity: 1 });

      timeline.addLabel("understand", 0)
        .to(navigation, { xPercent: 0, yPercent: 0, borderColor: color("grey"), duration: 1 }, 0)
        .to(content, { xPercent: 0, yPercent: 0, duration: 1 }, 0)
        .to(identity, { xPercent: 0, yPercent: 0, duration: 1 }, 0)
        .to(detail, { yPercent: 0, borderColor: color("grey"), duration: 1 }, 0)
        .to(frame, { scale: 1, borderColor: color("grey"), duration: 1 }, 0)
        .to(guides, { opacity: 1, duration: 1 }, 0)
        .addLabel("structure", 1)
        .to(frame, { backgroundColor: color("white"), borderColor: color("line-light"), duration: 1 }, 1)
        .set(frame, { borderStyle: "solid" }, 1.15)
        .to([navigation, detail], { borderColor: color("line-light"), duration: 1 }, 1)
        .to(labels, { color: color("ink"), backgroundColor: "transparent", duration: .8 }, 1.15)
        .to([wireTitle, wireText, imageGuides], { opacity: 0, duration: .65 }, 1.2)
        .to(realText, { opacity: 1, duration: .65 }, 1.3)
        .to(identity, { backgroundColor: color("paper-muted"), borderColor: "transparent", duration: 1 }, 1)
        .to(mark, { opacity: .65, scale: .92, duration: .7 }, 1.3)
        .to(guides, { opacity: .55, duration: 1 }, 1)
        .addLabel("build", 2)
        .to(identity, { backgroundColor: color("ink"), duration: 1 }, 2)
        .to(mark, { opacity: 1, scale: 1, filter: "invert(1)", duration: 1 }, 2)
        .to(guides, { opacity: .3, duration: 1 }, 2)
        .to(link, { borderColor: color("ink"), duration: 1 }, 2)
        .to(content.querySelector("em"), { x: ".12em", duration: 1 }, 2)
        .addLabel("refine", 3);

      // Text remains mounted. Crossfades span the boundary instead of replacing strings.
      captions.slice(1).forEach((caption, index) => {
        timeline.to(captions[index]!, { opacity: 0, duration: .24 }, index + .38)
          .to(caption, { opacity: 1, duration: .24 }, index + .38);
      });
      const publish = () => {
        const progress = timeline.time() / 3;
        const stage = Math.min(3, Math.max(0, Math.round(progress * 3)));
        section.dataset.processProgress = progress.toFixed(4);
        if (stage !== lastStage) { lastStage = stage; onStage(stage); }
        if (section.dataset.processManualTarget && Math.abs(progress - Number(section.dataset.processManualTarget) / 3) < .008) delete section.dataset.processManualTarget;
      };
      timeline.eventCallback("onUpdate", publish);
      trigger = ScrollTrigger.create({
        id: "process-sequence", trigger: composition, animation: timeline,
        start: isPinned ? "top top+=24" : "top 65%",
        end: isPinned ? () => `+=${Math.round(innerHeight * 1.8)}` : "bottom 35%",
        pin: isPinned ? composition : false, pinSpacing: true,
        scrub: true, anticipatePin: isPinned ? 1 : 0, refreshPriority: -40, invalidateOnRefresh: true,
        onRefresh: self => {
          section.dataset.processStart = String(self.start); section.dataset.processEnd = String(self.end);
          section.dataset.processDistance = String(self.end - self.start); publish();
        },
      });
    }, section);
    ScrollTrigger.refresh();
  }
  build();
  const releaseAnchor = createSectionAnchor(section);
  const reconcileGeometry = () => {
    cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => {
      if (!active) return;
      if (canPin() !== isPinned) { context?.revert(); build(); }
    });
  };
  const resize = new ResizeObserver(reconcileGeometry); resize.observe(composition);
  window.addEventListener("resize", reconcileGeometry);
  const cancelManual = () => {
    if (!section.dataset.processManualTarget) return;
    delete section.dataset.processManualTarget;
    window.scrollTo({ top: scrollY, behavior: "instant" });
  };
  for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) window.addEventListener(event, cancelManual, { passive: true, signal: lifetime.signal });
  return {
    select(index) {
      if (!active || !trigger || !processSteps[index]) return;
      section.dataset.processManualTarget = String(index);
      // This application uses native window scroll; no second smoothing driver is added.
      // Only an explicit user selection requests a short native smooth scroll.
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * index / 3, behavior: "smooth" });
    },
    destroy() {
      active = false; cancelAnimationFrame(refreshFrame); resize.disconnect(); releaseAnchor(); lifetime.abort(); window.removeEventListener("resize", reconcileGeometry);
      if (section.dataset.processManualTarget) window.scrollTo({ top: scrollY, behavior: "instant" });
      context?.revert(); delete figure.dataset.processMotion;
      for (const key of ["processPinned", "processProgress", "processStart", "processEnd", "processDistance", "processManualTarget"]) delete section.dataset[key];
      section.dataset.processMotion = "static";
    },
  };
}
