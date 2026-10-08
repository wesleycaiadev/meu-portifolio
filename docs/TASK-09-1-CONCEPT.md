# TASK 09.1 · Conceito revisado da apresentação de projetos

Proposta para aprovação. Nenhum novo código 3D escrito.
Checkpoint preservado: `f5abce7`. A URL atual ainda mostra o protótipo rejeitado.

## 1. Conceito e justificativa

**Conhecer o site, explorar sua interface e entender o trabalho realizado.**

Proponho um notebook tridimensional aberto, sem marca de fabricante, com acabamento grafite fosco e a screenshot verdadeira do SpaSmooth em destaque. A forma situa o projeto em um contexto de uso reconhecível. O nome, a categoria e a descrição permanecem em HTML legível, associados à imagem.

Um único celular aparece ao explorar a versão mobile. Localização e FAQ são mostrados na própria tela do notebook, um detalhe de cada vez. Não se tornam novos monitores.

Base, teclado discreto, trackpad e espessura da tampa dão plausibilidade ao notebook. Sua articulação é moderada; enquadramento e reorganização editorial conduzem a transformação. Não há nervuras, abas vazias, pedestal industrial ou peças usadas apenas para demonstrar geometria.

Fundo e tipografia seguem os tokens existentes: escuro, off-white, cinzas, Inter Tight e uso seletivo da Instrument Serif. Iluminação neutra e sombra de contato suave. As cores do SpaSmooth ficam nas capturas; não serão adotadas como nova assinatura do portfólio. Não adicionar cenário, reflexos excessivos, neon ou marca de fabricante.

| Aspecto | Protótipo rejeitado | Nova proposta |
| --- | --- | --- |
| Protagonista | Máquina com cinco painéis | SpaSmooth e sua interface |
| Significado do movimento | Demonstrar articulação de peças | Revelar versão mobile e partes reais do site |
| Conteúdo principal | Estrutura, superfícies e espessura | Contexto, interface, tecnologias confirmadas e participação |
| Relação entre imagens | Telas distribuídas em torno de um núcleo | Desktop/mobile do mesmo projeto; detalhes na tela principal |
| Encerramento | Retorno mecânico | Repouso para leitura e acesso futuro ao case |
| Controles | Coluna dominante de inspeção | Controles de desenvolvimento separados da composição |

A nova solução melhora a compreensão porque cada mudança visual tem um conteúdo correspondente. O notebook é suporte da apresentação; o visitante não precisa entender sua construção para entender o projeto.

## 2. Storyboard A · Apresentar

Nome **SpaSmooth**, categoria proposta **Website · Bem-estar**, descrição objetiva e Hero desktop grande. O notebook começa aberto, numa vista quase frontal. Não há introdução longa abrindo uma tela vazia.

Copy proposta, sustentada pelas capturas:

> Website de massoterapia, Day Spa e bronzeamento, com apresentação de serviços, localização e chamadas para agendamento.

O visitante deve reconhecer o projeto e seu contexto antes de explorar o movimento. A imagem útil da tela tem prioridade sobre mostrar todo o teclado.

## 3. Storyboard B · Explorar

A câmera passa moderadamente para três quartos. O celular se revela junto à lateral externa do notebook, sem cobrir imagem, título ou descrição. O Hero mobile mostra a reorganização da interface.

Uma opção permite observar o menu mobile real. Na tela principal, escolhas pequenas de **Visão geral**, **Localização** e **Dúvidas** mostram as capturas correspondentes. A imagem permanece estável até nova seleção. Uma legenda factual identifica o detalhe escolhido.

Não mostrar todos os detalhes simultaneamente. Trocar screenshots não será apresentado como navegação funcional do site ou funcionamento de integração. Desktop e mobile constituem uma composição única, sem aparelhos distribuídos arbitrariamente.

## 4. Storyboard C · Aprofundar

O conjunto repousa num ângulo legível e abre espaço para informações editoriais. O celular perde protagonismo. O conteúdo mostra o que foi construído, tecnologias efetivamente utilizadas e participação de Wesley, seguido da ação proposta **Conhecer o case**.

Stack e responsabilidades só serão preenchidas após confirmação. Não copiar a stack do portfólio. Não publicar placeholders como informação do projeto.

O CTA prepara a futura abertura da página detalhada. Seu destino e a transição não serão implementados nesta tarefa. A ação pode ser representada na revisão visual futura, mas só será navegável quando houver uma rota real; não criar link falso na experiência publicada.

## 5. Composição desktop

Grid de 12 colunas com tokens e gutters existentes. Estudo inicial em 1440 × 900, também avaliado em 1024 px.

| Estado | Conteúdo editorial | Conteúdo visual |
| --- | --- | --- |
| A | Colunas 1–4: categoria, nome e descrição | Colunas 6–12: notebook, screenshot dominante |
| B | Mesmo eixo de texto, legenda do detalhe | Notebook e um celular dentro da área visual |
| C | Colunas 1–5: descrição, stack, participação e CTA | Colunas 7–12: notebook em repouso |

São relações propostas, não coordenadas fixas. O início do texto se relaciona com a área principal da tela. Em larguras menores, empilhar antes de comprimir a leitura. Não reservar a maior parte da viewport a espaço vazio enquanto o site aparece pequeno.

O Hero desktop tem proporção aproximada de 1,99:1. A captura será contida proporcionalmente na região útil da tela, com margens discretas quando necessário. Nunca esticar para preencher uma tela de proporção diferente. Localização e FAQ também preservam suas proporções.

Controles A/B/C, Reset e diagnóstico ficam em uma área de desenvolvimento recolhível, fora da composição editorial. Não são elementos do design final.

## 6. Câmera e interações previstas

Câmera perspectiva moderada, olhando para a área útil da tela. Posições e FOV serão definidos após a escala do modelo ser aprovada, evitando distorção de grande angular.

- **A:** quase frontal, com leve elevação para sugerir base e espessura.
- **B:** deslocamento lateral inicial de aproximadamente 15–25°, para revelar profundidade e mobile.
- **C:** perspectiva discreta, conjunto acomodado ao lado das informações.

Os ângulos são alvos de estudo. Se prejudicarem a leitura, reduzir o movimento. Não haverá órbita livre de 360° nem rotação contínua.

**Mouse:** drag secundário sobre a área visual, inicialmente limitado a aproximadamente ±10° na horizontal e ±5° na vertical, com damping e retorno suave à pose narrativa. Texto, seleção de detalhes e CTA ficam fora do drag. A orientação adicional não poderá esconder a tela atrás do aparelho.

**Scroll futuro:** A → B → C com scrub reversível. Parar o scroll interrompe o progresso; subir recompõe a sequência. Sem autoplay, snap ou delays que continuam sozinhos. A pose de scroll é a base; o drag só acrescenta exploração limitada.

Faixas conceituais, a calibrar na implementação futura:

| Progresso | Momento |
| --- | --- |
| 0–25% | A em repouso |
| 25–45% | Câmera e revelação do celular |
| 45–65% | B legível |
| 65–85% | Reorganização para C |
| 85–100% | C em repouso para leitura |

Detalhes são escolhidos explicitamente, não passados depressa pelo scroll. A distância de rolagem será definida depois, evitando pin excessivamente longo. No playground, estados e progresso local poderão ser inspecionados sem envolver a home.

**Teclado:** controles nativos, foco visível e estados identificáveis. Drag nunca obrigatório. Reset restaura a pose narrativa; Escape encerra a exploração manual.

**Mobile:** leitura vertical, screenshot mobile dominante e detalhes acessíveis por toque. Evitar dois dispositivos minúsculos na mesma viewport. Simplificar câmera, sem hover essencial ou scroll preso. Tablet mantém dois aparelhos apenas com espaço útil suficiente.

**Reduced motion/WebGL indisponível:** as mesmas informações em HTML e capturas estáticas. Nenhum conteúdo essencial fica escondido em uma face 3D.

## 7. Informações reais disponíveis do SpaSmooth

Foram examinadas as cinco capturas, os dados atuais, a especificação e o checklist. Screenshots comprovam aparência e conteúdo visível; não comprovam backend ou funcionamento de integrações.

| Asset | Evidência visual disponível |
| --- | --- |
| `spasmooth-hero-desktop.png` | Marca, massoterapia/Day Spa/bronzeamento, apresentação principal, chamadas para agendamento e identificação de Aracaju |
| `spasmooth-hero-mobile.png` | Versão mobile, reorganização visual, CTA e acesso ao menu |
| `spasmooth-mobile-menu.png` | Menu expandido, destinos e opções visuais de unidades |
| `spasmooth-localizacao.png` | Localização, endereço, contato e mapa visível |
| `spasmooth-faq-footer.png` | Perguntas frequentes, footer e chamadas de navegação/agendamento |

Não afirmar pagamentos, agendamento integrado, atualização em tempo real, CMS, autenticação ou resultados com base nessas imagens.

## 8. Dados pendentes

Precisam de confirmação antes de preencher o estado C:

1. Linguagens, framework, bibliotecas principais e ferramentas do SpaSmooth.
2. Backend, banco, CMS ou serviços externos, se houver.
3. Participação de Wesley: pesquisa, conteúdo, design, frontend, backend, integrações e publicação; trabalhos compartilhados ou partes fornecidas pelo cliente.
4. Escopo realmente entregue e estado do projeto: protótipo, site publicado ou outro.
5. URLs corretas e divulgáveis do site, repositório e futuro case.
6. Destino e funcionamento real da chamada de agendamento, caso seja descrita além da evidência visual.

Métricas não são necessárias e só entram se confirmadas. O conceito pode ser aprovado antes dessas respostas; o conteúdo factual de C depende delas.

## 9. Estratégia futura para MF Consultoria

O mesmo sistema terá conteúdo próprio, sem repetir a ficha do SpaSmooth:

- A: Hero desktop, nome e contexto de curadoria automotiva, visível na captura.
- B: Hero mobile e detalhe de curadoria/processo; CTA/footer como detalhe adicional na tela principal.
- C: tecnologias, participação e destino próprios, ainda sujeitos a confirmação.

A proporção do Hero da MF é diferente. Ajustar a imagem sem deformação e manter a escala do aparelho estável durante a troca. Usar dados por finalidade: apresentação, mobile, detalhes, informações confirmadas e URLs. Não atrelar a narrativa a índices de faces.

A troca de projetos será validada somente depois da aprovação visual do SpaSmooth.

## 10. Ponte futura com a home

Planejar uma transferência visual do preview 2D ativo para a tela do notebook, mantendo projeto, captura, proporção, posição e tamanho aparentes.

O controlador atual oferece `getSnapshot()` com seleção, imagem e bounds. Revalidar esses bounds contra o layout no momento da futura integração.

1. Medir o preview após a seleção estar resolvida.
2. Preparar a textura correspondente; manter a imagem 2D enquanto carrega.
3. Projetar a região útil da tela 3D exatamente sobre a imagem 2D. A pose de encaixe pode ser mais frontal que A.
4. Transferir a imagem coincidente para o 3D; revelar gradualmente corpo, base e perspectiva.
5. Conduzir à pose A, preservando a identificação do projeto.
6. Na reversão, restaurar a imagem 2D coincidente antes de retirar o 3D.

O traço aprovado não se transforma em cabo ou dobradiça. Lista, preview e traço permanecem intactos nesta tarefa. A ponte será implementada em outra tarefa aprovada.

## 11. Plano em tarefas pequenas, após aprovação

Somente dependências existentes: Three.js, GSAP, React/Next.js e Sass. Não há nova biblioteca prevista.

| Tarefa | Objetivo e arquivos previstos | Critério objetivo |
| --- | --- | --- |
| 1 · Conteúdo e composição A | Atualizar `src/data/projectObject.ts`, `src/components/three/ProjectObjectPlayground.tsx` e seu Sass. Nome, categoria, descrição e screenshot estática; sem geometria nova. | Projeto reconhecido primeiro; imagem grande; controles separados; aprovação em 1440/1024/390/320 px. |
| 2 · Notebook estático | Criar `src/lib/three/projectPresentation.ts` e conectá-lo ao playground. Geometria coerente e somente pose A. | Screenshot proporcional e legível; base/tampa plausíveis; enquadramento conserva o peso da imagem aprovado na tarefa 1. |
| 3 · Exploração B | Adicionar celular, câmera B e seleção de capturas no novo controlador e componente. | Desktop/mobile claros; menu/localização/FAQ acessíveis; sem telas extras ou sobreposição sobre texto e imagem. |
| 4 · Conteúdo C | Preencher somente dados confirmados; bloco editorial, pose C e intenção do CTA. | Stack e participação verificadas; leitura estável; nenhum link falso. |
| 5 · Motion e acessibilidade | Progresso local reversível no playground, drag limitado, teclado, touch e fallback. | Scroll parado congela sequência; reversão completa; informação preservada em reduced motion; mobile utilizável. |
| 6 · Validação isolada | Conferir render por demanda, DPR, resize, cleanup, context loss e produção. Registrar evidências em `docs/`. | Lint/typecheck/build passam; sem overflow; render parado em repouso; playground bloqueado em produção; home intacta. |

Cada tarefa termina em revisão. Não criar abstrações para novos tipos de case antes de validar SpaSmooth. A home e as partes já aprovadas não serão alteradas nessas tarefas do playground.

## Escopo desta entrega

Somente este documento foi criado. Código, assets, dependências e checkpoint não foram modificados. Não há nova prévia 3D no localhost.

Parar e aguardar aprovação do conceito, storyboard e composição antes de escrever a nova geometria.
