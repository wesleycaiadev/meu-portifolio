// Destinations confirmed directly by Wesley in the portfolio brief.
export const contact = {
  name: "Wesley Caiã",
  role: "Design & Desenvolvimento",
  email: "wesleycaia.dev@gmail.com",
  whatsapp: { number: "5579998356598", display: "+55 79 99835-6598" },
  linkedin: "https://www.linkedin.com/in/wesley-caia-dev/",
  // Add a real PDF under public/ and set its public path here when available.
  resume: null as { href: string; fileName: string } | null,
} as const;

export const contactChannels = [
  { id: "whatsapp", name: "WhatsApp", detail: contact.whatsapp.display, href: `https://wa.me/${contact.whatsapp.number}`, icon: "/assets/contact/whatsapp.svg" },
  { id: "email", name: "E-mail", detail: contact.email, href: `mailto:${contact.email}`, icon: null },
  { id: "linkedin", name: "LinkedIn", detail: "wesley-caia-dev", href: contact.linkedin, icon: "/assets/contact/linkedin.svg" },
] as const;
