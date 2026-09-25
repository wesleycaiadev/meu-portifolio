import { ContactForm } from "@/components/sections/ContactForm";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contact } from "@/data/site";

const channels = [
  { label: "WhatsApp", icon: "whatsapp" as const, href: contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : "" },
  { label: "LinkedIn", icon: "linkedin" as const, href: contact.linkedin },
  { label: "E-mail", icon: "email" as const, href: contact.email ? `mailto:${contact.email}` : "" },
  { label: "Currículo", icon: "download" as const, href: contact.resume },
];

export function Contact() {
  return (
    <section id="contato" className="section contact" aria-labelledby="contact-title">
      <div className="container contact__inner">
        <div className="contact__content">
          <h2 id="contact-title">Tem algo interessante para construir?</h2>
          <p>Estou aberto a oportunidades, projetos e conversas sobre produto e tecnologia.</p>
          <ul className="contact__socials" aria-label="Canais de contato">
            {channels.map((channel) => <li key={channel.label}>{channel.href ? <a href={channel.href} aria-label={channel.label} target={channel.icon === "linkedin" || channel.icon === "whatsapp" ? "_blank" : undefined} rel={channel.icon === "linkedin" || channel.icon === "whatsapp" ? "noopener noreferrer" : undefined}><SocialIcon name={channel.icon} /></a> : <span aria-label={`${channel.label} em breve`} title={`${channel.label} ainda não configurado`}><SocialIcon name={channel.icon} /></span>}</li>)}
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
