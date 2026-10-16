export type MotionPreference = "full" | "reduced";

const storageKey = "portfolio-motion-preference";
const changeEvent = "portfolio-motion-preference-change";
let memoryPreference: MotionPreference | undefined;

// Product choice: motion starts enabled; a visitor can reduce it for this site.
// The OS preference is left untouched. Breakpoint/WebGL fallbacks stay separate.
export function isMotionReduced(): boolean {
  if (typeof window === "undefined") return false;
  if (memoryPreference) return memoryPreference === "reduced";
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "full" || saved === "reduced") return saved === "reduced";
  } catch { /* In-page choice still works when browser storage is blocked. */ }
  return document.documentElement.dataset.motion === "reduced";
}

export function setMotionPreference(preference: MotionPreference) {
  memoryPreference = preference;
  document.documentElement.dataset.motion = preference;
  try { localStorage.setItem(storageKey, preference); } catch { /* Keep the choice for this document. */ }
  window.dispatchEvent(new Event(changeEvent));
}

export function observeMotionPreference(onChange: () => void, signal?: AbortSignal) {
  const sync = () => {
    document.documentElement.dataset.motion = isMotionReduced() ? "reduced" : "full";
    onChange();
  };
  const storage = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return;
    memoryPreference = undefined;
    // A removed preference returns to the default, including across tabs.
    document.documentElement.dataset.motion = "full";
    sync();
  };
  const options = signal ? { signal } : undefined;
  window.addEventListener(changeEvent, sync, options);
  window.addEventListener("storage", storage, options);
  return () => {
    window.removeEventListener(changeEvent, sync);
    window.removeEventListener("storage", storage);
  };
}

export const motionPreferenceBootstrap = `try{document.documentElement.dataset.motion=localStorage.getItem(${JSON.stringify(storageKey)})==="reduced"?"reduced":"full"}catch{document.documentElement.dataset.motion="full"}`;
