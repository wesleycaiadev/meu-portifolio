import { navigation } from "@/data/site";

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="wordmark" href="#inicio" aria-label="Wesley Caiã, voltar ao início">Wesley Caiã</a>
        <nav className="site-header__nav" aria-label="Navegação principal">
          {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <a className="header-cta" href="#contato">Vamos conversar</a>
      </div>
    </header>
  );
}
