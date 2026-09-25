import { navigation } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div><a className="wordmark" href="#inicio">Wesley Caiã</a><p>Front-end Developer</p></div>
          <nav aria-label="Navegação do rodapé">{navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
        </div>
        <div className="site-footer__bottom"><span>Sergipe, Brasil</span><span>© {new Date().getFullYear()} Wesley Caiã. Todos os direitos reservados.</span></div>
      </div>
    </footer>
  );
}
