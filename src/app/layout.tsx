import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "@/styles/globals.scss";
import { TraceField } from "@/components/motion/TraceField";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

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
      <body>
        <TraceField />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
