# TASK 03 — Hero nav border interaction

## Implementação

Os três destinos usam `BorderLink`, mantendo os mesmos anchors, textos, dimensões,
padding e borda CSS da TASK 02.1. A WC, Header e composição do Hero permanecem iguais.

Um `rect` SVG decorativo acompanha o perímetro da pill, sobre a borda existente.
`pathLength="1"` normaliza o desenho; CSS transiciona `stroke-dashoffset` de 1 para 0.
O percurso começa no topo e segue no sentido horário. A geometria segue a
[definição de retângulos arredondados do SVG](https://www.w3.org/TR/SVG2/shapes.html#RectElement).

- Duração: **420 ms**, token `--duration-nav-border`.
- Easing: **cubic-bezier(0.2, 0, 0.2, 1)**, token existente `--ease-feedback`.
- Saída do ponteiro: reversão suave até esconder o traço secundário. A transição
  CSS também reverte a partir do progresso atual em entradas/saídas rápidas.
- Foco por teclado: borda completa imediatamente, mantendo outline global de
  2 px com offset de 4 px. O foco não depende do desenho animado.
- Active: reforço de contraste, sem escala, transformação ou mudança de tamanho.
- Reduced motion: transição desativada; destaque e retorno imediatos.
- Hover habilitado apenas para `(hover: hover) and (pointer: fine)`.

SVG foi escolhido pela correspondência precisa entre o traço e o perímetro.
Pseudo-elementos segmentados exigiriam sincronização entre vários trechos;
máscaras cônicas criariam uma varredura angular, com velocidade desigual ao longo
da pill. O SVG usa uma única transição e acompanha cada largura sem distorcer
as curvas ou a espessura.

Um `ResizeObserver` por link mede o border-box quando ele muda, inclusive após
carregar fontes ou redimensionar texto. Não há loop, listener de ponteiro ou
JavaScript por frame. Os SVGs ficam fora do fluxo, ignoram eventos de ponteiro
e estão ocultos para tecnologias assistivas. O observer é desconectado no unmount.

## Validação

- `npm run lint`: passou, sem warnings.
- `npm run typecheck`: passou.
- `npm run build`: passou; home continua prerenderizada.
- Aplicação de produção iniciada em `http://127.0.0.1:3000`.
- Edge headless: três links desenham a borda, completam o percurso e revertem.
  Foram observados valores intermediários de `stroke-dashoffset` na entrada e
  na saída, incluindo uma entrada curta seguida de saída.
- Nenhuma mudança nos retângulos dos links, WC, Header ou Hero durante a interação;
  nenhum evento de layout shift observado.
- Comparação antes/depois em 1440×900, 390×844 e 320×700: todas as dimensões e
  posições coincidem, sem overflow horizontal. Pixels do Hero parado coincidem;
  no mobile, a única diferença fica nos 4 px da scrollbar nativa sobreposta.
- Tab percorre Projetos, Sobre e Contato, com foco completo e imediato.
  Enter navega para o destino; clique também funciona.
- Reduced motion emulado: offset final imediato, transition `none`, zero animações.
  O ambiente de validação também possui essa preferência ativada por padrão.
- Touch emulado em 390 e 320 px: os três destinos navegam para os respectivos
  fragments, sem hover/focus-visible ou traço secundário preso após tocar.
- Texto a 200% em 320 px: sem overflow; a geometria SVG acompanha o tamanho real.
- Nenhuma exceção de runtime capturada.
- `package.json`, lockfile, referências e assets fornecidos permanecem intactos.
  Nenhuma dependência nova, biblioteca de motion ou WebGL foi adicionada ao efeito.

## Arquivos desta tarefa

Modificados:

- `src/components/sections/Hero.tsx`: usa o mesmo componente nos três links.
- `src/components/sections/Hero.module.scss`: estilos dos links movidos para o componente.
- `src/styles/_tokens.scss`: novo token de duração e sua variante reduced motion.

Criados:

- `src/components/ui/BorderLink.tsx`.
- `src/components/ui/BorderLink.module.scss`.
- `docs/HERO-NAV-BORDER.md`.

## Limitações e escopo

Validação interativa feita em Chromium/Edge, com touch e preferências emulados;
não inclui aparelho físico, Safari ou Firefox. O desenho secundário é preparado
após a hidratação e primeira medição; antes disso, a borda original, navegação
nativa e foco acessível continuam disponíveis.

TASK 04 não iniciada.
