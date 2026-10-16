# TASK 16 — Auditoria final do portfólio

Data: 15/10/2026. Base preservada no checkpoint **`793889f` — `feat: complete portfolio contact section`**.

## Escopo e estado da entrega

Auditoria da home, SpaSmooth e MF Consultoria, com correções localizadas de legibilidade, carregamento, descarte de recursos e preparação de metadados. Identidade WC, composição, conteúdo factual, paleta, direção de movimento, notebooks e navegação nativa foram preservados. Nenhuma biblioteca foi instalada.

**Auditoria concluída, com correções locais verificadas. Pronto para preparar a publicação, condicionado à confirmação do domínio e à validação do ambiente público.** A pendência de dependência de desenvolvimento continua registrada; não há P0 ou P1 funcional reproduzível restante no percurso testado.

Não houve deploy. A TASK 17 não foi iniciada. As alterações da TASK 16 permanecem disponíveis no diretório de trabalho, sem novo commit.

## Método e limites

- Produção local: `next build` + `next start`, porta temporária 3002. Desenvolvimento: porta 3000, incluindo os parâmetros de preview existentes.
- Microsoft Edge automatizado com Playwright e inspeção visual das capturas e de quadros dos quatro vídeos. Rolagem dos vídeos por eventos nativos de roda; sem acelerar a reprodução ou avançar timelines artificialmente.
- Layout em 320×900, 390×900, 768×1000, 1024×900, 1440×1000, 1920×1080 e 844×390. DPR 2 também utilizado no percurso de navegação com WebGL.
- Movimento normal, preferência por movimento reduzido, alteração dessa preferência durante a visita, ausência de WebGL, perda real de contexto e conteúdo dos cases sem JavaScript.
- Axe 4.13.0, teclado, métricas locais de navegação, recursos, tarefas longas, CLS, LCP, contadores DOM/JS e coleta de memória pelo protocolo do navegador.
- Não houve teste em aparelho físico, Safari/Firefox, leitor de tela real, GPU móvel ou rede móvel. Emulação de tela e toque não equivale a esses testes.
- Não foi executado Lighthouse. Os tempos locais não representam nota, Core Web Vitals de campo, percentil de usuários ou garantia de FPS. Há aquecimento de cache e alguma concorrência entre verificações; comparar bytes é mais confiável que atribuir causalidade às diferenças de tempo.

## Matriz de problemas e correções

Não foi encontrado P0 reproduzível no percurso auditado.

| ID | Grau | Problema e evidência | Correção / estado |
| --- | --- | --- | --- |
| 16-01 | P1 | `/playground` respondia 200 em produção. [Antes](previews/task16/before-playground.png), 1440×1000; inventário inicial. | Guarda de ambiente adicionada. Os três playgrounds respondem 404 em produção e continuam disponíveis para desenvolvimento. |
| 16-02 | P1 | A imagem responsiva podia reter toda a árvore anterior da home após navegação com movimento. A linha de base chegou a 9.820 nós / 1.095 listeners após oito percursos. [Medição anterior](previews/task16/memory-before-fix.json), 1440×1000 / DPR 2. | Seleção das mesmas URLs otimizadas passou a usar `ResizeObserver` e consulta de breakpoint com descarte explícito. Não registra `srcset/sizes` nativos. Versões desktop/mobile e proporções preservadas; resize e Strict Mode verificados. Ver resultado final na seção de performance. |
| 16-03 | P1 | Após remover a retenção da home, permanecia um canvas antigo por visita. O heap ligou os contextos à textura PBR compartilhada `DFG_LUT` do Three r186. | A textura é liberada antes de limpar as propriedades do renderizador. Não altera material, shader, iluminação ou aparência; as visitas seguintes voltam a enviá-la à GPU. Correção específica à versão instalada, sem editar a biblioteca. |
| 16-04 | P1 | O retrato carregava o arquivo de 923.322 bytes mesmo na amostra em que bastava uma versão menor. [Sobre antes](previews/task16/before-sobre-1440.png). | Mesma fotografia, enquadramento e CSS. Otimizador Next com qualidade 85 e escolha de resolução conforme largura/DPR. Removida a query artificial `?v=2`. Na amostra de entrada, retrato de 47.566 bytes. |
| 16-05 | P1 | Links do cabeçalho dos cases tinham cerca de 23,09 px de altura; pequenos textos editoriais chegavam a 12–13 px. [Antes SpaSmooth](previews/task16/before-spasmooth-390x900.png), 390×900. | Alvos do cabeçalho e retorno à visão geral com mínimo de 44 px; textos auxiliares/tecnologias aumentados pontualmente para 14–15 px. Nenhuma composição refeita. [Depois](previews/task16/final-spasmooth-390x900.png). |
| 16-06 | P2 | Preload desktop podia disputar o primeiro screenshot mobile dos cases. | Primeiro screenshot usa carregamento imediato com prioridade alta e sem preload desktop indevido. Restantes continuam lazy. Seleção mobile/desktop preservada. |
| 16-07 | P2 | Símbolo SVG continha JPEG embutido volumoso. | Reempacotamento da imagem interna em WebP sem perdas. Geometria, transformações, janela e pixels decodificados idênticos. SVG de 1.594.568 para 1.310.884 bytes. [Prova](previews/task16/brand-optimization.json). |
| 16-08 | P2 | Favicon/ícone Apple e metadados de compartilhamento estavam incompletos. | Ícones derivados da WC aprovada; títulos, descrições, OG e Twitter textuais nas três páginas. Canonical/sitemap/imagens absolutas condicionados ao domínio confirmado. |
| 16-09 | P2 | Cabeçalhos HTTP de configuração podiam ser melhorados sem alterar execução. | `nosniff`, `strict-origin-when-cross-origin` e remoção de `X-Powered-By`. Conferidos nas respostas de produção. |
| 16-10 | P1, ferramentas | Auditoria de dependências sinaliza `braces` pela cadeia do ESLint. | Pendente de atualização compatível publicada. Não aplicado o downgrade major de `eslint-config-next` sugerido pelo fix automático. Sem dependência de produção afetada na auditoria executada. Detalhes abaixo. |
| 16-11 | P1 | Mesmo com DOM estável, restavam dois listeners de consulta de mídia por retorno. O código instalado do GSAP 3.15 revertia o contexto, mas mantinha essas assinaturas nativas. | Sobre usa uma consulta de breakpoint com remoção explícita e o mesmo `gsap.context`. Timelines, valores e SplitText preservados. Troca desktop → tablet → desktop testada, com restauração do pin e texto intacto. |
| 16-12 | P2 | O SVG vazio de Projetos mudava de caixa fora da tela para viewport ao iniciar, gerando CLS local 1 na entrada com movimento. [Diagnóstico anterior](previews/task16/motion-layout-shifts-before.json), 1440×1000. | CSS inicial passa a reservar a mesma posição fixa já usada pela sequência, invisível até a seção estar próxima. Trajetória e controlador preservados. Nova amostra sem deslocamentos: [registro final](previews/task16/motion-layout-shifts.json), CLS 0. |

Os problemas de descarte usam contadores e heap como evidência, pois uma captura estática não mostra retenção de memória. Capturas antes/depois foram usadas nos problemas visuais e de exposição de rota.

## Inspeção visual e responsividade

Foram examinados alinhamentos, hierarquia, espaçamentos, contraste, continuidade das superfícies, ícones, limites dos screenshots e legibilidade. As mudanças visuais se limitaram aos textos e alvos dos cases. Não foi encontrado motivo para alterar a direção aprovada da home.

- **77 verificações de dimensões/abas**, sem overflow horizontal nas sete configurações. Nenhum link/botão visível abaixo de 24×24 px no levantamento final. Isso não certifica todos os critérios de tamanho de alvo e espaçamento da WCAG.
- Todas as quatro abas dos dois cases foram percorridas em cada largura.
- Capturas reais preservadas; o conteúdo comprido dos cases é explorável por rolagem interna. Nenhuma imagem foi esticada para simular outra interface.
- Sobre mantém foto e enquadramento; Expertise mantém disposição aprovada e cores de marca nas interações; Processo conserva quatro estados e adaptação mobile; Contato conserva seus destinos e encerramento.
- Nas capturas finais de fallback, o teste aguarda a decodificação da primeira imagem, evitando registrar um frame de carregamento como tela vazia.

Resultados completos: [responsividade final](previews/task16/final-responsive.json).

| Seção | Desktop 1440 | Mobile 390 |
| --- | --- | --- |
| Hero | [Captura](previews/task16/final-inicio-1440.png) | [Captura](previews/task16/final-inicio-390.png) |
| Sobre | [Captura](previews/task16/final-sobre-1440.png) | [Captura](previews/task16/final-sobre-390.png) |
| Projetos | [Captura](previews/task16/final-projetos-1440.png) | [Captura](previews/task16/final-projetos-390.png) |
| Expertise | [Captura](previews/task16/final-expertise-1440.png) | [Captura](previews/task16/final-expertise-390.png) |
| Processo | [Captura](previews/task16/final-processo-1440.png) | [Captura](previews/task16/final-processo-390.png) |
| Contato | [Captura](previews/task16/final-contato-1440.png) | [Captura](previews/task16/final-contato-390.png) |

Cases: [SpaSmooth desktop](previews/task16/final-spasmooth-1440x1000.png), [mobile](previews/task16/final-spasmooth-390x900.png), [paisagem](previews/task16/final-spasmooth-844x390.png); [MF desktop](previews/task16/final-mf-consultoria-1440x1000.png), [320 px](previews/task16/final-mf-consultoria-320x900.png), [paisagem](previews/task16/final-mf-consultoria-844x390.png).

## Movimento e continuidade

| Trecho | Verificação |
| --- | --- |
| Hero | WC aparece com identidade preservada; deformação/fluxo e energia do ponteiro; estado ativo e repouso; Takeover e navegação com pins existentes. |
| Sobre | Entrada do texto, blur → nitidez do retrato e retorno ao blur no scroll reverso. As amostras na mesma posição produziram o mesmo filtro. |
| Projetos | Escrita, continuidade do S e trail observados no vídeo; valor de escrita retorna ao voltar na rolagem; seleção por ponteiro/foco, preview correto e abertura dos dois projetos. |
| Cases | Superfície compartilhada → construção/abertura; um canvas por cena; exploração da tela por teclado; abas, retorno à visão geral, saída e retorno aos projetos. Acesso direto e refresh também verificados. |
| Expertise | Estados por scroll, hover/foco dos logos e cores React/TypeScript/JavaScript; Escape retorna às instruções. |
| Processo | Entender, Estruturar, Construir e Refinar; avanço e reversão; seleção manual quando a preferência reduz movimento. |
| Contato | Entrada, links, foco, encerramento e retorno ao início; sem novo efeito decorativo. |

Não foram observados saltos de loop, duplicação de cenas, pins acumulados, exceções de página ou telas vazias persistentes nos percursos gravados. Os vídeos foram registrados após o polimento visual; as correções posteriores tratam o descarte e a seleção das mesmas imagens, sem mudar as timelines.

### Vídeos entregues

1. [Percurso completo da home](previews/task16/home.webm).
2. [Entrada e exploração do SpaSmooth](previews/task16/spasmooth.webm).
3. [Entrada e exploração do MF Consultoria](previews/task16/mf-consultoria.webm).
4. [Processo com scroll reverso](previews/task16/process-reverse.webm).

[Registro dos estados percorridos](previews/task16/videos.json). São evidências de execução local, não avaliação de fluidez em hardware físico.

## Navegação e contato

Foram exercitados os três links do Hero, âncoras, foco de destino, histórico, retorno dos cases, URLs diretas, refresh, Ctrl+clique e abertura em nova aba. O clique modificado abriu nova aba sem ativar a transição da página original. O início permanece acessível por teclado e links nativos.

Os **68 resultados** da suíte de contato incluem produção com/sem movimento, preview de desenvolvimento, histórico, largura de tela, texto ampliado e conteúdo sem JavaScript: [registro](previews/task16/contact-validation.json).

Destinos confirmados no código e nos cliques interceptados localmente:

- WhatsApp e “Vamos conversar?”: `https://wa.me/5579998356598`.
- E-mail: `mailto:wesleycaia.dev@gmail.com`.
- LinkedIn: `https://www.linkedin.com/in/wesley-caia-dev/`.

Nenhuma mensagem foi enviada e não se validou propriedade de contas externas. Não há formulário fictício. Não foi encontrado currículo final aprovado; `contact.resume` continua nulo e nenhum botão de download sem arquivo foi inserido.

## Relatório de acessibilidade

- **Seis varreduras Axe**, home + dois cases em 390 e 1440 px: **zero violações automáticas**. Home: 43 verificações aprovadas por varredura; cases: 39.
- Há **nove elementos por varredura da home** com contraste inconclusivo para o Axe. Não foram convertidos artificialmente em aprovação. Pares funcionais do sistema de cores foram calculados separadamente e passaram 4,5:1; logos/decorativos e composição foram inspecionados visualmente.
- Primeiro foco: “Pular para o conteúdo”. Títulos, regiões, nomes de links, tabs, foco de destino e foco visível revisados. Abas respondem a setas e End; retorno à visão geral restaura foco na aba Sobre.
- Escape na Expertise restaura instruções; quatro passos do Processo permanecem acionáveis manualmente.
- Ativar reduced motion durante a visita remove os cinco pins da home e libera o canvas WC. A versão estática permanece informativa e navegável.
- Perda de contexto e ausência de WebGL deixam as capturas reais e abas acessíveis. Sem JavaScript, os cases mantêm capturas e quatro blocos editoriais em disclosures.
- Texto ampliado foi exercitado na suíte de contato. Não houve certificação por leitor de tela ou auditoria formal WCAG completa.

[Axe final](previews/task16/final-accessibility.json), [contraste, teclado e reduced motion](previews/task16/final-checks.json), [fallback SpaSmooth](previews/task16/after-spasmooth-context-loss.png), [fallback MF](previews/task16/after-mf-consultoria-context-loss.png).

## Relatório de performance

Os inventários registram recursos realmente transferidos, tempos e CLS nas mesmas três rotas. Os valores finais consolidados e a comparação de memória estão em [resumo medido](previews/task16/audit-summary.json); fontes brutas: [antes](previews/task16/before-inventory.json), [final](previews/task16/final-inventory.json), [navegação repetida antes](previews/task16/memory-before-fix.json), [navegação repetida final](previews/task16/memory-after-fix.json).

- Retrato: 923.322 → 47.566 bytes na amostra de entrada 1440 px/DPR 1. Demais larguras/DPR podem escolher outras resoluções. Qualidade 85, mesma origem e CSS. O fallback do servidor também é uma imagem real otimizada.
- Símbolo WC: 1.594.568 → 1.310.884 bytes em disco; resposta HTTP comprimida observada de 1.121.453 → 986.898 bytes. Pixels decodificados idênticos, SHA-256 registrado.
- As capturas dos cases continuam reais e sem recompressão destrutiva do texto. A primeira tem prioridade alta; demais são lazy. O tamanho dos PNGs continua sendo um custo conhecido, especialmente SpaSmooth.
- O engine específico dos cases não é solicitado pela home antes da entrada. O Three compartilhado já é necessário para a WC da home; não se afirma que a home inteira deixa de carregar Three.
- WC com DPR máximo 1,5; cadência configurada em 30 fps de repouso e 60 fps ativa. São limites de renderização, não FPS medido no aparelho do visitante.
- Cases com DPR limitado e renderização por necessidade. Observadores, eventos e RAFs têm descarte; contexto perdido/aba oculta suspende a cena. Contextos, canvases e pins foram contados no percurso repetido.
- Fontes Inter Tight e Instrument Serif continuam as aprovadas, servidas localmente pelos assets gerados pelo Next. A compilação precisa buscar a origem do Google Fonts quando não há cache; a tentativa sem rede falhou e a execução com acesso autorizado compilou.
- Sem JavaScript, a imagem de fallback pode ser a captura desktop completa mesmo em tela pequena; as informações permanecem disponíveis. Com JavaScript, breakpoint e mudança de orientação selecionam a captura correspondente, com descarte da assinatura de resize.

### Navegação repetida: antes e depois

Oito percursos alternados home → SpaSmooth/MF → home, com movimento ativo, DPR 2 e coleta de memória em cada retorno:

| Indicador | Antes | Final |
| --- | --- | --- |
| Nós DOM | 2.435 → 9.820 | **1.361 em todos os oito retornos** |
| Listeners JS | 556 → 1.095 | **478 em todos os oito retornos** |
| Contextos dos cases | Descarte já acontecia | 8 criados / 8 perdidos explicitamente |
| Canvas dos cases após retorno | 0 na árvore visível | 0; retenção do renderizador compartilhado corrigida |
| Pins da home após retorno | 5 | 5, sem duplicação |
| RAFs pendentes da home | Não usados como prova de FPS | 2–3, sem crescimento por visita |
| Heap JS coletado | 11,02 → 13,86 MB | 10,58 → 12,04 MB |

O crescimento de árvores anteriores e listeners foi eliminado **neste percurso**. O heap ainda varia com caches, código e coleta; não se declara ausência universal de vazamento ou estabilidade de VRAM. A medição permite concluir sobre o acúmulo reproduzido e corrigido, sem extrapolar para todo navegador ou duração de uso.

### Entrada e custo do movimento

Na amostra final com movimento ativo: **362.654 bytes de JavaScript**, LCP local **1.752 ms**, **CLS 0**. A versão estática tem menos JavaScript; as duas amostras não devem ser misturadas. [Inventário com movimento](previews/task16/full-motion-inventory.json).

Foram observadas tarefas longas na inicialização do WebGL, incluindo uma de 536 ms no Edge headless. O carregamento 3D continua sendo um custo real. Não se recomenda reduzir ou reconstruir o shader aprovado a partir de uma única amostra sem GPU física; validar em hardware real antes da abertura pública. Não houve nova arquitetura de renderização nesta auditoria.

Entrada estática/reduced motion, 1440×1000 e DPR 1; JavaScript comprimido efetivamente carregado como script:

| Rota | JS antes → final | LCP local antes → final | CLS final |
| --- | --- | --- | --- |
| Home | 181.939 → 182.454 bytes | 816 → 640 ms | 0 |
| SpaSmooth | 192.375 → 193.306 bytes | 320 → 248 ms | 0 |
| MF Consultoria | 192.375 → 193.306 bytes | 272 → 244 ms | 0 |

O pequeno acréscimo de JavaScript da correção de imagens é registrado, não ocultado como redução de bundle. Os tempos são amostras locais sem significância estatística e não demonstram isoladamente uma aceleração causada pelas alterações.

## SEO, configuração e segurança

- Títulos/descrições específicos, grafia Wesley Caiã, `pt_BR`, OG/Twitter textuais e ícones WC presentes nas três rotas públicas.
- `.env.example` documenta `SITE_URL`, que continua vazio. Não foi inferido domínio de localhost, preview ou links dos projetos.
- Até confirmação da origem HTTPS, páginas ficam `noindex`, robots bloqueia indexação e sitemap não inventa URLs. Com a origem configurada e rebuild, o sitemap contém somente as três rotas públicas e os cases recebem suas imagens reais de compartilhamento. Caminhos, credenciais, query, hash e origem HTTP são recusados pela validação.
- A home ainda precisa de arte de compartilhamento aprovada, se desejada; não se criou imagem promocional fictícia.
- Produção: playgrounds 404; `.env`, `.git/config` e arquivos temporários de auditoria não são servidos. Não foram encontradas credenciais nos padrões verificados ou source maps públicos de navegador.
- Logs de erro legítimos e ferramentas de desenvolvimento foram mantidos. Nenhuma dependência foi removida apenas para reduzir contagem de arquivos.
- Auditoria npm de produção: **zero vulnerabilidades conhecidas no resultado executado**. Auditoria completa: cinco entradas altas na mesma cadeia de ferramentas `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`.
- A causa publicada é **CVE-2026-93687 / GHSA-vfj7-8cjw-p6xm**, `braces <=3.0.3`, sem versão corrigida indicada em 15/10/2026. A sugestão automática de regressão para ESLint Config Next 14 não foi aplicada ao Next 16. Acompanhar atualização compatível; não aceitar padrões arbitrários de terceiros nas ferramentas. [Advisory primário](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

## Validação final

| Verificação | Resultado |
| --- | --- |
| Lint com zero warnings | Aprovado |
| Typecheck | Aprovado |
| Build de produção | Aprovado |
| Rotas públicas / playgrounds | 200 nas três públicas; 404 nos três playgrounds |
| Responsividade | 77 verificações; zero overflow / zero erros de página |
| Axe | 6 varreduras, zero violações; contraste inconclusivo explicitado acima |
| Contato e navegação de encerramento | 68 resultados aprovados |
| Movimento, domínio, teclado e fallbacks | 42 resultados aprovados |
| Cases repetidos | 73 resultados funcionais aprovados; DOM/listeners estáveis nos oito retornos |

Resultados intermediários `after-*`, `behavior.json`, `memory-quick.json`, `memory-cleanup-probe.json` e `memory-full-diagnostic.json` documentam diagnóstico e experimentos. Para conclusão, prevalecem os arquivos `final-*`, `memory-after-fix.json`, `contact-validation.json` e `audit-summary.json`. Heaps brutos e scripts temporários permanecem fora dos artefatos de publicação.

## Pendências reais de publicação

1. **Confirmar domínio HTTPS**, configurar `SITE_URL` e recompilar. Validar canonical, robots, sitemap e compartilhamento no ambiente publicado antes de liberar indexação.
2. **Acompanhar o advisory das ferramentas de desenvolvimento** e adotar atualização compatível quando houver correção. Não houve troca de versão major como parte desta auditoria.
3. **Currículo final aprovado** ainda não fornecido. A ausência é explícita e não gera download quebrado.
4. **Arte OG da home**, se desejada, depende de aprovação; os cases já dispõem de capturas reais.
5. Antes da abertura pública, fazer uma passada em dispositivos reais e em Safari/Firefox, incluindo leitor de tela. Essas verificações não foram simuladas como concluídas.

**Recomendação: seguir para a preparação de publicação somente quando Wesley autorizar essa próxima etapa.** As correções locais desta auditoria estão verificadas. A liberação pública depende do domínio confirmado, rebuild e revisão de indexação/compartilhamento no ambiente final. A pendência das ferramentas deve ser acompanhada e a validação em dispositivos reais permanece necessária. Não houve deploy nesta entrega.

## Arquivos alterados

- `next.config.ts`: qualidade de imagem, cabeçalhos e identificação do servidor.
- `.env.example`: instrução do domínio confirmado.
- `src/app/layout.tsx`, `src/app/projetos/spasmooth/page.tsx`, `src/app/projetos/mf-consultoria/page.tsx`: metadados.
- `src/lib/siteMetadata.ts`: origem e metadados compartilhados.
- `src/app/robots.ts`, `src/app/sitemap.ts`: indexação condicionada ao domínio.
- `src/app/icon.png`, `src/app/apple-icon.png`: ícones derivados da marca existente.
- `src/app/playground/page.tsx`: indisponibilidade em produção.
- `src/components/project-case/ProjectCase.module.scss`: leitura e alvos dos cases.
- `src/components/project-case/ProjectCaseCaptures.tsx`: prioridade e seleção das capturas.
- `src/components/ui/ResponsiveImage.tsx`: resolução e descarte de assinaturas de imagem.
- `src/components/sections/About.tsx`, `src/components/sections/Projects.tsx`: aplicação do componente de imagem.
- `src/lib/three/projectCase.ts`: liberação da textura PBR compartilhada no encerramento.
- `src/lib/motion/aboutReveal.ts`: descarte explícito da consulta de breakpoint, preservando as timelines.
- `src/components/motion/ProjectTrail.module.scss`: estado inicial do overlay consistente com sua posição animada.
- `public/assets/brand/logo-symbol.svg`: reempacotamento sem perdas da imagem embutida.
- `docs/TASK-16-FINAL-AUDIT.md` e `docs/previews/task16/`: relatório, vídeos, screenshots e resultados medidos.

### Links locais para revisão

- [Home](http://localhost:3000/).
- [Expertise/Processo com preview de movimento em desenvolvimento](http://localhost:3000/?motion=preview#expertise).
- [Preview completo pelos controles de desenvolvimento](http://localhost:3000/?wc-preview=1&motion=preview#conteudo): em desktop com mouse, clicar **Ativar animação** no painel para WC/Sobre/Projetos mesmo com reduced motion.
- [SpaSmooth](http://localhost:3000/projetos/spasmooth).
- [MF Consultoria](http://localhost:3000/projetos/mf-consultoria).

O parâmetro `motion=preview` atual ativa os previews das seções que o implementam. Ele não ignora globalmente a preferência de acessibilidade da WC/Sobre. A auditoria completa de movimento em produção usou um contexto separado sem preferência por redução; a rota normal respeitou a preferência do sistema.
