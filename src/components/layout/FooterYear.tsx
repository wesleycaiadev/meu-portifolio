"use client";

import { useSyncExternalStore } from "react";

function subscribe(update: () => void) {
  // Refresh even a cached build's year when a visitor returns to the page.
  document.addEventListener("visibilitychange", update);
  return () => document.removeEventListener("visibilitychange", update);
}
export function FooterYear({ initialYear }: { initialYear: number }) {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => initialYear);
  return <time dateTime={String(year)}>{year}</time>;
}
