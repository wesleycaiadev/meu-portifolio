import * as THREE from "three";
import { gsap } from "gsap";
import type { ObjectSurface } from "@/data/projectObject";
import type { ProjectTransitionDestination, TransitionQuad } from "@/lib/motion/projectTransition";

export type ProjectCaseController = {
  replay: () => void;
  reset: () => void;
  setReading: (reading: boolean) => void;
  completeEntrance: () => boolean;
  destroy: () => void;
};
type Phase = "entering" | "ready" | "error";
type Hooks = {
  onPhase: (phase: Phase) => void; onReveal: (progress: number) => void;
  onTransferReady?: (destination: ProjectTransitionDestination) => boolean;
};

function outlineShape(width: number, height: number, radius: number) {
  const x = -width / 2, y = -height / 2, r = radius;
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y); shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height); shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y); return shape;
}
function bodyGeometry(width: number, height: number, depth: number, radius = .12) {
  const geometry = new THREE.ExtrudeGeometry(outlineShape(width, height, radius), {
    depth, steps: 1, bevelEnabled: true, bevelSize: .018, bevelThickness: .012, bevelSegments: 2, curveSegments: 8,
  });
  geometry.translate(0, 0, -depth / 2); return geometry;
}

export function createProjectCase(host: HTMLElement, sources: readonly ObjectSurface[], hooks: Hooks,
  options: { screenFit: "scroll" | "contain" } = { screenFit: "scroll" }): ProjectCaseController {
  const primary = sources[0];
  if (!primary) throw new Error("A project capture is required.");
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0x101010); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const canvas = renderer.domElement; canvas.setAttribute("aria-hidden", "true"); host.append(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 50);
  const rig = new THREE.Group(); scene.add(rig);
  const chassis = new THREE.Group(); rig.add(chassis);
  const lid = new THREE.Group(); lid.position.set(0, .13, -1.36); rig.add(lid);
  const graphite = new THREE.MeshStandardMaterial({ color: 0x292b2d, roughness: .62, metalness: .35, transparent: true });
  const edge = new THREE.MeshStandardMaterial({ color: 0x3c3e40, roughness: .50, metalness: .45, transparent: true });
  const keyboardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .95, transparent: true });
  const black = new THREE.MeshStandardMaterial({ color: 0x151617, roughness: .85, transparent: true });
  const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false });
  const materials = [graphite, edge, keyboardMaterial, black];
  const textures = new Set<THREE.Texture>();
  const life = new AbortController();
  let disposed = false, contextLost = false, loaded = false, visible = true, phase: Phase = "entering";
  let frame = 0, previous = 0, fit = 1, resumeEntry = false, resumeLayout = false, pendingEntry = false;
  let entrance: gsap.core.Timeline | undefined, layout: gsap.core.Timeline | undefined;
  const pose = { y: 4.5, z: 7.9, targetY: .25 };
  const appearance = { body: 0, trace: 0, traceOpacity: 1, reveal: 0 };
  const drag = { yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0, pointer: -1, x: 0, y: 0 };
  const scroll = { current: 0, target: 0, max: 0, painted: -1 };

  const base = new THREE.Mesh(bodyGeometry(4.8, 2.85, .11), [graphite, edge]);
  base.rotation.x = -Math.PI / 2; base.position.y = .02; base.castShadow = true; base.receiveShadow = true; chassis.add(base);
  const cover = new THREE.Mesh(bodyGeometry(4.8, 2.60, .105), [graphite, edge]);
  cover.position.y = 1.30; cover.castShadow = true; lid.add(cover);
  const bezel = new THREE.Mesh(bodyGeometry(4.62, 2.44, .012, .08), black);
  bezel.position.set(0, 1.30, .066); lid.add(bezel);
  // Keep the approved physical display fixed across projects. Captures adapt inside it.
  const screenW = 4.46, screenAspect = 1905 / 956, screenH = screenW / screenAspect;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(screenW, screenH), screenMaterial);
  screen.position.set(0, 1.30, .095); lid.add(screen);
  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(.058, .058, 3.4, 16), edge);
  hinge.rotation.z = Math.PI / 2; hinge.position.set(0, .10, -1.36); chassis.add(hinge);
  const trackpad = new THREE.Mesh(bodyGeometry(1.44, .67, .005, .065), black);
  trackpad.rotation.x = -Math.PI / 2; trackpad.position.set(0, .084, .79); chassis.add(trackpad);

  // A quiet keyboard texture provides scale without modelling an industrial key assembly.
  const keys = document.createElement("canvas"); keys.width = 768; keys.height = 256;
  const keyContext = keys.getContext("2d");
  if (keyContext) {
    keyContext.fillStyle = "#242628"; keyContext.fillRect(0, 0, keys.width, keys.height);
    for (let row = 0; row < 5; row++) for (let column = 0; column < 14; column++) {
      if (row === 4 && column > 3 && column < 10) continue;
      keyContext.fillStyle = "#191b1d"; keyContext.strokeStyle = "#353739";
      const x = 8 + column * 54, y = 5 + row * 50;
      keyContext.beginPath(); keyContext.roundRect(x, y, 45, 39, 3); keyContext.fill(); keyContext.stroke();
    }
    keyContext.fillStyle = "#191b1d"; keyContext.fillRect(224, 205, 316, 39);
  }
  const keyTexture = new THREE.CanvasTexture(keys); keyTexture.colorSpace = THREE.SRGBColorSpace;
  textures.add(keyTexture); keyboardMaterial.map = keyTexture;
  const keyboard = new THREE.Mesh(new THREE.PlaneGeometry(4.14, 1.36), keyboardMaterial);
  keyboard.rotation.x = -Math.PI / 2; keyboard.position.set(0, .088, -.33); chassis.add(keyboard);

  const outlinePoints = outlineShape(4.8, 2.85, .12).getPoints(18).map(p => new THREE.Vector3(p.x, .098, -p.y));
  const outlineGeometry = new THREE.BufferGeometry().setFromPoints(outlinePoints);
  const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xf4f2ed, transparent: true });
  const outline = new THREE.Line(outlineGeometry, outlineMaterial); rig.add(outline);
  outlineGeometry.setDrawRange(0, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x161719, 1.3));
  const key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(-3, 6, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -4; key.shadow.camera.right = 4;
  key.shadow.camera.top = 4; key.shadow.camera.bottom = -4; key.shadow.bias = -.001;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe5e6e7, 1.15); fill.position.set(4, 2, -3); scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ color: 0x000000, opacity: .28 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.06; floor.receiveShadow = true; scene.add(floor);

  const viewport = document.createElement("canvas"), story = document.createElement("canvas");
  viewport.width = Math.min(1536, renderer.capabilities.maxTextureSize);
  viewport.height = Math.round(viewport.width / screenAspect);
  const viewportContext = viewport.getContext("2d"), storyContext = story.getContext("2d");
  const storyTexture = new THREE.CanvasTexture(viewport); storyTexture.colorSpace = THREE.SRGBColorSpace;
  storyTexture.generateMipmaps = false; storyTexture.minFilter = THREE.LinearFilter;
  textures.add(storyTexture); screenMaterial.map = storyTexture;

  const paint = () => {
    if (!loaded || !viewportContext) return;
    viewportContext.clearRect(0, 0, viewport.width, viewport.height);
    viewportContext.drawImage(story, 0, Math.round(scroll.current), viewport.width, viewport.height, 0, 0, viewport.width, viewport.height);
    storyTexture.needsUpdate = true; scroll.painted = scroll.current;
  };
  const stop = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; host.dataset.caseRunning = "false"; };
  const wake = () => {
    if (disposed || contextLost || document.hidden || !visible || frame) return;
    frame = requestAnimationFrame(render);
  };
  function render(time: number) {
    frame = 0;
    if (disposed || contextLost || document.hidden || !visible) { stop(); return; }
    const firstFrame = !previous;
    const dt = previous ? Math.min(.05, (time - previous) / 1000) : 1 / 60; previous = time;
    const damping = 1 - Math.exp(-dt * 13);
    scroll.current += (scroll.target - scroll.current) * damping;
    if (Math.abs(scroll.target - scroll.current) <= .25) scroll.current = scroll.target;
    drag.yaw += (drag.targetYaw - drag.yaw) * damping; drag.pitch += (drag.targetPitch - drag.pitch) * damping;
    rig.rotation.set(drag.pitch, drag.yaw, 0);
    for (const material of materials) material.opacity = appearance.body;
    chassis.visible = lid.visible = appearance.body > .001;
    outlineGeometry.setDrawRange(0, Math.floor(appearance.trace * outlinePoints.length));
    outlineMaterial.opacity = appearance.traceOpacity;
    camera.position.set(.22, pose.y * fit, pose.z * fit); camera.lookAt(0, pose.targetY, 0);
    if (Math.abs(scroll.current - scroll.painted) > .2) paint();
    const changing = !!entrance?.isActive() || !!layout?.isActive();
    const unsettled = Math.abs(drag.yaw - drag.targetYaw) + Math.abs(drag.pitch - drag.targetPitch) > .0002;
    renderer.shadowMap.needsUpdate = renderer.shadowMap.needsUpdate || changing || unsettled || firstFrame;
    renderer.render(scene, camera);
    host.dataset.caseScroll = Math.round(scroll.current).toString(); host.dataset.caseScrollMax = Math.round(scroll.max).toString();
    host.dataset.caseYaw = drag.yaw.toFixed(4); host.dataset.caseLid = lid.rotation.x.toFixed(4);
    if (changing || unsettled || Math.abs(scroll.target - scroll.current) > .25) { host.dataset.caseRunning = "true"; wake(); }
    else stop();
  }
  const resizeRenderer = () => {
    const { width, height } = host.getBoundingClientRect(); if (!width || !height) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(width, height, false);
    host.dataset.caseDpr = String(renderer.getPixelRatio());
    camera.aspect = width / height; camera.updateProjectionMatrix(); fit = Math.max(1, 1.22 / camera.aspect);
    renderer.shadowMap.needsUpdate = true; wake();
  };
  const resize = new ResizeObserver(resizeRenderer); resize.observe(host);
  resizeRenderer();
  const suspend = () => {
    resumeEntry = resumeEntry || !!entrance?.isActive(); resumeLayout = resumeLayout || !!layout?.isActive();
    entrance?.pause(); layout?.pause(); stop();
  };
  const resume = () => {
    if (contextLost || document.hidden || !visible) return;
    if (resumeEntry) entrance?.resume(); if (resumeLayout) layout?.resume();
    resumeEntry = resumeLayout = false; wake();
  };
  const intersection = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting; if (visible) resume(); else suspend(); });
  intersection.observe(host);

  const transferSurface = (): TransitionQuad => {
    const bounds = host.getBoundingClientRect();
    camera.position.set(.22, pose.y * fit, pose.z * fit); camera.lookAt(0, pose.targetY, 0);
    camera.updateMatrixWorld(true);
    return [[-screenW / 2, .20, -1.25], [screenW / 2, .20, -1.25],
      [screenW / 2, .20, -1.25 + screenH], [-screenW / 2, .20, -1.25 + screenH]].map(([x, y, z]) => {
      const point = new THREE.Vector3(x, y, z).project(camera);
      return { x: bounds.x + (point.x + 1) * bounds.width / 2, y: bounds.y + (1 - point.y) * bounds.height / 2 };
    }) as unknown as TransitionQuad;
  };
  function completeEntrance() {
    if (!loaded || disposed || contextLost) return false;
    entrance?.kill(); entrance = undefined;
    resumeEntry = false;
    lid.rotation.x = -.10; pose.y = 2.35; pose.z = 8.2; pose.targetY = 1.12;
    appearance.body = appearance.reveal = 1; appearance.traceOpacity = 0;
    screenMaterial.color.setRGB(1, 1, 1); hooks.onReveal(1);
    phase = "ready"; host.dataset.casePhase = phase; hooks.onPhase(phase); wake();
    return true;
  }
  function replay(cinematic = false) {
    if (!loaded || disposed || contextLost) return;
    entrance?.kill(); layout?.kill(); layout = undefined;
    resumeEntry = resumeLayout = false;
    drag.pointer = -1; drag.targetPitch = drag.targetYaw = drag.pitch = drag.yaw = 0;
    scroll.target = scroll.current = 0; scroll.painted = -1;
    rig.position.x = 0; rig.scale.setScalar(1); lid.rotation.x = Math.PI / 2;
    pose.y = 4.5; pose.z = 7.9; pose.targetY = .25;
    appearance.body = appearance.trace = appearance.reveal = 0; appearance.traceOpacity = 1;
    screenMaterial.color.setRGB(0, 0, 0); hooks.onReveal(0);
    phase = "entering"; host.dataset.casePhase = phase; hooks.onPhase(phase);
    entrance = gsap.timeline({ paused: cinematic, onUpdate: () => { hooks.onReveal(appearance.reveal); wake(); }, onComplete: () => {
      entrance = undefined; phase = "ready"; host.dataset.casePhase = phase; hooks.onPhase(phase); wake();
    } });
    if (cinematic) {
      host.dataset.caseEntry = "shared";
      entrance.to(appearance, { trace: 1, duration: .65, ease: "power1.inOut" }, 0)
        .to(appearance, { body: 1, duration: .43, ease: "power2.out" }, .32)
        .to(appearance, { traceOpacity: 0, duration: .25 }, .66)
        .to(lid.rotation, { x: -.10, duration: 1, ease: "power3.inOut" }, .76)
        .to(pose, { y: 2.35, z: 8.2, targetY: 1.12, duration: 1, ease: "power3.inOut" }, .76)
        .to(screenMaterial.color, { r: 1, g: 1, b: 1, duration: .54, ease: "power2.out" }, 1.16)
        .to(appearance, { reveal: 1, duration: .60, ease: "power2.out" }, 1.55);
      const animation = entrance;
      if (!hooks.onTransferReady?.({ surface: transferSurface(), play: () => animation.play() })) animation.play();
    } else {
      host.dataset.caseEntry = "direct";
      entrance.to(appearance, { trace: 1, duration: .95, ease: "power1.inOut" }, 0)
      .to(appearance, { body: 1, duration: .65, ease: "power2.out" }, .78)
      .to(appearance, { traceOpacity: 0, duration: .45 }, 1.12)
      .to(lid.rotation, { x: -.10, duration: 1.65, ease: "power3.inOut" }, 1.35)
      .to(pose, { y: 2.35, z: 8.2, targetY: 1.12, duration: 1.65, ease: "power3.inOut" }, 1.35)
      .to(screenMaterial.color, { r: 1, g: 1, b: 1, duration: .55, ease: "power2.out" }, 2.93)
      .to(appearance, { reveal: 1, duration: .70, ease: "power2.out" }, 3.18);
    }
    if (document.hidden || !visible) suspend(); wake();
  }
  function setReading(reading: boolean) {
    if (phase !== "ready" || !loaded || disposed || contextLost) return;
    layout?.kill();
    layout = gsap.timeline({ onUpdate: wake, onComplete: () => { layout = undefined; wake(); } });
    layout.to(rig.position, { x: reading ? -.22 : 0, duration: .65, ease: "power2.inOut" }, 0)
      .to(rig.scale, { x: reading ? .95 : 1, y: reading ? .95 : 1, z: reading ? .95 : 1, duration: .65, ease: "power2.inOut" }, 0);
    if (document.hidden || !visible) suspend(); wake();
  }
  function reset() {
    if (phase !== "ready") return;
    drag.targetPitch = drag.targetYaw = 0; scroll.target = 0; setReading(false); wake();
  }

  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  const screenAt = (x: number, y: number) => {
    if (!loaded || phase !== "ready" || contextLost) return false;
    const bounds = canvas.getBoundingClientRect();
    pointer.set((x - bounds.x) / bounds.width * 2 - 1, 1 - (y - bounds.y) / bounds.height * 2);
    scene.updateMatrixWorld(true); raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(screen).length > 0;
  };
  const scrollBy = (distance: number) => {
    const next = THREE.MathUtils.clamp(scroll.target + distance, 0, scroll.max);
    if (next === scroll.target) return false;
    scroll.target = next; wake(); return true;
  };
  host.addEventListener("wheel", event => {
    if (!screenAt(event.clientX, event.clientY) || event.ctrlKey || event.shiftKey) return;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? host.clientHeight : 1);
    const upper = screen.localToWorld(new THREE.Vector3(0, screenH / 2, 0)).project(camera);
    const lower = screen.localToWorld(new THREE.Vector3(0, -screenH / 2, 0)).project(camera);
    const renderedHeight = Math.max(1, Math.abs(upper.y - lower.y) * host.clientHeight / 2);
    if (scrollBy(delta * viewport.height / renderedHeight)) event.preventDefault();
  }, { passive: false, signal: life.signal });
  host.addEventListener("pointerdown", event => {
    if (phase !== "ready" || event.button !== 0 || contextLost) return;
    host.focus({ preventScroll: true });
    if (screenAt(event.clientX, event.clientY)) return;
    drag.pointer = event.pointerId; drag.x = event.clientX; drag.y = event.clientY; host.setPointerCapture(event.pointerId);
  }, { signal: life.signal });
  host.addEventListener("pointermove", event => {
    host.dataset.caseScreenHover = String(screenAt(event.clientX, event.clientY));
    if (event.pointerId !== drag.pointer) return;
    drag.targetYaw = THREE.MathUtils.clamp(drag.targetYaw + (event.clientX - drag.x) / host.clientWidth * .7, -.175, .175);
    drag.targetPitch = THREE.MathUtils.clamp(drag.targetPitch + (event.clientY - drag.y) / host.clientWidth * .4, -.087, .087);
    drag.x = event.clientX; drag.y = event.clientY; wake();
  }, { signal: life.signal });
  const release = () => { drag.pointer = -1; drag.targetYaw = drag.targetPitch = 0; wake(); };
  for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) host.addEventListener(name, release, { signal: life.signal });
  host.addEventListener("pointerleave", () => { host.dataset.caseScreenHover = "false"; }, { signal: life.signal });
  host.addEventListener("keydown", event => {
    if (phase !== "ready") return;
    const distance = event.key === "ArrowDown" ? viewport.height * .12 : event.key === "ArrowUp" ? -viewport.height * .12
      : event.key === "PageDown" || event.key === " " ? viewport.height * .8 : event.key === "PageUp" ? -viewport.height * .8
      : event.key === "Home" ? -scroll.max : event.key === "End" ? scroll.max : 0;
    if (distance && scrollBy(distance)) event.preventDefault();
    if (event.key === "Escape") { event.preventDefault(); release(); }
  }, { signal: life.signal });
  document.addEventListener("visibilitychange", () => { if (document.hidden) suspend(); else resume(); }, { signal: life.signal });
  canvas.addEventListener("webglcontextlost", event => { event.preventDefault(); contextLost = true; suspend(); hooks.onReveal(1); hooks.onPhase("error"); }, { signal: life.signal });
  canvas.addEventListener("webglcontextrestored", () => {
    if (disposed) return;
    contextLost = false;
    if (pendingEntry) { pendingEntry = false; replay(); return; }
    hooks.onPhase(phase); hooks.onReveal(appearance.reveal); resume();
  }, { signal: life.signal });

  void Promise.all(sources.map(async source => {
    const image = new Image(); image.src = source.src; await image.decode(); return image;
  })).then(images => {
    if (disposed || !storyContext || !viewportContext) return;
    story.width = viewport.width;
    story.height = options.screenFit === "contain" ? images.length * viewport.height
      : images.reduce((total, image) => total + Math.round(viewport.width * image.naturalHeight / image.naturalWidth), 0);
    let y = 0;
    for (const image of images) {
      if (options.screenFit === "contain") {
        const scale = Math.min(viewport.width / image.naturalWidth, viewport.height / image.naturalHeight);
        const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
        storyContext.fillStyle = "#101010"; storyContext.fillRect(0, y, viewport.width, viewport.height);
        storyContext.drawImage(image, (viewport.width - width) / 2, y + (viewport.height - height) / 2, width, height);
        y += viewport.height;
      } else {
        const height = Math.round(viewport.width * image.naturalHeight / image.naturalWidth);
        storyContext.drawImage(image, 0, y, viewport.width, height); y += height;
      }
    }
    scroll.max = Math.max(0, story.height - viewport.height); loaded = true; paint();
    if (contextLost) pendingEntry = true; else replay(!!hooks.onTransferReady);
  }).catch(() => { if (!disposed) { phase = "error"; stop(); hooks.onReveal(1); hooks.onPhase("error"); } });

  return { replay: () => replay(), reset, setReading, completeEntrance, destroy: () => {
    disposed = true; entrance?.kill(); layout?.kill(); stop(); life.abort(); resize.disconnect(); intersection.disconnect();
    const geometries = new Set<THREE.BufferGeometry>(), disposableMaterials = new Set<THREE.Material>();
    scene.traverse(node => {
      if (node instanceof THREE.Mesh || node instanceof THREE.Line) {
        geometries.add(node.geometry); (Array.isArray(node.material) ? node.material : [node.material]).forEach(material => disposableMaterials.add(material));
      }
    });
    geometries.forEach(geometry => geometry.dispose()); disposableMaterials.forEach(material => material.dispose());
    textures.forEach(texture => texture.dispose()); key.shadow.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    viewport.width = story.width = keys.width = 0;
    for (const name of ["casePhase", "caseEntry", "caseRunning", "caseScroll", "caseScrollMax", "caseYaw", "caseLid", "caseScreenHover", "caseDpr"]) delete host.dataset[name];
  } };
}
