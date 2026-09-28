import * as THREE from "three";
import { getMotion } from "@/lib/motion/gsap";

type Project = { slug: string; image: string };
type ProjectView = {
  slug: string;
  article: HTMLElement;
  host: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  group: THREE.Group;
  texture: THREE.Texture;
  geometry: THREE.PlaneGeometry;
  backingGeometry: THREE.BoxGeometry;
  faceMaterial: THREE.MeshBasicMaterial;
  backingMaterial: THREE.MeshStandardMaterial;
  face: THREE.Mesh;
  backing: THREE.Mesh;
  highlight: { mesh: THREE.Mesh; geometry: THREE.PlaneGeometry; material: THREE.MeshBasicMaterial; x: number } | null;
  ratio: number;
  scroll: { entry: number; exit: number };
  pointer: { x: number; y: number; hover: number };
  current: { x: number; y: number; hover: number };
  atmosphere: number;
  removePointer: () => void;
};

export function createProjectCanvas(canvas: HTMLCanvasElement, root: HTMLElement, projects: readonly Project[]) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const { gsap } = getMotion();
  const views: ProjectView[] = [];
  const textures: THREE.Texture[] = [];
  const triggers = gsap.context(() => {}, root);
  let disposed = false;
  let active = false;
  let previousTime = 0;
  const loader = new THREE.TextureLoader();

  const render = (time: number) => {
    if (!active || disposed) return;
    const dt = Math.min(.05, previousTime ? time - previousTime : .016);
    previousTime = time;
    const ease = 1 - Math.exp(-dt * 7);
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, width, height);
    renderer.clear();
    renderer.setScissorTest(true);

    for (const view of views) {
      const rect = view.host.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= height || rect.right <= 0 || rect.left >= width) continue;
      const left = Math.max(0, rect.left);
      const top = Math.max(0, rect.top);
      const right = Math.min(width, rect.right);
      const bottom = Math.min(height, rect.bottom);
      if (right <= left || bottom <= top) continue;

      view.current.x += (view.pointer.x - view.current.x) * ease;
      view.current.y += (view.pointer.y - view.current.y) * ease;
      view.current.hover += (view.pointer.hover - view.current.hover) * ease;
      if (view.slug === "spasmooth") {
        const entering = 1 - view.scroll.entry;
        const leaving = view.scroll.exit;
        const atmosphere = .35 + .65 * view.scroll.entry * (1 - leaving);
        if (Math.abs(atmosphere - view.atmosphere) > .008) {
          view.article.style.setProperty("--spa-presence", atmosphere.toFixed(3));
          view.atmosphere = atmosphere;
        }
        const maxAngle = THREE.MathUtils.degToRad(2.9);
        // Scroll defines the resting pose; the damped pointer adds a small local response.
        view.group.rotation.x = THREE.MathUtils.clamp(
          entering * THREE.MathUtils.degToRad(-1.15) + leaving * THREE.MathUtils.degToRad(.85) + view.current.y,
          -maxAngle, maxAngle,
        );
        view.group.rotation.y = THREE.MathUtils.clamp(
          entering * THREE.MathUtils.degToRad(1.25) - leaving * THREE.MathUtils.degToRad(1.1) + view.current.x,
          -maxAngle, maxAngle,
        );
        view.group.position.set(entering * .075 - leaving * .065, entering * .12 + leaving * .09, entering * -.55 - leaving * .38);
        view.backing.position.x = -view.current.x * .34;
        view.face.position.x = view.current.x * .16;
        if (view.highlight) {
          view.highlight.mesh.position.x = view.highlight.x + view.current.x * .5;
          view.highlight.material.opacity = .12 + view.current.hover * .045;
        }
      } else {
        view.group.rotation.x = view.current.y + (1 - view.scroll.entry) * -.018;
        view.group.rotation.y = view.current.x;
        view.group.position.y = (1 - view.scroll.entry) * -.08 - view.scroll.exit * .04;
        view.group.position.z = (1 - view.scroll.entry) * -.18 - view.scroll.exit * .08;
      }

      view.camera.aspect = rect.width / rect.height;
      view.camera.updateProjectionMatrix();
      const worldHeight = 2 * Math.tan(THREE.MathUtils.degToRad(view.camera.fov / 2)) * view.camera.position.z;
      const worldWidth = worldHeight * view.camera.aspect;
      const faceWidth = Math.min(worldWidth * .96, worldHeight * .96 * view.ratio);
      const scale = view.slug === "spasmooth"
        ? 1 - (1 - view.scroll.entry) * .045 - view.scroll.exit * .025 + view.current.hover * .009
        : 1 + view.current.hover * .012 - view.scroll.exit * .014;
      view.group.scale.setScalar(faceWidth / view.ratio * scale);

      renderer.setViewport(rect.left, height - rect.bottom, rect.width, rect.height);
      renderer.setScissor(left, height - bottom, right - left, bottom - top);
      renderer.render(view.scene, view.camera);
      if (view.host.dataset.projectWebgl !== "ready") view.host.dataset.projectWebgl = "ready";
    }
  };

  const onResize = () => {
    if (disposed) return;
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    if (active) render(gsap.ticker.time);
  };
  window.addEventListener("resize", onResize);

  const observer = new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    previousTime = 0;
    if (active) {
      gsap.ticker.add(render);
      render(gsap.ticker.time);
    } else {
      gsap.ticker.remove(render);
      renderer.setScissorTest(false);
      renderer.clear();
    }
  }, { rootMargin: "100px 0px" });
  observer.observe(root);

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    gsap.ticker.remove(render);
    observer.disconnect();
    window.removeEventListener("resize", onResize);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    triggers.revert();
    for (const view of views) {
      view.removePointer();
      if (view.slug === "spasmooth") view.article.style.removeProperty("--spa-presence");
      delete view.host.dataset.projectWebgl;
      view.geometry.dispose();
      view.backingGeometry.dispose();
      view.faceMaterial.dispose();
      view.backingMaterial.dispose();
      view.highlight?.geometry.dispose();
      view.highlight?.material.dispose();
    }
    textures.forEach(texture => texture.dispose());
    renderer.dispose();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    dispose();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  for (const project of projects) {
    const article = root.querySelector<HTMLElement>(`[data-project-slug="${project.slug}"]`);
    const host = article?.querySelector<HTMLElement>(".project__image");
    if (!article || !host) continue;
    // The responsive source is cached by the browser and keeps the GPU texture sized to the view.
    const imageSource = host.querySelector<HTMLImageElement>("img")?.currentSrc || project.image;
    const texture = loader.load(imageSource, () => {
      if (disposed) { texture.dispose(); return; }
      const image = texture.image as HTMLImageElement;
      const ratio = image.naturalWidth / image.naturalHeight;
      const isSpa = project.slug === "spasmooth";
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(isSpa ? 30 : 28, 1, .1, 20);
      camera.position.z = 5;
      const group = new THREE.Group();
      const geometry = new THREE.PlaneGeometry(ratio, 1);
      const backingGeometry = new THREE.BoxGeometry(ratio + (isSpa ? .035 : .025), isSpa ? 1.035 : 1.025, isSpa ? .09 : .055);
      const faceMaterial = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
      const backingMaterial = new THREE.MeshStandardMaterial({ color: isSpa ? 0x292e2a : 0x252825, roughness: isSpa ? .88 : 1, metalness: isSpa ? .04 : 0 });
      const backing = new THREE.Mesh(backingGeometry, backingMaterial);
      backing.position.z = isSpa ? -.04 : -.045;
      group.add(backing);
      const face = new THREE.Mesh(geometry, faceMaterial);
      if (isSpa) face.position.z = .03;
      group.add(face);
      let highlight: ProjectView["highlight"] = null;
      if (isSpa) {
        const highlightGeometry = new THREE.PlaneGeometry(ratio * .48, .006);
        const highlightMaterial = new THREE.MeshBasicMaterial({ color: 0xe8eeea, transparent: true, opacity: .12, depthWrite: false });
        const highlightMesh = new THREE.Mesh(highlightGeometry, highlightMaterial);
        const x = -ratio * .24;
        highlightMesh.position.set(x, .509, .052);
        group.add(highlightMesh);
        highlight = { mesh: highlightMesh, geometry: highlightGeometry, material: highlightMaterial, x };
      }
      scene.add(new THREE.AmbientLight(0xffffff, isSpa ? .78 : 1.1));
      if (isSpa) {
        const edgeLight = new THREE.DirectionalLight(0xffffff, .9);
        edgeLight.position.set(-2, 2.5, 3);
        scene.add(edgeLight);
      }
      scene.add(group);
      const scroll = { entry: 0, exit: 0 };
      const pointer = { x: 0, y: 0, hover: 0 };
      const current = { x: 0, y: 0, hover: 0 };
      let bounds: DOMRect | null = null;
      const maxTilt = (project.slug === "mf-consultoria" ? 1.8 : 2.2) * Math.PI / 180;
      const onEnter = () => { bounds = host.getBoundingClientRect(); pointer.hover = 1; };
      const onMove = (event: PointerEvent) => {
        if (!bounds) bounds = host.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
        const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
        pointer.x = x * maxTilt;
        pointer.y = -y * maxTilt;
      };
      const onLeave = () => { bounds = null; pointer.x = 0; pointer.y = 0; pointer.hover = 0; };
      const pointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
      if (pointerMedia.matches) {
        host.addEventListener("pointerenter", onEnter);
        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerleave", onLeave);
      }
      const removePointer = () => {
        host.removeEventListener("pointerenter", onEnter);
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
      };
      views.push({ slug: project.slug, article, host, scene, camera, group, texture, geometry, backingGeometry, faceMaterial, backingMaterial, face, backing, highlight, ratio, scroll, pointer, current, atmosphere: -1, removePointer });
      triggers.add(() => {
        gsap.to(scroll, { entry: 1, ease: "none", scrollTrigger: { trigger: article, start: "top 92%", end: "top 52%", scrub: .6 } });
        gsap.to(scroll, { exit: 1, ease: "none", scrollTrigger: { trigger: article, start: "bottom 68%", end: "bottom 25%", scrub: .6 } });
        const text = article.querySelector<HTMLElement>(".project__content");
        if (text) gsap.from(text, { y: 16, autoAlpha: 0, duration: .7, ease: "power2.out", scrollTrigger: { trigger: article, start: "top 80%", once: true } });
      });
      if (active) render(gsap.ticker.time);
    }, undefined, () => { /* HTML screenshot remains visible. */ });
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    textures.push(texture);
  }

  return dispose;
}
