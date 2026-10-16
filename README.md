# Wesley Caiã — Portfólio V2

Portfólio pessoal em Next.js App Router, React, TypeScript e SCSS. Inclui Hero WC, Sobre, Projetos, Expertise, Processo e Contato; os cases SpaSmooth e MF Consultoria possuem notebooks WebGL e capturas reais exploráveis. GSAP/ScrollTrigger, Lenis e Three.js compõem o movimento aprovado.

## Executar localmente

Use Node.js 24 LTS e npm. No PowerShell, `npm.cmd` evita a política de execução de `npm.ps1`. Se o comando não for encontrado, confirme a instalação do Node e reabra o terminal para atualizar o PATH.

```powershell
npm.cmd ci
npm.cmd run dev
```

Abra [localhost:3000](http://localhost:3000/).

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd run start
```

O typecheck gera os tipos de rotas antes de executar TypeScript. O projeto usa `strict`, `noUncheckedIndexedAccess` e `exactOptionalPropertyTypes`.

## Revisar movimento

Por decisão de Wesley, as animações iniciam habilitadas, inclusive quando o sistema informa `prefers-reduced-motion: reduce`. O controle **Reduzir movimento / Ativar animações** permite escolher a versão estática para este site e guarda a escolha no navegador. Não altera nenhuma configuração do Windows. A mesma escolha vale para a home, transições e cases.

Os cases continuam usando capturas estáticas em telas pequenas, ponteiros de toque ou ausência de WebGL. Esses limites de capacidade são independentes da preferência de movimento.

Somente em desenvolvimento, estes links permitem revisar os notebooks mesmo com movimento reduzido:

- [MF Consultoria — prévia 3D](http://localhost:3000/projetos/mf-consultoria?motion=preview).
- [SpaSmooth — prévia 3D](http://localhost:3000/projetos/spasmooth?motion=preview).
- [Home — controles de prévia](http://localhost:3000/?wc-preview=1&motion=preview#conteudo). Use **Ativar animação** no painel para revisar WC/Sobre/Projetos.

Nos cases, a prévia explícita inicia a abertura 3D em desktop e permite voltar à preferência escolhida no site. Os controles de depuração e seus parâmetros continuam restritos ao desenvolvimento. O controle público de movimento é uma preferência separada, disponível também em produção. Playgrounds permanecem restritos ao desenvolvimento.

## Organização

- `src/app`: home, cases, metadados, ícones, robots e sitemap.
- `src/components/layout`, `sections`, `project-case` e `ui`: interface, seções, cases e elementos compartilhados.
- `src/components/motion`, `src/lib/motion` e `src/lib/three`: integração de movimento e cenas, com descarte de recursos.
- `src/data`: conteúdo, projetos, capturas e contatos confirmados.
- `src/styles`: estilos globais e fundamentos visuais.
- `public/assets`: fotografias, capturas e marca aprovadas.
- `docs`: decisões, auditorias e evidências de revisão.

Referências em `reference/` não integram os assets públicos da aplicação. Os vídeos de referência e as gravações de revisão foram removidos da entrega por decisão de Wesley; os originais estão no backup local. Nenhum vídeo é necessário para o 3D ou para as animações. Consulte o plano de publicação para o tratamento do histórico Git.

## Publicação e metadados

Repositório oficial: [wesleycaiadev/meu-portifolio](https://github.com/wesleycaiadev/meu-portifolio).
Domínio confirmado: [wesleycaiadev.vercel.app](https://wesleycaiadev.vercel.app/). A confirmação do endereço não significa que a V2 já tenha sido publicada.

Configure `SITE_URL=https://wesleycaiadev.vercel.app` **apenas no ambiente Production da Vercel**, seguido de build. Mantenha Preview sem essa variável. Sem uma origem HTTPS válida, a aplicação usa `noindex`, bloqueia robôs e não inventa URLs no sitemap. Veja `.env.example`; não adicione credenciais ao Git.

A publicação depende do procedimento de [preparação GitHub/Vercel](docs/TASK-17-GITHUB-DEPLOY-PLAN.md). A TASK 17A não autoriza push ou deploy.

## Validação e limites

A [auditoria da TASK 16](docs/TASK-16-FINAL-AUDIT.md) reúne verificações de acessibilidade, responsividade, navegação, memória, WebGL, reduced motion e evidências visuais. Leia os limites de teste antes de extrapolar os resultados para dispositivos reais.

A auditoria de dependências de 16/10/2026 registrou zero vulnerabilidades de produção e cinco entradas altas na cadeia de ferramentas do ESLint, ligadas a `braces`. A pendência e o acompanhamento estão documentados; não foi aplicado downgrade incompatível.

O currículo final ainda não foi disponibilizado e o download permanece ausente. O PDF no histórico da V1 não é assumido como currículo aprovado da V2.

Consulte também `README-FIRST.md`, `PORTFOLIO-SPEC.md`, `ASSET-CHECKLIST.md` e as decisões posteriores em `docs/`. Para alterações de Next, leia primeiro a documentação da versão instalada em `node_modules/next/dist/docs/`, conforme `AGENTS.md`.
