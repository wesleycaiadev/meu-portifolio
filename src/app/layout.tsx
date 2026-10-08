import type { Metadata } from "next";
import type { ReactNode } from "react";
import { instrumentSerif, interTight } from "./fonts";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Wesley Caiã",
  description: "Portfólio de Wesley Caiã.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${interTight.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
