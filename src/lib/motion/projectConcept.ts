import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { selectedProjects, type ProjectId } from "@/data/projects";
import { catmull, spline, type Point } from "./projectTrail";

// One original cursive centerline, including the P bowl, j descender and t bar.
// Its final s exits at (640,61), the exact origin of the continuing ribbon.
const lettering = "M 0 150 C -5 95 -4 35 8 -35 C 18 -76 115 -82 117 -21 C 117 39 26 59 8 53 C 23 54 51 46 72 36"
  + " C 98 28 101 19 104 12 C 108 -3 113 5 111 29 C 109 63 102 96 113 99 C 143 99 142 26 167 33"
  + " C 191 11 229 31 227 57 C 222 95 181 115 167 89 C 153 67 166 32 187 30 C 211 30 223 48 249 41"
  + " C 264 25 270 -8 263 -13 C 252 -18 261 31 260 48 C 258 102 248 150 220 171 C 188 194 197 226 237 210"
  + " C 292 190 290 97 280 79 C 272 61 290 35 310 34 C 338 4 355 43 317 58 C 297 68 297 96 326 98"
  + " C 352 100 365 72 378 55 C 394 28 403 -69 390 -77 C 370 -90 375 -5 387 6"
  + " C 379 -1 363 15 347 13 C 338 10 420 -2 445 -9 C 431 -5 396 2 387 6"
  + " C 387 52 378 90 398 98 C 419 102 430 74 437 52 C 436 30 477 11 497 31"
  + " C 527 71 480 111 457 93 C 430 74 431 42 454 33 C 478 28 491 42 515 42"
  + " C 550 29 559 4 551 6 C 540 1 532 35 547 43 C 568 55 603 61 594 84"
  + " C 581 106 546 115 530 95 C 524 87 550 100 570 94 C 604 89 620 71 640 61";
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const phase = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function createProjectConcept(
  section: HTMLElement, svg: SVGSVGElement, path: SVGPathElement,
  onSelect: (id: ProjectId) => void,
) {
  const stage = section.querySelector<HTMLElement>("[data-project-stage]");
  const intro = section.querySelector<HTMLElement>("[data-project-intro]");
  const portrait = document.querySelector<HTMLElement>("[data-about-portrait]");
  const connector = svg.querySelector<SVGPathElement>("[data-project-connector]");
  const word = svg.querySelector<SVGPathElement>("[data-project-lettering]");
  const heading = section.querySelector("h2");
  const controls = selectedProjects.map(project => ({
    id: project.id, element: section.querySelector<HTMLElement>(`[data-project-select="${project.id}"]`)!,
  }));
  if (!stage || !intro || !portrait || !connector || !word || !heading || controls.some(item => !item.element)) return () => {};

  gsap.registerPlugin(ScrollTrigger);
  const lifetime = new AbortController();
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const originalHeading = heading.textContent;
  section.dataset.projectsConcept = "true";
  section.dataset.trailSelection = "scroll";
  heading.textContent = "Projetos";
  svg.style.cssText = "position:fixed;inset:0;width:100%;height:100%;overflow:clip";
  word.setAttribute("d", lettering);
  const wordLength = word.getTotalLength();
  const state = { progress: 0 };
  let progress = 0;
  let frame = 0;
  let previousTime = 0;
  let visible = false;
  let disposed = false;
  let seeded = false;
  let points: Point[] = [];
  let tipY = 0;
  let selectionProgress = -1;
  let selected: ProjectId | undefined;
  const pointer = { x: 0, y: 0, dx: 0, dy: 0, energy: 0, time: 0 };

  const stop = () => {
    cancelAnimationFrame(frame); frame = 0; previousTime = 0;
    section.dataset.trailRunning = "false";
  };
  const wake = () => {
    if (disposed || !visible || document.hidden || frame) return;
    section.dataset.trailRunning = "true";
    frame = requestAnimationFrame(render);
  };
  const draw = (element: SVGPathElement, length: number, value: number) => {
    element.style.visibility = value > 0 ? "visible" : "hidden";
    element.style.strokeDasharray = String(length);
    element.style.strokeDashoffset = String(length * (1 - value));
  };

  function render(time: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) { stop(); return; }
    const dt = previousTime ? Math.min(0.05, (time - previousTime) / 1000) : 1 / 60;
    previousTime = time;
    progress = mix(progress, state.progress, 1 - Math.exp(-dt / 0.12));
    pointer.energy *= Math.exp(-dt * 5.5);

    // Read all HTML geometry together before updating SVG; only while moving.
    const region = section.getBoundingClientRect();
    const stageBox = stage!.getBoundingClientRect();
    const photo = portrait!.getBoundingClientRect();
    const rows = controls.map(control => ({ ...control, bounds: control.element.getBoundingClientRect() }));
    const scale = Math.min(720, stageBox.width * 0.50) / 640;
    const wordX = rows[0]!.bounds.x + stageBox.width * 0.11;
    const wordY = region.y + intro!.offsetHeight * 0.37;
    const entry = { x: wordX, y: wordY + 150 * scale };
    const exit = { x: wordX + 640 * scale, y: wordY + 61 * scale };
    svg.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`);
    word!.setAttribute("transform", `translate(${wordX} ${wordY}) scale(${scale})`);
    word!.setAttribute("stroke-width", "5");
    const photoX = photo.x + photo.width * 0.30;
    connector!.setAttribute("d", `M ${photoX} ${photo.bottom} C ${photoX - 50} ${photo.bottom + 90} ${entry.x - 55} ${entry.y - 160} ${entry.x} ${entry.y}`);
    connector!.setAttribute("stroke-width", String(5 * scale));
    draw(connector!, connector!.getTotalLength(), phase(progress, 0.01, 0.10));
    draw(word!, wordLength, phase(progress, 0.10, 0.30));

    const first = rows[0]!.bounds;
    const second = rows[1]!.bounds;
    const firstY = first.y + first.height / 2;
    const secondY = second.y + second.height / 2;
    const geometry: Point[] = [
      exit,
      { x: exit.x + 90, y: exit.y - 45 },
      { x: first.x + first.width * 0.34, y: firstY - 90 },
      { x: first.x + first.width * 0.18, y: firstY },
      { x: first.x + first.width * 0.29, y: secondY },
      { x: first.right + 45, y: secondY + 70 },
      { x: first.right - 30, y: secondY + 155 },
      { x: -70, y: secondY + 265 },
    ];
    const head = phase(progress, 0.36, 0.98);
    const targets = Array.from({ length: 32 }, (_, index) => {
      const base = catmull(geometry, head * index / 31);
      const distance = Math.hypot(base.x - pointer.x, base.y - pointer.y);
      const influence = index < 2 ? 0 : Math.pow(clamp(1 - distance / 260), 2) * pointer.energy * 32;
      return { x: base.x + pointer.dx * influence, y: base.y + pointer.dy * influence };
    });
    const leadingY = catmull(geometry, head).y;
    if (!seeded) { points = targets.map(point => ({ ...point })); tipY = leadingY; seeded = true; }
    tipY = mix(tipY, leadingY, 1 - Math.exp(-dt * 13));
    let error = 0;
    for (let i = 0; i < points.length; i++) {
      const follow = i === 0 ? 1 : 1 - Math.exp(-dt * mix(8, 13, i / 31));
      const point = points[i]!;
      const target = targets[i]!;
      point.x = mix(point.x, target.x, follow); point.y = mix(point.y, target.y, follow);
      error = Math.max(error, Math.abs(point.x - target.x), Math.abs(point.y - target.y));
    }
    path.setAttribute("d", head > 0.001 ? spline(points) : "");
    path.setAttribute("stroke-width", String(mix(5 * scale, Math.min(28, Math.max(18, innerWidth * 0.017)), phase(head, 0, 0.20))));
    const id = head < 0.01 || Math.abs(firstY - tipY) <= Math.abs(secondY - tipY) ? rows[0]!.id : rows[1]!.id;
    const activeCenter = id === rows[0]!.id ? firstY : secondY;
    section.style.setProperty("--project-preview-offset", `${activeCenter - stageBox.y - stageBox.height / 2}px`);
    if (id !== selected || Math.abs(progress - selectionProgress) > 0.0001) {
      selected = id; selectionProgress = progress; section.dataset.trailProject = id; onSelect(id);
    }
    section.dataset.trailProgress = progress.toFixed(4);
    section.dataset.projectWriting = phase(progress, 0.10, 0.30).toFixed(4);
    if (Math.abs(progress - state.progress) > 0.0001 || pointer.energy > 0.001 || error > 0.08) wake(); else stop();
  }

  const hold = ScrollTrigger.create({
    id: "project-concept-hold", trigger: stage, start: "top top",
    end: () => `+=${Math.round(innerHeight * 0.90)}`,
    pin: true, pinSpacing: true, refreshPriority: -10, invalidateOnRefresh: true,
  });
  const sequence = ScrollTrigger.create({
    id: "project-concept", trigger: section, start: "top 60%",
    end: () => hold.end, refreshPriority: -20, scrub: true, invalidateOnRefresh: true,
    animation: gsap.to(state, { progress: 1, duration: 1, paused: true, ease: "none", onUpdate: wake }),
    onRefresh: self => {
      section.dataset.trailStart = String(self.start); section.dataset.trailEnd = String(self.end);
      seeded = false; wake();
    },
  });
  const intersection = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    svg.style.visibility = visible ? "visible" : "hidden";
    if (visible) { progress = state.progress; seeded = false; wake(); }
    else { stop(); pointer.energy = 0; }
  }, { rootMargin: "200px 0px" });
  intersection.observe(section);
  window.addEventListener("scroll", wake, { passive: true, signal: lifetime.signal });
  window.addEventListener("resize", () => { seeded = false; wake(); }, { signal: lifetime.signal });
  section.addEventListener("pointermove", event => {
    if (!fine.matches || event.pointerType === "touch" || !visible || document.hidden) return;
    const now = performance.now();
    if (pointer.time) {
      const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
      const distance = Math.hypot(dx, dy);
      pointer.dx = distance ? dx / distance : 0; pointer.dy = distance ? dy / distance : 0;
      pointer.energy = Math.max(pointer.energy, clamp(distance / Math.max(16, now - pointer.time) / 2));
    }
    pointer.x = event.clientX; pointer.y = event.clientY; pointer.time = now; wake();
  }, { signal: lifetime.signal });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { stop(); pointer.energy = 0; pointer.time = 0; }
    else { seeded = false; wake(); }
  }, { signal: lifetime.signal });
  ScrollTrigger.refresh();

  return () => {
    disposed = true; stop(); lifetime.abort(); intersection.disconnect();
    sequence.animation?.kill(); sequence.kill(); hold.kill();
    svg.removeAttribute("style"); svg.removeAttribute("viewBox");
    for (const element of [path, connector, word]) {
      for (const attribute of ["d", "style", "stroke-width", "transform"]) element.removeAttribute(attribute);
    }
    heading.textContent = originalHeading;
    section.style.removeProperty("--project-preview-offset");
    for (const key of ["projectsConcept", "trailStart", "trailEnd", "trailProgress", "trailRunning", "trailSelection", "trailProject", "projectWriting"]) delete section.dataset[key];
  };
}
