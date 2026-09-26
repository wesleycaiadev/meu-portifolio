"use client";

import { useLayoutEffect } from "react";
import { getMotion } from "@/lib/motion/gsap";
import { motionQuery } from "@/lib/motion/preference";

type FadeRevealProps = {
  targetId: string;
  triggerId: string;
  start?: string;
};

export function FadeReveal({ targetId, triggerId, start = "top 82%" }: FadeRevealProps) {
  useLayoutEffect(() => {
    const section = document.getElementById(triggerId);
    const target = document.getElementById(targetId);
    if (!section || !target) return;

    const description = target.parentElement?.querySelector<HTMLElement>("p");
    const { gsap, SplitText } = getMotion();
    const media = gsap.matchMedia();

    media.add(motionQuery(), () => {
      let split: ReturnType<typeof SplitText.create> | null = null;
      const context = gsap.context(() => {
        split = SplitText.create(target, { type: "lines", mask: "lines", aria: "auto" });
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: section, start, once: true },
          onComplete: () => { if (split?.isSplit) split.revert(); },
        });

        reveal.from(split.lines, { yPercent: 92, duration: .78, stagger: .09, ease: "power3.out" }, 0);
        if (description) reveal.from(description, { y: 12, autoAlpha: 0, duration: .55, ease: "power2.out" }, .24);
      }, section);

      return () => {
        context.revert();
        if (split?.isSplit) split.revert();
      };
    });

    return () => media.revert();
  }, [start, targetId, triggerId]);

  return null;
}
