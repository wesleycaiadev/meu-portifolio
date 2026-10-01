import { BorderLink } from "@/components/ui/BorderLink";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section id="inicio" className={`container ${styles.hero}`} aria-label="Início">
      <div className={styles.brandStage}>
        {/* Viewing window around the supplied artwork. The original SVG is unchanged. */}
        <svg className={styles.brand} viewBox="300 440 420 230" aria-hidden="true" focusable="false">
          <defs>
            {/* Static white-to-transparent matte for the supplied monochrome raster.
                Bounds match the viewing window; the source and geometry are unchanged. */}
            <filter id="wc-transparent-background" filterUnits="userSpaceOnUse" x="300" y="440" width="420" height="230" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.2126 -0.7152 -0.0722 0 1" />
              {/* Whites above 90% luminance are background; solid black stays opaque. */}
              <feComponentTransfer><feFuncA type="linear" slope="1.111111" intercept="-0.111111" /></feComponentTransfer>
            </filter>
          </defs>
          <image href="/assets/brand/logo-symbol.svg" width="1080" height="1080" filter="url(#wc-transparent-background)" />
        </svg>
      </div>
      <nav className={styles.navigation} aria-label="Navegação principal">
        <ul>
          <li><BorderLink href="#projetos">Projetos</BorderLink></li>
          <li><BorderLink href="#sobre">Sobre</BorderLink></li>
          <li><BorderLink href="#contato">Contato</BorderLink></li>
        </ul>
      </nav>
    </section>
  );
}
