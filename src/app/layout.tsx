import type { ReactNode } from "react";
import { instrumentSerif, interTight } from "./fonts";
import "@/styles/globals.scss";
import { ProjectTransitionProvider } from "@/components/motion/ProjectTransitionProvider";
import { portfolioMetadata } from "@/lib/siteMetadata";

export const metadata = portfolioMetadata(
  "Wesley Caiã — Design & Desenvolvimento",
  "Portfólio de Wesley Caiã. Design e desenvolvimento de interfaces, aplicações e experiências digitais com identidade, código e movimento.",
  "/",
  "/assets/brand/social-home.png",
);

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${interTight.variable} ${instrumentSerif.variable}`}>
      <body><ProjectTransitionProvider>{children}</ProjectTransitionProvider></body>
    </html>
  );
}
