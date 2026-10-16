# TASK 11 — Home → Notebook 3D

> Atualização de 16/10/2026: vídeos de referência e revisão foram retirados da entrega por decisão de Wesley. As descrições abaixo registram testes anteriores; as gravações originais permanecem no backup local.

Implementada em 14/10/2026, após o checkpoint aprovado da TASK 10: `8651ac2` (`feat: create spasmooth production case page`).

## Estratégia e continuidade

`ProjectTransitionProvider` permanece no layout raiz, acima das rotas do App Router. Seu contexto compartilha somente a sessão temporária desta passagem: screenshot, bounds medidos, caminho de destino, timelines e cleanup. Não armazena estado de navegação persistente nem substitui o roteador.

Na ativação normal do link SpaSmooth, o controlador de previews estabiliza a seleção e mede a área real da imagem contida. A screenshot atual (`currentSrc`) passa a uma camada fixa, com a imagem original oculta. O fundo escurece durante 280 ms, reduzindo a presença da lista e do traço sem modificar esses componentes. Em seguida, `router.push` realiza a navegação real do Next.js.

Depois de preparar as texturas e o viewport, o motor 3D fornece os quatro pontos da superfície de transferência do notebook, projetados pela câmera nas coordenadas atuais da página. GSAP interpola esses pontos; uma matriz de perspectiva CSS transforma a screenshot até essa superfície. Origem e destino acompanham as dimensões reais da viewport, sem coordenadas de tela fixadas para uma resolução.

Contorno e corpo aparecem durante a transferência. A screenshot dá lugar à superfície do notebook enquanto a tampa abre; a tela revela a captura real do mesmo SpaSmooth. O conteúdo editorial aparece na parte final. A composição final, a geometria, as abas, os textos e a interação interna permanecem os da TASK 10.

## Duração e relação com a entrada existente

| Movimento | Duração / posição na sequência |
| --- | --- |
| Saída da home | 0,28 s antes de navegar |
| Transferência da screenshot | 0,78 s a partir da preparação do notebook |
| Corpo do notebook | 0,43 s, começando em 0,32 s |
| Saída da screenshot | 0,28 s, começando em 0,68 s |
| Tampa e câmera | 1 s, começando em 0,76 s |
| Revelação da tela | 0,54 s, começando em 1,16 s |
| Conteúdo editorial | 0,60 s, começando em 1,55 s |

A sequência animada tem **2,43 s**: saída de 0,28 s + entrada compartilhada de 2,15 s, com movimentos sobrepostos. A carga da rota, do módulo e das texturas acrescenta tempo variável. O teste de produção mediu **2,623 s** entre seleção e liberação da camada; a gravação com screenshots intermediários registrou 2,742 s.

A entrada compartilhada substitui a abertura independente nesta navegação. Não executa duas entradas em sequência. Acesso direto, refresh e novas abas continuam usando a abertura aprovada, de 3,88 s.

## Navegação, interrupções e alternativas

- O elemento continua sendo `next/link`, com `href` real. `onNavigate` permite interceptar apenas a navegação interna normal. Ctrl/Cmd, botão do meio e novas abas mantêm a ação nativa.
- Cliques repetidos não reiniciam a passagem nem adicionam entradas duplicadas ao histórico. Hover, foco e seleção por scroll não trocam o projeto enquanto ele está em transferência.
- Desktop e tablet com ponteiro fino usam a passagem medida. A composição vertical do tablet foi verificada em 820 px.
- Mobile e dispositivos com ponteiro coarse usam navegação direta e capturas estáticas. Nenhuma transformação desktop é imposta ao mobile.
- `prefers-reduced-motion: reduce` sempre omite esta transformação e mostra o conteúdo essencial. Não há bypass de reduced motion nesta TASK.
- Resize, Escape, retorno, mudança de rota e ocultação do documento removem a camada. Se o motor já está preparado, ele conclui a pose final; caso contrário, o case mostra suas capturas e conteúdo editorial.
- Um limite de 5 s remove a sessão e libera a experiência se a preparação demorar. Falha de textura ou WebGL encerra a camada e ativa a apresentação estática. Respostas tardias não recriam o motor destruído.
- `Voltar aos projetos` continua usando a lógica aprovada de retorno e foco na seção Projetos. Não foi criada uma animação inversa.

## Arquivos de implementação

| Arquivo | Alteração |
| --- | --- |
| `src/components/motion/ProjectTransitionProvider.tsx` | Novo coordenador e contexto persistentes, transferência GSAP e cancelamento |
| `src/components/motion/ProjectTransition.module.scss` | Nova camada temporária, invisível fora da passagem |
| `src/lib/motion/projectTransition.ts` | Tipos compartilhados e matriz de perspectiva |
| `src/app/layout.tsx` | Instala o coordenador acima das rotas |
| `src/components/sections/Projects.tsx` | Conecta o link real à passagem e estabiliza a seleção |
| `src/lib/motion/projectPreview.ts` | Adiciona a captura estável da seleção e seus bounds no clique |
| `src/components/project-case/ProjectCase.tsx` | Conecta a preparação, conclusão e alternativas do case à sessão |
| `src/lib/three/projectCase.ts` | Entrada compartilhada curta, projeção da superfície e conclusão segura |

Nenhuma dependência foi instalada. As demais seções e seus sistemas de motion não foram redesenhados. MF Consultoria permanece somente com sua prévia. A API do coordenador usa o caminho do case para permitir futuros destinos sem duplicar a implementação.

## Validação e evidências

Lint, TypeScript e build aprovados. A validação de desenvolvimento passou em 57 verificações; a de produção também passou em 57, sem exceções de página. Foram testados seleção estabilizada, ausência de duplicação, teclado, histórico, refresh, Ctrl + clique, botão do meio, viewports de 1920/1440/820/390 px, retorno rápido, resize, Escape, reduced motion, WebGL indisponível e texturas com falha ou atraso.

A regressão do case aprovado passou em mais 54 verificações de produção, incluindo rolagem interna e seus limites, abas por teclado, foco ao voltar à visão geral, perda e recuperação de contexto WebGL, acesso sem JavaScript e ausência de overflow em 320 px.

- [Relatório de produção](previews/task11-production-validation.json)
- [Relatório de desenvolvimento](previews/task11-development-validation.json)
- [Regressão do case aprovado](previews/task11-regression-production-validation.json)
- [Validação da gravação principal](previews/task11-video-validation.json)
- Vídeo da transição, scroll interno e retorno (gravação preservada no backup local)
- Vídeo por teclado (gravação preservada no backup local)
- Vídeo com movimento reduzido (gravação preservada no backup local)
- Vídeo de acesso direto (gravação preservada no backup local)
- Vídeo mobile (gravação preservada no backup local)
- Screenshots: [Home](previews/task11-home.png), [transferência](previews/task11-transfer.png), [construção](previews/task11-construction.png), [case aberto](previews/task11-open.png), [retorno](previews/task11-return.png), [tablet](previews/task11-820.png), [desktop largo](previews/task11-1920.png), [mobile](previews/task11-mobile.png).

Os scripts utilizados ficam em `.tmp-task11/preview.cjs.txt`, `.tmp-task11/validate.cjs.txt` e `.tmp-task11/regression.cjs.txt`. Usam o Playwright já disponível no ambiente e o Edge instalado.

## Limites da validação

O Edge sem janela mantém `document.hidden=false` ao alternar abas. A interrupção por `visibilitychange` foi testada com o estado oculto simulado e registrado no relatório, sem modificar a aplicação. A abertura nativa de outras abas foi testada separadamente. Viewports e toque foram emulados; não houve teste em dispositivos físicos ou outros motores de navegador.

O tempo de carregamento depende do dispositivo e da rede; o limite da sessão evita prender a navegação. Não há transição inversa cinematográfica nem case de MF Consultoria nesta entrega.

As alterações da TASK 11 permanecem sem um novo commit. A TASK 12 não foi iniciada.
