import * as THREE from "three";
import { gsap } from "gsap";
import type { ObjectSurface, ProjectObjectContent } from "@/data/projectObject";

export type ProjectObjectView = "front" | "quarter" | "expanded";
export type ProjectObjectController = {
  setView: (view: ProjectObjectView) => void;
  demonstrate: () => void;
  reset: () => void;
  destroy: () => void;
};
type Hooks = { onStatus: (available: boolean, text: string) => void; onView: (view: ProjectObjectView) => void };
type Panel = { hinge: THREE.Group; axis: "x" | "y"; closed: number; expanded: number };

function roundedPanel(width: number, height: number, depth: number) {
  const x = -width / 2, y = -height / 2, r = .055;
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y); shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height); shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true,
    bevelSegments: 3, steps: 1, bevelSize: .025, bevelThickness: .025, curveSegments: 8 });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

export function createProjectObject(host: HTMLElement, content: ProjectObjectContent, hooks: Hooks): ProjectObjectController {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x101010);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true"); host.append(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 80);
  const object = new THREE.Group(); scene.add(object);
  const front = new THREE.MeshStandardMaterial({ color: 0x242629, roughness: .76, metalness: .32 });
  const edge = new THREE.MeshStandardMaterial({ color: 0x606266, roughness: .48, metalness: .67 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x77797b, roughness: .58, metalness: .72 });
  const seam = new THREE.LineBasicMaterial({ color: 0x4c4e50, transparent: true, opacity: .65 });
  const textures = new Set<THREE.Texture>();
  const surfaces: { mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>; source: ObjectSurface }[] = [];
  const panels: Panel[] = [];
  const life = new AbortController();
  let disposed = false, lost = false, ready = false, visible = true;
  let frame = 0, previous = 0, fit = 1;
  let animation: gsap.core.Timeline | undefined;
  let resumeAnimation = false;
  const pose = { x: .35, y: .45, z: 10.8 };
  const drag = { x: 0, y: 0, targetX: 0, targetY: 0, pointer: -1, lastX: 0, lastY: 0 };
  const cameras = { front: { x: .35, y: .45, z: 10.8 }, quarter: { x: 6.6, y: 3.1, z: 9.2 }, expanded: { x: -4.2, y: 3.5, z: 13.2 } };

  function rod(a: THREE.Vector3, b: THREE.Vector3, radius = .047) {
    const direction = b.clone().sub(a);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 12), metal);
    mesh.position.copy(a).add(b).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    mesh.castShadow = true; object.add(mesh);
  }
  // Two rounded diagonal ribs recall the WC's alternating shoulders. They are
  // load-bearing rails behind the panels, not a literal extruded logo.
  for (const z of [-.62, -.97]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.05, 1, z), new THREE.Vector3(-1.05, -.82, z),
      new THREE.Vector3(0, .52, z), new THREE.Vector3(1.05, -.82, z), new THREE.Vector3(2.1, 1, z),
    ]);
    const rib = new THREE.Mesh(new THREE.TubeGeometry(curve, 56, .065, 10, false), metal);
    rib.castShadow = true; object.add(rib);
  }
  rod(new THREE.Vector3(-2.05, -1.08, -.62), new THREE.Vector3(-2.05, 1.08, .50));
  rod(new THREE.Vector3(2.1, -1.05, -.65), new THREE.Vector3(2.1, 1.55, -.30));
  rod(new THREE.Vector3(-2.05, -.8, -.97), new THREE.Vector3(2.1, -.8, -.97));
  rod(new THREE.Vector3(0, -.97, -.62), new THREE.Vector3(0, 1.12, -.18));

  function panel(options: { width: number; height: number; depth: number; position: [number, number, number];
    center: [number, number, number]; axis: "x" | "y"; closed: number; expanded: number; source?: ObjectSurface }) {
    const hinge = new THREE.Group(); hinge.position.set(...options.position); object.add(hinge);
    const body = new THREE.Mesh(roundedPanel(options.width, options.height, options.depth), [front, edge]);
    body.position.set(...options.center); body.castShadow = true; body.receiveShadow = true; hinge.add(body);
    const outline = new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry, 30), seam);
    outline.position.copy(body.position); hinge.add(outline);
    const pivot = new THREE.Mesh(new THREE.CylinderGeometry(.095, .095,
      options.axis === "y" ? Math.min(options.height * .72, 1.8) : options.width * .72, 20), metal);
    if (options.axis === "x") pivot.rotation.z = Math.PI / 2;
    hinge.add(pivot);
    // Physical hinge pins and collars remain in place during articulation.
    for (const offset of [-.38, .38]) {
      const collar = new THREE.Mesh(new THREE.TorusGeometry(.102, .019, 8, 20), edge);
      collar.rotation.x = Math.PI / 2;
      if (options.axis === "y") collar.position.y = offset;
      else { collar.rotation.y = Math.PI / 2; collar.position.x = offset * options.width; }
      hinge.add(collar);
    }
    if (options.source) {
      const w = options.width - .12, h = options.height - .12;
      const aspect = options.source.width / options.source.height;
      const imageW = Math.min(w, h * aspect), imageH = imageW / aspect;
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(imageW, imageH),
        new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }));
      screen.position.copy(body.position); screen.position.z += options.depth / 2 + .031;
      hinge.add(screen); surfaces.push({ mesh: screen, source: options.source });
    } else {
      // Recessed graphite ribs give the neutral shutters a structural face.
      for (const offset of [-.32, 0, .32]) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(options.width * .80, .025, .015), edge);
        bar.position.copy(body.position); bar.position.y += offset * options.height;
        bar.position.z += options.depth / 2 + .027; hinge.add(bar);
      }
    }
    hinge.rotation[options.axis] = options.closed;
    panels.push({ hinge, axis: options.axis, closed: options.closed, expanded: options.expanded });
  }

  panel({ width: 4.12, height: 4 / (content.main.width / content.main.height) + .12, depth: .20,
    position: [-2.05, 0, .5], center: [2.05, 0, 0], axis: "y", closed: 0, expanded: -1.08, source: content.main });
  panel({ width: 1.46, height: 2.90 + .12, depth: .16,
    position: [2.1, .22, -.36], center: [.79, 0, 0], axis: "y", closed: -.88, expanded: -.12, source: content.mobile });
  panel({ width: 2.82, height: 2.70 / (content.detail.width / content.detail.height) + .12, depth: .18,
    position: [-2.05, -.16, -.43], center: [-1.46, 0, 0], axis: "y", closed: .87, expanded: .10, source: content.detail });
  panel({ width: 3.4, height: .86, depth: .14,
    position: [0, 1.12, -.18], center: [0, .48, 0], axis: "x", closed: 1.20, expanded: .30 });
  panel({ width: 3.4, height: 1.00, depth: .14,
    position: [0, -1.12, -.18], center: [0, -.55, 0], axis: "x", closed: -1.15, expanded: -.30 });
  host.dataset.objectPanels = String(panels.length);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x242526, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 3.0); key.position.set(-3, 6, 7); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -7; key.shadow.camera.right = 7;
  key.shadow.camera.top = 6; key.shadow.camera.bottom = -6; key.shadow.bias = -.001;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe6e8ea, 1.1); fill.position.set(5, 1, -3); scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: .30 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -2.05; floor.receiveShadow = true; scene.add(floor);

  const stop = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; host.dataset.objectRunning = "false"; };
  const wake = () => {
    if (disposed || lost || document.hidden || !visible || frame) return;
    frame = requestAnimationFrame(render);
  };
  function render(time: number) {
    frame = 0;
    if (disposed || lost || document.hidden || !visible) { stop(); return; }
    const dt = previous ? Math.min(.05, (time - previous) / 1000) : 1 / 60; previous = time;
    drag.x += (drag.targetX - drag.x) * (1 - Math.exp(-dt * 10));
    drag.y += (drag.targetY - drag.y) * (1 - Math.exp(-dt * 10));
    object.rotation.set(drag.x, drag.y, 0);
    camera.position.set(pose.x * fit, pose.y * fit, pose.z * fit); camera.lookAt(0, .05, 0);
    renderer.render(scene, camera);
    host.dataset.objectYaw = drag.y.toFixed(3); host.dataset.objectPitch = drag.x.toFixed(3);
    if (Math.abs(drag.x - drag.targetX) + Math.abs(drag.y - drag.targetY) > .0002 || animation?.isActive()) {
      host.dataset.objectRunning = "true"; wake();
    } else stop();
  }
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, width < 640 ? 1.25 : 1.5));
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
    const framing = camera.aspect < 1 ? 1.3 : 1.55;
    fit = Math.max(1, framing / camera.aspect); host.dataset.objectDpr = String(renderer.getPixelRatio()); wake();
  }); resize.observe(host);
  const suspend = () => {
    resumeAnimation = resumeAnimation || !!animation?.isActive(); animation?.pause(); stop();
  };
  const resume = () => {
    if (lost || document.hidden || !visible) return;
    if (resumeAnimation) animation?.resume(); resumeAnimation = false; wake();
  };
  const intersection = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting; if (visible) resume(); else suspend();
  });
  intersection.observe(host);

  function move(view: ProjectObjectView, timeline: gsap.core.Timeline, at = 0) {
    timeline.call(() => { hooks.onView(view); host.dataset.objectView = view; }, [], at);
    timeline.to(pose, { ...cameras[view], duration: 1.25, ease: "power2.inOut" }, at);
    timeline.to(drag, { targetX: 0, targetY: 0, duration: .55 }, at);
    panels.forEach((p, i) => timeline.to(p.hinge.rotation, {
      [p.axis]: view === "expanded" ? p.expanded : p.closed,
      duration: 1.15, ease: "power2.inOut",
    }, at + i * .055));
  }
  function setView(view: ProjectObjectView) {
    if (!ready || lost || disposed) return;
    animation?.kill();
    animation = gsap.timeline({ onUpdate: wake, onComplete: () => { animation = undefined; wake(); } });
    move(view, animation); if (document.hidden || !visible) suspend(); wake();
  }
  function reset() { setView("front"); }
  function demonstrate() {
    if (!ready || lost || disposed) return;
    animation?.kill();
    animation = gsap.timeline({ onUpdate: wake, onComplete: () => { animation = undefined; hooks.onView("front"); host.dataset.objectView = "front"; wake(); } });
    move("front", animation, 0);
    move("expanded", animation, 1.55);
    move("front", animation, 3.50); if (document.hidden || !visible) suspend(); wake();
  }
  host.addEventListener("pointerdown", event => {
    if (!ready || lost || event.button !== 0) return;
    gsap.killTweensOf(drag);
    drag.pointer = event.pointerId; drag.lastX = event.clientX; drag.lastY = event.clientY;
    host.setPointerCapture(event.pointerId); host.focus({ preventScroll: true });
  }, { signal: life.signal });
  host.addEventListener("pointermove", event => {
    if (event.pointerId !== drag.pointer) return;
    const width = host.clientWidth;
    drag.targetY = THREE.MathUtils.clamp(drag.targetY + (event.clientX - drag.lastX) / width * 2.0, -.95, .95);
    drag.targetX = THREE.MathUtils.clamp(drag.targetX + (event.clientY - drag.lastY) / width * 1.2, -.30, .30);
    drag.lastX = event.clientX; drag.lastY = event.clientY; wake();
  }, { signal: life.signal });
  const release = () => { drag.pointer = -1; };
  host.addEventListener("pointerup", release, { signal: life.signal });
  host.addEventListener("pointercancel", release, { signal: life.signal });
  host.addEventListener("lostpointercapture", release, { signal: life.signal });
  host.addEventListener("keydown", event => {
    if (!ready) return;
    if (event.key === "Escape") { event.preventDefault(); reset(); return; }
    if (!event.key.startsWith("Arrow")) return;
    event.preventDefault();
    drag.targetY = THREE.MathUtils.clamp(drag.targetY + (event.key === "ArrowLeft" ? -.12 : event.key === "ArrowRight" ? .12 : 0), -.95, .95);
    drag.targetX = THREE.MathUtils.clamp(drag.targetX + (event.key === "ArrowUp" ? -.06 : event.key === "ArrowDown" ? .06 : 0), -.30, .30); wake();
  }, { signal: life.signal });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspend(); else resume();
  }, { signal: life.signal });
  canvas.addEventListener("webglcontextlost", event => {
    event.preventDefault(); lost = true; drag.pointer = -1; suspend();
    hooks.onStatus(false, "Contexto WebGL interrompido. A captura estática permanece disponível.");
  }, { signal: life.signal });
  canvas.addEventListener("webglcontextrestored", () => {
    if (disposed) return;
    lost = false;
    hooks.onStatus(ready, "Contexto restaurado. Explore pelos controles ou pelo drag."); resume();
  }, { signal: life.signal });

  const loader = new THREE.TextureLoader();
  void Promise.all(surfaces.map(async ({ mesh, source }) => {
    const texture = await loader.loadAsync(source.src);
    if (disposed) { texture.dispose(); return; }
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    textures.add(texture); mesh.material.map = texture; mesh.material.needsUpdate = true; wake();
  })).then(() => {
    if (disposed) return;
    ready = true; host.dataset.objectView = "front";
    hooks.onStatus(true, "Cinco painéis prontos. Explore pelos controles ou pelo drag."); wake();
  }).catch(() => {
    if (!disposed) hooks.onStatus(false, "Uma captura não pôde carregar. A referência estática permanece disponível.");
  });
  wake();

  return { setView, demonstrate, reset, destroy: () => {
    disposed = true; animation?.kill(); stop(); life.abort(); resize.disconnect(); intersection.disconnect();
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
    scene.traverse(node => {
      if (node instanceof THREE.Mesh || node instanceof THREE.LineSegments) {
        geometries.add(node.geometry);
        (Array.isArray(node.material) ? node.material : [node.material]).forEach(m => materials.add(m));
      }
    });
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
    key.shadow.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    for (const key of ["objectPanels", "objectRunning", "objectYaw", "objectPitch", "objectDpr", "objectView"]) delete host.dataset[key];
  } };
}
