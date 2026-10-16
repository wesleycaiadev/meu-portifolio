# TASK 17 — Exclusão dos vídeos de referência e revisão

Data: 16/10/2026. Autorização: Wesley permitiu excluir os vídeos usados como exemplos/revisão e enviar apenas o material necessário ao projeto.

## Identificação e escopo

- O arquivo bloqueador `reference/gustavo/reference-video.mp4`, de 130.186.014 bytes, é uma gravação do portfólio de **Gustavo Sextaro** usada para estudar linguagem visual/movimento. A folha de contato existente confirma o conteúdo.
- Os outros 38 vídeos da árvore atual são gravações das etapas de implementação/revisão em `docs/previews/`.
- Nenhum desses vídeos é referenciado por `src/`, configuração ou assets da aplicação. O notebook, a WC e as animações são produzidos pelo código GSAP/Three.js, não pela reprodução desses arquivos.
- **39 arquivos / 228.187.561 bytes** removidos da árvore atual. As fotografias, capturas dos projetos, SVGs, fontes, código e configuração foram preservados. Nenhum código de aplicação foi alterado.
- Documentos de revisão indicam agora que as gravações foram arquivadas no backup; links para os vídeos removidos foram convertidos em descrições. Resultados medidos e screenshots continuam disponíveis.
- `.gitignore` impede que os vídeos de revisão/referência voltem a ser adicionados por engano.

## Backup

Antes da remoção foi criado `backups/portfolio-before-video-cleanup-2026-10-16.bundle`, com HEAD original `94f18c2001f5a10b57f16cf260acf87806927b1f`, histórico V1 e referências locais. `git bundle verify` confirmou histórico completo. O bundle é local e ignorado; não será enviado ao GitHub.

## Cópia para publicação

A exclusão na árvore atual não remove os vídeos dos commits antigos. Foi preparada uma cópia isolada em `.tmp-task17/publish`, com **git-filter-repo v2.47.0** obtido do [repositório oficial](https://github.com/newren/git-filter-repo/releases/tag/v2.47.0). A ferramenta fica apenas na pasta temporária, sem nova dependência no projeto.

A filtragem excluiu os **40 caminhos de vídeo** encontrados no histórico V2 (incluindo uma gravação temporária já ausente no HEAD) e `.tmp-task10/`. Foram mantidos os 32 commits V2, inclusive vazios, com autor, mensagem e datas, e produzido um mapa de hashes. O checkout original conserva os hashes anteriores; somente a cópia candidata recebeu novos identificadores. Nenhum force-push faz parte desse procedimento.

Inventário dos arquivos removidos: [video-cleanup.json](previews/task17/video-cleanup.json).

## Integração e validação

- Checkpoint original da remoção: `b4510bb5885feb467b8156e40777f0601b1b27b4`.
- Mesmo checkpoint após filtragem: `8f99f0898df4bd3680980627224927758fbe36bf`.
- Branch candidata: `codex/portfolio-v2-integration`, na cópia isolada. O checkout principal permanece em `master`, com o histórico original.
- Os **19 commits V1**, com hashes originais, foram integrados por merge explícito de históricos independentes com estratégia `ours`. A árvore V2 permaneceu idêntica.
- Merge de integração: `484534ca2932b65c41372f8ca4c3b93bfe2cd75e`; **52 commits** nesse ponto (32 V2 + 19 V1 + 1 merge). Commits documentais posteriores não alteram essa contagem histórica de referência.
- Tag de recuperação V1: `portfolio-v1-before-v2`, apontando a `23740d5447a86507cc4bd944a30e4b4cee270038`.
- Verificação do histórico integrado: nenhum caminho de vídeo, nenhum temporário `.tmp-task10/`, nenhum blob acima de 100 MiB. Maior blob: 8.825.608 bytes, já pertencente à V1.
- **418 blobs textuais** verificados por padrões de segredos, sem ocorrências; o limite desse método e a ausência de varredura binária continuam explícitos.
- Comparação confirmou autores, mensagens e datas de todos os commits V2 e árvore atual idêntica à original sem os vídeos.
- `npm ci`, lint, typecheck e build aprovados na cópia integrada; o código da aplicação não precisou de alterações. Auditoria de dependências de produção: zero vulnerabilidades conhecidas no resultado. Permanecem as cinco entradas altas já documentadas nas ferramentas de desenvolvimento. O aviso de raiz do Next é específico ao clone estar dentro do checkout original, sem mudar a configuração da aplicação.

Evidência: [clean-history-validation.json](previews/task17/clean-history-validation.json). O mapa entre hashes fica preservado em `backups/portfolio-v2-video-cleanup.commit-map`, ignorado pelo Git.

O acesso administrativo ao repositório foi confirmado após autenticação pelo Git Credential Manager, sem exibir ou salvar tokens nos documentos. O envio usa exclusivamente a tag V1 e a branch candidata; `main` e a promoção na Vercel aguardam a revisão do PR e da hospedagem.
