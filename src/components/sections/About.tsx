import Image from "next/image";

export function About() {
  return (
    <section id="sobre" className="section about" aria-labelledby="about-title">
      <div className="container about__inner">
        <div className="about__image"><Image src="/images/wesley-about.png" alt="Wesley Caiã em retrato com suéter verde escuro" fill sizes="(max-width: 760px) 100vw, 40vw" /></div>
        <div className="about__content">
          <h2 id="about-title">Eu comecei entendendo máquinas. Hoje construo sistemas.</h2>
          <p>Minha relação com tecnologia começou antes das telas, desmontando aparelhos, analisando circuitos e entendendo como a eletricidade dá vida a mecanismos físicos. Na bancada de eletrônica e manutenção, aprendi a olhar cada componente com defeito e exigir paciência cirúrgica: um detalhe ignorado é capaz de impedir que tudo funcione.</p>
          <p>Quando cheguei ao software, percebi que a matéria-prima havia mudado, mas a curiosidade continuava exatamente a mesma. Queria entender o que acontece nos bastidores de cada clique, como as escolhas se transformam na rede e o que faria a lógica de negócios se traduzir em algo compreensível para quem está do outro lado.</p>
          <p>Hoje, meu trabalho diário está concentrado no desenvolvimento front-end e na engenharia de produtos digitais — construindo interfaces ágeis, consistentes e com acabamento de movimento intencional. Ao mesmo tempo, amplio continuamente minha visão em direção à arquitetura de sistemas, integração de backend e decisões técnicas que garantem robustez e longevidade para o que é colocado no ar.</p>
          <p>Acredito em tecnologia funcional, pensada para durar e desenhada com respeito ao tempo e à atenção de quem usa.</p>
        </div>
      </div>
    </section>
  );
}
