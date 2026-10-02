// Loaded only in development and only on ?wc-preview=1. The controls live
// outside the decorative, aria-hidden identity and never change Hero layout.
export function createWcMotionPreview(frame: HTMLElement, onChange: (enabled: boolean) => void) {
  const lifetime = new AbortController();
  const panel = document.createElement("aside");
  panel.dataset.wcPreview = "";
  panel.setAttribute("aria-label", "Prévia de movimento da WC");
  panel.style.cssText = "position:fixed;top:16px;right:16px;z-index:1000;width:270px;max-width:calc(100vw - 32px);padding:14px;background:#fff;color:#171717;border:1px solid #aaa;border-radius:8px;font:13px/1.45 system-ui;box-sizing:border-box";
  const title = document.createElement("strong");
  title.textContent = "Prévia ao vivo · TASK 06";
  const explanation = document.createElement("p");
  explanation.style.cssText = "margin:8px 0";
  explanation.textContent = "Ativar esta prévia permite movimento mesmo com a preferência de movimento reduzido. Não altera o Windows.";
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.wcPreviewToggle = "";
  button.style.cssText = "min-height:44px;padding:8px 12px;border:1px solid currentColor;border-radius:6px;background:transparent;color:inherit;font:inherit;cursor:pointer";
  button.textContent = "Ativar animação";
  button.setAttribute("aria-pressed", "false");
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.style.cssText = "margin:8px 0 0;font-size:12px";
  const pointer = matchMedia("(hover: hover) and (pointer: fine)");
  let enabled = false;
  const update = () => {
    button.disabled = !pointer.matches;
    button.style.cursor = pointer.matches ? "pointer" : "not-allowed";
    status.textContent = !pointer.matches ? "Prévia disponível em desktop com mouse. Touch permanece estático."
      : !enabled ? "Prévia desativada. Clique para visualizar."
      : frame.dataset.wcReady !== "true" ? "Inicializando a animação…"
      : `Animação ativa · ${frame.dataset.wcState === "active" ? "interação" : "onda ambiente"}. Role para ver a transição e o retrato entrar em foco.`;
  };
  button.addEventListener("click", () => {
    enabled = !enabled;
    button.textContent = enabled ? "Desativar animação" : "Ativar animação";
    button.setAttribute("aria-pressed", String(enabled));
    onChange(enabled);
    update();
  }, { signal: lifetime.signal });
  pointer.addEventListener("change", update, { signal: lifetime.signal });
  const observer = new MutationObserver(update);
  observer.observe(frame, { attributes: true, attributeFilter: ["data-wc-ready", "data-wc-state"] });
  panel.append(title, explanation, button, status);
  document.body.append(panel);
  update();
  return () => {
    lifetime.abort();
    observer.disconnect();
    panel.remove();
  };
}
