import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { narrativeSections } from "@/data/narrative";
import { HeroTakeover } from "@/components/motion/HeroTakeover";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { ProjectReturnAnchor } from "@/components/layout/ProjectReturnAnchor";
import { Expertise } from "@/components/sections/Expertise";
import { Process } from "@/components/sections/Process";

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
        <Expertise />
        <Process />
        <div className="container foundation-following">
          {narrativeSections.filter(section => section.id === "contato").map((section) => (
            <SectionPlaceholder key={section.id} {...section} />
          ))}
        </div>
      </main>
    </>
  );
}
