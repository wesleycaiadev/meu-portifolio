import type { Metadata } from "next";
import type { ReactNode } from "react";
import { instrumentSerif, interTight } from "./fonts";
import "@/styles/globals.scss";
import { ProjectTransitionProvider } from "@/components/motion/ProjectTransitionProvider";

export const metadata: Metadata = {
  title: "Wesley Caiã",
  description: "Portfólio de Wesley Caiã.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${interTight.variable} ${instrumentSerif.variable}`}>
      <body><ProjectTransitionProvider>{children}</ProjectTransitionProvider></body>
    </html>
  );
}
