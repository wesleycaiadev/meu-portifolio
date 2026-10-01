# Wesley Caia — nova fundação do portfólio

Aplicação criada do zero para a TASK 00. A home contém apenas um header temporário e placeholders na ordem Hero, About, Projects, Manifesto, Expertise, Process e Contact. Não há animações, smooth scroll ativo, canvas WebGL ou design final.

## Executar

Use Node.js 24 LTS. No PowerShell, `npm.cmd` evita depender da política de execução de `npm.ps1`.

```powershell
npm.cmd ci
npm.cmd run dev
```

Abra http://localhost:3000.

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd run start
```

O script de typecheck gera os tipos de rotas do Next antes de executar TypeScript. `strict`, `noUncheckedIndexedAccess` e `exactOptionalPropertyTypes` estão habilitados. ESLint usa os presets de Next/Core Web Vitals e TypeScript.

## Organização

- `src/app`: layout e rota inicial do App Router.
- `src/components/layout`: header temporário.
- `src/components/sections`: componente temporário dos placeholders.
- `src/components/motion`, `three` e `ui`: pastas reservadas, sem implementação.
- `src/data`: ordem narrativa e textos temporários.
- `src/lib/motion` e `three`: pastas reservadas, sem abstrações antecipadas.
- `src/styles`: SCSS estrutural temporário.

GSAP (incluindo ScrollTrigger), Lenis e Three.js estão instalados para etapas posteriores. Não são importados pela home nem inicializados nesta tarefa. Nenhuma biblioteca adicional de UI, motion ou renderização foi adicionada.

## Fontes de verdade e preservação

Leia `README-FIRST.md`, `PORTFOLIO-SPEC.md` e `ASSET-CHECKLIST.md` antes de futuras alterações. As instruções atuais do usuário determinam criação nova; a menção a preservar uma aplicação anterior no pacote não autoriza recuperar código antigo.

Os assets originais permanecem em `public/assets/`. O material de Gustavo permanece em `reference/`, fora de `public/`, sem imports, rotas ou cópias para o bundle. Referências orientam linguagem e ritmo; a identidade e os projetos são de Wesley Caia.

O wordmark e o retrato final de About seguem pendentes conforme o checklist. Nada foi fabricado para substituí-los.

Pare na TASK 00; novas etapas dependem de aprovação específica.

## Documentação consultada

- [Instalação manual do Next.js](https://nextjs.org/docs/app/getting-started/installation#manual-installation)
- [Configuração ESLint](https://nextjs.org/docs/app/api-reference/config/eslint)
- [Sass no Next.js](https://nextjs.org/docs/app/guides/sass)
- Documentação da versão instalada em `node_modules/next/dist/docs/`.
