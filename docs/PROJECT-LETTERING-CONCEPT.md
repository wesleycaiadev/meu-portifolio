# Prévia: retrato → Projetos → lista

Esta versão foi refinada após a revisão visual. Consulte [o ajuste de espessura, lettering e curvas](PROJECT-LETTERING-REFINEMENT.md) para os valores e capturas atuais.

Checkpoint anterior: `9394e74`.

[Abrir a proposta](http://127.0.0.1:3000/?wc-preview=1&projects-concept=1). Recarregar, clicar em **Ativar animação** e rolar do final de Sobre até os projetos. O parâmetro `projects-concept=1` ativa esta proposta somente em desenvolvimento; o link anterior e a produção continuam com a composição aprovada.

## Proposta visual

Uma linha fina sai da base real do retrato. Ela chega ao início de um lettering original de “Projetos”, desenhado em SVG como uma linha cursiva contínua. A saída do último s é a origem exata da curva que desce para SpaSmooth e MF Consultoria.

O rótulo pequeno fica oculto visualmente nesta prévia; o h2 acessível passa a se chamar Projetos. A curva mantém inércia, influência local do ponteiro e seleção dos previews pelo scroll. Não foram adicionadas fontes, imagens ou dependências.

Conector e lettering usam stroke de aproximadamente 5px, com escala responsiva. O traço seguinte ganha a espessura anterior de 18–28px. A tangente inicial da curva continua a direção da saída do s.

## Enquadramento

A passagem pela lista mantém sua composição na viewport por 0.90 viewport de scroll. As imagens mantêm seus tamanhos e proporções; o centro do preview acompanha o centro do nome ativo. Assim, SpaSmooth aparece inteiro quando o traço chega ao projeto, e MF Consultoria também fica inteiro durante sua passagem.

O grid preserva as dimensões da lista, nomes e screenshots. A centralização usa o elemento marcado como stage, inclusive depois de o ScrollTrigger inserir seu pin spacer. Não há coordenadas absolutas para posicionar os componentes de conteúdo.

## Sequência

Um único progresso com scrub controla a coreografia:

- 1–10%: conexão desde o retrato.
- 10–30%: desenho da palavra Projetos.
- 30–36%: palavra completa antes da continuação.
- 36–98%: curva sai do s, passa pelos dois nomes e continua para fora.

O stage fica fixado de `top top` por `0.90 × altura da viewport`. A sequência começa em `top 60%` da seção e termina no fim desse pin. Em 1440 × 900, os valores medidos são 3330–5130px. São recalculados após os pins do Hero e Sobre, com prioridades -10 e -20.

Tudo reverte ao subir o scroll. Não há autoplay. O lettering usa stroke-dash; a continuação usa a mesma spline do trail, com 32 pontos, damping de 120ms no progresso, taxas de 8–13/s nos pontos e influência do ponteiro limitada a 32px. A origem não se solta do s. O RAF para em repouso, fora da região e quando a página fica oculta.

## Escopo e validação

Esta é uma proposta desktop para aprovação visual. Abaixo de 1024px e em reduced motion normal, a composição estática anterior permanece legível. O toggle explícito de desenvolvimento permite o mesmo override manual de movimento já existente.

Lint, typecheck e build passaram. Testados: escrita progressiva e reversa, retorno MF → Spa, imagens sem corte durante a passagem, centros alinhados, pausa do loop e ausência de overflow. Conferidos 1440 × 900, 1024 × 768 e 1920 × 1080, além do fallback em 390px e 320px. A produção ignora os parâmetros da proposta e não apresenta o painel de desenvolvimento.

## Capturas

- [Palavra completa](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/project-concept-final-30.png>).
- [SpaSmooth](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/project-concept-final-60.png>).
- [MF Consultoria](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/project-concept-final-78.png>).

## Arquivos

Novo controller experimental: `src/lib/motion/projectConcept.ts`.

Modificados: `src/lib/motion/projectTrail.ts` (exportação das funções de geometria existentes), `src/components/motion/ProjectTrail.tsx` (seleção do controller pela URL e paths vazios para a proposta), `src/components/sections/Projects.tsx` (marcação do stage e espaço introdutório oculto por padrão), `src/components/sections/Projects.module.scss` (regras exclusivas da proposta).

Hero, Sobre, retrato, assets, referências e dependências preservados. Proposta sem commit, aguardando revisão visual; nenhuma etapa de 3D iniciada.
