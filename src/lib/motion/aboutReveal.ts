import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

type TextReveal = { start: number; end: number; span: number; y: number; blur: number };
type CharacterRange = { element: HTMLElement; start: number; end: number };

function readTextReveal(element: HTMLElement, desktop: boolean): TextReveal {
  const data = element.dataset;
  const start = Number((!desktop && data.revealMobileStart) || data.revealStart);
  const end = Number((!desktop && data.revealMobileEnd) || data.revealEnd);
  return {
    start, end, span: Number(data.revealItemSpan ?? end - start),
    y: Number((!desktop && data.revealMobileY) || data.revealY),
    blur: Number((!desktop && data.revealMobileBlur) || data.revealBlur),
  };
}

function characterRanges(elements: Element[], settings: TextReveal): CharacterRange[] {
  const spread = Math.max(0, settings.end - settings.start - settings.span);
  return elements.map((node, index) => {
    const element = node as HTMLElement;
    const start = settings.start + index * (elements.length > 1 ? spread / (elements.length - 1) : 0);
    const end = start + settings.span;
    element.dataset.revealCharacter = String(index + 1);
    element.dataset.revealStart = String(start);
    element.dataset.revealEnd = String(end);
    return { element, start, end };
  });
}

function addTextReveal(timeline: gsap.core.Timeline, ranges: CharacterRange[], settings: TextReveal) {
  for (const range of ranges) {
    timeline.fromTo(range.element, { autoAlpha: 0, y: settings.y, filter: `blur(${settings.blur}px)` }, {
      autoAlpha: 1, y: 0, filter: "blur(0px)",
      duration: range.end - range.start, ease: "sine.inOut",
    }, range.start);
  }
}

export function createAboutReveal(section: HTMLElement) {
  const heading = section.querySelector<HTMLElement>("[data-about-heading]");
  const description = section.querySelector<HTMLElement>("[data-about-description]");
  const portrait = section.querySelector<HTMLElement>("[data-about-portrait]");
  const image = section.querySelector<HTMLImageElement>("[data-about-image]");
  if (!heading || !description || !portrait || !image) return () => {};

  gsap.registerPlugin(ScrollTrigger, SplitText);
  // Own this listener: GSAP 3.15 removes matchMedia contexts on revert, but
  // leaves its native query listeners registered after repeated route mounts.
  const breakpoint = matchMedia("(min-width: 64rem)");
  let context: gsap.Context | undefined;
  const reconcile = () => {
    context?.revert();
    const desktop = breakpoint.matches;
    context = gsap.context(() => {
      const headingReveal = readTextReveal(heading, desktop);
      const descriptionReveal = readTextReveal(description, desktop);
      let active = true;
      const addPortrait = (timeline: gsap.core.Timeline, start: number, finish: number) => {
        const duration = finish - start;
        timeline
          .fromTo(portrait, { autoAlpha: 0 }, { autoAlpha: 1, duration: duration * 0.2, ease: "sine.inOut" }, start)
          .fromTo(portrait, { clipPath: "inset(10% 6% 14% 6%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration, ease: "power2.inOut" }, start)
          .fromTo(image, { y: desktop ? 32 : 24, scale: 1.045 }, { y: 0, scale: 1, duration, ease: "power2.out" }, start)
          .fromTo(image, { filter: "blur(20px)" }, { filter: "blur(12px)", duration: duration * 0.3, ease: "sine.inOut" }, start)
          .to(image, { filter: "blur(5px)", duration: duration * 0.35, ease: "sine.inOut" }, start + duration * 0.3)
          .to(image, { filter: "blur(0px)", duration: duration * 0.35, ease: "power2.out" }, start + duration * 0.65);
      };
      const setRange = (trigger: ScrollTrigger) => {
        section.dataset.aboutStart = String(trigger.start);
        section.dataset.aboutEnd = String(trigger.end);
      };

      if (desktop) {
        // Hold the approved composition while the longer character sequence unfolds.
        // Its extra native scroll is also included in the shared reveal range below.
        ScrollTrigger.create({
          id: "about-hold", trigger: section, start: "top top",
          end: () => `+=${Math.round(innerHeight * 1.10)}`,
          pin: true, pinSpacing: true, invalidateOnRefresh: true,
        });
      }

      const paragraphSplit = SplitText.create(description, { type: "words,chars", aria: "auto" });
      const headingSplit = SplitText.create(heading, {
        type: desktop ? "lines,words,chars" : "words,chars",
        ...(desktop ? { mask: "lines" as const } : {}), autoSplit: desktop, aria: "auto",
        onSplit: self => {
          const state = { progress: 0 };
          const titleCharacters = characterRanges(self.chars, headingReveal);
          const paragraphCharacters = characterRanges(paragraphSplit.chars, descriptionReveal);
          const allCharacters = [...titleCharacters, ...paragraphCharacters];
          const timeline = gsap.timeline({
            onUpdate: () => {
              const p = state.progress;
              section.dataset[desktop ? "aboutProgress" : "aboutTextProgress"] = String(p);
              for (const character of allCharacters) {
                if (p >= character.end && character.element.style.filter !== "none") character.element.style.filter = "none";
              }
              for (const mask of self.masks) {
                const overflow = p >= headingReveal.end ? "visible" : "clip";
                const style = (mask as HTMLElement).style;
                if (style.overflow !== overflow) style.overflow = overflow;
              }
              if (desktop && p >= 0.88) image.style.filter = "none";
            },
            scrollTrigger: {
              id: desktop ? "about-sequence" : "about-copy", trigger: section,
              start: desktop ? "top 76%" : "top 92%",
              end: desktop ? () => `+=${Math.round(innerHeight * 1.86)}` : "top top",
              scrub: true, invalidateOnRefresh: true,
              ...(desktop ? { onRefresh: setRange } : {}),
            },
          });
          timeline.to(state, { progress: 1, duration: 1, ease: "none" }, 0);
          addTextReveal(timeline, titleCharacters, headingReveal);
          addTextReveal(timeline, paragraphCharacters, descriptionReveal);
          if (desktop) addPortrait(timeline, 0.20, 0.88);
          // Recalculate after SplitText restores previous time and pin geometry changes.
          queueMicrotask(() => { if (active) ScrollTrigger.refresh(); });
          return timeline;
        },
      });

      if (!desktop) {
        const photo = { progress: 0 };
        const reveal = gsap.timeline({
          onUpdate: () => {
            section.dataset.aboutProgress = String(photo.progress);
            if (photo.progress === 1) image.style.filter = "none";
          },
          scrollTrigger: {
            id: "about-portrait", trigger: portrait, start: "top 90%", end: "top 20%",
            scrub: true, invalidateOnRefresh: true, onRefresh: setRange,
          },
        });
        reveal.to(photo, { progress: 1, duration: 1, ease: "none" }, 0);
        addPortrait(reveal, 0, 1);
      }

      ScrollTrigger.refresh();
      return () => {
        active = false;
        headingSplit.revert();
        paragraphSplit.revert();
        for (const name of ["aboutProgress", "aboutTextProgress", "aboutStart", "aboutEnd"]) delete section.dataset[name];
      };
    }, section);
  };
  reconcile();
  breakpoint.addEventListener("change", reconcile);
  return () => { breakpoint.removeEventListener("change", reconcile); context?.revert(); };
}
