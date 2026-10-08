import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { selectedProjects, type ProjectId } from "@/data/projects";
import { spline, type Point } from "./projectTrail";

// A restrained monoline script: shared baseline/x-height, open counters,
// and separate j dot / t crossbar. The final s continues into the same ribbon.
const lettering = "M 0 170 L 24 5 C 71 -11 142 -1 137 48 C 133 89 77 106 24 100"
  + " L 17 147 C 12 187 84 168 112 134 C 135 107 151 74 160 55"
  + " L 146 163 C 160 108 180 52 211 55 C 229 57 225 81 252 80"
  + " C 277 39 326 48 334 84 C 344 125 312 171 278 165 C 243 159 239 117 255 84"
  + " C 270 51 308 48 329 73 C 348 96 374 97 399 56"
  + " L 376 203 C 367 253 321 271 319 238 C 317 209 377 182 431 139"
  + " C 470 114 505 66 477 56 C 448 46 417 96 426 136 C 435 177 489 178 525 136"
  + " C 550 106 566 44 579 -8 L 550 130 C 537 184 588 173 617 125"
  + " C 610 94 631 55 666 55 C 704 53 722 88 708 125 C 695 162 661 175 636 158"
  + " C 602 135 612 83 644 62 C 668 46 694 63 710 77 C 737 101 762 88 798 52"
  + " C 823 29 845 44 828 69 C 812 88 778 89 791 109 C 804 127 861 118 861 146"
  + " C 859 177 805 184 784 160 C 809 181 870 162 928 128";
const accents = "M 411 11 L 411 12 M 530 58 L 610 58";
const LETTER_END = { x: 928, y: 128 };
const POINT_COUNT = 56;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const phase = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
type Curve = [Point, Point, Point, Point];

function sampleCurve(curves: Curve[], progress: number): Point {
  const position = clamp(progress) * curves.length;
  const index = Math.min(curves.length - 1, Math.floor(position));
  const t = position - index;
  const u = 1 - t;
  const [a, b, c, d] = curves[index]!;
  const axis = (key: keyof Point) => u ** 3 * a[key] + 3 * u ** 2 * t * b[key]
    + 3 * u * t ** 2 * c[key] + t ** 3 * d[key];
  return { x: axis("x"), y: axis("y") };
}

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
  const details = document.createElementNS("http://www.w3.org/2000/svg", "path");
  details.setAttribute("d", accents);
  details.setAttribute("fill", "none");
  details.setAttribute("stroke", "currentColor");
  details.setAttribute("stroke-linecap", "round");
  details.dataset.projectAccents = "";
  svg.append(details);
  const detailLength = details.getTotalLength();
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
    const introBox = intro!.getBoundingClientRect();
    const stageBox = stage!.getBoundingClientRect();
    const photo = portrait!.getBoundingClientRect();
    const rows = controls.map(control => ({ ...control, bounds: control.element.getBoundingClientRect() }));
    const stroke = Math.min(28, Math.max(18, innerWidth * 0.017));
    const scale = Math.min(1020, stageBox.width * 0.76) / 928;
    const wordX = stageBox.x + (stageBox.width - 928 * scale) / 2;
    const wordY = introBox.y + introBox.height * 0.38;
    const entry = { x: wordX, y: wordY + 170 * scale };
    const exit = { x: wordX + LETTER_END.x * scale, y: wordY + LETTER_END.y * scale };
    svg.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`);
    for (const element of [word!, details]) {
      element.setAttribute("transform", `translate(${wordX} ${wordY}) scale(${scale})`);
      element.setAttribute("stroke-width", String(stroke / scale));
    }
    const photoX = photo.x + photo.width * 0.30;
    // Approach around the outside of the P; never cut diagonally across the word.
    const shoulderY = wordY - 90 * scale;
    connector!.setAttribute("d", `M ${photoX} ${photo.bottom}
      C ${photoX} ${shoulderY} ${entry.x - 95} ${shoulderY - 55} ${entry.x - 95} ${wordY + 60 * scale}
      C ${entry.x - 95} ${entry.y + 95} ${entry.x - 12} ${entry.y + 85} ${entry.x} ${entry.y}`);
    connector!.setAttribute("stroke-width", String(stroke));
    draw(connector!, connector!.getTotalLength(), phase(progress, 0.01, 0.12));
    draw(word!, wordLength, phase(progress, 0.12, 0.37));
    draw(details, detailLength, phase(progress, 0.30, 0.37));

    const first = rows[0]!.bounds;
    const second = rows[1]!.bounds;
    const firstY = first.y + first.height / 2;
    const secondY = second.y + second.height / 2;
    // Follow the lower part of each row so the ribbon does not erase the names.
    const firstLane = firstY + first.height * 0.38;
    const secondLane = secondY + second.height * 0.38;
    // Broad alternating shoulders. Vertical distances remain open even while
    // the list is pinned: no tight curl between adjacent project rows.
    const left = Math.max(stroke, first.x - stageBox.width * 0.015);
    const right = first.right - stroke;
    const gap = secondLane - firstLane;
    const shoulder = { x: right, y: firstLane - gap * 0.65 };
    const leftTurn = { x: left + 25, y: firstLane + gap * 0.50 };
    const rightTurn = { x: right - 20, y: secondLane + gap * 0.50 };
    // Explicit Bézier handles preserve matching tangents at each turn. A spline
    // through unevenly spaced anchors could overshoot into a small knot.
    const curves: Curve[] = [
      [exit, { x: exit.x + 100 * scale, y: exit.y - 60 * scale },
        { x: right + 110, y: shoulder.y - gap * 0.70 }, shoulder],
      [shoulder, { x: right - 110, y: shoulder.y + gap * 0.70 },
        { x: leftTurn.x, y: firstLane - gap * 0.10 }, leftTurn],
      [leftTurn, { x: leftTurn.x, y: leftTurn.y + gap * 0.60 },
        { x: rightTurn.x, y: secondLane - gap * 0.10 }, rightTurn],
      [rightTurn, { x: rightTurn.x, y: rightTurn.y + gap * 0.60 },
        { x: left + 100, y: secondLane + gap * 1.75 },
        { x: -80, y: secondLane + gap * 1.75 }],
    ];
    // Give each passage its own scroll interval instead of racing through the
    // short rows while spending most of the sequence on the long connector.
    const waypoints: [number, number][] = [
      [0.42, 0], [0.58, 0.25], [0.73, 0.50], [0.90, 0.75], [1, 1],
    ];
    let head = 0;
    for (let i = 1; i < waypoints.length; i++) {
      const [start, from] = waypoints[i - 1]!;
      const [end, to] = waypoints[i]!;
      if (progress >= start) head = mix(from, to, phase(progress, start, end));
    }
    const targets = Array.from({ length: POINT_COUNT }, (_, index) => {
      const base = sampleCurve(curves, head * index / (POINT_COUNT - 1));
      const distance = Math.hypot(base.x - pointer.x, base.y - pointer.y);
      const influence = index < 2 ? 0 : Math.pow(clamp(1 - distance / 260), 2) * pointer.energy * 32;
      return { x: base.x + pointer.dx * influence, y: base.y + pointer.dy * influence };
    });
    const leadingY = sampleCurve(curves, head).y;
    if (!seeded) { points = targets.map(point => ({ ...point })); tipY = leadingY; seeded = true; }
    tipY = mix(tipY, leadingY, 1 - Math.exp(-dt * 13));
    let error = 0;
    for (let i = 0; i < points.length; i++) {
      const follow = i === 0 ? 1 : 1 - Math.exp(-dt * mix(8, 13, i / (POINT_COUNT - 1)));
      const point = points[i]!;
      const target = targets[i]!;
      point.x = mix(point.x, target.x, follow); point.y = mix(point.y, target.y, follow);
      error = Math.max(error, Math.abs(point.x - target.x), Math.abs(point.y - target.y));
    }
    path.setAttribute("d", head > 0.001 ? spline(points) : "");
    path.setAttribute("stroke-width", String(stroke));
    const id = head < 0.01 || Math.abs(firstLane - tipY) <= Math.abs(secondLane - tipY) ? rows[0]!.id : rows[1]!.id;
    const activeCenter = id === rows[0]!.id ? firstY : secondY;
    section.style.setProperty("--project-preview-offset", `${activeCenter - stageBox.y - stageBox.height / 2}px`);
    if (id !== selected || Math.abs(progress - selectionProgress) > 0.0001) {
      selected = id; selectionProgress = progress; section.dataset.trailProject = id; onSelect(id);
    }
    section.dataset.trailProgress = progress.toFixed(4);
    section.dataset.projectWriting = phase(progress, 0.12, 0.37).toFixed(4);
    if (Math.abs(progress - state.progress) > 0.0001 || pointer.energy > 0.001 || error > 0.08) wake(); else stop();
  }

  const writingHold = ScrollTrigger.create({
    id: "project-writing-hold", trigger: intro, start: "top top",
    end: () => `+=${Math.round(innerHeight * 0.80)}`,
    pin: true, pinSpacing: true, refreshPriority: -10, invalidateOnRefresh: true,
  });
  const hold = ScrollTrigger.create({
    id: "project-concept-hold", trigger: stage, start: "top top",
    end: () => `+=${Math.round(innerHeight * 1.65)}`,
    pin: true, pinSpacing: true, refreshPriority: -15, invalidateOnRefresh: true,
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
    sequence.animation?.kill(); sequence.kill(); hold.kill(); writingHold.kill();
    svg.removeAttribute("style"); svg.removeAttribute("viewBox");
    for (const element of [path, connector, word]) {
      for (const attribute of ["d", "style", "stroke-width", "transform"]) element.removeAttribute(attribute);
    }
    details.remove();
    heading.textContent = originalHeading;
    section.style.removeProperty("--project-preview-offset");
    for (const key of ["projectsConcept", "trailStart", "trailEnd", "trailProgress", "trailRunning", "trailSelection", "trailProject", "projectWriting"]) delete section.dataset[key];
  };
}
