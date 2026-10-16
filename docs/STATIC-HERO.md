# TASK 02.1 — simplificação do Hero

## Composição atual

A primeira viewport contém somente Wesley Caia no topo, WC central dominante e três destinos inferiores: Projetos, Sobre e Contato. Não há headline editorial, descrição, CTAs separados, moldura, painel ou sombras. O ritmo e a hierarquia seguem o princípio da referência de Gustavo; a marca e o sistema visual pertencem a Wesley.

A WC mantém proporção e orientação. O nome é o H1 discreto da home; o SVG decorativo não repete a marca para leitores de tela. O Header usa texto comum no playground, que mantém seu próprio H1. Os destinos são links nativos em uma lista dentro de uma navegação rotulada, com targets de 47px de altura e foco visível.

Inter Tight aparece no nome e nos controles. Instrument Serif continua disponível no sistema visual e no playground, sem trecho editorial no Hero.

## Layout

- Header de 5rem, sem links, background separado ou divisória.
- Hero com min-block-size baseado em 100svh, descontando o header.
- WC centralizada e limitada pela largura e altura disponíveis; enquadramento de até 72rem.
- Três pills transparentes, borda de 1px, sem ícones ou preenchimento no hover.
- Em 320 e 390px os três destinos continuam na mesma linha; fontes ampliadas podem refluí-los sem esconder destinos.
- Markup simples: nav, ul, li e a. Nenhum pseudo-elemento, mask ou efeito de borda foi implementado nos controles.
- O skip link foca o main sem desenhar uma moldura no contêiner de leitura. Links e botões mantêm o outline global de foco.

## Correção do fundo da logo

O Hero anterior não tinha uma borda CSS. A fonte fornecida possui uma prancheta branca opaca de 1080 × 1080 e um JPEG embutido com variações tonais, que apareciam como um retângulo sobre o off-white. Multiply conservava essas variações.

O original public/assets/brand/logo-symbol.svg permanece intacto. A apresentação conserva o viewBox 300 440 420 230 e usa um filtro SVG 2D estático para converter a luminância em transparência. Brancos acima de 90% tornam-se transparentes; o preto permanece opaco. Não há alteração de geometria, nova arte, filtro animado, shader ou WebGL. Os limites do filtro coincidem com a área visível, evitando processar a prancheta vazia inteira.

A limpeza remove o fundo perceptível, mas o arquivo continua rasterizado, com 1.594.568 bytes e sem paths editáveis. Uma fonte vetorial real continua necessária para futuras decisões de morphing/extrusão; esta tarefa não implementa essas técnicas.

## Capturas

- previews/task02-1-hero-desktop.png — 1440 × 900.
- previews/task02-1-hero-mobile.png — 390 × 844.

As capturas da TASK 02 são mantidas somente como histórico da composição anterior.

## Validação

- Lint, typecheck e build finais: passaram.
- Produção validada em 320 × 700, 390 × 844, 768 × 1024, 1024 × 768 e 1440 × 900: sem overflow horizontal, Hero completando a primeira viewport e marca centralizada.
- Alturas pequenas adicionais: 320 × 480, 390 × 568 e 768 × 400, sem overflow ou conteúdo inacessível.
- Os três destinos permanecem na mesma linha em 320 e 390px, com 47px de altura.
- Header sem links; Hero contendo somente os três rótulos de navegação, sem headline, descrição ou CTAs antigos.
- Computed styles: borda do Hero 0px, outline none, sombra none; controles transparentes com borda de 1px e duração de transição 0s.
- Tab passa pelo skip link e pelos três destinos, sempre com outline sólido de 2px visível. Enter navega e transfere o foco para Projetos, Sobre e Contato.
- Texto a 200% em 320px: sem overflow. Playground em 320px: sem overflow e com um H1.
- Nenhum canvas, animação ou erro de JavaScript. GSAP, ScrollTrigger, Lenis e Three.js seguem sem imports em src/.
- Documentos originais, public/assets/ e reference/ sem alterações no Git.

A TASK 03 não foi iniciada.
