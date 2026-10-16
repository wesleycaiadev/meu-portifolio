# TASK 07: lista editorial e preview 2D

> Atualização de 16/10/2026: vídeos de referência e revisão foram retirados da entrega por decisão de Wesley. As descrições abaixo registram testes anteriores; as gravações originais permanecem no backup local.

Checkpoint anterior às alterações: `6689442`, com a mensagem `feat: complete scroll-driven about section`.

## Prévia ao vivo

[Abrir a aplicação](http://127.0.0.1:3000/?wc-preview=1). Recarregar, usar **Ativar animação** no controle de desenvolvimento e rolar até **Projetos selecionados**, depois de Sobre. No desktop, passar o ponteiro sobre os dois nomes. Tab também seleciona o projeto. O controle de desenvolvimento permite visualizar movimento mesmo quando o Windows pede movimento reduzido; a aplicação normal e a produção respeitam a preferência do sistema.

TASK 08 não iniciada. Hero, WC Ambient Flow, Pointer Energy, navegação do Hero, takeover, Sobre, copy, retrato, animações anteriores, assets e tokens globais foram preservados.

## Estrutura e composição

- `projects.ts` contém somente nomes, índices, textos alternativos e dimensões/caminhos dos screenshots fornecidos.
- `Projects.tsx` contém uma lista ordenada com dois botões e dois elementos de imagem responsivos. A seleção é compartilhada; SpaSmooth é o estado inicial.
- `Projects.module.scss` utiliza o grid, a tipografia, as cores, os divisores e os espaçamentos existentes. Desktop: lista nas colunas 1–6, respiro na 7, preview nas colunas 8–12. Os dois buffers de imagem ocupam a mesma célula; apenas o selecionado fica visível e acessível.
- `projectPreview.ts` controla preparação das imagens, troca, interrupção, preferência de movimento e limpeza. É importado dinamicamente pelo componente.
- A seção continua na superfície escura de Sobre, com espaço de entrada e altura mínima de uma viewport. Não há cards, painel, mockup, metadados inventados ou novo efeito de entrada. A entrada estática e a rolagem normal mantêm a pausa após Sobre sem acrescentar outra sequência de ScrollTrigger.

## Transição

| Imagem | Opacity | Escala | Blur | Duração | Easing |
| --- | --- | --- | --- | --- | --- |
| Saída | atual → 0 | atual → 0,985 | atual → 8px | 300ms | `power2.inOut` |
| Entrada | 0 → 1 | 1,02 → 1 | 8px → 0 | 420ms | `power2.out` |

As duas partes começam juntas. Duração total: **420ms**. Se o buffer já estiver parcialmente visível após uma interrupção, a próxima troca parte dos valores atuais, sem reiniciar bruscamente em zero. Blur e `will-change` são removidos ao concluir.

Cada pedido recebe uma geração. Somente o pedido mais recente que terminar de decodificar pode selecionar e animar. A timeline anterior é encerrada; existe no máximo uma timeline de troca. A imagem anterior permanece enquanto a próxima decodifica. Falha de carregamento mantém o preview atual e informa o erro pelo status acessível. Pointer leave preserva a última seleção.

## Proporções e carregamento

Desktop usa os heroes reais:

- SpaSmooth: `spasmooth-hero-desktop.png`, 1905 × 956.
- MF Consultoria: `mf-consultoria-hero-desktop.png`, 1345 × 947.

A área compartilhada reserva a proporção do screenshot mais alto, 1345 / 947. `object-fit: contain` centraliza cada imagem e preserva sua proporção. SpaSmooth tem espaço livre acima/abaixo dentro da área transparente; MF ocupa sua altura. A área reservada não muda durante a seleção. O estado final não estica nem corta os screenshots. O clipping apenas contém o pequeno overscan durante a transição.

Next Image fornece `srcset` e `sizes`. Um `picture` escolhe o hero mobile abaixo de 1024px, mantendo somente dois elementos `img` no DOM. Cada projeto usa apenas uma variante adequada à viewport. Nenhum screenshot secundário é antecipado e nenhum asset foi regravado.

O carregamento inicial usa o lazy loading nativo. Um IntersectionObserver com margem de **700px** prepara e decodifica os dois heroes antes da proximidade da seção. O navegador pode começar as requisições lazy mais cedo, conforme sua heurística; isso foi observado no teste desktop. O controle limita o carregamento aos dois previews principais, sem prometer um instante exato de início da rede. Uma seleção também aguarda `decode()` antes de trocar, evitando flash de imagem incompleta.

## Teclado, touch e movimento reduzido

Os nomes são botões nativos com `aria-pressed`, `aria-controls` e instruções para leitores de tela. Tab alcança ambos; foco seleciona o preview e preserva o outline global de 2px. Enter/espaço e clique selecionam e anunciam que o estudo de caso ainda não está disponível. Esta é a ação temporária até a tarefa dos cases; não há URL falsa, navegação vazia ou transformação 3D.

Somente ponteiro fino com hover em desktop seleciona por pointer enter. Em touch não existe dependência de hover. Ambos os screenshots permanecem visíveis na composição vertical, inclusive depois de tocar em um título.

Com `prefers-reduced-motion: reduce`, a seleção é imediata, sem blur ou escala. Alterar a preferência durante uma troca encerra a timeline e normaliza os dois buffers. Não há autoplay ou animação contínua nesta seção.

## Mobile e tablet

Abaixo de 1024px: identificação, índice/nome do SpaSmooth, screenshot grande, índice/nome de MF Consultoria e screenshot grande. Os heroes mobile fornecidos preservam 402 / 870 e 396 / 869. Cada screenshot completo pode ser percorrido pela rolagem normal; não há carousel ou swipe.

As imagens chegam a 560px de largura em tablet. Em 1024px e 1440px, o preview compartilhado fica ao lado da lista. Em 1024px, o nome mais longo pode ocupar duas linhas sem comprimir a tipografia.

## Preparação para a etapa espacial

O controlador expõe `getSnapshot()` com projeto ativo, asset, `currentSrc`, elemento da imagem, botão de origem, bounds da área, bounds da imagem contida, tamanho renderizado e aspect ratio. A leitura de geometria ocorre somente quando esse método é solicitado. Não há medição contínua, loop próprio por frame, Canvas, Three.js ou objeto espacial em Projetos.

## Verificação

Lint, typecheck e build de produção passaram. Nenhuma dependência instalada ou alterada.

| Viewport testada | Composição | Overflow horizontal | Imagens |
| --- | --- | --- | --- |
| 320 × 700 | Vertical | Não | Dois heroes mobile |
| 390 × 844 | Vertical | Não | Dois heroes mobile |
| 768 × 1024 | Vertical | Não | Dois heroes mobile |
| 1024 × 768 | Compartilhada | Não | Dois heroes desktop, um visível |
| 1440 × 900 | Compartilhada | Não | Dois heroes desktop, um visível |

Verificação automatizada em Microsoft Edge/Chromium com viewport, ponteiro, teclado, touch e media query emulados:

- 20 alternâncias rápidas de 45ms, com a última seleção preservada e nenhum estado tardio depois da conclusão.
- Bounds da seção e dos controles iguais antes/depois da troca; PerformanceObserver não registrou layout shift durante as seleções.
- Tab seleciona ambos com foco visível. Enter anuncia o estado temporário e mantém a URL.
- Pointer leave preserva o preview.
- Touch real via eventos de entrada do navegador seleciona sem esconder qualquer imagem mobile.
- Redução de movimento durante uma troca elimina blur/escala e termina no projeto selecionado.
- Falha de decodificação simulada mantém a imagem anterior e anuncia erro.
- Redimensionamento entre 320, 768, 1024 e 1440px normaliza o modo sem estado preso.
- Lista e itens mantêm suas funções na árvore de acessibilidade, inclusive com `display: contents` no desktop.
- Scroll reverso preserva a seleção e a reversão já aprovada de Sobre.
- Nenhuma exceção de runtime nos testes. Hero e demais arquivos aprovados não tiveram alterações; referências e assets permanecem iguais ao checkpoint.

Não houve teste físico em Safari/iOS nesta tarefa.

## Evidências

Capturas de produção, sem o painel de desenvolvimento:

- [SpaSmooth desktop](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task07-desktop-spasmooth.png>) (1440 × 900).
- [MF desktop](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task07-desktop-mf.png>) (1440 × 900).
- [SpaSmooth mobile](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task07-mobile-spasmooth.png>) (390 × 844).
- [MF mobile](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task07-mobile-mf.png>) (390 × 844).

Vídeos da viewport real:

- Vídeo desktop (gravação preservada no backup local) (17 segundos): final de Sobre, entrada em Projetos, SpaSmooth, MF, retorno, trocas rápidas, pointer leave, teclado/Enter e scroll reverso.
- Vídeo mobile (gravação preservada no backup local) (18 segundos): final de Sobre, entrada vertical, screenshots completos durante a rolagem, toque e retorno.

Os dois vídeos foram reabertos no navegador e conferidos: duração finita, seek disponível, dimensões corretas e nenhuma falha de captura.

## Arquivos

Criados:

1. `src/data/projects.ts`
2. `src/components/sections/Projects.tsx`
3. `src/components/sections/Projects.module.scss`
4. `src/lib/motion/projectPreview.ts`
5. `docs/PROJECT-EDITORIAL-PREVIEW.md`
6. `docs/previews/task07-desktop-spasmooth.png`
7. `docs/previews/task07-desktop-mf.png`
8. `docs/previews/task07-mobile-spasmooth.png`
9. `docs/previews/task07-mobile-mf.png`
10. `docs/previews/task07-projects-desktop.webm`
11. `docs/previews/task07-projects-mobile.webm`

Modificado: `src/app/page.tsx`, para integrar Projetos depois de Sobre e retirar somente o placeholder de Projetos da lista restante.

As alterações da TASK 07 permanecem sem commit para revisão visual. A implementação para nesta etapa.
