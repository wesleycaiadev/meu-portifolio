import type { Metadata } from "next";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Wesley Caiã — Front-end Developer",
  description:
    "Portfólio de Wesley Caiã. Experiências digitais que unem desenvolvimento front-end, interface, arquitetura e visão de produto.",
  openGraph: {
    title: "Wesley Caiã — Front-end Developer",
    description: "Ideias transformadas em experiências digitais.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
