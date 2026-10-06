import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Point = { x: number; y: number };
const POINT_COUNT = 28;
const clamp = (value: number, low = 0, high = 1) => Math.max(low, Math.min(high, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Alternating shoulders and a returning curve echo the WC's rhythm without
// tracing the logo or reproducing the reference's path.
const guide: Point[] = [
  { x: -0.22, y: -0.24 }, { x: 0.06, y: -0.08 },
  { x: 0.32, y: 0.10 }, { x: 0.28, y: 0.30 },
  { x: 0.11, y: 0.46 }, { x: 0.14, y: 0.61 },
  { x: 0.38, y: 0.73 }, { x: 0.44, y: 0.88 },
  { x: 0.28, y: 1.10 }, { x: -0.18, y: 1.34 },
];

function catmull(points: Point[], t: number): Point {
  const position = clamp(t) * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(position));
  const u = position - index;
  const p0 = points[Math.max(0, index - 1)]!;
  const p1 = points[index]!;
  const p2 = points[index + 1]!;
  const p3 = points[Math.min(points.length - 1, index + 2)]!;
  const axis = (key: keyof Point) => 0.5 * (
    2 * p1[key] + (-p0[key] + p2[key]) * u
    + (2 * p0[key] - 5 * p1[key] + 4 * p2[key] - p3[key]) * u * u
    + (-p0[key] + 3 * p1[key] - 3 * p2[key] + p3[key]) * u * u * u
  );
  return { x: axis("x"), y: axis("y") };
}

function spline(points: Point[]): string {
  const first = points[0]!;
  let d = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[Math.min(points.length - 1, i + 2)]!;
    d += ` C ${(p1.x + (p2.x - p0.x) / 6).toFixed(2)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(2)}`
      + ` ${(p2.x - (p3.x - p1.x) / 6).toFixed(2)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(2)}`
      + ` ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export function createProjectTrail(section: HTMLElement, svg: SVGSVGElement, path: SVGPathElement) {
  const list = section.querySelector<HTMLOListElement>("ol");
  if (!list) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const lifetime = new AbortController();
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const state = { progress: 0 };
  let progress = 0;
  let sectionTop = 0;
  let width = 0;
  let height = 0;
  let listX = 0;
  let listY = 0;
  let listWidth = 0;
  let listHeight = 0;
  let visible = false;
  let disposed = false;
  let frame = 0;
  let previousTime = 0;
  let seeded = false;
  let points: Point[] = [];
  const pointer = { x: 0, y: 0, dx: 0, dy: 0, energy: 0, time: 0 };

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    section.dataset.trailRunning = "false";
  };
  const wake = () => {
    if (disposed || !visible || document.hidden || frame) return;
    section.dataset.trailRunning = "true";
    frame = requestAnimationFrame(render);
  };
  const measure = () => {
    const box = section.getBoundingClientRect();
    const region = list.getBoundingClientRect();
    sectionTop = box.top + scrollY;
    width = box.width;
    height = box.height;
    listX = region.left - box.left;
    listY = region.top - box.top;
    listWidth = region.width;
    listHeight = region.height;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    path.setAttribute("stroke-width", String(clamp(width * 0.017, 18, 28)));
    seeded = false;
    wake();
  };

  function render(time: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) { stop(); return; }
    const dt = previousTime ? clamp((time - previousTime) / 1000, 0.001, 0.05) : 1 / 60;
    previousTime = time;
    progress = mix(progress, state.progress, 1 - Math.exp(-dt / 0.12));
    pointer.energy *= Math.exp(-dt * 5.5);
    // A moving window advances along the curve: the tail also exits physically.
    const head = (progress - 0.15) / 0.75 * 1.34;
    const tail = head - 0.34;
    const start = clamp(tail);
    const end = clamp(head);
    const hasStroke = head > 0 && tail < 1 && end - start > 0.001;
    const targets = Array.from({ length: POINT_COUNT }, (_, i) => {
      const position = catmull(guide, mix(start, end, i / (POINT_COUNT - 1)));
      const base = { x: listX + position.x * listWidth, y: listY + position.y * listHeight };
      const distance = Math.hypot(base.x - pointer.x, base.y - pointer.y);
      const local = Math.pow(clamp(1 - distance / 260), 2) * pointer.energy;
      return { x: base.x + pointer.dx * local * 32, y: base.y + pointer.dy * local * 32 };
    });
    if (!seeded) { points = targets.map(point => ({ ...point })); seeded = true; }
    let error = 0;
    for (let i = 0; i < POINT_COUNT; i++) {
      const point = points[i]!;
      const target = targets[i]!;
      // Slightly slower tail response gives inertia without oscillation.
      const follow = 1 - Math.exp(-dt * mix(8, 13, i / (POINT_COUNT - 1)));
      point.x = mix(point.x, target.x, follow);
      point.y = mix(point.y, target.y, follow);
      error = Math.max(error, Math.abs(point.x - target.x), Math.abs(point.y - target.y));
    }
    path.setAttribute("d", hasStroke ? spline(points) : "");
    section.dataset.trailProgress = progress.toFixed(4);
    if (Math.abs(progress - state.progress) > 0.0001 || pointer.energy > 0.001 || error > 0.08) wake();
    else stop();
  }

  const trigger = ScrollTrigger.create({
    id: "project-trail", trigger: section, start: "top 90%", end: "clamp(bottom 10%)",
    // Resolve after the upstream Hero/About pins even if their dynamic imports
    // initialize later. Their pin spacing is part of this section's position.
    refreshPriority: -10, scrub: true, invalidateOnRefresh: true,
    animation: gsap.to(state, { progress: 1, duration: 1, ease: "none", paused: true, onUpdate: wake }),
    onRefresh: self => {
      section.dataset.trailStart = String(self.start);
      section.dataset.trailEnd = String(self.end);
      state.progress = self.progress;
      measure();
    },
  });
  const intersection = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible) { progress = state.progress; seeded = false; wake(); }
    else { stop(); path.setAttribute("d", ""); pointer.energy = 0; }
  });
  intersection.observe(section);
  const resize = new ResizeObserver(measure);
  resize.observe(section);
  resize.observe(list);
  section.addEventListener("pointermove", event => {
    if (!fine.matches || event.pointerType === "touch" || !visible || document.hidden) return;
    const now = performance.now();
    const x = event.clientX - section.getBoundingClientRect().left;
    const y = event.clientY + scrollY - sectionTop;
    if (pointer.time) {
      const elapsed = Math.max(16, now - pointer.time);
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const distance = Math.hypot(dx, dy);
      pointer.dx = distance ? dx / distance : 0;
      pointer.dy = distance ? dy / distance : 0;
      pointer.energy = Math.max(pointer.energy, clamp(distance / elapsed / 2));
    }
    pointer.x = x; pointer.y = y; pointer.time = now;
    wake();
  }, { signal: lifetime.signal });
  section.addEventListener("pointerleave", () => { pointer.time = 0; wake(); }, { signal: lifetime.signal });
  fine.addEventListener("change", () => { pointer.energy = 0; pointer.time = 0; wake(); }, { signal: lifetime.signal });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { stop(); pointer.energy = 0; pointer.time = 0; }
    else { progress = state.progress; seeded = false; wake(); }
  }, { signal: lifetime.signal });
  measure();

  return () => {
    disposed = true;
    stop();
    lifetime.abort(); intersection.disconnect(); resize.disconnect();
    trigger.animation?.kill(); trigger.kill();
    path.removeAttribute("d"); path.removeAttribute("stroke-width"); svg.removeAttribute("viewBox");
    for (const key of ["trailProgress", "trailStart", "trailEnd", "trailRunning"]) delete section.dataset[key];
  };
}
