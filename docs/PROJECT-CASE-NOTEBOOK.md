# TASK 09: Project case entry / notebook reveal prototype

Protótipo isolado do SpaSmooth. A aprovação conceitual da última tarefa substitui a direção dos cinco painéis. Não há integração com a home nem implementação da TASK 10.

Prévia: http://127.0.0.1:3000/playground/project-case

Checkpoint anterior preservado: `f5abce7`. Checkpoint dos documentos de conceito antes desta implementação: `a8dd086`. O novo código permanece disponível para revisão visual, sem um novo commit de aprovação.

## Composição e entrada

Um notebook grafite sem marca de fabricante apresenta a captura real do SpaSmooth. Base, tampa, dobradiça e trackpad têm profundidade; o teclado é uma única textura discreta. O projeto e seu contexto aparecem em HTML à direita. Os controles de replay e reset ficam em um disclosure de desenvolvimento abaixo da composição.

A rota simula a entrada de um projeto assim que as imagens terminam de carregar. Não há clique na lista da home nesta etapa. Durante o carregamento, a imagem e o texto ficam ocultos para preservar a entrada sobre o fundo escuro.

| Momento | Intervalo relativo ao início | Movimento |
| --- | --- | --- |
| Contorno | 0 a 0,95 s | Desenho do perímetro da base, `power1.inOut` |
| Construção | 0,78 a 1,43 s | Corpo ganha presença, `power2.out` |
| Continuidade | 1,12 a 1,57 s | Contorno desaparece sobre a própria base |
| Abertura | 1,35 a 3,00 s | Tampa abre e câmera acompanha, `power3.inOut` |
| Tela | 2,93 a 3,48 s | Captura ganha luminosidade, `power2.out` |
| Conteúdo | 3,18 a 3,88 s | Editorial surge com opacity e deslocamento de 18 px |

A sequência termina em repouso. Não há rotação infinita nem movimento contínuo da câmera. O replay repete a sequência completa; reset retorna exploração, scroll interno e composição à visão inicial aberta.

## Arquitetura

| Arquivo | Responsabilidade |
| --- | --- |
| `src/app/playground/project-case/page.tsx` | Rota Server Component, metadata noindex e `notFound()` fora de desenvolvimento |
| `src/components/three/ProjectCasePlayground.tsx` | Conteúdo semântico, tabs, preferências de movimento, import dinâmico, lifecycle e fallback |
| `src/components/three/ProjectCasePlayground.module.scss` | Grid editorial, estados de leitura, responsividade e feedback das tabs |
| `src/data/projectCase.ts` | Copy factual, papéis das capturas e informações pendentes |
| `src/lib/three/projectCase.ts` | Geometria, câmera, GSAP, textura rolável, raycast, damping e descarte |

Three.js direto e GSAP existentes no projeto. Sem React Three Fiber, iframe ou nova dependência da aplicação. Os papéis das imagens são reutilizados do módulo factual `projectObject.ts`; a geometria rejeitada não é reutilizada.

## Exploração dentro da tela

As capturas desktop de apresentação, localização e FAQ/footer são concatenadas proporcionalmente em um canvas fora da tela. Uma janela desse canvas alimenta a `CanvasTexture` do notebook. O canvas da textura tem largura máxima de 1536 px e preserva a proporção do Hero. Nos assets atuais, a janela tem 771 px de altura, o conteúdo combinado 2942 px e o percurso interno 2171 px.

O raycast contra a tela decide se o wheel pertence ao projeto. A distância é convertida considerando a altura projetada da tela. Ao alcançar um extremo sem poder consumir mais scroll, a página volta a receber o wheel. Ctrl/Shift + wheel não são capturados. A imagem não contém links clicáveis.

Teclado com foco na apresentação: setas verticais, Page Up/Down, Space, Home/End. As tabs usam setas horizontais, Home/End e foco visível do sistema existente.

**Limite da simulação:** são capturas de trechos diferentes, com enquadramentos originais distintos. As junções não representam a continuidade exata de um site completo. A legenda informa a seleção de capturas. Não foi inventado conteúdo entre esses trechos nem validado agendamento real.

## Leitura e interação

Selecionar qualquer tab reduz o notebook para 95% e desloca o rig 0,22 unidade à esquerda em 650 ms. O grid altera a proporção de 1,58:1 para 1,32:1 em 600 ms. O painel da tab entra em 380 ms com opacity e 8 px de deslocamento. A ação de voltar à visão do projeto desfaz a reorganização.

Drag fora da tela: yaw limitado a aproximadamente 10 graus, pitch a 5 graus e damping de 13/s. Soltar o ponteiro retorna à pose inicial. Arrastar sobre a tela não gira o notebook.

## Responsividade e acessibilidade

- Desktop com ponteiro fino: apresentação 3D completa.
- Abaixo de 1024 px: composição vertical com editorial antes da visualização.
- Até 767 px ou ponteiro coarse: capturas com scroll nativo; a primeira imagem passa a ser o Hero mobile. Sem interação obrigatória por hover.
- Movimento reduzido: conteúdo imediatamente legível e apresentação estática rolável. É possível ativar a abertura 3D explicitamente apenas nessa prévia; isso não altera a preferência do sistema.
- Falha de WebGL/import/imagem: fallback semântico com capturas disponíveis.
- Perda de contexto WebGL: fallback temporário; restauração retoma a apresentação.

## Performance e lifecycle

DPR limitado a 1,5; sombra 1024; teclado sem meshes por tecla; textura sem regeneração de mipmaps. A textura é atualizada somente durante scroll interno. RAF para quando o objeto está em repouso. Entrada, layout e render suspendem quando a seção sai da viewport ou o documento fica oculto. Listeners, observers, timelines, geometria, materiais, texturas e contexto são descartados no unmount.

## Conteúdo confirmado e pendente

**Evidência visual fornecida:** serviços de massoterapia, Day Spa e bronzeamento; versões desktop/mobile; menu mobile expandido; localização/mapa/contato; FAQ; chamadas para agendamento; fundos claros, azuis, fotografias e títulos serifados/itálicos.

**Ainda precisa de confirmação:** linguagens, framework, backend, serviços externos, funcionamento de integrações e agendamento, escopo de Wesley em design/desenvolvimento/publicação, URLs de produção/repositório e resultados. Não foram inventadas métricas, responsabilidades ou bibliotecas. A stack do portfólio não foi atribuída ao SpaSmooth.

## Validação

Registro automatizado em `docs/previews/project-case-validation.json`: scroll interno e reverso, liberação nos extremos, damping/limites do drag, todas as tabs, teclado, perda/restauração de contexto, suspensão via evento de visibilidade, unmount, movimento reduzido, opt-in/out e ausência de WebGL. Larguras verificadas: 1920, 1091, 1024, 820, 390 e 320 px, sem overflow horizontal. Sem exceções de página na bateria registrada.

O teste de visibilidade simula `document.hidden` e dispara `visibilitychange`; não é uma medição de consumo de GPU com a janela física minimizada. A suíte de interação foi executada no Edge headless com WebGL, não em hardware mobile real. A avaliação estética final depende da aprovação visual de Wesley.

Vídeos em tempo real, 1440 × 900:

- `docs/previews/project-case-entry.webm`: entrada completa.
- `docs/previews/project-case-open.webm`: aberto, exploração moderada e retorno.
- `docs/previews/project-case-scroll.webm`: scroll nas capturas e reversão.
- `docs/previews/project-case-tabs.webm`: quatro tabs e retorno à visão inicial.

Screenshots: contorno, abertura, aberto, scroll, FAQ, Sobre, Tecnologias e fallback mobile em `docs/previews/project-case-*.png`.

Verificação final em 08/10/2026:

- `npm run lint`: passou, sem warnings.
- `npm run typecheck`: passou.
- `npm run build`: passou. O sandbox bloqueou subprocessos com EPERM na primeira tentativa; a execução autorizada concluiu todas as etapas.
- Produção na porta temporária 3002: `/playground/project-case` retornou 404; home retornou 200; sem controles de prévia, mesmo com os parâmetros de desenvolvimento na URL; sem exceções de página. Registro em `docs/previews/project-case-production-validation.json`.
- Assets, `reference/`, dependências e arquivos existentes: sem alterações em relação ao checkpoint. Nenhuma dependência nova da aplicação.
- FFmpeg do Playwright foi baixado apenas em pasta temporária para gravar/verificar os vídeos, sem modificar package.json ou lockfile. Essa pasta foi removida após a validação.

Arquivos de implementação criados: os cinco listados na tabela de arquitetura. Documentação criada: este arquivo. Evidências criadas: quatro WebM, nove PNG (oito estados mais a home em produção) e dois JSON. Nenhum arquivo rastreado anterior foi modificado. O servidor de desenvolvimento permanece em 127.0.0.1:3000 para avaliação ao vivo; o servidor temporário de produção foi encerrado.
