"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./BorderLink.module.scss";

type BorderLinkProps = {
  href: string;
  children: string;
};

type BorderGeometry = { width: number; height: number; stroke: number };

export function BorderLink({ href, children }: BorderLinkProps) {
  const anchor = useRef<HTMLAnchorElement>(null);
  const [geometry, setGeometry] = useState<BorderGeometry | null>(null);

  useEffect(() => {
    const element = anchor.current;
    if (!element) return;

    // Only size changes update geometry. CSS handles every animation frame.
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const box = entry.borderBoxSize[0];
      const bounds = box
        ? { width: box.inlineSize, height: box.blockSize }
        : element.getBoundingClientRect();
      const stroke = Number.parseFloat(getComputedStyle(element).borderTopWidth);
      setGeometry({ width: bounds.width, height: bounds.height, stroke });
    });
    observer.observe(element, { box: "border-box" });
    return () => observer.disconnect();
  }, []);

  return (
    <a ref={anchor} className={styles.link} href={href}>
      {children}
      {geometry && (
        <svg
          className={styles.border}
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          aria-hidden="true"
          focusable="false"
        >
          <rect
            className={styles.stroke}
            x={geometry.stroke / 2}
            y={geometry.stroke / 2}
            width={geometry.width - geometry.stroke}
            height={geometry.height - geometry.stroke}
            rx={(geometry.height - geometry.stroke) / 2}
            pathLength="1"
          />
        </svg>
      )}
    </a>
  );
}
