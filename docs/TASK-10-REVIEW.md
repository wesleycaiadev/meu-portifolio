# Revisão da Tarefa 10 — SpaSmooth

Concluída em 14/10/2026. Escopo: revisar a versão atual do case público em `/projetos/spasmooth` e sua integração com Projetos na home.

## Correções desta revisão

- Ao voltar à visão geral, a aba **Sobre** é selecionada e recebe foco. O botão de retorno sai do DOM sem perder a posição de navegação por teclado.
- O notebook usa `THREE.PCFShadowMap` diretamente. O Three.js instalado já substituía `PCFSoftShadowMap` por essa opção e emitia um aviso de API removida. O resultado visual permanece o mesmo.
- A validação existente ganhou verificações para a seleção de Sobre e a preservação do foco.

## Validação

- `npm.cmd run lint`: aprovado após as correções.
- `npm.cmd run typecheck`: aprovado; o build final também verificou TypeScript após a correção do Three.js.
- `npm.cmd run build`: aprovado.
- Edge automatizado em desenvolvimento: 53 verificações aprovadas, sem exceções de página. Executado após a correção do foco e antes da substituição da opção de sombras.
- Edge automatizado no build final de produção: 54 verificações aprovadas, sem exceções de página.
- Revisão visual das capturas de desktop (1440 px) e mobile (390 px); verificações de overflow em 820, 390 e 320 px.

Foram verificados entrada e repouso do notebook, rolagem interna com mouse e teclado, liberação da rolagem nos limites, abas e logos, troca de viewport, perda e recuperação de WebGL, retorno à seção Projetos, histórico do navegador, recarga e abertura em outra aba. As alternativas com reduced motion, JavaScript desabilitado e WebGL indisponível permaneceram legíveis. O playground do case retorna 404 em produção.

As verificações móveis usam emulação de viewport e toque no Edge; não constituem testes em dispositivos físicos.

## Evidências

- [Relatório de desenvolvimento](previews/task10-development-validation.json)
- [Relatório de produção](previews/task10-production-validation.json)
- [Captura desktop](previews/task10-desktop.png)
- [Captura mobile](previews/task10-mobile.png)

Nenhum commit foi criado nesta revisão.
