# TASK 13 — Transição cinematográfica compartilhada

> Atualização de 16/10/2026: vídeos de referência e revisão foram retirados da entrega por decisão de Wesley. As descrições abaixo registram testes anteriores; as gravações originais permanecem no backup local.

Concluída em 14/10/2026. A MF Consultoria utiliza a mesma passagem Home → notebook → case do SpaSmooth. A TASK 14 não foi iniciada.

## Checkpoint

As TASKS 11 e 12 aprovadas foram salvas no commit `a2bbb25` (`feat: complete shared project transition and MF Consultoria case`). Os diretórios temporários das TASKS 11 e 12 ficaram fora do checkpoint; `.tmp-task*/` foi acrescentado ao `.gitignore`. Os artefatos da TASK 10 já rastreados anteriormente foram preservados. As alterações desta TASK 13 permanecem disponíveis no diretório de trabalho, sem novo commit.

## Arquitetura e arquivos alterados

Somente três arquivos da aplicação mudaram nesta tarefa:

| Arquivo | Alteração |
| --- | --- |
| `src/data/projects.ts` | Habilita a MF e declara a origem permitida da transferência: desktop para MF, responsiva para SpaSmooth. |
| `src/components/motion/ProjectTransitionProvider.tsx` | Confere a origem declarada antes de iniciar; identifica o projeto na camada durante a transferência e limpa essa identificação ao terminar. |
| `src/lib/three/projectCase.ts` | Calcula a área realmente ocupada pela captura contida e utiliza o mesmo cálculo para a textura e os quatro pontos de destino. |

O coordenador persistente da TASK 11, sua camada de imagem, timeline GSAP e controlador Three.js continuam únicos. O snapshot existente fornece projeto, destino, captura efetivamente exibida, proporção e bounds. A rota conecta o mesmo motor preparado à transferência; a abertura compartilhada substitui a abertura de acesso direto nessa passagem, evitando duas aberturas consecutivas.

Não houve alteração de layout, SCSS, conteúdo editorial, geometria, câmera, materiais, duração configurada ou bibliotecas. Hero, logo, efeitos ambientais, Sobre e lista editorial foram preservados.

## Enquadramento

A captura inicial da MF mede **1345 × 947**, enquanto a do SpaSmooth mede **1905 × 956**. A tela física do notebook conserva a proporção aprovada de 1905/956.

Na MF, a imagem inteira ocupa uma região central com margens laterais. A transferência converge para essa região útil, em vez de esticar a imagem até os limites físicos da tela. A escala uniforme é o mínimo entre as razões de largura e altura; esse cálculo também desenha a captura na textura. A imagem transferida e a imagem final continuam sendo a mesma captura real, sem crop destrutivo.

O SpaSmooth conserva seu modo rolável e os mesmos quatro pontos de destino anteriores. Sua captura já corresponde à proporção física da tela.

### Regra por viewport

O preview aprovado da home utiliza capturas mobile abaixo de 1024 px. Para preservar esse preview e evitar uma troca de imagem durante a passagem, a MF só transfere quando a origem efetivamente exibida é sua captura desktop. Em 768 px com ponteiro fino, usa navegação direta e a abertura própria do case; a partir de 1024 px, utiliza a passagem compartilhada. Em mobile, ponteiro coarse ou movimento reduzido, mantém a apresentação direta prevista pelo sistema.

O SpaSmooth conserva a política responsiva anterior. Nenhuma preferência do sistema foi alterada e nenhum novo parâmetro de bypass foi adicionado.

## Duração medida

Gravações comparáveis, no build de produção local, Edge automatizado, viewport **1440 × 900** e preferência de movimento normal:

| Projeto | Seleção até encerramento da camada |
| --- | --- |
| SpaSmooth | **2754 ms (2,754 s)** |
| MF Consultoria | **2598 ms (2,598 s)** |

A sequência configurada conserva 0,28 s de saída e 2,15 s de entrada compartilhada: **2,43 s**, acrescidos da preparação de rota, módulo e texturas. Na suíte separada de produção, a MF levou 2631 ms. Não há espera artificial nova; esses tempos variam com a execução. O watchdog existente de 5 s continua liberando a navegação em caso de interrupção.

## Validação

- Lint, TypeScript e build: aprovados.
- MF em produção: **67 verificações aprovadas**, sem exceções de página.
- SpaSmooth em produção: **54 verificações aprovadas**, sem exceções de página.
- MF em desenvolvimento: **64 verificações aprovadas**, sem exceções de página; a suíte de produção inclui adicionalmente o cenário de seleção rápida.
- Viewports: **320, 390, 768, 1024 e 1440 px**; a regressão SpaSmooth também verifica 820 px.
- Passagem por clique e Enter, seleção rápida entre projetos, clique repetido, identidade da textura, proporções e estado final.
- Navegação modificada, nova aba, histórico, voltar, refresh, acesso direto e remontagem.
- Resize, interrupção, aba oculta, falha de textura e WebGL indisponível, sem camada bloqueando a página.
- Reduced motion e mobile seguem a navegação direta. Capturas e conteúdo permanecem acessíveis sem JavaScript/WebGL.
- Scroll interno, teclado até o limite da captura, liberação de scroll, abas editoriais, foco e retorno aos Projetos permanecem funcionais.

As gravações completas e screenshots foram revisados. Não foram detectadas regressões na composição ou exploração do SpaSmooth; a composição final da MF continua a aprovada na TASK 12.

## Links para avaliar

- [Home: selecione e abra o projeto](http://localhost:3000/#projetos)
- [Case MF Consultoria: acesso direto](http://localhost:3000/projetos/mf-consultoria)
- [Case SpaSmooth: acesso direto](http://localhost:3000/projetos/spasmooth)
- Vídeo A — SpaSmooth (gravação preservada no backup local)
- Vídeo B — MF Consultoria (gravação preservada no backup local)

A passagem cinematográfica começa na home. Acesso direto usa a entrada própria do case. Com movimento reduzido ativo, a página respeita essa preferência; os vídeos permitem avaliar a sequência completa sem alterar a configuração do navegador.

### Evidências

- [Duração e validação dos dois vídeos](previews/task13-video-validation.json)
- [MF em produção](previews/task13-mf-production-validation.json)
- [MF em desenvolvimento](previews/task13-mf-development-validation.json)
- [Regressão SpaSmooth](previews/task13-spasmooth-regression-production-validation.json)
- MF: [home](previews/task13-mf-consultoria-home.png), [transferência](previews/task13-mf-consultoria-transfer.png), [convergência](previews/task13-mf-consultoria-surface.png), [abertura](previews/task13-mf-consultoria-opening.png), [estado final](previews/task13-mf-consultoria-open.png).
- SpaSmooth: [home](previews/task13-spasmooth-home.png), [transferência](previews/task13-spasmooth-transfer.png), [convergência](previews/task13-spasmooth-surface.png), [abertura](previews/task13-spasmooth-opening.png), [estado final](previews/task13-spasmooth-open.png).
- Responsividade MF: [320](previews/task13-mf-mobile-320.png), [390](previews/task13-mf-mobile.png), [768](previews/task13-mf-768.png), [1024](previews/task13-mf-1024.png), [1440](previews/task13-mf-1440.png), [reduced motion](previews/task13-mf-reduced-motion.png).
- SpaSmooth: [regressão desktop](previews/task13-spasmooth-regression-desktop.png), [regressão mobile](previews/task13-spasmooth-regression-mobile.png).

Os scripts de validação estão em `.tmp-task13/`, ignorado pelo Git. As evidências finais estão em `docs/previews/`.

## Limitações

Os testes utilizam Edge automatizado, viewports e toque emulados, sem dispositivos físicos ou outros motores de navegador. A condição de aba oculta foi simulada com `visibilitychange` e `hidden=true`; abertura nativa em nova aba foi testada separadamente. Isso verifica o tratamento da interrupção, sem certificar todas as políticas de suspensão de abas em hardware real.

Os tempos medidos são de execução local; não representam latência de hospedagem pública. O enquadramento entre capturas de proporções diferentes exige as margens já aprovadas na tela da MF. Nenhuma medição física de bateria, VRAM ou taxa de quadros foi realizada nesta tarefa.
