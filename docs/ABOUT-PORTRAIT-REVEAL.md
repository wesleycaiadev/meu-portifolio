# TASK 06 — Sobre editorial e reveal do retrato

A seção Sobre foi implementada. TASK 07 não iniciada. Nenhum vídeo foi gerado.

## Prévia ao vivo

[http://127.0.0.1:3000/?wc-preview=1](http://127.0.0.1:3000/?wc-preview=1)

Em desktop com mouse, clicar em **Ativar animação** e rolar do Hero para Sobre. O controle de desenvolvimento permite testar a sequência mesmo com movimento reduzido no Windows, sem modificar essa preferência. Desativar a prévia restaura o conteúdo estático e nítido. A página normal e o build de produção respeitam reduced motion.

## Composição e conteúdo

- Mesmo fundo `--color-ink: #101010` da transição aprovada.
- Desktop a partir de 1024px: texto nas primeiras seis posições do grid, uma posição de respiro, retrato nas últimas cinco. O retrato ocupa aproximadamente 40% da área útil, com um deslocamento vertical editorial de 64px.
- Abaixo de 1024px: headline, parágrafo e retrato em ordem de leitura. A partir de 768px, retrato limitado a 560px e alinhado à direita; abaixo disso, ocupa a largura disponível entre os gutters.
- Inter Tight e uma única palavra em Instrument Serif italic, mantendo os tokens existentes.
- Copy curto e marcado como editorial revisável no componente. O travessão foi removido a pedido de Wesley.
- Retrato em janela 4:5, sem rotação, moldura, cartões ou elementos de preenchimento.
- Os placeholders seguintes foram preservados. A trajetória, a escala e os parâmetros do takeover da WC não foram alterados.

## Foto final e preservação de qualidade

Fonte final indicada por Wesley: `C:/Users/wesley/Downloads/Gemini_Generated_Image_ (1).png`.

Arquivo consumido pelo site: `public/assets/photos/portrait-about.webp`.

- Resolução original preservada: **896 × 1195px**.
- WebP **lossless**, 923.322 bytes.
- A imagem é servida diretamente (`unoptimized`) para evitar outra compressão ou redimensionamento pelo Next.js.
- Carregamento lazy padrão; URL com `?v=2` evita mostrar o retrato anterior por cache durante a troca.
- Somente o símbolo no canto inferior direito foi removido. Foi usado o **image_gen integrado**, com um recorte local do tecido, e o resultado foi aplicado apenas à pequena região afetada.
- Comparação dos pixels decodificados: **zero diferenças fora da região do canto**. 99,2774% dos pixels da foto inteira permanecem idênticos, incluindo rosto, cabelo, iluminação e enquadramento.
- O PNG fornecido em Downloads permanece intacto.

Prompt usado no image_gen:

> Use case: precise-object-edit. Edit target: the provided 160×160 pixel square crop from the lower-right corner of a personal portrait. Remove ONLY the pale four-point Gemini sparkle/star logo near the lower-right of this crop, replacing that small area with a seamless continuation of the existing dark green rib-knit sweater. Continue the same narrow knit ribs, their diagonal slope, cloth folds, fine photographic grain, shadows and exact dark green tones. Keep every existing sweater detail outside the logo unchanged. Do not smooth the texture, brighten it, add text, create another logo, or introduce a border. This is local photograph restoration, not a new photo. Preserve the square crop composition.

## Coreografia

GSAP + ScrollTrigger já instalados; nenhum pacote adicional.

**Texto**

- Trigger: topo de Sobre em 82% da viewport.
- Final: topo em 54% no desktop, 50% na composição empilhada.
- Heading: opacity/visibility e Y de 20px → 0.
- Palavra serif: reforço discreto de opacidade dentro do heading.
- Parágrafo: opacity/visibility e Y de 12px → 0, após o início do heading.
- Easing principal: `power2.out`. Não há divisão por palavras.

**Retrato**

- Desktop: topo de Sobre em 76% da viewport → topo de Sobre no topo da viewport, intervalo de **76vh**.
- Mobile/tablet empilhado: topo da própria fotografia em 90% → 40% da viewport, intervalo de **50vh**. Isso evita terminar o reveal da foto enquanto ela ainda está abaixo do texto.
- Blur: **20px → 12px → 5px → 0px**, e `filter: none` no final.
- Os três estágios de foco ocupam 30%, 35% e 35% do percurso. Easing `sine.inOut` nos primeiros, `power2.out` no último.
- Translate Y: **32px → 0** no desktop, **24px → 0** nas composições empilhadas.
- Scale: **1.045 → 1**.
- Clip: `inset(10% 6% 14% 6%) → inset(0)`, easing `power2.inOut`.
- `scrub: true`: duração real controlada pela rolagem, sem autoplay ou tempo obrigatório.
- Sem pin na seção Sobre. O único pin pertence ao Hero aprovado.
- Reversão acompanha o scroll; o filtro e os transform são restaurados corretamente ao voltar.
- `will-change` aplicado somente durante o trecho em movimento e removido nos extremos.
- Cleanup de GSAP e listeners ao desmontar, alterar breakpoint ou ativar reduced motion.

## Validação

Build final de produção em servidor temporário local, navegador Edge headless isolado. Viewports mobile usam emulação de touch. Não houve gravação de vídeo.

| Viewport | Range do retrato | Resultado |
| --- | --- | --- |
| 320 × 700 | 350px | Sem overflow; foco final limpo; reversão correta |
| 390 × 844 | 422px | Sem overflow; texto e foto em ordem; foco final limpo |
| 768 × 1024 | 512px | Composição empilhada; fotografia de 560px; sem overflow |
| 1024 × 768 | 584px | Composição editorial em duas regiões; sem overflow |
| 1440 × 900 | 684px | Composição editorial; fotografia ~40% da largura útil |

- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `git diff --check`: passou.
- Handoff: todos os pixels RGB da área da aplicação em **16,16,16**; fundo de Hero e Sobre iguais.
- Três ciclos completos de ida/volta: filtro final `none`, sem duplicação de pin.
- Dimensões do layout estáveis no início, meio e final do reveal.
- WC na viewport inicial de 1440 × 900: mesmos bounds aprovados (1152 × 630,84375; X 136,5; Y 131,078125).
- Resize 1440 → 390 → 1024 → 1440: triggers atualizados, sem overflow.
- Reduced motion: conteúdo imediatamente visível, foto nítida, sem transforms/clip animados. Alternar a preferência durante a execução também limpa os efeitos.
- Sem JavaScript: HTML permanece legível e foto carrega nítida.
- Teclado: skip link, Projetos, Sobre em ordem; Enter em Sobre chega à seção e leva o foco ao destino.
- `h2`, identificação da seção e alt corretos. Contraste medido: título **17,01:1**, corpo **9,45:1**.
- Texto ampliado em 200% a 320px: sem overflow horizontal.
- Nenhuma exceção de runtime/erro de console observado.
- `reference/gustavo/reference-video.mp4` responde 404 no servidor de produção.
- Sem dependências novas. Assets de marca, projetos e referência preservados.

Limites da verificação: QA automatizado em Edge isolado, com emulação de viewport/touch. Safari, Firefox e dispositivos físicos não foram testados nesta tarefa. A aprovação do ritmo visual deve ser feita na prévia ao vivo.

## Screenshots

- [Handoff totalmente escuro](previews/task06-about-handoff.png), 1440 × 900.
- [Início visível do reveal](previews/task06-about-initial.png), ~20% do range e blur ~14px.
- [Metade do reveal](previews/task06-about-mid.png), 50% e blur ~7,72px.
- [Final desktop](previews/task06-about-desktop-final.png), 1440 × 900.
- [Final mobile](previews/task06-about-mobile-final.png), 390 × 844.

## Arquivos criados nesta tarefa

- `src/components/sections/About.tsx`
- `src/components/sections/About.module.scss`
- `src/components/motion/AboutReveal.tsx`
- `src/lib/motion/aboutReveal.ts`
- `public/assets/photos/portrait-about.webp`
- `docs/ABOUT-PORTRAIT-REVEAL.md`
- Os cinco screenshots `docs/previews/task06-about-*.png` listados acima.

## Arquivos modificados nesta tarefa

- `src/app/page.tsx`: integra Sobre após o Hero.
- `src/components/motion/HeroTakeover.tsx`: remove apenas o placeholder de Sobre.
- `src/components/motion/HeroTakeover.module.scss`: remove estilos desse placeholder.
- `src/lib/three/wcMotionPreview.ts`: identifica TASK 06 e orienta a prévia do retrato.
- `ASSET-CHECKLIST.md`: marca a foto fornecida como disponível.

As mudanças anteriores da TASK 05 já estavam no working tree e foram preservadas. TASK 06 permanece sem commit para revisão. TASK 07 não foi iniciada.

