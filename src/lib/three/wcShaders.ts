export const wcVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  uniform float uInkHeight;
  uniform float uAmbientAmp;
  uniform vec2 uPointer;
  uniform vec2 uVelocity;
  uniform float uRadius;
  uniform float uBaseRadius;
  uniform float uRadiusGrowth;
  uniform float uForce;
  uniform vec4 uWake[6];
  uniform float uWakeAge[6];
  uniform float uEchoDistance;
  varying vec2 vUv;
  varying vec2 vMaskOffset;
  varying vec2 vEchoOffset;
  varying float vEchoStrength;

  float hash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }

  float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), f.x),
               mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), f.x), f.y);
  }

  vec2 toUv(vec2 heightUnits) {
    return heightUnits / vec2(uAspect, 1.0);
  }

  vec2 travellingWave(vec2 p) {
    float n = noise(p * 1.1 + vec2(uTime * 0.045, -uTime * 0.031)) - 0.5;
    float a = sin(p.x * 3.3 + p.y * 0.9 - uTime * 0.78 + n * 0.6);
    float b = sin(-p.x * 1.65 + p.y * 3.4 - uTime * 0.51 + 1.4 + n * 0.45);
    float c = sin(p.x * 4.7 - p.y * 2.2 - uTime * 1.02 + 2.4 + n * 0.35);
    return vec2(0.28 * a + 0.55 * b + 0.17 * c,
                0.76 * a - 0.14 * b + 0.10 * c);
  }

  vec2 ambientFlow(vec2 uv) {
    vec2 p = (uv - 0.5) * vec2(uAspect, 1.0) / uInkHeight;
    // Travelling phases carry a crest through the silhouette. Subtracting the
    // center anchors the viewing window without turning the wave into a pulse.
    return (travellingWave(p) - travellingWave(vec2(0.0))) * 0.5 * uAmbientAmp;
  }

  float field(vec2 uv, vec2 center, float radius) {
    float distance = length((uv - center) * vec2(uAspect, 1.0));
    float core = 1.0 - smoothstep(0.0, radius, distance);
    float spread = 1.0 - smoothstep(0.0, radius * 1.85, distance);
    return 0.68 * core + 0.32 * spread;
  }

  vec2 pointerFlow(vec2 uv, float core) {
    vec2 drag = uVelocity * core * 0.90;
    for (int i = 0; i < 6; i++) {
      float age = uWakeAge[i];
      if (age < 2.4) {
        float weight = 0.28;
        if (i == 1) weight = 0.24;
        if (i == 2) weight = 0.19;
        if (i == 3) weight = 0.14;
        if (i == 4) weight = 0.10;
        if (i == 5) weight = 0.05;
        float radius = (uBaseRadius + uRadiusGrowth * length(uWake[i].zw))
                       * (1.0 + min(age, 1.2) * 0.65);
        vec2 delta = (uv - uWake[i].xy) * vec2(uAspect, 1.0);
        float distance = length(delta);
        // A broad delayed crest carries a little energy into neighbouring
        // regions; the captured direction remains the primary influence.
        float crest = sin(distance / max(radius, 0.001) * 3.5 - age * 4.5);
        vec2 direction = uWake[i].zw;
        vec2 ripple = vec2(-direction.y, direction.x) * crest * 0.18;
        drag += (direction + ripple) * field(uv, uWake[i].xy, radius)
                * exp(-2.8 * age) * weight * 0.40;
      }
    }
    // Conservative bound also guarantees the provided transparent padding.
    drag /= max(1.0, length(drag));
    return drag * uForce;
  }

  void main() {
    vUv = uv;
    vec2 ambient = ambientFlow(uv);
    float core = field(uv, uPointer, uRadius);
    vec2 pointer = pointerFlow(uv, core);
    // Small geometric flex plus the remaining mask warp in the fragment shader.
    // Field evaluation at grid vertices keeps the fragment workload small.
    vec3 displaced = position;
    displaced.xy += toUv(ambient * 0.22);
    vMaskOffset = toUv(ambient * 0.78 + pointer);
    vEchoOffset = toUv(uVelocity * uEchoDistance * core);
    vEchoStrength = smoothstep(0.38, 0.82, length(uVelocity)) * core;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

export const wcFragmentShader = /* glsl */ `
  uniform sampler2D uMask;
  uniform float uEchoMix;
  varying vec2 vUv;
  varying vec2 vMaskOffset;
  varying vec2 vEchoOffset;
  varying float vEchoStrength;

  void main() {
    vec2 maskUv = vUv - vMaskOffset;
    float alpha = texture2D(uMask, maskUv).a;
    if (vEchoStrength > 0.001 && uEchoMix > 0.0) {
      // Positive sampling offset leaves a faint contour behind screen motion.
      // Preserve the solid primary mask; never blur/lighten its black interior.
      float nearEcho = texture2D(uMask, maskUv + vEchoOffset * 0.45).a;
      float farEcho = texture2D(uMask, maskUv + vEchoOffset).a;
      alpha = max(alpha, (nearEcho * 0.7 + farEcho * 0.3) * vEchoStrength * uEchoMix);
    }
    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
  }
`;
