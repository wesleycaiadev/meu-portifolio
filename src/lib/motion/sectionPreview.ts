// Local developer preview only. Returning to system preferences updates the native
// URL and reconciles both new controllers without reloading or changing other scenes.
export function endSectionPreview() {
  const url = new URL(location.href);
  url.searchParams.delete("motion");
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new Event("section-motion-preview-end"));
}
