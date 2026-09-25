"use client";

import type { FormEvent } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { contact } from "@/data/site";

function buildMessage(data: FormData) {
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const subject = String(data.get("subject") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();
  return { subject, body: `Olá, Wesley!\n\n${message}\n\nNome: ${name}\nE-mail: ${email}` };
}

export function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const channel = submitter?.value;
    const { subject, body } = buildMessage(new FormData(event.currentTarget));

    if (channel === "whatsapp" && contact.whatsapp) {
      window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`, "_blank", "noopener,noreferrer");
    }
    if (channel === "email" && contact.email) {
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  }

  return (
    <form id="formulario-contato" className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__row">
        <label>Nome<input name="name" type="text" placeholder="Seu nome" autoComplete="name" required /></label>
        <label>E-mail<input name="email" type="email" placeholder="seu@email.com" autoComplete="email" required /></label>
      </div>
      <label>Assunto<input name="subject" type="text" placeholder="Sobre o que vamos conversar?" required /></label>
      <label>Mensagem<textarea name="message" rows={5} placeholder="Fale um pouco sobre o projeto, expectativas e prazos..." required /></label>
      <div className="contact-form__actions">
        <button className="button button--light" type="submit" value="whatsapp" disabled={!contact.whatsapp} title={!contact.whatsapp ? "WhatsApp ainda não configurado" : undefined}>Enviar pelo WhatsApp <ArrowIcon diagonal /></button>
        <button className="button button--outline" type="submit" value="email" disabled={!contact.email} title={!contact.email ? "E-mail ainda não configurado" : undefined}>Enviar por e-mail <ArrowIcon diagonal /></button>
      </div>
    </form>
  );
}
