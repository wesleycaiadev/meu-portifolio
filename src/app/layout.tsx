import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Wesley Caia — Portfólio em construção",
  description: "Fundação do novo portfólio de Wesley Caia.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
