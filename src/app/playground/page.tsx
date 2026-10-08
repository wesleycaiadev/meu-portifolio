import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ButtonSample } from "@/components/ui/ButtonSample";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Playground visual — Wesley Caiã",
  description: "Página temporária para revisão da fundação visual da TASK 01.",
  robots: { index: false, follow: false },
};

export default function PlaygroundPage() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <div className={`container ${styles.intro}`}>
          <p className="label text-secondary">TASK 01 · Playground temporário</p>
          <h1>Fundação visual</h1>
          <p className="prose">Uma amostra de escala, espaço e contraste. Este conteúdo serve apenas para revisar o sistema visual; não é o Hero nem o texto final do portfólio.</p>
          <Link href="/">Voltar à estrutura provisória</Link>
        </div>
        <section className={`surface--light ${styles.sample}`} aria-labelledby="amostra-clara">
          <div className="container editorial-grid">
            <p className={`label text-secondary ${styles.annotation}`}>01 · Superfície clara</p>
            <div className={styles.content}>
              <h2 id="amostra-clara">Escala, ritmo e <em className="editorial-emphasis">contraste.</em></h2>
              <h3>Títulos e texto corrido</h3>
              <p className="prose">Inter Tight conduz a leitura, os títulos e a interface. Instrument Serif italic aparece em um trecho curto, como contraste editorial. As duas famílias foram aprovadas na TASK 02.</p>
              <p className="prose text-secondary">Texto secundário: informação de apoio com contraste próprio, sem reduzir a opacidade de todo o conteúdo.</p>
              <div className={styles.actions}>
                <ButtonSample />
                <div>
                  <button className="button" type="button" disabled>Exemplo indisponível</button>
                  <p className="label text-secondary">Amostra do estado desabilitado.</p>
                </div>
              </div>
              <p><a href="#amostra-escura">Ver a mesma base em fundo escuro</a></p>
            </div>
          </div>
        </section>
        <section className={`surface--dark ${styles.sample}`} aria-labelledby="amostra-escura">
          <div className="container editorial-grid">
            <p className={`label text-secondary ${styles.annotation}`}>02 · Superfície escura</p>
            <div className={styles.content}>
              <h2 id="amostra-escura">O mesmo sistema, <em className="editorial-emphasis">outra superfície.</em></h2>
              <h3>Hierarquia preservada</h3>
              <p className="prose">As dimensões e a ordem de leitura permanecem. Superfícies, textos, bordas e controles recebem os papéis semânticos da base escura.</p>
              <p className="prose text-secondary">Texto secundário: o apoio permanece legível sobre preto profundo, sem glow, gradientes ou sombras decorativas.</p>
              <div className={styles.actions}><ButtonSample /></div>
              <p><a href="#amostra-clara">Voltar à amostra clara</a></p>
            </div>
          </div>
        </section>
      </main>
      <footer className={`container ${styles.footer}`}>
        <p className="label text-secondary">Amostra de desenvolvimento · Inter Tight + Instrument Serif italic.</p>
      </footer>
    </>
  );
}
