import Image from "next/image";
import { HeroMotion } from "@/components/motion/HeroMotion";
import { SignalPaths } from "@/components/motion/TraceField";

export function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <SignalPaths />
        <div className="hero__aura" aria-hidden="true"><div className="hero__aura-core" /></div>
        <div className="hero__content">
          <h1 id="hero-title">Transformo ideias em experiências digitais que funcionam tão bem quanto parecem.</h1>
          <p>Eu construo experiências digitais combinando desenvolvimento front-end, interface, arquitetura e visão de produto.</p>
          <div className="hero__actions">
            <a className="button button--light" href="#projetos">Ver projetos</a>
            <a className="button button--outline" href="#sobre">Sobre mim</a>
          </div>
        </div>
        <div className="hero__portrait">
          <div className="hero__portrait-media">
            <Image src="/images/wesley-hero.png" alt="Retrato de Wesley Caiã com camiseta preta" fill priority sizes="(max-width: 700px) 100vw, (max-width: 1000px) 38vw, 36vw" />
          </div>
        </div>
      </div>
      <HeroMotion />
    </section>
  );
}
