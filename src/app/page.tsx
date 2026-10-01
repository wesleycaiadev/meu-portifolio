import { TemporaryHeader } from "@/components/layout/TemporaryHeader";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { narrativeSections } from "@/data/narrative";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <TemporaryHeader />
      <main id="conteudo" className="container" tabIndex={-1}>
        <div className="foundation-intro">
          <p className="label text-secondary">Portfólio em construção · Estrutura temporária</p>
          <Link href="/playground">Abrir playground visual</Link>
        </div>
        {narrativeSections.map((section) => (
          <SectionPlaceholder key={section.id} {...section} />
        ))}
      </main>
    </>
  );
}
import Link from "next/link";
