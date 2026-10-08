# TASK 08.1: continuidade da assinatura de Projetos

Checkpoint anterior: `8681983`. Lettering, proporções da lista, previews e zigue-zagues aprovados preservados.

## Emenda e ritmo

Antes, palavra e continuação usavam dois strokes visíveis. A posição e a espessura já coincidiam, mas havia uma pausa de 37–42% do progresso antes da continuação.

Agora a palavra e a continuação formam um único caminho SVG visível, com um único comando M. O outro path serve exclusivamente como guia invisível para medições e seleção pelo scroll. A curva final do S foi prolongada matematicamente por 0.4 de seu parâmetro, preservando posição, tangente e curvatura na emenda. O desenho original da palavra não foi alterado.

Uma interpolação monotônica Hermite controla a distância desenhada pelo mesmo progresso de ScrollTrigger com scrub. Ela mantém velocidade contínua nos pontos de mudança de etapa. Não há pausa entre palavra e continuação, snap ou autoplay.

| Progresso | Marco |
| --- | --- |
| 1–12% | Conexão desde o retrato |
| 12–36% | Palavra, com desaceleração gradual ao final |
| 29–36% | Ponto do j e barra do t |
| 36–39% | Prolongamento contínuo do S |
| 39–58% | Curva ampla até a lista |
| 58–73% | Passagem por SpaSmooth |
| 73–90% | Zigue-zague e MF Consultoria |
| 90–98.5% | Saída da ponta além da borda esquerda |

O pin da escrita foi reduzido de 0.80 para 0.68 viewport. O pin da lista permanece 1.65 viewport. Em 1440 × 900, a sequência mede 3330–6615px, em vez de 3330–6723px. Após o pin, toda a composição acompanha a saída natural da seção; nenhuma nova transição foi criada.

A espessura permanece `clamp(18px, 1.7vw, 28px)`. A palavra não recebe deformação do mouse. A influência na continuação é amortecida ao redor da emenda e cresce depois de uma área protegida de 120px. O RAF continua parando em repouso, fora da seção e com a aba oculta.

## Preview e acesso

A seleção pelo scroll usa a geometria neutra, sem influência do mouse. A posição do preview acompanha o projeto efetivamente exibido, inclusive quando escolhido por foco de teclado ou cliques durante uma parada do scroll. A animação de troca existente permanece intacta.

A assinatura aprovada passou a ser a implementação padrão em desktop, inclusive em produção; não depende mais de projects-concept=1. O link anterior continua válido para o painel de prévia de movimento em desenvolvimento. Nenhum painel é criado em produção, mesmo com wc-preview=1, projects-concept=1 e wc-debug=1.

Desktop e tablet em landscape a partir de 1024px recebem a sequência completa. Nas larguras com lista empilhada, a versão reduzida preserva nomes e imagens sem crossings decorativos. Reduced motion utiliza a composição estática; o override permanece exclusivamente no painel explícito de desenvolvimento.

## Validação

Lint, typecheck e build passaram. Conferidos 1440 × 900, 1024 × 768, 1920 × 1080; touch em 320px, 390px e 820px; reduced motion; reversão completa; ponteiro; foco e troca rápida; cleanup de pins. Sem erros de navegador e sem overflow. Imagens inteiras durante a passagem, com erro máximo de alinhamento dos centros de 0.016px.

A emenda tem posição única dentro do mesmo path. A comparação numérica de tangentes em amostras a 0.5 unidade de cada lado mediu 0.171° de variação natural da curva. A tangência matemática no ponto é exata. Capturas e medições estão em `docs/previews/task081-validation.json`.

## Vídeos reais de navegador

- [Antes: emenda e reversão](previews/task081-before-seam.webm)
- [Depois: emenda e reversão](previews/task081-after-seam.webm)
- [Close da emenda](previews/task081-seam-close.webm)
- [Sequência completa, com reversão](previews/task081-full-sequence.webm)
- [Segunda execução com ponteiro](previews/task081-pointer-sequence.webm)

Os vídeos mostram a aplicação rodando em tempo real. O painel foi ocultado apenas nas gravações posteriores para não cobrir o S. O close é um recorte do vídeo real, sem alteração de velocidade.

Código alterado: `src/lib/motion/projectConcept.ts` e `src/components/motion/ProjectTrail.tsx`. Nenhuma dependência do projeto foi adicionada. O gravador de navegador foi baixado como ferramenta temporária de QA. Hero, WC, Sobre, retrato, assets e animações dos previews não foram alterados.
