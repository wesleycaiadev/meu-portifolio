import { existsSync } from "node:fs";
import path from "node:path";
import { contact, contactChannels } from "@/data/contact";
import { ContactAnchor } from "./ContactAnchor";
import styles from "./Contact.module.scss";
import ContactCards from "@/components/ui/contact-cards";

function availableResume() {
  const resume = contact.resume;
  if (!resume || !resume.href.startsWith("/") || !resume.href.toLowerCase().endsWith(".pdf")) return null;
  const publicRoot = path.resolve(process.cwd(), "public");
  const file = path.resolve(publicRoot, `.${resume.href}`);
  return file.startsWith(`${publicRoot}${path.sep}`) && existsSync(file) ? resume : null;
}

export function Contact() {
  const resume = availableResume();
  return (
    <section id="contato" className={`surface--dark ${styles.section}`} aria-labelledby="contato-titulo" tabIndex={-1}>
      <div className={styles.threshold} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <p className={styles.label}>Contato</p>
        <h2 id="contato-titulo" className={styles.heading}>Toda boa ideia<br />merece <em>sair do papel.</em></h2>
        <a className={styles.invitation} href={contactChannels[0].href} aria-label="Vamos conversar pelo WhatsApp">
          <span>Vamos <em>conversar?</em></span>
        </a>
        <ContactCards channels={contactChannels} />
        {resume && <a href={resume.href} download={resume.fileName} className={styles.resume}>Baixar currículo <span aria-hidden="true">↓</span></a>}
      </div>
      <ContactAnchor />
    </section>
  );
}
