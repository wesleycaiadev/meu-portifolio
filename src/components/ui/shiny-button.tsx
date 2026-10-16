"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./shiny-button.module.scss";

type Content = { children: ReactNode; className?: string };
type ShinyButtonProps = Content & (
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
);

// Hash navigation stays a real link, including before hydration and with Ctrl+click.
export function ShinyButton(props: ShinyButtonProps) {
  if (typeof props.href === "string") {
    const { children, className = "", ...attributes } = props;
    return <a {...attributes} className={`${styles.control} ${className}`}>
      <span className={styles.label}>{children}</span>
    </a>;
  }

  const { children, className = "", type = "button", ...attributes } = props;
  return <button {...attributes} type={type} className={`${styles.control} ${className}`}>
    <span className={styles.label}>{children}</span>
  </button>;
}
