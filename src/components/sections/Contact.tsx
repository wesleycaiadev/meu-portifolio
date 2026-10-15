import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import { contact, contactChannels } from "@/data/contact";
import { ContactAnchor } from "./ContactAnchor";
import styles from "./Contact.module.scss";

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
          <span>Vamos <em>conversar?</em></span><span className={styles.invitationArrow} aria-hidden="true">↗</span>
        </a>
        <nav aria-label="Canais de contato" className={styles.channels}>
          {contactChannels.map(channel => (
            <a key={channel.id} href={channel.href} className={styles.channel} data-contact-channel={channel.id}>
              <span className={styles.channelTitle}>
                {channel.icon ? <Image src={channel.icon} width={24} height={24} alt="" aria-hidden="true" className={styles.channelIcon} />
                  : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" /><path d="m3 5 9 8 9-8" stroke="currentColor" strokeWidth="1.5" /></svg>}
                {channel.name}<span className={styles.channelArrow} aria-hidden="true">↗</span>
              </span>
              <span className={styles.channelDetail}>{channel.detail}</span>
            </a>
          ))}
        </nav>
        {resume && <a href={resume.href} download={resume.fileName} className={styles.resume}>Baixar currículo <span aria-hidden="true">↓</span></a>}
      </div>
      <ContactAnchor />
    </section>
  );
}
