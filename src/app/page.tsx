import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { narrativeSections } from "@/data/narrative";
import { HeroTakeover } from "@/components/motion/HeroTakeover";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { ProjectReturnAnchor } from "@/components/layout/ProjectReturnAnchor";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <main id="conteudo" className="portfolio-main" tabIndex={-1}>
        <HeroTakeover>
          <Header heading />
          <Hero />
        </HeroTakeover>
        <About />
        <Projects />
        <ProjectReturnAnchor />
        <div className="container foundation-following">
          {narrativeSections.filter(section => section.id !== "sobre" && section.id !== "projetos").map((section) => (
            <SectionPlaceholder key={section.id} {...section} />
          ))}
        </div>
      </main>
    </>
  );
}
