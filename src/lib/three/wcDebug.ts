export type WcDebugSnapshot = {
  width: number;
  height: number;
  pointer: readonly [number, number];
  target: readonly [number, number];
  velocity: readonly [number, number];
  radius: number;
  force: number;
  segments: readonly [number, number];
  inkBounds: { left: number; top: number; width: number; height: number };
  time: number;
  ambientAmplitude: number;
  wakeCount: number;
  fps: number;
  echo: boolean;
};

// Imported only by the development-only ?wc-debug branch. No global listeners,
// perpetual RAF, production cursor replacement or changes to the layout.
export function createWcDebug(frame: HTMLElement) {
  const ns = "http://www.w3.org/2000/svg";
  const layer = document.createElement("div");
  layer.dataset.wcDebug = "";
  layer.style.cssText = "position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden";
  const svg = document.createElementNS(ns, "svg");
  svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
  const circle = document.createElementNS(ns, "circle");
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke", "#cc2659");
  circle.setAttribute("stroke-dasharray", "4 4");
  const point = document.createElementNS(ns, "circle");
  point.setAttribute("r", "4");
  point.setAttribute("fill", "#cc2659");
  const vector = document.createElementNS(ns, "line");
  vector.setAttribute("stroke", "#cc2659");
  vector.setAttribute("stroke-width", "3");
  svg.append(circle, vector, point);
  const readout = document.createElement("pre");
  readout.style.cssText = "position:absolute;top:0;left:0;margin:0;padding:8px;font:12px/1.5 monospace;color:#7a1435;background:#f4f2edee;white-space:pre-wrap";
  layer.append(svg, readout);
  frame.append(layer);

  return {
    update(s: WcDebugSnapshot) {
      const x = s.pointer[0] * s.width;
      const y = (1 - s.pointer[1]) * s.height;
      const radius = s.radius * s.height;
      svg.setAttribute("viewBox", `0 0 ${s.width} ${s.height}`);
      circle.setAttribute("cx", String(x));
      circle.setAttribute("cy", String(y));
      circle.setAttribute("r", String(radius));
      point.setAttribute("cx", String(s.target[0] * s.width));
      point.setAttribute("cy", String((1 - s.target[1]) * s.height));
      vector.setAttribute("x1", String(x));
      vector.setAttribute("y1", String(y));
      vector.setAttribute("x2", String(x + s.velocity[0] * radius));
      vector.setAttribute("y2", String(y - s.velocity[1] * radius));

      const f = (n: number) => n.toFixed(3);
      const inkUv = [(s.target[0] - s.inkBounds.left) / s.inkBounds.width, (s.target[1] - (1 - s.inkBounds.top - s.inkBounds.height)) / s.inkBounds.height];
      readout.textContent = `WC DEBUG · development only\nUV texture (${s.target.map(f).join(", ")}) · ink (${inkUv.map(f).join(", ")})\ndamped UV (${s.pointer.map(f).join(", ")}) · velocity (${s.velocity.map(f).join(", ")})\nradius ${radius.toFixed(1)}px · max force ${(s.force * s.height).toFixed(1)}px · speed ${(Math.hypot(...s.velocity) * 100).toFixed(1)}%\nambient ${(s.ambientAmplitude * s.height).toFixed(1)}px · time ${s.time.toFixed(2)}s · ${s.fps} FPS target\nmesh ${s.segments.join(" × ")} · XY + UV warp · memory ${s.wakeCount}/6 · echo ${s.echo ? "enabled locally" : "off"}`;
      layer.dataset.wcSnapshot = JSON.stringify(s);
    },
    dispose() { layer.remove(); },
  };
}
