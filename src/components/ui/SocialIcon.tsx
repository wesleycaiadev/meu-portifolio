type IconName = "whatsapp" | "linkedin" | "email" | "download";

export function SocialIcon({ name }: { name: IconName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (name) {
    case "whatsapp":
      return <svg aria-hidden="true" viewBox="0 0 24 24" {...common}><path d="M12 3a9 9 0 0 0-7.75 13.58L3 21l4.57-1.2A9 9 0 1 0 12 3Z" /><path d="M8.4 8.1c-.28.22-.64.77-.64 1.53 0 1.63 2.24 4.4 4.9 5.62 1.15.53 2.15.5 2.85.31.58-.17 1.34-.83 1.5-1.35.13-.43.13-.8-.07-.94l-2.07-.98c-.2-.1-.38-.08-.54.13l-.77.93c-.15.17-.32.2-.55.08-.42-.21-1.77-.94-2.68-2.7-.18-.34.1-.46.28-.7.16-.2.34-.42.4-.65.08-.24.04-.42-.07-.59l-.96-1.65c-.18-.31-.42-.31-.66-.29Z" /></svg>;
    case "linkedin":
      return <svg aria-hidden="true" viewBox="0 0 24 24" {...common}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.7 10v7M7.7 7.2v.1M11 17v-7h3v1.1c.5-.8 1.25-1.3 2.4-1.3 1.8 0 2.6 1.1 2.6 3.2V17M14 13.1V17" /></svg>;
    case "email":
      return <svg aria-hidden="true" viewBox="0 0 24 24" {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
    case "download":
      return <svg aria-hidden="true" viewBox="0 0 24 24" {...common}><path d="M12 3v12m-4-4 4 4 4-4M4 17v3h16v-3" /></svg>;
  }
}
