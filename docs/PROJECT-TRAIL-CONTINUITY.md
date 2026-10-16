# Correção da continuidade e seleção pelo scroll

Checkpoint: `8dcd838`, antes destas correções.

[Ver ao vivo](http://127.0.0.1:3000/?wc-preview=1): recarregar, **Ativar animação** e rolar até Projetos.

## Traço contínuo

O desenho agora cresce desde a origem fixa fora da borda esquerda. A parte revelada permanece na seção: não há janela móvel nem cauda arredondada se soltando da borda. A frente avança pelas mesmas curvas com o damping existente. Quando completa o percurso, o desenho continua ligado à borda e sai da viewport com a própria rolagem da seção. Ao subir, a frente recua e desfaz o desenho na ordem inversa.

A origem também fica fora da viewport em telas ultrawide, independentemente do gutter do container. O ponto inicial não recebe deslocamento do ponteiro. Espessura, cores, curvas principais e comportamento mobile permanecem os mesmos.

## Projeto acompanha a frente

O centro vertical dos dois controles é medido no grid atual. A posição da frente, amortecida como o último ponto do traço, determina qual projeto está mais próximo: SpaSmooth primeiro; MF Consultoria depois. O retorno seleciona SpaSmooth novamente. A escolha usa a posição da curva, sem percentuais fixos de troca por breakpoint e sem depender do mouse.

O deslocamento secundário do ponteiro não interfere nesse cálculo. Enquanto o trail está ativo, hover não troca a imagem. Teclado e clique continuam disponíveis como escolha explícita; o próximo movimento de scroll retoma a sincronização. As trocas reutilizam o controller de preview existente, inclusive sua proteção contra pedidos assíncronos interrompidos.

Em mobile e reduced motion normal, não há trail nem posse da seleção pelo scroll; os controles acessíveis continuam funcionando. O modo de desenvolvimento ainda permite o override manual de movimento para prévia.

## Validação

Lint, typecheck e build passaram. No navegador: origem constante e fora da viewport, comprimento crescente, Spa → MF e MF → Spa sem mover o mouse, hover sem disputar seleção, teclado com retorno ao scroll, fallback mobile/reduced motion e ausência de overflow. O loop continua parando em repouso e fora da seção.

As capturas desta correção são [SpaSmooth](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task08-continuity-35.png>), [MF Consultoria](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task08-continuity-50.png>) e [trajetória completa](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task08-continuity-80.png>). As evidências do relatório original da TASK 08 documentam a versão anterior ao pedido de continuidade.

Código modificado: `src/lib/motion/projectTrail.ts`, `src/components/motion/ProjectTrail.tsx`, `src/components/sections/Projects.tsx`. Nenhuma dependência adicionada. Hero, Sobre, layout de Projetos e tratamento dos previews preservados. Nenhuma etapa de 3D iniciada.
