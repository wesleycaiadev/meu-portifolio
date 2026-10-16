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

A exclusão na árvore atual não remove os vídeos dos commits antigos. Será preparada uma cópia isolada em `.tmp-task17/publish`, com **git-filter-repo v2.47.0** obtido do [repositório oficial](https://github.com/newren/git-filter-repo/releases/tag/v2.47.0). A ferramenta fica apenas na pasta temporária, sem nova dependência no projeto.

A filtragem excluirá os **40 caminhos de vídeo** encontrados no histórico V2 (incluindo uma gravação temporária já ausente no HEAD) e `.tmp-task10/`. Ela manterá os commits, inclusive vazios, com autor, mensagem e datas, e produzirá um mapa de hashes. O checkout original conserva os hashes anteriores; somente a cópia candidata recebe novos identificadores. Nenhum force-push faz parte desse procedimento.

Inventário dos arquivos removidos: [video-cleanup.json](previews/task17/video-cleanup.json). A conclusão da preparação e os impedimentos remotos serão registrados abaixo após a verificação.
