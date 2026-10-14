# TASK 12 — Case público da MF Consultoria

Implementada em 14/10/2026. Rota: `/projetos/mf-consultoria`.

## Arquitetura reutilizada

Os dois cases usam `ProjectCase`, os mesmos componentes de conteúdo/capturas/navegação, o mesmo SCSS e um único controlador Three.js. Não foi criado outro notebook ou outra timeline. As rotas fornecem seus dados ao componente compartilhado.

`ProjectCaseData` concentra slug, caminho público, nome, descrição, participação, metadata, links confirmados, capturas, versão mobile, política de acomodação na tela, nota de simulação, tecnologias e conteúdo das quatro abas.

SpaSmooth mantém seus textos, capturas, geometria, materiais, câmera, abertura e experiência de leitura. Seu caminho de renderização continua usando a exploração rolável anterior. MF Consultoria usa a mesma abertura independente de 3,88 s, o mesmo enquadramento e a mesma interação por mouse/teclado. A troca de abas mantém o recuo discreto do notebook e o espaço editorial aprovado.

## Conteúdo e fontes

As quatro imagens vêm exclusivamente de `public/assets/projects/mf-consultoria/`:

| Captura | Dimensões originais | Uso |
| --- | --- | --- |
| `mf-consultoria-hero-desktop.png` | 1345 × 947 | Tela inicial do notebook |
| `mf-consultoria-hero-mobile.png` | 396 × 869 | Apresentação mobile |
| `mf-consultoria-curadoria-processo.png` | 1341 × 568 | Segunda captura desktop |
| `mf-consultoria-cta-footer.png` | 1347 × 766 | Terceira captura desktop |

A stack foi conferida em `src/data/projectTechnologies.ts` e `docs/PROJECT-CASE-NOTEBOOK.md`: **Angular, TypeScript, SCSS, Supabase, PostgreSQL e Vercel**. Nenhuma versão de Angular, autenticação, RLS ou função específica de backend foi inferida.

Wesley confirmou nesta tarefa que realizou todo o projeto. A aba Sobre registra concepção, design, desenvolvimento, integrações e publicação. Estética descreve os elementos observáveis nas imagens: fundos claros, contraste com blocos escuros, títulos serifados/itálicos, retrato, hierarquia e composição mobile. Funcionalidades apresenta somente a proposta de curadoria, as etapas visíveis do processo, os destinos da navegação e as chamadas de contato.

A URL externa do site não foi fornecida; a lista de links externos permanece vazia. O destino público interno é real. Não foram criados links fictícios nem métricas, resultados ou depoimentos.

## Proporções e simulação visual

A região física da tela permanece com a proporção aprovada do notebook SpaSmooth (1905/956), independentemente da proporção de cada captura. O aparelho não muda de tamanho por projeto.

Na MF, cada screenshot é acomodado inteiro em um segmento da tela, com escala uniforme e margens neutras quando necessárias. A captura inicial mais alta recebe margens laterais; a captura de curadoria mais larga recebe margens verticais. O scroll percorre esses segmentos. No SpaSmooth, o desenho das capturas no canvas mantém o comportamento anterior.

As imagens são registros de seções distintas. A exploração é uma **simulação visual rolável**, sem reprodução integral ou integração navegável do site real. Essa informação aparece também na interface da MF. No HTML/mobile, os screenshots mantêm suas proporções naturais e podem ser percorridos por rolagem nativa.

## Navegação e acessibilidade

- MF Consultoria agora é um link real na lista editorial da home.
- Sua navegação usa o comportamento padrão de `next/link`. A transformação compartilhada da TASK 11 permanece habilitada somente para SpaSmooth, por meio de `cinematicTransition`.
- Acesso direto, refresh, histórico e retorno à seção Projetos funcionam para os dois projetos.
- Mobile e ponteiro coarse apresentam o conteúdo vertical e capturas HTML. Reduced motion mostra imediatamente a apresentação essencial.
- WebGL indisponível mantém conteúdo e capturas acessíveis. O fallback sem JavaScript também recebe os dados corretos de cada projeto.
- Abas, foco ao voltar à visão geral, teclado na tela, alt text e limites de scroll permanecem compartilhados.

## Recursos e performance

O motor recebe somente as capturas do projeto atual. A validação de acesso direto à MF não observou solicitações de texturas SpaSmooth. O cleanup mantém cancelamento das timelines, RAF e listeners, desconexão dos observers e descarte de geometrias, materiais, texturas e contexto WebGL.

Duas alternâncias completas MF → home → SpaSmooth → home → MF foram instrumentadas. Em cada verificação houve **um contexto conectado e ativo**; os antigos estavam desconectados e perdidos, seus sinais de listeners abortados e seus observers sem alvos antigos. As contagens de desenho dos contextos antigos permaneceram estáveis, confirmando que seus loops pararam. Os registros antigos aparecem no JSON porque a instrumentação de teste os retém; eles não são renderers ativos da aplicação.

## Arquivos alterados

| Arquivo | Alteração nesta tarefa |
| --- | --- |
| `src/data/projectCase.ts` | Contrato compartilhado e dados próprios da MF; metadata e participação de cada case |
| `src/data/projects.ts` | Destino real da MF e política explícita de transição por projeto |
| `src/app/projetos/mf-consultoria/page.tsx` | Nova rota pública, com metadata e fallback sem JavaScript |
| `src/app/projetos/spasmooth/page.tsx` | Passa os dados aprovados ao componente compartilhado |
| `src/components/project-case/ProjectCase.tsx` | Recebe dados de projeto e os conecta ao controlador existente |
| `src/components/project-case/ProjectCaseContent.tsx` | Conteúdo, autoria, tecnologias e links por projeto |
| `src/components/project-case/ProjectCaseCaptures.tsx` | Capturas e alt text por projeto; `preload` atual substitui a prop `priority` descontinuada |
| `src/components/project-case/ProjectCaseNavigation.tsx` | Identificação do projeto no retorno |
| `src/components/project-case/ProjectCaseNoScript.tsx` | Apresentação HTML por projeto |
| `src/components/three/ProjectCasePlayground.tsx` | Mantém o playground SpaSmooth com seus dados explícitos |
| `src/components/sections/Projects.tsx` | Link MF e navegação padrão; preserva a passagem SpaSmooth |
| `src/components/layout/ProjectReturnAnchor.tsx` | Aceita o retorno dos dois cases |
| `src/lib/three/projectCase.ts` | Tela física fixa e acomodação proporcional opcional, dentro do mesmo motor |

Não houve alteração de SCSS nesta tarefa, instalação de bibliotecas, geração de novos assets ou redesign das demais seções. As alterações da TASK 11 já presentes no diretório foram preservadas.

## Validação

- `npm.cmd run lint`: aprovado.
- `npm.cmd run typecheck`: aprovado.
- `npm.cmd run build`: aprovado, incluindo as duas rotas públicas.
- MF e alternância de recursos: **76 verificações em produção**, sem exceções de página.
- Regressão SpaSmooth: **54 verificações em produção**, sem exceções de página.
- Após atualizar a prop de preload, a checagem final confirmou abertura desktop e carregamento da captura correta em desktop/mobile nos dois cases. A API instalada trata `priority` e `preload` como o mesmo sinal de pré-carregamento; a substituição mantém esse comportamento.
- Viewports verificadas: 1920, 1440, 820, 390 e 320 px. Revisão visual dos cases, tecnologias e alternativas mobile.

Os testes cobrem scroll interno e teclado até o rodapé, seleção das quatro abas, tecnologias/logos, autoria, foco, restauração de composição, proporções de desenho no canvas, metadata, retorno, refresh/histórico, reduced motion, WebGL indisponível e JavaScript desabilitado.

## Evidências

- [Vídeo completo MF: abertura, scroll, abas, retorno e mobile](previews/task12-mf-case.webm)
- [Vídeo mobile separado](previews/task12-mf-mobile.webm)
- [Relatório de produção e recursos](previews/task12-production-validation.json)
- [Regressão SpaSmooth](previews/task12-spasmooth-regression-production-validation.json)
- [Carregamento do build final](previews/task12-final-loading-validation.json)
- [Verificação da gravação](previews/task12-mf-video-validation.json)
- Screenshots: [contorno](previews/task12-mf-outline.png), [abertura](previews/task12-mf-opening.png), [aberto](previews/task12-mf-open.png), [scroll](previews/task12-mf-scroll.png), [rodapé](previews/task12-mf-footer.png), [Sobre](previews/task12-mf-about.png), [Estética](previews/task12-mf-aesthetics.png), [Funcionalidades](previews/task12-mf-features.png), [Tecnologias](previews/task12-mf-technologies.png), [retorno](previews/task12-mf-return.png), [mobile](previews/task12-mf-mobile.png), [SpaSmooth após o refactor](previews/task12-spasmooth-regression-desktop.png).

Scripts utilizados: `.tmp-task12/preview.cjs.txt`, `.tmp-task12/validate.cjs.txt`, `.tmp-task12/spasmooth-regression.cjs.txt` e `.tmp-task12/loading-smoke.cjs.txt`. Usam o Edge e os runtimes de validação já disponíveis no ambiente.

## Limitações

Os testes ocorreram no Edge automatizado com viewports e toque emulados, sem dispositivos físicos ou outros motores. A instrumentação de recursos verifica descarte e atividade; não é uma medição de VRAM ou consumo de bateria em hardware real.

As capturas permitem inspecionar a apresentação visual, mas não comprovam o funcionamento de backend, showroom ou destinos externos. Essas funções não foram promovidas a resultados comprovados no case. A URL externa permanece pendente de confirmação.

A navegação da MF permanece sem transformação cinematográfica compartilhada. Nenhum novo commit foi criado nesta tarefa e nenhuma fase posterior foi iniciada.
