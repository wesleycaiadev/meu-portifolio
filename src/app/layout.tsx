import type { ReactNode } from "react";
import { instrumentSerif, interTight } from "./fonts";
import "@/styles/globals.scss";
import { ProjectTransitionProvider } from "@/components/motion/ProjectTransitionProvider";
import { portfolioMetadata } from "@/lib/siteMetadata";
import Script from "next/script";
import { MotionControl } from "@/components/motion/MotionControl";
import { motionPreferenceBootstrap } from "@/lib/motion/preference";

export const metadata = portfolioMetadata(
  "Wesley Caiã — Design & Desenvolvimento",
  "Portfólio de Wesley Caiã. Design e desenvolvimento de interfaces, aplicações e experiências digitais com identidade, código e movimento.",
  "/",
);

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${interTight.variable} ${instrumentSerif.variable}`} data-motion="full" suppressHydrationWarning>
      <body>
        <Script id="portfolio-motion-preference" strategy="beforeInteractive">{motionPreferenceBootstrap}</Script>
        <ProjectTransitionProvider>{children}</ProjectTransitionProvider>
        <MotionControl />
      </body>
    </html>
  );
}
