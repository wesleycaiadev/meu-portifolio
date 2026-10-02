import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// A solid region near the lower WC junction, measured from the existing mask.
// Its inscribed radius is ~7% of the texture height; reserve extra edge margin.
const FOCAL = { x: 266 / 420, y: 170 / 230, safeRadius: 0.065 } as const;
const smooth = (from: number, to: number, progress: number) => {
  const t = Math.min(1, Math.max(0, (progress - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

export function createWcTakeover(scene: HTMLDivElement) {
  const frame = scene.querySelector<HTMLElement>("[data-wc-identity]");
  const header = scene.querySelector<HTMLElement>("header");
  const nav = scene.querySelector<HTMLElement>("#inicio nav");
  const stage = frame?.parentElement;
  if (!frame || !header || !nav || !stage) return () => {};

  gsap.registerPlugin(ScrollTrigger);
  const originalStyles = [scene, frame, header, nav].map(element => element.getAttribute("style"));
  const camera = { progress: 0 };
  let width = 0, height = 0, cx = 0, cy = 0, viewportWidth = 0, viewportHeight = 0, finalScale = 1;
  let lastWeight = -1;
  const measure = () => {
    const css = getComputedStyle(frame);
    width = parseFloat(css.width);
    height = parseFloat(css.height);
    const bounds = stage.getBoundingClientRect();
    const sceneBounds = scene.getBoundingClientRect();
    cx = bounds.left - sceneBounds.left + bounds.width / 2;
    cy = bounds.top - sceneBounds.top + bounds.height / 2;
    viewportWidth = scene.clientWidth;
    viewportHeight = scene.clientHeight;
    finalScale = Math.max(1, Math.hypot(viewportWidth, viewportHeight) / (2 * height * FOCAL.safeRadius) * 1.30);
  };
  const compose = () => {
    const p = camera.progress < 0.00001 ? 0 : camera.progress;
    const scale = Math.exp(Math.log(finalScale) * p);
    const aim = smooth(0.10, 0.75, p);
    const x = (viewportWidth / 2 - cx) * p - (FOCAL.x - 0.5) * width * scale * aim;
    const y = (viewportHeight / 2 - cy) * p - (FOCAL.y - 0.5) * height * scale * aim;
    const weight = 1 - smooth(0.08, 0.68, p);
    const covered = p >= 0.98;

    gsap.set(frame, {
      x, y, scale, transformOrigin: "50% 50%", autoAlpha: covered ? 0 : 1,
      // Match the design-system black only once curves have almost filled the view.
      filter: p > 0.90 ? `invert(${smooth(0.90, 0.96, p) * (16 / 255) * 100}%)` : "none",
    });
    gsap.set(header, { autoAlpha: 1 - smooth(0.02, 0.15, p), y: -8 * smooth(0.02, 0.15, p) });
    gsap.set(nav, { autoAlpha: 1 - smooth(0.03, 0.20, p) });
    const inactive = p >= 0.14;
    if (inactive && nav.contains(document.activeElement)) {
      document.querySelector<HTMLElement>("#conteudo")?.focus({ preventScroll: true });
    }
    nav.inert = inactive;
    nav.style.pointerEvents = inactive ? "none" : "";
    if (inactive) nav.setAttribute("aria-hidden", "true"); else nav.removeAttribute("aria-hidden");
    if (p >= 0.15) header.setAttribute("aria-hidden", "true"); else header.removeAttribute("aria-hidden");
    scene.style.backgroundColor = covered ? "var(--color-ink)" : "var(--color-paper)";
    scene.dataset.wcProgress = String(p);
    scene.dataset.wcScale = String(scale);
    scene.dataset.wcFinalScale = String(finalScale);
    scene.dataset.wcPosition = `${x},${y}`;
    frame.dataset.wcMotionWeight = String(weight);
    if (weight !== lastWeight) {
      lastWeight = weight;
      frame.dispatchEvent(new CustomEvent("wc-takeover", { detail: { weight } }));
    }
  };
  measure();
  const context = gsap.context(() => {
    gsap.timeline({
      onUpdate: compose,
      scrollTrigger: {
        id: "wc-takeover", trigger: scene, start: "top top", pin: true,
        // Compact native scroll, with less travel on tablet and phone.
        end: () => `+=${Math.round(innerHeight * (innerWidth < 768 ? 0.55 : innerWidth < 1024 ? 0.90 : 1.20))}`,
        scrub: true, invalidateOnRefresh: true, anticipatePin: 1,
        onRefreshInit: measure,
        onRefresh: trigger => {
          measure();
          camera.progress = trigger.progress;
          scene.dataset.wcScrollDistance = String(trigger.end - trigger.start);
          compose();
        },
      },
    }).to(camera, { progress: 1, duration: 1, ease: "none" });
  }, scene);
  compose();

  return () => {
    context.revert();
    [scene, frame, header, nav].forEach((element, index) => {
      const original = originalStyles[index];
      if (original == null) element.removeAttribute("style"); else element.setAttribute("style", original);
    });
    nav.inert = false;
    nav.removeAttribute("aria-hidden");
    header.removeAttribute("aria-hidden");
    for (const name of ["wcProgress", "wcScale", "wcFinalScale", "wcPosition", "wcScrollDistance"]) delete scene.dataset[name];
    frame.dataset.wcMotionWeight = "1";
    frame.dispatchEvent(new CustomEvent("wc-takeover", { detail: { weight: 1 } }));
  };
}
