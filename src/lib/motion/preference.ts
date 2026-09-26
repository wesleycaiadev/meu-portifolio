export function isMotionPreview() {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return false;

  const { hostname, search } = window.location;
  const local = hostname === "localhost" || hostname === "127.0.0.1";
  return local && new URLSearchParams(search).get("motion") === "preview";
}

export function motionQuery(condition?: string) {
  const preference = isMotionPreview()
    ? "(min-width: 0px)"
    : "(prefers-reduced-motion: no-preference)";

  return condition ? `${condition} and ${preference}` : preference;
}
