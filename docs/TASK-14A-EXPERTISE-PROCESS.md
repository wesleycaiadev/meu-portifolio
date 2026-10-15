# TASK 14A — Expertise e Processo

Implementada em 14/10/2026. **Fundação visual pronta para aprovação; TASK 14B não iniciada.**

Antes da implementação, a TASK 13 aprovada foi registrada no checkpoint `107a014`, com a mensagem solicitada: `feat: enable shared cinematic project transitions`. Os diretórios temporários ignorados ficaram fora do commit. Esta TASK 14A permanece sem novo commit.

## Avaliar na página

- [Expertise](http://localhost:3000/#expertise): selecione um logo ou use Tab, setas, Home e End.
- [Processo](http://localhost:3000/#processo): selecione Entender, Estruturar, Construir e Refinar.

Os estados funcionam também por toque e com movimento reduzido. Nesta fase, a transformação da ilustração responde à seleção da etapa; não existe sequência automática ou scrollytelling.

## Direção visual

Expertise continua o fundo escuro de Projetos. A composição divide tecnologias em quatro grupos, com escalas diferentes, uma segunda linha recuada nas interfaces e deslocamentos verticais entre grupos. Linhas finas delimitam relações e espaço, sem cartões, porcentagens, carrossel ou efeitos luminosos.

Um painel lateral explica a tecnologia selecionada e apresenta somente destinos existentes. Em tablet/mobile, esse texto aparece junto ao grupo selecionado. Foco e seleção destacam o símbolo e seu nome; as demais marcas perdem um pouco de contraste no desktop, mantendo os rótulos legíveis.

Processo usa a cor de papel existente. Um recorte geométrico na passagem entre as seções introduz a superfície clara, sem mudar os tokens globais. A área editorial se relaciona com uma única ilustração de interface, que conserva seus elementos entre os quatro estados:

| Estado | Composição |
| --- | --- |
| Entender | Fragmentos, contornos e linhas orientadoras ainda deslocados. |
| Estruturar | Os elementos se alinham e revelam navegação, conteúdo e grid. |
| Construir | A mesma estrutura recebe tipografia, superfícies e identidade. |
| Refinar | Contraste, alinhamentos e detalhes completam a interface. |

A ilustração é um estudo abstrato, identificado como tal, sem representar um novo produto entregue. Reutiliza a marca WC aprovada e sua janela de visualização existente; não há novo cenário WebGL ou logo redesenhado.

## Tecnologias e associações confirmadas

As relações com SpaSmooth e MF são derivadas de `projectTechnologyStacks`, confirmado por Wesley. Não inferimos CSS, JavaScript, React ou PostgreSQL a partir de um framework ou serviço utilizado em outro projeto.

| Grupo | Tecnologia | Aplicações exibidas |
| --- | --- | --- |
| Interfaces e aplicações | React | SpaSmooth; este portfólio |
| Interfaces e aplicações | Next.js | SpaSmooth; este portfólio |
| Interfaces e aplicações | Angular | MF Consultoria |
| Interfaces e aplicações | TypeScript | SpaSmooth; MF Consultoria; este portfólio |
| Interfaces e aplicações | JavaScript | Este portfólio |
| Estilos e apresentação | SCSS | MF Consultoria; este portfólio |
| Estilos e apresentação | Tailwind CSS | SpaSmooth |
| Estilos e apresentação | CSS | Este portfólio |
| Dados e serviços | Supabase | SpaSmooth; MF Consultoria |
| Dados e serviços | PostgreSQL | MF Consultoria |
| Movimento e experiências | GSAP | Este portfólio |
| Movimento e experiências | Three.js | Este portfólio |

As associações ao portfólio são sustentadas por `package.json`, componentes TSX, estilos SCSS/CSS, importações GSAP/Three.js e configuração JavaScript do repositório (`eslint.config.mjs`). JavaScript não foi apresentado como a linguagem autoral dos componentes TypeScript nem atribuído aos outros cases por inferência.

**SQLite e Figma foram omitidos:** o documento original menciona possibilidades, mas os registros atuais não comprovam seu uso. Não acrescentamos um grupo de ferramentas de design sem dados confirmados. Clerk e Vercel permanecem nos dados dos cases, sem ampliar os grupos propostos nesta fase.

São 12 marcas reais. Oito SVGs existentes foram reutilizados; quatro foram adicionados do [repositório Simple Icons](https://github.com/simple-icons/simple-icons): JavaScript, CSS, GSAP e Three.js. Os paths e títulos originais foram preservados. A procedência foi registrada em `public/assets/technologies/README.md`. O símbolo Sass identifica SCSS, como nos cases anteriores.

Os links dos cases usam suas rotas públicas reais. “Este portfólio” retorna ao conteúdo da home. Nenhum destino externo ou projeto não documentado foi criado.

## Tipografia, grid e proporções

- Inter Tight em títulos, informação e controles; Instrument Serif italic apenas em “movimento” e “último detalhe”, além do título ilustrativo.
- Títulos principais de 2,5 a 5,75 rem, com altura de linha 1,03 e ajuste fluido por viewport. Corpos de texto usam cerca de 1 a 1,125 rem, com altura de linha entre 1,5 e 1,6.
- Cabeçalhos desktop organizados no grid existente de 12 colunas: título ocupa 8 colunas, texto de apoio 3, com uma coluna de respiro.
- Expertise divide a área inferior em composição e painel na razão 8:3; os grupos usam 1,3:1, escalas de logos entre 40 e 64 px e espaçamento assimétrico.
- Processo usa áreas editorial/visual na razão 4:6; a ilustração conserva a proporção 600:440.
- Tablet simplifica o grid mantendo os dois grupos por linha e o texto de seleção junto ao grupo. Processo conserva duas áreas a partir de 768 px.
- Mobile usa leitura vertical. As tecnologias têm nomes sempre visíveis; Processo apresenta quatro seletores compactos, descrição da etapa e ilustração abaixo, sem pin ou hover obrigatório.

As pequenas inscrições dentro da ilustração são decorativas, proporcionais ao desenho e removidas da árvore acessível. Os títulos, instruções e legendas que explicam a evolução são HTML real, em tamanho de leitura.

## Arquitetura

| Arquivo | Responsabilidade |
| --- | --- |
| `src/data/expertise.ts` | Grupos, funções das tecnologias e associação aos projetos confirmados. |
| `src/data/process.ts` | Quatro etapas, descrições e estados conceituais. |
| `src/components/sections/Expertise.tsx` | Seleção por mouse, toque e teclado; painel desktop e detalhes junto ao grupo em telas menores. |
| `src/components/sections/Expertise.module.scss` | Composição espacial, escalas, tipografia e estados de foco/seleção. |
| `src/components/sections/Process.tsx` | Seleção das etapas, narrativa editorial e indicador acessível de progresso. |
| `src/components/sections/ProcessVisual.tsx` | Ilustração estável, com frame, navegação, conteúdo, identidade e detalhe identificados. |
| `src/components/sections/Process.module.scss` | Superfície clara local, passagem geométrica e os quatro estados visuais. |
| `src/app/page.tsx` | Integração após Projetos e antes de Contato; substituição dos placeholders de Expertise/Processo. O placeholder de Manifesto, ainda sem conteúdo definido, deixa de ocupar a home. |
| `public/assets/technologies/{javascript,css,gsap,threedotjs}.svg` | Quatro logos reais adicionais. |
| `public/assets/technologies/README.md` | Procedência dos assets novos. |

Os arquivos de Hero, marca interativa, Sobre, Projetos, trail, preview, coordenador, motor 3D, dados/rotas dos cases e estilos globais permanecem idênticos ao checkpoint da TASK 13. A navegação minimalista do Hero mantém seus três links.

Os componentes renderizam conteúdo no HTML inicial. No modo sem JavaScript, uma lista adicional expõe todas as funções/associações das tecnologias e as quatro descrições do Processo. Com movimento reduzido, as seleções continuam operáveis e as transições de cor são zeradas pelos tokens existentes.

## Preparação para a TASK 14B

Esta fase entrega alvos estáveis: `data-expertise-group`, `data-technology`, `data-process-state` e `data-process-layer`. A seleção das etapas não desmonta o frame da ilustração.

Depois de aprovada a composição, a proposta é:

1. Mapear o progresso local da rolagem para a reorganização dos quatro grupos, com deslocamentos definidos por grupo, evitando movimentos aleatórios.
2. Usar GSAP/ScrollTrigger existentes para interpolar as posições, proporções e contrastes dos mesmos elementos do Processo entre os quatro estados.
3. Manter a trajetória reversível e a inércia discreta ligada à direção de scroll. Nenhum autoplay independente.
4. Separar progresso contínuo de seleção manual para que teclado e toque mantenham prioridade e foco estável.
5. Restringir qualquer pin a desktop após validação de ritmo; conservar as seleções diretas e conteúdo completo em mobile/reduced motion.
6. Inicializar o controlador apenas quando elegível e liberar listeners, triggers e timelines ao desmontar ou mudar a preferência de movimento.

Não foi criado controlador de scroll novo, timeline GSAP nova, RAF ou canvas para estas seções nesta TASK 14A. Somente microinterações de cor/opacidade de 160 ms estão implementadas.

## Validação e limites

- Lint, typecheck e build: aprovados.
- **78 verificações** das novas seções aprovadas em produção, sem exceções de página.
- **11 verificações** de regressão aprovadas: SpaSmooth e MF continuam concluindo a transferência compartilhada, exibindo um único notebook e retornando à seção Projetos. As novas seções continuam presentes após o retorno.
- **6 verificações finais** no servidor principal: indicador acessível das quatro etapas, Expertise atualizada e ausência de exceções de página. O servidor de desenvolvimento permanece disponível em `localhost:3000`.
- Responsividade testada em **1440, 1024, 768, 390 e 320 px**, sem overflow horizontal, inclusive com texto ampliado a 200%.
- Foco visível, Tab, setas, Home/End, reversibilidade, seleção por toque, links dos cases, movimento reduzido e acesso sem JavaScript verificados.
- Os quatro estados foram diferenciados visualmente e mantiveram a mesma instância de frame. Não houve autoplay.
- A revisão visual corrigiu uma sobreposição inicial na ilustração e aproximou a explicação da tecnologia selecionada em telas pequenas.

Os testes foram feitos no Edge automatizado, com viewports e toque emulados. Não certificam dispositivos físicos, outros motores ou desempenho de animações futuras. A avaliação estética e o ritmo de scrollytelling dependem da aprovação desta composição; não foram tratados como aprovados automaticamente.

O build precisou de execução com permissão de subprocessos: a primeira tentativa compilou, mas o sandbox bloqueou a etapa seguinte com `spawn EPERM`. A execução autorizada concluiu normalmente, sem instalação de dependências.

## Capturas para aprovação

Capturas finais feitas no build de produção, sem o indicador de desenvolvimento:

| Largura | Expertise | Tecnologia selecionada | Processo |
| --- | --- | --- | --- |
| 1440 | [Inicial](previews/task14-expertise-1440.png) | [Angular](previews/task14-expertise-selected-1440.png) | [Inicial](previews/task14-process-1440.png) |
| 1024 | [Inicial](previews/task14-expertise-1024.png) | [Angular](previews/task14-expertise-selected-1024.png) | [Inicial](previews/task14-process-1024.png) |
| 390 | [Inicial](previews/task14-expertise-390.png) | [Angular](previews/task14-expertise-selected-390.png) | [Inicial](previews/task14-process-390.png) |
| 320 | [Inicial](previews/task14-expertise-320.png) | [Angular](previews/task14-expertise-selected-320.png) | [Inicial](previews/task14-process-320.png) |

Quatro estados desktop: [Entender](previews/task14-process-understand-1440.png), [Estruturar](previews/task14-process-structure-1440.png), [Construir](previews/task14-process-build-1440.png), [Refinar](previews/task14-process-refine-1440.png).

- [Passagem Expertise escura → Processo claro](previews/task14-section-threshold-1440.png)
- [Verificações das novas seções](previews/task14-production-validation.json)
- [Regressão dos projetos](previews/task14-protected-regression.json)
- [Verificação final do servidor principal](previews/task14-final-smoke.json)
- [Registro das capturas](previews/task14-preview-validation.json)

Os scripts auxiliares ficam em `.tmp-task14/`, ignorado pelo Git. Nenhuma fase seguinte foi iniciada.
