# TASK 07.1: equilíbrio da composição de Projetos

Checkpoint anterior ao ajuste: `e189fd1`, `chore: checkpoint before projects composition rebalance`.

## Prévia

[Ver no localhost](http://127.0.0.1:3000/?wc-preview=1). Recarregar, clicar em **Ativar animação** e rolar até **Projetos selecionados**. Passar o ponteiro pelos nomes para alternar as imagens.

O grande traço branco observado na referência fica para a próxima tarefa, depois da aprovação dos bounds desta composição. Nesta etapa não foi implementado trail, cursor, SVG path, Canvas, Three.js ou ScrollTrigger adicional.

## Comparação e decisão

Foram comparados os dois vídeos fornecidos nesta solicitação: Gustavo (19,84s) e Wesley (23,18s). Na referência, a lista funciona como índice e o preview tem peso próprio. Na versão anterior de Wesley, os nomes utilizavam o token de headline principal; em larguras amplas o nome maior ainda quebrava em duas linhas. O screenshot ficava subordinado à tipografia.

A correção controla a escala dos dois títulos e aumenta a área compartilhada. Os dois projetos continuam com espaço negativo entre si e entre lista e imagem. A posição é definida pelo grid, sem coordenadas absolutas. O preview ocupa as duas linhas da lista, relacionando as duas áreas verticalmente. A numeração, os divisores finos e o indicador discreto permanecem.

## Medidas finais

Desktop, a partir de **1024px**:

- Lista: **40%** da largura útil.
- Preview: **46%** da largura útil.
- Espaço horizontal entre lista e preview: **14%**.
- Espaço entre as linhas do grid: **48px**, usando `--space-7`.
- Nomes: `clamp(2.75rem, 4vw, 4.5rem)`, de **44px a 72px**.
- Índices: token existente de **13px**, sem aumento.

Medidas reais do navegador com scrollbar desktop:

| Viewport | Tamanho dos nomes | Largura do preview | Gap horizontal | Modo |
| --- | --- | --- | --- | --- |
| 390 × 844 | 40px | 350px | Não se aplica | Vertical |
| 1024 × 768 | 44px | 421,73px | 128,34px | Compartilhado |
| 1440 × 900 | 57,6px | 595,88px | 181,34px | Compartilhado |
| 1920 × 1080 | 72px | 588,80px | 179,19px | Compartilhado |

Em 1440px, os nomes diminuíram de **93,6px para 57,6px**, aproximadamente 38%. O preview cresceu de **523,17px para 595,88px**, aproximadamente 14% em largura e 30% em área. O peso relativo entre nomes e imagem muda sem transformar o screenshot em card.

A área compartilhada mantém a proporção **1345 / 947** e mede aproximadamente **595,88 × 419,55px** em 1440px. SpaSmooth continua contido, com proporção própria, e ocupa aproximadamente **595,88 × 299px**. MF ocupa a altura da área. Não houve crop destrutivo, esticamento, moldura, sombra ou mockup.

## Responsividade e imagens

O breakpoint permanece em `64rem` / 1024px. Abaixo dele, a composição vertical da TASK 07 foi preservada, incluindo tipografia, espaçamento e heroes mobile. Nenhum breakpoint novo foi necessário. Os tokens globais de 768px e 1440px permanecem intactos.

O atributo `sizes` desktop de Next Image foi atualizado para a área maior: 603px como limite estimado a partir de 1440px e 42vw entre 1024px e 1440px. Isso acompanha a largura útil do container após os gutters. Mobile conserva seu `sizes` anterior.

## Interação preservada

Não foi alterado `projectPreview.ts`, nem o estado, os handlers ou a semântica dos controles. A troca mantém entrada em 420ms com `power2.out` e saída em 300ms com `power2.inOut`, combinando blur de 8px, opacity e escala. A última seleção permanece após pointer leave; interrupções continuam partindo dos valores atuais.

Teclado e reduced motion permanecem funcionando. Sem movimento, a seleção é imediata. Mobile apresenta ambos os projetos na rolagem, independentemente de seleção.

Hero, WC, takeover, Sobre, copy, fotografia, animações de Sobre, assets, referências, dependências e tokens globais não tiveram alterações.

## Validação

- Lint: passou.
- Typecheck: passou.
- Build de produção: passou.
- Verificação visual e responsiva em 320, 390, 768, 1024, 1440 e 1920px, sem overflow horizontal.
- Alternância ampliada mantém blur, fade e escala corretos, encerrando em estado limpo.
- 20 trocas rápidas: última seleção preservada, sem timeline acumulada.
- Bounds da seção e dos controles iguais antes/depois; nenhuma ocorrência de layout shift durante as trocas.
- Tab e Enter funcionam; foco visível conserva outline de 2px.
- Reduced motion troca imediatamente, sem blur ou escala.
- Nenhuma exceção de runtime nos testes.

Validação de navegador realizada em Edge/Chromium com viewports e preferências emulados. Não houve teste físico em Safari/iOS.

## Capturas

- [1440px, SpaSmooth ativo](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task071-desktop-spasmooth.png>).
- [1440px, MF ativo](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task071-desktop-mf.png>).
- [1024px](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task071-desktop-1024.png>).
- [390px](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task071-mobile-390.png>).
- [Vídeo curto de alternância](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task071-projects-switch.webm>).

Vídeo de aproximadamente 9 segundos, em 1440 × 900, com alternância normal, trocas rápidas e pointer leave. Foi reaberto para conferir a reprodução, a duração finita e o seek. Nenhuma falha de captura.

## Arquivos

Modificados:

- `src/components/sections/Projects.module.scss`: colunas, gap e escala desktop dos nomes.
- `src/components/sections/Projects.tsx`: somente o `sizes` desktop.

Criados: este relatório, quatro screenshots e o vídeo de validação listados acima. Nenhuma dependência instalada. Alterações da TASK 07.1 permanecem sem commit para revisão visual.

A implementação termina nesta tarefa. TASK 08 não iniciada.
