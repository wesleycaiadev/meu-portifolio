import { TemporaryHeader } from "@/components/layout/TemporaryHeader";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { narrativeSections } from "@/data/narrative";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <TemporaryHeader />
      <main id="conteudo" className="foundation-main" tabIndex={-1}>
        <p>Portfólio em construção · Fundação do projeto</p>
        {narrativeSections.map((section) => (
          <SectionPlaceholder key={section.id} {...section} />
        ))}
      </main>
    </>
  );
}
