# TASK 14B — Expertise e Processo: motion por scroll

> Atualização de 16/10/2026: vídeos de referência e revisão foram retirados da entrega por decisão de Wesley. As descrições abaixo registram testes anteriores; as gravações originais permanecem no backup local.

Implementada em 14/10/2026 sobre a composição aprovada da TASK 14A. **Pronta para avaliação do motion. TASK 15 não iniciada.**

Refinamento editorial concluído em 15/10/2026: IA como abordagem de desenvolvimento, SQL na descrição de PostgreSQL e parallax na descrição de GSAP. Os controladores de motion e os cases não foram alterados nessa revisão.

## Links para avaliar

- [Expertise: prévia de motion](http://localhost:3000/?motion=preview#expertise)
- [Processo: prévia de motion](http://localhost:3000/?motion=preview#processo)
- [Home normal, respeitando a preferência do sistema](http://localhost:3000/#expertise)
- Vídeo A — Expertise, entrada, seleção, saída e reversão (gravação preservada no backup local)
- Vídeo B — Processo, quatro estados, reversão e seleção manual (gravação preservada no backup local)

As prévias são **exclusivas de desenvolvimento**. O parâmetro habilita somente o motion das duas novas seções quando o navegador solicita movimento reduzido. Não altera a configuração do sistema, Hero, Sobre, Projetos ou os cases. Uma instrução identifica a prévia e permite retornar à preferência do sistema. Em produção, o parâmetro é ignorado.

## Expertise

O painel começa sem seleção e mostra apenas a instrução. Depois de hover, foco ou clique, mostra tecnologia, descrição e aplicações; a instrução deixa de aparecer. Escape limpa a seleção. Em telas menores, a explicação continua junto ao grupo.

A timeline `expertise-sequence` usa GSAP/ScrollTrigger, **sem pin**, com `scrub: true`. Começa quando o topo da seção chega a 90% da viewport e termina quando seu fim chega a 20%. Cada entrada começa conforme o grupo se aproxima da área de leitura; assim, as linhas inferiores não terminam sua reorganização antes de aparecer.

| Grupo | Deslocamento inicial desktop |
| --- | --- |
| Interfaces e aplicações | x −18 px; y +24 px |
| Estilos e apresentação | x +22 px; y +34 px |
| Dados e serviços | x −12 px; y +30 px |
| Movimento e experiências | x +16 px; y +40 px |
| Design e desenvolvimento | x −10 px; y +22 px |

A entrada vai de opacidade 0,74 a 1 e termina em x/y zero. Tablet com ponteiro fino usa 55% da amplitude. Nos últimos 10% do percurso há um recuo pequeno, de aproximadamente 2–7 px, mantendo opacidade 1. Não há movimento aleatório, autoplay ou desaparecimento de informação durante a saída.

**Scroll e seleção têm responsabilidades separadas:** GSAP controla os grupos; React controla o item selecionado e o painel. A rolagem não escolhe tecnologias. O hover informativo considera movimentos reais do ponteiro, sem usar o progresso do scroll para alterar seleção. Tab, setas, Home/End e toque permanecem operáveis.

## Cores e tecnologias acrescentadas

As marcas permanecem monocromáticas em repouso e recebem cor no hover, foco visível ou seleção. React usa azul `#61DAFB`, TypeScript `#3178C6`, JavaScript amarelo `#F7DF1E` e Angular o vermelho `#DD0031` pedido por Wesley. Os demais usam cores registradas no módulo de dados; Figma preserva seus cinco preenchimentos originais. Marcas pretas permanecem claras na superfície escura. Os nomes continuam com as cores de texto do sistema, preservando a leitura.

`TechnologyLogo` reutiliza o SVG original como imagem monocromática e máscara colorida, com os mesmos paths e proporção. O Figma usa sua imagem multicolor original. Não há redesenho de logos, glow ou mudança da paleta global.

São **16 tecnologias/ferramentas**. Os quatro grupos anteriores foram mantidos; o pedido adicional acrescenta HTML e um grupo de design e desenvolvimento.

| Acréscimo | Fundamentação e aplicações |
| --- | --- |
| HTML | Markup semântico presente no portfólio; referência à home. |
| Figma | Incluído por solicitação de Wesley; sem associação inferida aos cases. |
| Clerk | Já documentado na stack confirmada do SpaSmooth; link para seu case. |
| Vercel | Já documentado na stack confirmada da MF Consultoria; link para seu case. |

Supabase e PostgreSQL continuam associados somente às stacks confirmadas. A descrição de PostgreSQL inclui consultas SQL; a de GSAP inclui parallax como técnica de movimento. Nenhum banco adicional foi acrescentado por suposição.

Após o esclarecimento de Wesley, IA aparece como abordagem em texto editorial: **“IA aplicada ao desenvolvimento”**, com apoio à análise de problemas, estruturação de soluções e revisão de código, mantendo decisões e validação sob sua responsabilidade. Não há badge Codex/OpenAI, alegação de especialização em modelos ou associação de IA aos cases. O nome incerto “OpenCloud” não foi interpretado como outra ferramenta.

HTML foi obtido do Simple Icons; Figma vem do Devicon. Fontes e direitos das marcas estão registrados em `public/assets/technologies/README.md`.

## Processo: uma timeline, quatro marcos

`process-sequence` usa uma timeline principal com quatro labels. O mesmo frame, navegação, conteúdo, imagem, marca e detalhe permanecem montados. Não existe outra cena 3D, canvas ou desenho independente por etapa.

| Marco | Progresso | Transformação |
| --- | --- | --- |
| Entender | 0% | Fragmentos separados, contornos, marca/tipografia ainda em formação. |
| Estruturar | 33,33% | Deslocamentos chegam a zero; frame, navegação e grid se alinham. |
| Construir | 66,67% | Superfícies, tipografia e identidade substituem a estrutura de wireframe. |
| Refinar | 100% | Contraste da área visual, escala da marca, espaçamento e detalhes atingem o resultado final. |

A sequência usa transform, opacity e mudanças locais de cor/borda. As proporções e o layout final aprovados foram mantidos. A diferença entre etapas envolve posição, alinhamento, estrutura aparente e acabamento, além de opacidade.

O `scrub` é **booleano (`true`)**, sem atraso temporal, snap, loop ou autoplay. Parar a rolagem mantém o ponto intermediário; subir a página percorre a mesma sequência ao contrário. A [documentação do ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) distingue esse controle direto do scrub numérico, que acrescenta tempo para acompanhar o scroll.

React recebe atualizações somente ao cruzar a etapa dominante: limites de **16,67%, 50% e 83,33%** entre os marcos. Os rótulos e o indicador acessível acompanham essa etapa. As quatro legendas ficam montadas e fazem crossfade de 8% do percurso ao redor de cada limite, evitando troca brusca de strings.

## Pin, percurso e responsividade

Somente desktop a partir de 1024 px, com ponteiro fino e movimento permitido, recebe scrollytelling. O pin prende **a composição editorial/visual**, depois do título da seção, com início a 24 px do topo da viewport.

O pin só é usado quando a altura da composição cabe em `altura da viewport − 48 px`. Seu percurso é **180vh**:

- Viewport 1440 × 1000 da gravação: **1800 px**.
- Viewport com altura de 900 px, se a composição couber: **1620 px**.
- Os marcos dividem esse percurso em três trechos iguais: 0, 600, 1200 e 1800 px na gravação.

Quando a composição não cabe, como no desktop de 720 px de altura validado, a sequência funciona **sem pin**, do topo da composição a 65% da viewport até seu fim a 35%. Esse percurso deriva da altura natural do conteúdo, sem espaço extra de pin. Resize e mudanças reais de tamanho reavaliam essa escolha.

Tablet usa Processo manual, sem pin, e pode manter a entrada reduzida da Expertise. Mobile/ponteiro coarse preserva as seleções diretas, com informação completa e sem reorganização longa. Movimento reduzido desativa ambas as timelines, remove o pin e devolve os quatro estados estáticos aos seletores.

## Seleção manual e navegação

Com scrollytelling ativo, clique, Enter/Espaço ou navegação por setas conduz o scroll nativo ao marco correspondente. O foco é mantido. O estado visual e editorial vêm do progresso efetivo, inclusive durante o percurso até o destino.

Tab foca o seletor sem deslocar automaticamente a timeline ativa. Em modo estático, mantém a seleção por foco existente. Não foi introduzido outro driver de rolagem: esta versão usa scroll nativo, e o pedido manual usa apenas a suavização nativa do navegador.

Wheel, toque, nova ação de ponteiro ou teclado interrompem um deslocamento manual anterior. Cleanup também cancela deslocamento pendente. Com movimento reduzido/mobile, a seleção não solicita deslocamento automático.

A passagem escuro → off-white e sua forma geométrica foram preservadas. Não houve novo takeover ou decoração de tela inteira.

## Integração e cleanup

- Hero, WC Scroll Takeover, Sobre, escrita de Projetos, trail, preview, transições cinematográficas, motor 3D e dados dos cases permanecem sem alteração em relação ao checkpoint existente.
- As novas triggers têm prioridade de refresh posterior às cenas anteriores: Expertise −30, Processo −40.
- Uma correção curta trata apenas as âncoras iniciais `#expertise` e `#processo`, pois os pins anteriores são criados de forma assíncrona. Libera controle na primeira interação ou após quatro segundos. Histórico/retorno de cases continuam com seu mecanismo existente.
- Imports de motion são progressivos; conteúdo estático já existe no HTML. Promessas tardias verificam geração/disposição antes de criar controlador.
- `gsap.context().revert()` desfaz timelines, triggers, pin e estilos próprios. Observers, listeners, timers e RAFs de refresh são liberados. Não há loop RAF novo para o desenho.

## Arquivos da TASK 14B

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/sections/Expertise.tsx` | Estados coerentes do painel, hover real, lifecycle e prévia local. |
| `src/components/sections/Expertise.module.scss` | Estados de cor, logos e ajuste dos slots para HTML. |
| `src/components/sections/TechnologyLogo.tsx` | Tratamento monocromático/colorido dos SVGs reais. |
| `src/data/expertise.ts` | Acréscimos solicitados, cores e associações documentadas. |
| `src/components/sections/Process.tsx` | Integração do controlador, seleção manual e acessibilidade. |
| `src/components/sections/ProcessVisual.tsx` | Alvos semânticos e legendas montadas para crossfade. |
| `src/components/sections/Process.module.scss` | Separação dos estados estáticos e propriedades controladas por motion. |
| `src/lib/motion/expertiseMotion.ts` | Entrada/saída dos grupos, sem pin. |
| `src/lib/motion/processMotion.ts` | Timeline, marcos, pin condicional, sincronização e cleanup. |
| `src/lib/motion/sectionAnchor.ts` | Correção limitada às novas âncoras iniciais. |
| `src/lib/motion/sectionPreview.ts` | Retorno da prévia local à preferência do sistema. |
| `public/assets/technologies/{html5,figma}.svg` | Marcas reais adicionais. |
| `public/assets/technologies/README.md` | Proveniência e tratamento das marcas. |

Os arquivos da TASK 14A ainda não commitados continuam no diretório de trabalho junto desta fase. Nenhum novo commit foi criado na TASK 14B. Nenhuma biblioteca ou fonte foi instalada.

## Validação

- **Lint, typecheck e build: aprovados.**
- **87 verificações da entrega de motion em produção**, antes do refinamento editorial de IA, sem exceções de página.
- **11 verificações dos cases**, incluindo passagem compartilhada dos dois projetos, um único notebook e retorno correto aos Projetos.
- **9 verificações da prévia em desenvolvimento**, com sistema em reduced motion: rota normal estática, prévia habilitada só nas novas seções, saída da prévia e limpeza do pin.
- Viewports cobertas: 1440 × 1000, 1440 × 720, 1024 × 900, 768 × 1000, 390 × 900 e 320 × 900.
- Hover/cores, painel, associações, Escape, foco, setas/Home, seleção por toque, marcos, pausa intermediária, reversão, interrupção manual, resize, mudança de preferência em tempo real, âncoras e ausência de overflow.
- Texto ampliado a 200% em 1024/390/320, conteúdo sem JavaScript e ausência de canvas nas novas seções.

Após o refinamento editorial, lint, TypeScript e build foram executados novamente e passaram. Uma conferência específica de **22 verificações** cobriu 1440, 390 e 320 px: 16 controles sem badge de fornecedor de IA, presença/leitura do novo texto, descrições SQL/parallax, ausência de overflow, reduced motion na rota normal e movimento reversível no grupo de design em desenvolvimento. Nenhuma exceção de página foi registrada. As verificações amplas anteriores documentam a entrega do motion; não foram contadas como uma nova execução após a revisão de conteúdo.

Os vídeos foram gravados em produção com **wheel nativo em tempo real**, sem buscar diretamente a posição da timeline ou alterar velocidade da gravação. O percurso registrado da gravação A tem cerca de **26,10 s** e o B **19,46 s**, incluindo pausas e ações manuais; esses tempos não são durações fixas da animação por scroll. O vídeo A e as capturas comparativas foram atualizados após o refinamento editorial; o vídeo B preserva a validação original de Processo, cujo controlador não mudou.

As capturas comparativas da composição inteira da Expertise congelam o quadro já renderizado durante a captura, preservando os estados de progresso 0 e aproximadamente 0,87. Isso evita que a própria captura fora da viewport altere a posição da página. Não foi usado esse congelamento nas gravações.

### Evidências

- Vídeo Expertise (gravação preservada no backup local)
- Vídeo Processo (gravação preservada no backup local)
- [Dados das gravações](previews/task14b-video-validation.json)
- Expertise: [entrada](previews/task14b-expertise-initial.png), [exploração/seleção](previews/task14b-expertise-exploration.png), [repouso](previews/task14b-expertise-final.png).
- Processo: [Entender](previews/task14b-process-understand.png), [Estruturar](previews/task14b-process-structure.png), [Construir](previews/task14b-process-build.png), [Refinar](previews/task14b-process-refine.png).
- Capturas da entrega anterior ao refinamento editorial — 1024: [Expertise](previews/task14b-expertise-1024.png), [Processo](previews/task14b-process-1024.png).
- Capturas anteriores — 390: [Expertise/Figma](previews/task14b-expertise-390.png), [Processo](previews/task14b-process-390.png).
- Capturas anteriores — 320: [Expertise/Figma](previews/task14b-expertise-320.png), [Processo](previews/task14b-process-320.png).
- [Validação de produção](previews/task14b-production-validation.json)
- [Regressão dos cases](previews/task14b-protected-regression.json)
- [Prévia/reduced motion](previews/task14b-development-preview-validation.json)
- Refinamento editorial de IA: [desktop](previews/task14b-editorial-1440.png), [390 px](previews/task14b-editorial-390.png), [320 px](previews/task14b-editorial-320.png), [22 verificações](previews/task14b-editorial-validation.json).

## Limites da avaliação

Edge automatizado, com viewports/toque emulados, sem dispositivos físicos ou outros motores. As gravações e quadros foram revisados, mas não substituem a aprovação visual de Wesley. Não foi medida taxa de quadros, bateria ou GPU em hardware real.

A comparação de reversão admite diferença de até 0,25 px na matriz de transformação por arredondamento do pin; os valores observados diferiram menos de 0,01 px. Não houve reset ou troca de frame na ilustração.

O tempo da navegação suave manual é definido pelo navegador. O progresso da sequência principal continua diretamente ligado ao scroll. A altura real do conteúdo decide o pin; não se força uma composição maior que a viewport.

Os scripts e quadros intermediários ficam em `.tmp-task14b/`, ignorado pelo Git. O servidor principal permanece em `localhost:3000`.
