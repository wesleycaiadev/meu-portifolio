import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { HeroTakeover } from "@/components/motion/HeroTakeover";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { ProjectReturnAnchor } from "@/components/layout/ProjectReturnAnchor";
import { Expertise } from "@/components/sections/Expertise";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

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
        <Contact />
      </main>
      <Footer />
    </>
  );
}
