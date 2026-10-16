# TASK 17A — Preparação GitHub e publicação V2

Data: **16/10/2026**. Destino exclusivo: [wesleycaiadev/meu-portifolio](https://github.com/wesleycaiadev/meu-portifolio). Domínio confirmado por Wesley: **https://wesleycaiadev.vercel.app/**.

> **Decisão posterior de Wesley, 16/10/2026:** autorizada a exclusão dos vídeos de exemplo/revisão da entrega e o envio do código necessário. O vídeo de 124,16 MiB é a gravação do site Gustavo Sextaro, sem uso pela aplicação. Foram removidos da árvore atual 39 vídeos de referência/revisão (228.187.561 bytes), preservados no novo backup verificado `backups/portfolio-before-video-cleanup-2026-10-16.bundle`. Para a cópia de publicação, a exclusão passa a abranger os 40 caminhos de vídeos encontrados no histórico V2 e os temporários de `.tmp-task10/`; os textos e imagens de referência ficam preservados. Essa decisão substitui a pendência de aprovação da exclusão de vídeos e a proposta de remover o diretório `reference/gustavo/` inteiro. Os demais registros abaixo descrevem a auditoria anterior; acompanhe a execução em [limpeza dos vídeos](TASK-17-VIDEO-CLEANUP.md).

**Estado: auditoria e checkpoint locais concluídos; integração e publicação bloqueadas. Nenhum push, deploy, merge de históricos, alteração de domínio, desarquivamento ou configuração remota foi executado.** A TASK 17A exige aprovação antes da TASK 17B. A confirmação do domínio não autoriza essas alterações.

## 1. Estado do Git local

| Item | Resultado |
| --- | --- |
| Diretório | `C:\Users\wesley\Documents\PORTIFOLIO V2` |
| Branch | `master` |
| HEAD anterior à preparação | `793889f18c99205862f9c6a7d814b8b62cf92679` — contato concluído |
| Checkpoint funcional criado | **`f0edae185b23bf71af1cabd51c38c4a7ed387880`** — `feat: finalize portfolio v2 audit and interface refinements` |
| Commits V2 nesse checkpoint | 30; os 29 anteriores foram preservados sem reescrita |
| Raiz V2 | `bd79cf72c94f2d130752848ab9dab26069d2e897` |
| Remotes configurados | Nenhum; não foi criado `origin` |
| Referência de auditoria local | `refs/remotes/portfolio-audit/main`, obtida por fetch da URL oficial |
| Integridade | `git fsck --full --no-reflogs` sem objetos ausentes/corrompidos; árvores soltas e um arquivo temporário de objetos preexistente, sem limpeza destrutiva |

As alterações da TASK 16, botões, contato, marca e ajuste da prévia dos cases estão no checkpoint funcional. Este plano e suas evidências recebem um commit documental separado. Consulte `git log -2 --oneline` e `git status --short` para o estado final; o hash do próprio commit deste documento não pode ser gravado nele sem autorreferência.

Doze arquivos de ferramentas/gravações de `.tmp-task10/` já estavam rastreados apesar do ignore. Foram retirados **somente do índice/árvore atual**, mantendo arquivos físicos e commits antigos. `.tmp-task*/`, `.next`, `node_modules`, logs e `.env*` continuam ignorados; apenas `.env.example` é permitido. Bundles em `backups/` também são ignorados.

## 2. Estado do repositório remoto

Inspeção pública por Git e API do GitHub em 16/10/2026:

- Repositório público, **arquivado (`archived: true`)**. Isso impede a publicação de alterações até desarquivamento autorizado pelo proprietário.
- Branch padrão e única branch anunciada: **`main`**.
- HEAD: **`23740d5447a86507cc4bd944a30e4b4cee270038`**, `corrigindo texto do sobre mim`, de 31/05/2026.
- 19 commits V1; raiz **`5def947f46d487396d6c18db283d91f29d922504`**.
- Nenhuma tag anunciada. `portfolio-v1-before-v2` estava livre na consulta; validar novamente antes de criar.
- API de branch indica `protected: false`; endpoint de rulesets retornou lista vazia. Isso não comprova permissões de escrita da conta nem exclui mudanças posteriores de regras.
- Árvore V1: HTML/CSS/JS e assets, 15 arquivos; sem `package.json`, `vercel.json` ou workflow YAML rastreado.
- Workflow dinâmico ativo **`pages-build-deployment`**, com build/deploy GitHub Pages bem-sucedidos no HEAD remoto. Não confundir com configuração de Vercel.
- Commit status **Vercel: success**, associado ao projeto histórico **`wesleycaiadevs-projects/my-portifolio`**. [Registro do deployment](https://vercel.com/wesleycaiadevs-projects/my-portifolio/9qj3WSKY4UgUJSHPKxn5AwcpKTHz).

Foi executado apenas fetch para a referência local de auditoria, sem alterar branches remotas:

```powershell
git fetch --no-tags https://github.com/wesleycaiadev/meu-portifolio.git refs/heads/main:refs/remotes/portfolio-audit/main
```

## 3. Relação entre os históricos e bloqueio de tamanho

`git merge-base HEAD portfolio-audit/main` não encontrou ancestral comum. Os históricos são **independentes**. Um push direto de `master` sobre `main` não é a integração apropriada.

Além disso, a V2 contém este blob histórico, ausente do histórico V1 consultado:

| Arquivo | Tamanho | Origem |
| --- | --- | --- |
| `reference/gustavo/reference-video.mp4` | **130.186.014 bytes / aproximadamente 124,16 MiB** | Commit `d4c712c`; blob `17b1bb808add95bf7516be4a8d21af39dff3281d` |

O [GitHub bloqueia arquivos acima de 100 MiB](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github). Remover o arquivo apenas no último commit, adicionar um ignore ou executar apenas `git lfs track` **não remove o blob dos ancestrais**. Um merge com estratégia `ours`, sozinho, também não resolve esse bloqueio.

### Decisão obrigatória antes da integração

**Proposta recomendada, ainda não executada:** conservar o histórico V2 original integralmente no backup e no checkout atual; criar uma cópia isolada para publicação, removendo do histórico dessa cópia apenas `reference/gustavo/` e `.tmp-task10/`. Preservar cada commit das TASKS, seus autores, mensagens e datas, incluindo commits que fiquem vazios, e entregar um mapa entre hashes antigos e novos. **Os hashes V2 mudam nessa cópia.** A história V1 permanece com os hashes originais.

Essa opção precisa de aprovação explícita porque a exigência de preservar commits pode significar também preservar seus identificadores. Não será tratada automaticamente como autorizada.

Alternativa: migrar o vídeo para Git LFS em cópia isolada. Também altera hashes, envolve armazenamento LFS e publicação de um vídeo de referência de terceiro, que não é um asset do portfólio. Git LFS 3.7.1 está instalado, mas não foi usado para migrar nada.

Se for obrigatório publicar **todos os hashes V2 originais**, mantendo esse blob em Git convencional, a publicação permanece bloqueada pelo limite. Não substituir o histórico por um único commit, não fazer squash das TASKS e não usar force-push como solução.

## 4. Branch de produção

**Identificada no GitHub: `main`.** O deployment Vercel histórico no SHA remoto tem ambiente `Production`. Ainda falta confirmar no painel autenticado a configuração **Production Branch** atual, a integração Git atual e o projeto que possui o domínio confirmado. Não inferir configurações atuais a partir de um deployment antigo.

## 5. Backup e preservação

Backup local **já criado e verificado**:

- Arquivo: `backups/portfolio-before-migration-2026-10-16.bundle`.
- 255.649.043 bytes; SHA-256 **`F1215051C4256C3406EF54A93FEBB0FA45686A1BB7BCDE7EFB17E99EA9995CFA`**.
- `git bundle verify`: completo e válido.
- Contém `master` em `f0edae1`, V1 em `portfolio-audit/main` e referências internas locais do aplicativo. **Não publicar esse bundle nem usar `push --all`/`--mirror`.**
- O bundle inclui os hashes V2 originais e o vídeo volumoso; não inclui o commit documental posterior desta TASK 17A. Criar outro bundle com nome novo antes de qualquer futura migração.

Antes da TASK 17B: copiar o bundle para armazenamento seguro fora deste disco e verificar o mesmo hash. Para recuperação, clonar o bundle com branch `master`; a V1 pode ser restaurada pelo SHA remoto incluído. Não executar reset destrutivo no checkout de trabalho.

Após autorização e confirmação de que o remoto não mudou, criar tag anotada **`portfolio-v1-before-v2`** no HEAD V1. Publicar essa tag no mesmo repositório antes da integração. Se o nome já existir e apontar a outro commit, parar e definir outro nome; nunca substituir uma tag alheia.

## 6. Estratégia exata de integração proposta

Dependências: resolver o bloqueio do repositório arquivado, aprovar a opção de tratamento do histórico volumoso e confirmar o painel da hospedagem.

1. Conferir checkout limpo e criar novo backup completo, sem substituir o bundle verificado.
2. Clonar esse backup em `.tmp-task17/publish`, conservando o checkout original intacto.
3. Somente com a opção recomendada aprovada, filtrar os dois diretórios não produtivos na branch V2 dessa cópia. `git-filter-repo` não foi instalado/executado nesta etapa. Manter commits vazios e armazenar o `commit-map` fora da futura árvore pública.
4. Verificar quantidade de commits e metadados contra o original; todos os commits originais devem ter correspondência. Comparar a árvore com a original, admitindo apenas as duas exclusões aprovadas. Repetir o scan de segredos e de blobs grandes **em todo o histórico candidato**, não apenas no HEAD.
5. Configurar `origin` na cópia isolada somente após inspecionar seus remotes; o checkout principal continua sem remote. Fazer novo fetch de `main` e comparar com `23740d5`. Qualquer novidade remota exige revisão antes de prosseguir.
6. Criar branch **`codex/portfolio-v2-integration`**, confirmar nome livre e criar/publicar o backup V1 conforme a seção 5.
7. Na branch candidata V2, fazer merge explícito do HEAD V1 com `--allow-unrelated-histories --strategy=ours`. Isso mantém a árvore V2 como resultado e ambos os históricos alcançáveis. Não usar `-X ours`, que é outra estratégia e pode mesclar arquivos da V1.
8. Verificar que o HEAD V1 é ancestral e que a árvore do merge é idêntica à árvore V2 sanitizada. Todos os commits mapeados das TASKS devem ser ancestrais.
9. Revalidar lint, typecheck, build e percurso funcional na cópia integrada. Publicar apenas a branch candidata e abrir PR para `main`; anexar o PR a esta conversa quando criado.
10. Validar preview no projeto Vercel existente antes de merge/promover. O PR deve usar **merge commit**, preservando os commits das TASKS; não squash/rebase. Inspecionar novamente alterações concorrentes antes do merge.
11. Apenas depois da aprovação do preview: atualizar `main`, compilar/promover no projeto existente, validar domínio e indexação. Não criar outro repositório ou projeto por conveniência.

## 7. Arquivos e segurança

Árvore de publicação proposta: código em `src/`, assets aprovados em `public/`, arquivos de configuração/package lock, `.env.example`, documentação e evidências em `docs/`, além das instruções do projeto já presentes. `.env.example` contém apenas instruções e `SITE_URL` vazio.

Excluir da cópia de publicação os diretórios históricos explícitos `reference/gustavo/` e `.tmp-task10/`, mediante a decisão da seção 3. A referência visual original permanece recuperável no bundle e checkout original. Não copiar capturas, SVGs ou vídeos adicionais da pasta pessoal para a aplicação sem necessidade.

Não publicar `.env`, `.env.local`, bundles, caches, dependências instaladas, `.next`, scripts temporários, perfis de navegador, dumps, tokens ou logs de autenticação. O currículo antigo da V1 permanece recuperável no histórico/tag, mas não será ativado como currículo aprovado da V2.

Scan por padrões realizado sobre **335 blobs textuais históricos** dos dois históricos e **194 arquivos textuais atuais**, antes do checkpoint: nenhum padrão de segredo encontrado e nenhum caminho sensível identificado. Foram procurados formatos de chaves privadas, tokens comuns e atribuições de credenciais; valores encontrados não seriam impressos. Isso não é garantia de ausência de segredo, não substitui scanner completo e não cobre conteúdo binário. Repetir após a transformação candidata e revisar todos os caminhos enviados.

Os contatos públicos são intencionais: e-mail, WhatsApp e LinkedIn fornecidos por Wesley. Nenhuma credencial Vercel/GitHub foi solicitada ou salva.

## 8. Hospedagem existente

| Item | Evidência / ação pendente |
| --- | --- |
| Domínio confirmado | **https://wesleycaiadev.vercel.app/**: HTTP 200, servidor Vercel, título `Wesley Caiã \| Front-End Developer`; ainda apresenta V1 |
| Projeto histórico | `my-portifolio`, conta/equipe `wesleycaiadevs-projects`, pelo status Vercel do commit remoto |
| Associação atual domínio → projeto | **Não confirmada no painel**; confirmar antes de editar qualquer configuração |
| Integração Git | Deployment histórico ligado ao repositório oficial; conexão atual e permissões precisam ser conferidas |
| Branch / framework / Node / comandos atuais | Não acessíveis pela inspeção pública; confirmar no painel |
| Configuração V2 proposta | Next.js, raiz do repositório, Node 24.x, instalação `npm ci`, build `npm run build`, saída `.next` gerenciada pelo preset Next |
| Variáveis atuais | Não inspecionadas; revisar nomes e escopos no painel, sem copiar valores secretos para Git/documentos |
| `SITE_URL` proposto | `https://wesleycaiadev.vercel.app`, **Production somente**; manter Preview sem a variável e recompilar |
| Preview | Confirmar integração de branches, proteção de acesso e política de deploy antes de publicar a branch candidata |
| DNS/domínio | Preservar endereço confirmado; nenhuma alteração nesta etapa |

O endereço salvo em `repo.homepage`, `meu-portifolio-one-beta.vercel.app`, retorna 404 `DEPLOYMENT_NOT_FOUND`. Atualizar esse metadado somente na fase autorizada. O deployment Vercel histórico específico redireciona ao login; não foi confundido com uma resposta pública da aplicação.

[GitHub Pages V1](https://wesleycaiadev.github.io/meu-portifolio/) também responde 200. A configuração atual publica HTML estático. A V2 utiliza runtime Next/otimizador de imagens; não enviar `.next` ao Pages e não converter a aplicação para exportação estática como parte desta migração. Definir na TASK 17B se o Pages será mantido como arquivo V1 ou desativado, evitando implantação automática incorreta/duplicidade de indexação.

## 9. Pendências, validação e riscos

### Impedimentos de publicação

1. **Repositório arquivado**: precisa de desarquivamento autorizado pelo proprietário.
2. **Blob histórico de 124,16 MiB**: exige decisão explícita sobre hashes V2/filtragem ou LFS. Nenhum histórico foi reescrito.
3. **Configuração atual da Vercel**: confirmar projeto dono do domínio, integração Git, Production Branch, framework, Node, comandos, variáveis e preview antes de qualquer mudança.
4. **Pendência P1 de ferramentas da TASK 16**: cinco entradas altas na cadeia ESLint/`braces`; auditoria de produção retornou zero. Não é falha funcional reproduzida do site, mas permanece uma pendência real. Acompanhamento e decisão sobre esse risco precedem autorização de publicação; não executar downgrade incompatível para zerar contador.

A preparação fica limitada à auditoria, correção da prévia, checkpoint e plano; não foi iniciada integração candidata nem liberação de produção. Também continuam pendentes testes em dispositivos físicos/Safari/Firefox/leitor de tela e a validação do ambiente público, conforme a TASK 16. Currículo e arte OG exclusiva da home não foram fabricados.

### Validação local

O [relatório da TASK 16](TASK-16-FINAL-AUDIT.md) foi lido: sem P0/P1 funcional reproduzível restante, com a pendência de ferramentas acima. Seus registros cobrem Hero/WC, Sobre, Projetos/trail, transições, dois cases, Expertise, Processo, Contato, mobile, reduced motion e fallbacks WebGL. Incluem 77 verificações de dimensões/abas, seis varreduras Axe sem violações automáticas e oito percursos de navegação com descarte de recursos estável. São evidências anteriores, não alegação de que toda essa suíte foi repetida na TASK 17A.

Nesta revisão foram executados novamente: **lint, typecheck e build, todos aprovados**. Produção mantém as rotas públicas prerenderizadas. Auditorias npm: produção sem vulnerabilidades conhecidas no resultado, completa com as cinco entradas já descritas.

### Correção do acesso ao 3D

O notebook não havia sido removido: `prefers-reduced-motion` mantinha o case estático, e o preview do movimento não estava exposto nas rotas finais. Agora `?motion=preview` ativa explicitamente o notebook **somente em desenvolvimento/desktop**, com controle para retornar à preferência do sistema. Texto do fallback explica a preferência ativa. Layout, câmera, modelo, composição e timelines foram preservados.

- [MF Consultoria — 3D local](http://localhost:3000/projetos/mf-consultoria?motion=preview).
- [SpaSmooth — 3D local](http://localhost:3000/projetos/spasmooth?motion=preview).
- Edge automatizado: **14 verificações em desenvolvimento** e **6 em produção** aprovadas; normal com reduced motion estático, preview dev com um canvas e exploração por teclado, desligamento/replay funcionais, mobile estático, produção sem bypass e normal sem preferência com 3D. Nenhum erro de página registrado.
- Evidências: [dev](previews/task17/case-preview-dev.json), [produção](previews/task17/case-preview-production.json), [MF](previews/task17/mf-consultoria-preview.png), [SpaSmooth](previews/task17/spasmooth-preview.png), [domínio público](previews/task17/confirmed-domain.json).

## 10. Comandos planejados — NÃO executados nesta etapa

Este roteiro é condicionado às decisões anteriores; não é um script para execução cega. Conferir código de saída em cada passo e interromper diante de diferença inesperada. Não instalar ferramenta de filtragem antes de aprovar a transformação.

```powershell
# Checkout principal, limpo. Criar outro backup; não substituir o já verificado.
git status --short
git log -2 --oneline
git bundle create backups/portfolio-before-17b.bundle --all
git bundle verify backups/portfolio-before-17b.bundle

# Cópia isolada; destino deve estar ausente.
git clone --branch master --single-branch backups/portfolio-before-17b.bundle .tmp-task17/publish
Set-Location .tmp-task17/publish

# SOMENTE se aprovada a opção de filtragem; preservar commits vazios.
git filter-repo --path reference/gustavo/ --path .tmp-task10/ --invert-paths --prune-empty never --prune-degenerate never --refs refs/heads/master
# Salvar/revisar .git/filter-repo/commit-map e comparar cada commit/árvore.
# Repetir scan de segredos e confirmar ausência de blobs acima do limite.

# Inspecionar remotes criados pelo clone/filtro antes de configurar o destino.
git remote -v
# Se origin ainda apontar ao bundle, renomeá-lo para source-bundle.
# Se não existir origin, não executar o rename.
git remote rename origin source-bundle
git remote add origin https://github.com/wesleycaiadev/meu-portifolio.git
git fetch origin main --no-tags
git rev-parse refs/remotes/origin/main
# Parar se não corresponder ao SHA remoto auditado e revisar novidades.
git ls-remote --heads --tags origin

# Após resolver arquivamento e verificar nomes livres e permissões:
git tag -a portfolio-v1-before-v2 refs/remotes/origin/main -m "Preserve portfolio V1 before V2 integration"
git switch -c codex/portfolio-v2-integration
# Guardar o SHA/tree da V2 candidata antes do merge.
git rev-parse HEAD
git rev-parse 'HEAD^{tree}'
git merge --allow-unrelated-histories --strategy=ours refs/remotes/origin/main -m "Merge portfolio V1 history into V2"
git merge-base --is-ancestor refs/remotes/origin/main HEAD
git rev-parse 'HEAD^{tree}'
# Comparar com a árvore V2 anterior e verificar os commits mapeados.
npm.cmd ci
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build

# SOMENTE na TASK 17B autorizada, após todas as conferências:
git push origin refs/tags/portfolio-v1-before-v2
git push -u origin codex/portfolio-v2-integration
```

Depois: criar PR para `main`, obter preview no projeto existente, validar e aguardar aprovação de promoção. Não publicar a branch original volumosa, referências internas do app ou o backup. Nenhum `push --force`, `push --all`, `push --mirror`, reset destrutivo ou exclusão remota faz parte do procedimento.

## 11. Rollback

- **Antes da promoção**: manter `main` e o domínio na V1 enquanto o preview é avaliado. Fechar o PR se necessário; o trabalho original continua no checkout/bundle.
- **Após deploy**: usar rollback/promoção do deployment Vercel anterior **já compilado**, anotando antes seu identificador e as configurações atuais. Confirmar que ele é recuperável e atende ao domínio; o registro histórico protegido por login, sozinho, não comprova isso.
- **Rollback de código**: preferir revert do merge do PR por novo commit, preservando ambos os históricos; escolher o pai principal correto após inspecionar o merge. Não mover `main` para trás por força.
- A V1 é HTML estático: reconstruí-la com o preset Next da V2 pode falhar. Restaurar a configuração anterior documentada ou promover seu deployment pronto, em vez de presumir que a tag V1 recompila com a configuração V2.
- `portfolio-v1-before-v2` e o bundle permitem recuperar os arquivos antigos. Guardar também metadados do deployment anterior e configurações de ambiente em armazenamento privado apropriado, sem valores secretos no Git.

## Aprovação necessária

Aprovar separadamente a estratégia que **altera os hashes da cópia V2**, a resolução do arquivamento e a execução da TASK 17B no projeto Vercel confirmado. Se a preservação exigir os hashes originais também no GitHub, revisar o plano antes de avançar. Não há aprovação implícita de publicação neste documento.
