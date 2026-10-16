"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent } from "react";
import styles from "./contact-cards.module.scss";

type ContactLink = { id: string; name: string; detail: string; href: string; icon: string | null };
const descriptions: Record<string, string> = {
  whatsapp: "Converse comigo sobre sua ideia ou projeto.",
  email: "Prefere escrever? Envie uma mensagem por e-mail.",
  linkedin: "Conheça meu perfil e minha trajetória profissional.",
};

function ChannelIcon({ channel, size = 24 }: { channel: ContactLink; size?: number }) {
  return channel.icon
    ? <Image src={channel.icon} width={size} height={size} alt="" aria-hidden="true" className={styles.icon} />
    : <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" /><path d="m3 5 9 8 9-8" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* Try the local selection fallback. */ }
  const field = document.createElement("textarea");
  field.value = text; field.readOnly = true;
  field.style.cssText = "position:fixed;inset:0 auto auto 0;opacity:0;pointer-events:none";
  const focused = document.activeElement;
  try {
    document.body.append(field); field.select();
    return document.execCommand("copy");
  } catch { return false; }
  finally { field.remove(); if (focused instanceof HTMLElement) focused.focus({ preventScroll: true }); }
}

export function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; clearTimeout(timeout.current); }; }, []);
  const copy = async () => {
    const copied = await copyText(email);
    if (!mounted.current) return;
    clearTimeout(timeout.current); setState(copied ? "copied" : "manual");
    if (copied) timeout.current = setTimeout(() => setState("idle"), 3000);
  };
  return <div className={styles.copyArea}>
    <button type="button" className={styles.copy} onClick={() => { void copy(); }} aria-label="Copiar e-mail">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M15 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="1.5" /></svg>
      {state === "copied" ? "E-mail copiado" : "Copiar e-mail"}
    </button>
    <span className={styles.assistive} role="status">{state === "copied" ? "E-mail copiado para a área de transferência." : state === "manual" ? "Não foi possível copiar automaticamente. Selecione o endereço abaixo." : ""}</span>
    {state === "manual" && <input aria-label="E-mail para copiar manualmente" value={email} readOnly className={styles.manual} onFocus={event => event.currentTarget.select()} />}
  </div>;
}

export default function ContactCards({ channels }: { channels: readonly ContactLink[] }) {
  const nav = useRef<HTMLElement>(null), content = useRef<HTMLDivElement>(null);
  const anchors = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState(0), [open, setOpen] = useState(false), [direction, setDirection] = useState(1);
  const [box, setBox] = useState({ left: 0, width: 0, height: 0 });
  const panelId = useId();
  const channel = channels[active];

  useEffect(() => {
    if (!open || !nav.current || !content.current) return;
    const update = () => {
      const root = nav.current, card = content.current, anchor = anchors.current[active];
      if (!root || !card || !anchor) return;
      if (!matchMedia("(min-width: 48rem)").matches) { setOpen(false); return; }
      const bounds = root.getBoundingClientRect(), link = anchor.getBoundingClientRect();
      const width = Math.min(card.offsetWidth, bounds.width);
      setBox({ left: Math.max(width / 2, Math.min(bounds.width - width / 2, link.left - bounds.left + link.width / 2)), width, height: card.offsetHeight });
    };
    const observer = new ResizeObserver(update);
    observer.observe(nav.current); observer.observe(content.current);
    return () => observer.disconnect();
  }, [active, open]);

  const show = (index: number) => {
    if (!matchMedia("(min-width: 48rem)").matches) return;
    setDirection(index >= active ? 1 : -1); setActive(index); setOpen(true);
  };
  const blur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  };
  const escape = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") { setOpen(false); event.stopPropagation(); }
  };

  return <nav ref={nav} aria-label="Canais de contato" className={styles.channels} data-preview-open={open && box.height > 0}
    onPointerLeave={() => { if (!nav.current?.contains(document.activeElement)) setOpen(false); }} onBlur={blur} onKeyDown={escape}>
    {channels.map((item, index) => <div key={item.id} className={styles.item}>
      <a ref={element => { anchors.current[index] = element; }} href={item.href} className={styles.channel}
        data-contact-channel={item.id} onPointerEnter={event => { if (event.pointerType !== "touch") show(index); }} onFocus={() => show(index)}>
        <span className={styles.title}><ChannelIcon channel={item} />{item.name}</span>
        <span className={styles.detail}>{item.detail}</span>
      </a>
      {item.id === "email" && <CopyEmailButton email={item.detail} />}
    </div>)}
    <div id={panelId} className={styles.panel} data-contact-preview={channel?.id} data-open={open && box.height > 0} aria-hidden={!open}
      style={{ left: box.left, width: box.width, height: box.height }}>
      {channel && <div ref={content} key={channel.id} className={styles.card} style={{ "--card-direction": direction } as CSSProperties}>
        <p className={styles.cardDescription}>{descriptions[channel.id]}</p>
      </div>}
    </div>
  </nav>;
}
