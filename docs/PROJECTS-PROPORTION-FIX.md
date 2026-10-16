# TASK 07.2: proporção e hierarquia de Projetos

Checkpoint anterior ao ajuste: `1286c27`, `chore: checkpoint before projects proportion fix`.

[Ver ao vivo](http://127.0.0.1:3000/?wc-preview=1). Recarregar, clicar em **Ativar animação** no desktop e rolar até **Projetos selecionados**.

## Composição final

Desktop, a partir de 1024px:

- Coluna da lista: **36%** da largura útil.
- Gap entre lista e preview: **6%**.
- Preview: **50%**.
- Os 8% restantes ficam na extremidade direita, sem aumentar o espaço entre texto e imagem.
- Títulos: `clamp(2.25rem, 3vw, 3.75rem)`, entre **36px e 60px**.
- Container exclusivo de Projetos: limite de **1600px**. Os gutters existentes permanecem. O limite global das demais seções não mudou.

Medidas reais do navegador, com scrollbar desktop:

| Viewport | Coluna da lista | Gap horizontal | Preview | Títulos |
| --- | --- | --- | --- | --- |
| 1024 × 768 | 330,06px | 55px | 458,42px | 36px |
| 1440 × 900 | 466,34px | 77,72px | 647,70px | 43,2px |
| 1920 × 1080 | 518,39px | 86,39px | 720px | 57,6px |

Em 1440px, a comparação com a TASK 07.1 é: títulos de 57,6px para **43,2px**, gap de 181,34px para **77,72px**, preview de 595,88px para **647,70px**. Em 1920px, o preview cresce de 588,80px para **720px**, graças ao container local mais amplo.

## Alinhamento e proporções

Os dois buffers de preview compartilham a mesma posição superior. Cada figura usa a proporção real do seu screenshot desktop, em vez de centralizar SpaSmooth verticalmente dentro da proporção mais alta de MF.

Os títulos alinham pelo início das linhas do grid. O preview recebe a mesma distância superior de 32px que o conteúdo dos botões, relacionando o topo da imagem com a área tipográfica do primeiro projeto. Em 1440 × 900, na captura realizada, ambos os previews começam em **Y = 329,38px**.

- SpaSmooth: aproximadamente **647,70 × 325,03px**, proporção 1905 / 956.
- MF Consultoria: aproximadamente **647,70 × 456,03px**, proporção 1345 / 947.

Os dois elementos continuam na mesma célula compartilhada do grid. A figura mais alta reserva espaço mesmo quando está invisível; por isso a troca não move a lista ou as seções seguintes. Não há recorte destrutivo, esticamento, card, moldura, mockup ou sombra.

## Interação e mobile

O controlador de motion não foi alterado. SpaSmooth permanece inicial; hover/focus seleciona; pointer leave conserva o último projeto. A transição mantém blur, opacity e scale, com entrada de 420ms e saída de 300ms. Reduced motion continua com troca imediata.

Abaixo de 1024px, a composição vertical existente foi preservada. Em 390px, títulos de 40px e imagens de 350px; em 320px, imagens de 280px; em 768px, imagens de 560px. Os dois projetos continuam disponíveis pela rolagem normal.

O `sizes` desktop de Next Image acompanha a área maior: 45,5vw entre 1024px e 1600px, e estimativa máxima de 728px a partir de 1600px. A fonte mobile permanece igual. Nenhum asset ou dependência foi alterado.

## Localhost

O servidor na porta 3000 estava desligado e foi reiniciado. O Next.js também bloqueou o acesso a recursos de desenvolvimento pelo hostname `127.0.0.1`. Conforme a documentação instalada, `next.config.ts` recebeu `allowedDevOrigins: ["127.0.0.1"]` para manter o link de revisão e os recursos de desenvolvimento funcionando.

## Validação

- Lint passou.
- Typecheck passou.
- Build de produção passou.
- 320, 390, 768, 1024, 1440 e 1920px: sem overflow horizontal.
- 20 trocas rápidas: última seleção preservada, estado final limpo, nenhuma timeline acumulada.
- Bounds da seção e dos botões idênticos antes/depois das seleções.
- PerformanceObserver não registrou layout shift durante a troca dos projetos.
- Tab seleciona ambos com outline de foco de 2px; Enter anuncia a seleção e a indisponibilidade temporária do case.
- Reduced motion: mudança imediata, blur final zero, escala final normal.
- Nenhuma exceção de runtime durante a validação.
- Hero, WC, takeover, Sobre, fotografia, animações anteriores, tokens globais, assets e referências preservados.

Verificação realizada em Edge/Chromium com viewports e preferências emulados. Não houve teste físico em Safari/iOS.

## Capturas solicitadas

- [1440 × 900, SpaSmooth](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task072-desktop-spasmooth.png>).
- [1440 × 900, MF Consultoria](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task072-desktop-mf.png>).
- [1024 × 768](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task072-desktop-1024.png>).
- [390 × 844](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task072-mobile-390.png>).

## Arquivos

Modificados:

- `src/components/sections/Projects.module.scss`: proporções, escala, alinhamento e largura local desktop.
- `src/components/sections/Projects.tsx`: aspecto desktop por screenshot e atualização de `sizes`.
- `next.config.ts`: origem local de desenvolvimento.

Criados: este relatório e as quatro capturas listadas acima. As alterações da TASK 07.2 permanecem sem commit para revisão visual.

O traço grande, cursor trail, Three.js e TASK 08 não foram iniciados. A implementação termina nesta correção de composição.
