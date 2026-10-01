import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { narrativeSections } from "@/data/narrative";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header heading />
      <main id="conteudo" className="portfolio-main" tabIndex={-1}>
        <Hero />
        <div className="container foundation-following">
          {narrativeSections.map((section) => (
            <SectionPlaceholder key={section.id} {...section} />
          ))}
        </div>
      </main>
    </>
  );
}
