# Refinamento da prévia de Projetos

Checkpoint antes do ajuste: `a890057` (`chore: checkpoint projects lettering preview`).

[Abrir ao vivo](http://127.0.0.1:3000/?wc-preview=1&projects-concept=1). Recarregue, ative a animação no painel e role desde o retrato.

## Ajustes visuais

- A mesma espessura do traço original é usada na conexão, na palavra, nos detalhes das letras e na continuação: `clamp(18px, 1.7vw, 28px)`. O SVG compensa a escala do lettering para preservar a espessura em pixels.
- A palavra Projetos tem baseline e altura de letras consistentes, espaços internos abertos, ponto do j e barra do t. É um desenho vetorial próprio; o esboço do usuário orienta apenas a sequência.
- A conexão chega ao P pela lateral. A saída do s continua exatamente na origem da faixa seguinte.
- Quatro curvas Bézier com tangentes alinhadas substituem a interpolação dos pontos irregulares que produzia uma dobra curta. As passagens são amplas e seguem a parte inferior de cada linha de projeto para preservar a leitura dos nomes.
- Um breve pin mantém a escrita visível; a passagem pelos projetos tem mais distância de scroll. Os previews continuam inteiros e centralizados no nome ativo.

## Ritmo e controles

O progresso é reversível e ligado ao scroll, com damping de 120ms e 56 pontos para a inércia e a resposta local ao ponteiro. A seleção acompanha a ponta sem considerar o deslocamento pelo mouse.

| Progresso | Etapa |
| --- | --- |
| 1–12% | Conexão desde o retrato |
| 12–37% | Escrita de Projetos |
| 30–37% | Detalhes do j e t |
| 37–42% | Palavra completa |
| 42–58% | Saída do s e aproximação da lista |
| 58–73% | Passagem por SpaSmooth |
| 73–90% | Curva e passagem por MF Consultoria |
| 90–100% | Curva de saída |

O pin da escrita dura `0.80 × altura da viewport`; o pin da lista, `1.65 × altura da viewport`. A sequência começa em `top 60%` e termina no fim do pin da lista. Em 1440 × 900 foram medidos 3330–6723px. Os valores são recalculados em resize e após os pins anteriores.

O RAF para em repouso, fora da região e com a página oculta. Abaixo de 1024px e em reduced motion normal, a composição estática continua disponível. O parâmetro experimental continua restrito ao desenvolvimento.

## Validação

Lint, typecheck e build passaram. Conferidos em navegador: espessura uniforme; avanço e reversão; seleção Spa → MF → Spa; centros de nome e imagem alinhados; imagens inteiras durante a passagem; ausência de overflow; resposta ao ponteiro e parada em repouso; limpeza de pins e detalhes ao desativar a prévia. Tamanhos: 1440 × 900, 1024 × 768, 1920 × 1080, além dos fallbacks de touch em 320px e 390px e reduced motion.

Capturas atuais:

- [Projetos escrito](previews/project-refine-37.png)
- [Passagem por SpaSmooth](previews/project-refine-69.png)
- [Passagem por MF Consultoria](previews/project-refine-86.png)
- [Curva de saída](previews/project-refine-98.png)

Código alterado: `src/lib/motion/projectConcept.ts` e `src/components/sections/Projects.module.scss`. Nenhuma dependência adicionada. Hero, Sobre, retrato e assets preservados. Refinamento disponível para revisão visual, sem avançar para a próxima tarefa.
