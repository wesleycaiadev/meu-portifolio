export type TransitionPoint = { x: number; y: number };
export type TransitionQuad = readonly [TransitionPoint, TransitionPoint, TransitionPoint, TransitionPoint];

export type ProjectTransitionDestination = {
  surface: TransitionQuad;
  play: () => void;
};

// Map the measured image rectangle to the four projected corners of the notebook.
// CSS and WebGL use the same viewport coordinates; no resolution-specific offsets.
export function projectiveMatrix(points: TransitionQuad, width: number, height: number) {
  const [p0, p1, p2, p3] = points;
  const dx1 = p1.x - p2.x, dx2 = p3.x - p2.x;
  const dy1 = p1.y - p2.y, dy2 = p3.y - p2.y;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy3 = p0.y - p1.y + p2.y - p3.y;
  const determinant = dx1 * dy2 - dx2 * dy1;
  const g = Math.abs(determinant) > .001 ? (dx3 * dy2 - dx2 * dy3) / determinant : 0;
  const h = Math.abs(determinant) > .001 ? (dx1 * dy3 - dx3 * dy1) / determinant : 0;
  const a = p1.x - p0.x + g * p1.x, b = p3.x - p0.x + h * p3.x;
  const d = p1.y - p0.y + g * p1.y, e = p3.y - p0.y + h * p3.y;
  return `matrix3d(${a / width},${d / width},0,${g / width},${b / height},${e / height},0,${h / height},0,0,1,0,${p0.x},${p0.y},0,1)`;
}
