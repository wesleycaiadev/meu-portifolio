import { gsap } from "gsap";
import { selectedProjects, type Project, type ProjectId } from "@/data/projects";

export type PreviewSnapshot = {
  activeProject: Project;
  asset: Project["preview"]["desktop"] | Project["preview"]["mobile"];
  currentSrc: string;
  sourceElement: HTMLImageElement;
  triggerElement: HTMLButtonElement | HTMLAnchorElement;
  stageBounds: DOMRect;
  bounds: DOMRect;
  aspectRatio: number;
  renderedSize: { width: number; height: number };
};

export type ProjectPreviewController = {
  select: (id: ProjectId) => void;
  getSnapshot: () => PreviewSnapshot;
  destroy: () => void;
};

export function createProjectPreview(
  section: HTMLElement,
  onSelect: (id: ProjectId) => void,
  onError: (message: string) => void,
): ProjectPreviewController {
  const entries = selectedProjects.map(project => {
    const figure = section.querySelector<HTMLElement>(`[data-project-preview="${project.id}"]`);
    const image = figure?.querySelector("img");
    const button = section.querySelector<HTMLButtonElement | HTMLAnchorElement>(`[data-project-select="${project.id}"]`);
    if (!figure || !image || !button) throw new Error(`Missing preview elements for ${project.id}.`);
    return { project, figure, image, button, style: figure.getAttribute("style") };
  });
  const entryFor = (id: ProjectId) => {
    const entry = entries.find(item => item.project.id === id);
    if (!entry) throw new Error(`Unknown project: ${id}.`);
    return entry;
  };
  const wide = matchMedia("(min-width: 64rem)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const previewMode = process.env.NODE_ENV === "development"
    && new URLSearchParams(location.search).get("wc-preview") === "1";
  const animate = () => previewMode
    ? document.documentElement.dataset.wcMotionPreview === "enabled"
    : !reduced.matches;
  const lifetime = new AbortController();
  let selected: ProjectId = selectedProjects[0].id;
  let requested: ProjectId = selected;
  let generation = 0;
  let disposed = false;
  let animation: gsap.core.Timeline | undefined;

  const markSelection = () => {
    section.dataset.projectsMode = wide.matches ? "shared" : "stacked";
    for (const entry of entries) entry.figure.setAttribute("aria-hidden", String(wide.matches && entry.project.id !== selected));
    onSelect(selected);
  };
  const reset = () => {
    generation++;
    requested = selected;
    animation?.kill();
    animation = undefined;
    for (const entry of entries) gsap.set(entry.figure, {
      autoAlpha: !wide.matches || entry.project.id === selected ? 1 : 0,
      scale: 1, filter: "none", clearProps: "willChange,zIndex",
    });
    section.dataset.previewTransition = "idle";
    section.removeAttribute("aria-busy");
    markSelection();
  };
  const decode = async (image: HTMLImageElement) => {
    // The browser selects the matching picture source and responsive srcset size.
    image.loading = "eager";
    await image.decode();
  };
  const warm = () => {
    section.dataset.projectsPreload = "loading";
    void Promise.allSettled(entries.map(entry => decode(entry.image))).then(results => {
      if (!disposed) section.dataset.projectsPreload = results.every(result => result.status === "fulfilled") ? "ready" : "partial";
    });
  };
  const proximity = new IntersectionObserver(records => {
    if (records.some(record => record.isIntersecting)) { proximity.disconnect(); warm(); }
  }, { rootMargin: "700px 0px" });
  proximity.observe(section);

  const select = (id: ProjectId) => {
    if (disposed || requested === id) return;
    requested = id;
    const ticket = ++generation;
    const incoming = entryFor(id);
    section.setAttribute("aria-busy", "true");
    void decode(incoming.image).then(() => {
      if (disposed || ticket !== generation) return;
      // Only the latest decoded request can take over. Interrupted styles are retained.
      animation?.kill();
      animation = undefined;
      selected = id;
      markSelection();
      section.removeAttribute("aria-busy");
      if (!wide.matches || !animate()) { reset(); return; }
      const outgoing = entries.find(entry => entry.project.id !== id);
      if (!outgoing) return;
      gsap.set(incoming.figure, { zIndex: 2, willChange: "transform,opacity,filter" });
      gsap.set(outgoing.figure, { zIndex: 1, willChange: "transform,opacity,filter" });
      if (Number(gsap.getProperty(incoming.figure, "opacity")) < 0.001) {
        gsap.set(incoming.figure, { autoAlpha: 0, scale: 1.02, filter: "blur(8px)" });
      }
      section.dataset.previewTransition = "running";
      animation = gsap.timeline({
        onComplete: () => {
          animation = undefined;
          gsap.set(incoming.figure, { filter: "none", clearProps: "willChange" });
          gsap.set(outgoing.figure, { filter: "none", scale: 1, clearProps: "willChange" });
          section.dataset.previewTransition = "idle";
        },
      })
        .to(outgoing.figure, { autoAlpha: 0, scale: 0.985, filter: "blur(8px)", duration: 0.30, ease: "power2.inOut" }, 0)
        .to(incoming.figure, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.42, ease: "power2.out" }, 0);
    }).catch(() => {
      if (disposed || ticket !== generation) return;
      requested = selected;
      section.removeAttribute("aria-busy");
      onError(`Não foi possível carregar a prévia de ${incoming.project.title}.`);
    });
  };

  wide.addEventListener("change", reset, { signal: lifetime.signal });
  reduced.addEventListener("change", reset, { signal: lifetime.signal });
  if (process.env.NODE_ENV === "development") window.addEventListener("wc-motion-preview", reset, { signal: lifetime.signal });
  reset();

  return {
    select,
    getSnapshot: () => {
      const entry = entryFor(selected);
      const asset = wide.matches ? entry.project.preview.desktop : entry.project.preview.mobile;
      const stageBounds = entry.figure.getBoundingClientRect();
      const aspectRatio = asset.width / asset.height;
      const width = Math.min(stageBounds.width, stageBounds.height * aspectRatio);
      const height = width / aspectRatio;
      const bounds = new DOMRect(stageBounds.x + (stageBounds.width - width) / 2,
        stageBounds.y + (stageBounds.height - height) / 2, width, height);
      return {
        activeProject: entry.project, asset, currentSrc: entry.image.currentSrc,
        sourceElement: entry.image, triggerElement: entry.button, stageBounds, bounds,
        aspectRatio, renderedSize: { width, height },
      };
    },
    destroy: () => {
      disposed = true;
      generation++;
      lifetime.abort();
      proximity.disconnect();
      animation?.kill();
      for (const entry of entries) {
        if (entry.style === null) entry.figure.removeAttribute("style"); else entry.figure.setAttribute("style", entry.style);
        entry.figure.removeAttribute("aria-hidden");
      }
      for (const name of ["projectsMode", "projectsPreload", "previewTransition"]) delete section.dataset[name];
      section.removeAttribute("aria-busy");
    },
  };
}
