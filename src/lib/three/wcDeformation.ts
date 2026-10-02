import {
  LinearFilter, Mesh, NoColorSpace, OrthographicCamera, PlaneGeometry,
  Scene, ShaderMaterial, TextureLoader, Vector2, Vector4, WebGLRenderer,
  type Texture,
} from "three";
import { wcFragmentShader, wcVertexShader } from "./wcShaders";
import type { createWcDebug } from "./wcDebug";

// Alpha >= 0.5 bounds, preserving the approved full 1680 × 920 texture frame.
const MASK_BOUNDS = { left: 89 / 1680, top: 93 / 920, width: 1484 / 1680, height: 742 / 920 } as const;
const SEGMENTS = [96, 52] as const;
const SETTINGS = {
  ambientAmplitude: 0.032,
  ambientEntry: 1.4,
  radius: 0.32,
  radiusGrowth: 0.16,
  force: 0.07,
  maxSpeed: 1.3,
  pointerDamping: 8,
  velocityDamping: 5,
  inputDecay: 6,
  inputHold: 0.05,
  memoryInterval: 0.09,
  memoryLifetime: 2.4,
  echoDistance: 0.006,
  echoMix: 0.10,
  settleEpsilon: 0.001,
  interactionThreshold: 0.015,
  interactionHold: 1000,
  teleportDistance: 0.30,
  sampleGap: 0.12,
  idleFps: 30,
  activeFps: 60,
  maxDpr: 1.5,
} as const;

export function createWcDeformation(frame: HTMLElement, canvasClass: string) {
  const lifetime = new AbortController();
  const camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
  camera.position.z = 2;
  const scene = new Scene();
  const targetPointer = new Vector2(0.5, 0.5);
  const pointer = targetPointer.clone();
  const targetVelocity = new Vector2();
  const velocity = new Vector2();
  const sample = new Vector2();
  const input = new Vector2();
  const wakeSamples = Array.from({ length: 6 }, () => new Vector4(0.5, 0.5, 0, 0));
  const wakeAges = new Float32Array(6).fill(10);
  const uniforms = {
    uTime: { value: 0 },
    uInkHeight: { value: MASK_BOUNDS.height },
    uAmbientAmp: { value: 0 },
    uMotionWeight: { value: Number(frame.dataset.wcMotionWeight ?? 1) },
    uPointer: { value: pointer },
    uVelocity: { value: velocity },
    uAspect: { value: 420 / 230 },
    uRadius: { value: SETTINGS.radius * MASK_BOUNDS.height },
    uBaseRadius: { value: SETTINGS.radius * MASK_BOUNDS.height },
    uRadiusGrowth: { value: SETTINGS.radiusGrowth * MASK_BOUNDS.height },
    uForce: { value: SETTINGS.force * MASK_BOUNDS.height },
    uWake: { value: wakeSamples },
    uWakeAge: { value: wakeAges },
    uEchoDistance: { value: SETTINGS.echoDistance * MASK_BOUNDS.height },
    uEchoMix: { value: SETTINGS.echoMix },
    uMask: { value: null as Texture | null },
  };
  let renderer: WebGLRenderer | undefined;
  let geometry: PlaneGeometry | undefined;
  let material: ShaderMaterial | undefined;
  let texture: Texture | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let intersection: IntersectionObserver | undefined;
  let debug: ReturnType<typeof createWcDebug> | undefined;
  let disposed = false;
  let visible = false;
  let focused = true;
  let ready = false;
  let validFrame = false;
  let dirty = true;
  let shaderFailed = false;
  let raf = 0;
  let lastDraw = 0;
  let sampleTime = 0;
  let lastWake = 0;
  let activeUntil = 0;
  let width = 0;
  let height = 0;
  const canRender = () => !disposed && visible && focused && !document.hidden;

  const resetPointer = () => {
    targetVelocity.set(0, 0);
    velocity.set(0, 0);
    wakeAges.fill(10);
    sampleTime = 0;
    lastWake = 0;
    activeUntil = 0;
  };
  const pause = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    lastDraw = 0;
    dirty = true;
    resetPointer();
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    lifetime.abort();
    pause();
    resizeObserver?.disconnect();
    intersection?.disconnect();
    debug?.dispose();
    geometry?.dispose();
    material?.dispose();
    texture?.dispose();
    renderer?.domElement.remove();
    renderer?.dispose();
    renderer?.forceContextLoss();
    delete frame.dataset.wcState;
    delete frame.dataset.wcReady;
    delete frame.dataset.wcFps;
  };

  const draw = (fps: number) => {
    if (!renderer || !canRender()) return false;
    try {
      renderer.render(scene, camera);
      if (shaderFailed || renderer.getContext().isContextLost()) { dispose(); return false; }
      validFrame = true;
      dirty = false;
      if (frame.dataset.wcReady !== "true") frame.dataset.wcReady = "true";
      const state = fps === SETTINGS.activeFps ? "active" : "idle";
      if (frame.dataset.wcState !== state) frame.dataset.wcState = state;
      if (frame.dataset.wcFps !== String(fps)) frame.dataset.wcFps = String(fps);
      debug?.update({
        width, height, pointer: [pointer.x, pointer.y], target: [targetPointer.x, targetPointer.y],
        velocity: [velocity.x, velocity.y], radius: uniforms.uRadius.value,
        force: uniforms.uForce.value, segments: SEGMENTS, inkBounds: MASK_BOUNDS,
        time: uniforms.uTime.value, ambientAmplitude: uniforms.uAmbientAmp.value,
        wakeCount: Array.from(wakeAges).filter(age => age < SETTINGS.memoryLifetime).length,
        fps, echo: Math.hypot(velocity.x, velocity.y) > 0.38,
      });
      return true;
    } catch { dispose(); return false; }
  };

  const tick = (now: number) => {
    raf = 0;
    if (!ready || !canRender()) return;
    const fps = now < activeUntil ? SETTINGS.activeFps : SETTINGS.idleFps;
    // Check at display refresh, but update/draw only at the selected cadence.
    if (!dirty && lastDraw && now - lastDraw < 1000 / fps - 1) {
      raf = requestAnimationFrame(tick);
      return;
    }
    const dt = lastDraw ? Math.min((now - lastDraw) / 1000, 0.064) : 0;
    lastDraw = now;
    uniforms.uTime.value += dt;
    const entry = Math.min(uniforms.uTime.value / SETTINGS.ambientEntry, 1);
    uniforms.uAmbientAmp.value = SETTINGS.ambientAmplitude * MASK_BOUNDS.height * entry * entry * (3 - 2 * entry);
    const recentInput = !!sampleTime && (now - sampleTime) / 1000 <= SETTINGS.inputHold;
    if (!recentInput) targetVelocity.multiplyScalar(Math.exp(-SETTINGS.inputDecay * dt));
    pointer.lerp(targetPointer, 1 - Math.exp(-SETTINGS.pointerDamping * dt));
    velocity.lerp(targetVelocity, 1 - Math.exp(-SETTINGS.velocityDamping * dt));
    const speed = velocity.length();
    uniforms.uRadius.value = (SETTINGS.radius + SETTINGS.radiusGrowth * speed) * MASK_BOUNDS.height;
    for (let i = 0; i < wakeAges.length; i++) wakeAges[i] = Math.min((wakeAges[i] ?? 10) + dt, 10);
    if (recentInput && speed > SETTINGS.interactionThreshold && (now - lastWake) / 1000 >= SETTINGS.memoryInterval) {
      for (let i = wakeSamples.length - 1; i > 0; i--) {
        const current = wakeSamples[i];
        const previous = wakeSamples[i - 1];
        if (current && previous) current.copy(previous);
        wakeAges[i] = wakeAges[i - 1] ?? 10;
      }
      wakeSamples[0]?.set(pointer.x, pointer.y, velocity.x, velocity.y);
      wakeAges[0] = 0;
      lastWake = now;
    }
    if (speed > SETTINGS.interactionThreshold) activeUntil = Math.max(activeUntil, now + 250);
    if (speed < SETTINGS.settleEpsilon && targetVelocity.length() < SETTINGS.settleEpsilon) {
      velocity.set(0, 0);
      targetVelocity.set(0, 0);
    }
    if (draw(fps) && uniforms.uMotionWeight.value > 0) raf = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!raf && ready && canRender()) raf = requestAnimationFrame(tick);
  };
  const resize = () => {
    if (disposed || !renderer) return;
    if (!canRender()) { dirty = true; return; }
    // CSS scroll transforms must not inflate the drawing buffer or texture cost.
    const css = getComputedStyle(frame);
    const bounds = { width: parseFloat(css.width), height: parseFloat(css.height) };
    if (!bounds.width || !bounds.height) return;
    const dpr = Math.min(devicePixelRatio || 1, SETTINGS.maxDpr);
    if (width !== bounds.width || height !== bounds.height || renderer.getPixelRatio() !== dpr) {
      width = bounds.width;
      height = bounds.height;
      pause();
      delete frame.dataset.wcReady;
      uniforms.uAspect.value = width / height;
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
    }
    wake();
  };
  const seed = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const bounds = frame.getBoundingClientRect();
    targetPointer.set((event.clientX - bounds.left) / bounds.width, 1 - (event.clientY - bounds.top) / bounds.height);
    sample.set(event.clientX, event.clientY);
    sampleTime = performance.now();
    targetVelocity.set(0, 0);
    if (velocity.length() < SETTINGS.settleEpsilon) pointer.copy(targetPointer);
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !validFrame || !canRender() || uniforms.uMotionWeight.value < 0.05) return;
    const bounds = frame.getBoundingClientRect();
    const now = performance.now();
    const elapsed = (now - sampleTime) / 1000;
    input.set(event.clientX - sample.x, sample.y - event.clientY).divideScalar(bounds.height * MASK_BOUNDS.height);
    if (!sampleTime || elapsed > SETTINGS.sampleGap || input.length() > SETTINGS.teleportDistance) { seed(event); return; }
    targetPointer.set((event.clientX - bounds.left) / bounds.width, 1 - (event.clientY - bounds.top) / bounds.height);
    input.divideScalar(Math.max(elapsed, 1 / 120));
    input.clampLength(0, SETTINGS.maxSpeed).divideScalar(SETTINGS.maxSpeed);
    targetVelocity.copy(input);
    sample.set(event.clientX, event.clientY);
    sampleTime = now;
    if (input.length() > SETTINGS.interactionThreshold) activeUntil = now + SETTINGS.interactionHold;
    wake();
  };
  const leave = () => { targetVelocity.set(0, 0); sampleTime = 0; };

  if (process.env.NODE_ENV === "development" && new URLSearchParams(location.search).has("wc-debug")) {
    void import("./wcDebug").then(({ createWcDebug }) => {
      if (disposed) return;
      debug = createWcDebug(frame);
      dirty = true;
      wake();
    }).catch(() => { /* Optional diagnostics do not interrupt the identity. */ });
  }

  try {
    renderer = new WebGLRenderer({ alpha: false, antialias: true, powerPreference: "low-power", depth: false, stencil: false });
    renderer.setClearColor(getComputedStyle(document.body).backgroundColor, 1);
    renderer.debug.onShaderError = () => { shaderFailed = true; };
    const canvas = renderer.domElement;
    canvas.className = canvasClass;
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("role", "presentation");
    frame.append(canvas);
    canvas.addEventListener("webglcontextlost", dispose, { signal: lifetime.signal });
    geometry = new PlaneGeometry(1, 1, ...SEGMENTS);
    geometry.deleteAttribute("normal");
    material = new ShaderMaterial({ uniforms, vertexShader: wcVertexShader, fragmentShader: wcFragmentShader,
      transparent: true, depthTest: false, depthWrite: false, toneMapped: false });
    const mesh = new Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);
    texture = new TextureLoader().load("/assets/brand/wc-mask.png", loaded => {
      if (disposed) { loaded.dispose(); return; }
      loaded.colorSpace = NoColorSpace;
      loaded.minFilter = LinearFilter;
      loaded.magFilter = LinearFilter;
      loaded.generateMipmaps = false;
      uniforms.uMask.value = loaded;
      ready = true;
      resize();
    }, undefined, dispose);
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(frame);
    intersection = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting && entry.intersectionRatio > 0;
      if (visible) resize(); else pause();
    });
    intersection.observe(frame.closest("#inicio") ?? frame);
    const options = { signal: lifetime.signal, passive: true };
    frame.addEventListener("pointerenter", seed, options);
    frame.addEventListener("pointermove", move, options);
    frame.addEventListener("pointerleave", leave, options);
    frame.addEventListener("pointercancel", leave, options);
    frame.addEventListener("wc-takeover", event => {
      const next = Math.max(0, Math.min(1, (event as CustomEvent<{ weight: number }>).detail.weight));
      if (uniforms.uMotionWeight.value === 0) lastDraw = 0;
      uniforms.uMotionWeight.value = next;
      if (next === 0) resetPointer();
      dirty = true;
      wake();
    }, options);
    window.addEventListener("resize", resize, options);
    window.addEventListener("blur", () => { focused = false; pause(); }, options);
    window.addEventListener("focus", () => { focused = true; resize(); }, options);
    document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); else resize(); }, options);
    resize();
  } catch { dispose(); }
  return dispose;
}
