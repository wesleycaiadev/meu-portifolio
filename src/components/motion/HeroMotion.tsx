"use client";

import { useLayoutEffect } from "react";
import { getMotion } from "@/lib/motion/gsap";
import { motionQuery } from "@/lib/motion/preference";

export function HeroMotion() {
  useLayoutEffect(() => {
    const hero = document.getElementById("inicio");
    const header = document.querySelector<HTMLElement>(".site-header");
    const headline = document.getElementById("hero-title");
    const content = hero?.querySelector<HTMLElement>(".hero__content");
    const paragraph = hero?.querySelector<HTMLElement>(".hero__content > p");
    const actions = hero?.querySelectorAll<HTMLElement>(".hero__actions > a");
    const portrait = hero?.querySelector<HTMLElement>(".hero__portrait");
    const portraitMedia = portrait?.querySelector<HTMLElement>(".hero__portrait-media");
    const image = portrait?.querySelector<HTMLImageElement>("img");
    const aura = hero?.querySelector<HTMLElement>(".hero__aura");
    const auraCore = aura?.querySelector<HTMLElement>(".hero__aura-core");

    if (!hero || !header || !headline || !content || !paragraph || !actions?.length || !portrait || !portraitMedia || !image || !aura || !auraCore) return;

    const { gsap, ScrollTrigger, SplitText } = getMotion();
    const media = gsap.matchMedia();

    media.add(motionQuery(), () => {
      let split: ReturnType<typeof SplitText.create> | null = null;
      let removePointer = () => {};
      const pointerMedia = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");

      const context = gsap.context(() => {
        split = SplitText.create(headline, { type: "lines", mask: "lines", aria: "auto" });

        const entrance = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            if (split?.isSplit) split.revert();
            gsap.set(portrait, { clearProps: "clipPath" });
            ScrollTrigger.refresh();
          },
        });

        entrance
          .from(auraCore, { autoAlpha: 0, scale: .9, duration: 2.35, ease: "power2.out" }, 0)
          .from(header, { y: -8, autoAlpha: 0, duration: .43 }, .14);

        const lineOffsets = [.32, .47, .59, .75, .87];
        split.lines.forEach((line, index) => {
          const start = lineOffsets[index] ?? .87 + (index - 4) * .11;
          entrance.from(line, { yPercent: 92, duration: .67 + (index % 2) * .05 }, start);
        });

        entrance
          .from(paragraph, { y: 14, autoAlpha: 0, duration: .54 }, 1.17)
          .from(actions, { y: 11, autoAlpha: 0, duration: .43, stagger: .1 }, 1.44)
          .fromTo(portrait,
            { clipPath: "inset(0% 20% 0% 20% round 16px)" },
            { clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 1.38, ease: "power3.inOut" },
            .72,
          )
          .from(portraitMedia, { y: 18, scale: 1.08, duration: 1.45, ease: "power2.out" }, .76);
      }, hero);

      const installPointer = () => {
        if (!pointerMedia.matches) return () => {};

        gsap.set(portrait, { transformPerspective: 1000, transformOrigin: "center center" });
        const rotateX = gsap.quickTo(portrait, "rotationX", { duration: .55, ease: "power2.out" });
        const rotateY = gsap.quickTo(portrait, "rotationY", { duration: .55, ease: "power2.out" });
        const translateX = gsap.quickTo(portrait, "x", { duration: .55, ease: "power2.out" });
        const auraX = gsap.quickTo(auraCore, "x", { duration: .75, ease: "power2.out" });
        const auraY = gsap.quickTo(auraCore, "y", { duration: .75, ease: "power2.out" });
        let bounds: DOMRect | null = null;

        const onEnter = () => { bounds = portrait.getBoundingClientRect(); };
        const onMove = (event: PointerEvent) => {
          if (!bounds) bounds = portrait.getBoundingClientRect();
          const horizontal = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
          const vertical = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
          rotateX(-vertical * 1.25);
          rotateY(horizontal * 1.25);
          translateX(horizontal * 2.5);
          auraX(horizontal * 4);
          auraY(vertical * 3);
        };
        const onLeave = () => {
          bounds = null;
          rotateX(0);
          rotateY(0);
          translateX(0);
          auraX(0);
          auraY(0);
        };

        portrait.addEventListener("pointerenter", onEnter);
        portrait.addEventListener("pointermove", onMove);
        portrait.addEventListener("pointerleave", onLeave);

        return () => {
          portrait.removeEventListener("pointerenter", onEnter);
          portrait.removeEventListener("pointermove", onMove);
          portrait.removeEventListener("pointerleave", onLeave);
          gsap.killTweensOf(portrait, "rotationX,rotationY,x");
          gsap.set(portrait, { rotationX: 0, rotationY: 0, x: 0 });
          gsap.killTweensOf(auraCore, "x,y");
          gsap.set(auraCore, { x: 0, y: 0 });
        };
      };

      const syncPointer = () => {
        removePointer();
        removePointer = installPointer();
      };

      pointerMedia.addEventListener("change", syncPointer);
      syncPointer();

      return () => {
        pointerMedia.removeEventListener("change", syncPointer);
        removePointer();
        context.revert();
        if (split?.isSplit) split.revert();
      };
    });

    media.add(motionQuery("(min-width: 701px)"), () => {
      const light = hero.querySelector<HTMLElement>("[data-signal-light]");
      const flow = hero.querySelector<HTMLElement>("[data-signal-flow]");
      const grid = hero.querySelector<HTMLElement>("[data-signal-grid]");

      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: .65,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(content, { y: () => window.innerWidth >= 1100 ? -18 : -10, opacity: .8 }, 0)
          .to(headline, { y: () => window.innerWidth >= 1100 ? -24 : -14 }, 0)
          .to(portrait, { y: () => window.innerWidth >= 1100 ? 26 : 14 }, 0)
          .to(image, { y: () => window.innerWidth >= 1100 ? 14 : 8, scale: 1.025 }, 0)
          .to(aura, { x: -34, y: -18 }, 0);
        if (light) timeline.to(light, { x: -52, y: -30, opacity: 0, duration: .34 }, 0);
        if (flow) timeline.to(flow, { x: -24, y: -16, scaleY: 1.035, opacity: 0, duration: .34 }, 0);
        if (grid) timeline.to(grid, { opacity: 0, duration: .34 }, 0);
      }, hero);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return null;
}
