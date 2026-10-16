import type { HTMLAttributes } from "react";

type RevealRange = readonly [start: number, end: number];

export interface RevealTextProps extends HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  text?: string;
  mode?: "characters" | "block";
  /** Fractions of the parent scroll sequence, rather than delays in seconds. */
  range: RevealRange;
  /** Portion of that sequence used to softly reveal each character. */
  itemSpan?: number;
  yOffset?: number;
  blur?: number;
  mobile?: { range: RevealRange; yOffset?: number; blur?: number };
}

/**
 * Adaptation of the supplied 21st.dev RevealText.
 * AboutReveal owns the shared scrub timeline; this component supplies its targets
 * and blur/slide settings. Semantic HTML stays readable before JS or without motion.
 */
export function RevealText({
  as: Tag = "h2", text, children, mode = "block", range, itemSpan,
  yOffset = 24, blur = 10, mobile, ...attributes
}: RevealTextProps) {
  return (
    <Tag
      {...attributes}
      data-reveal-text=""
      data-reveal-mode={mode}
      data-reveal-start={range[0]}
      data-reveal-end={range[1]}
      data-reveal-item-span={itemSpan}
      data-reveal-y={yOffset}
      data-reveal-blur={blur}
      data-reveal-mobile-start={mobile?.range[0]}
      data-reveal-mobile-end={mobile?.range[1]}
      data-reveal-mobile-y={mobile?.yOffset}
      data-reveal-mobile-blur={mobile?.blur}
    >
      {children ?? text}
    </Tag>
  );
}

export default RevealText;
