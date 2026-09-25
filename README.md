# Portfólio V2 — Wesley Caiã

Home estática construída com Next.js (App Router), TypeScript e SCSS. A página contém header, hero, projetos, expertise, processo, sobre, contato e footer. Não há bibliotecas de motion ou efeitos 3D nesta fase.

## Executar

Requer Node.js 20.9 ou superior.

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Organização

- `src/app`: entrada da home e metadados.
- `src/components/layout`: header e footer.
- `src/components/sections`: seções e formulário.
- `src/components/ui`: ícones simples.
- `src/data/site.ts`: projetos, tecnologias, etapas, navegação e contatos.
- `src/styles/globals.scss`: base visual e breakpoints.
- `public/images`: cópias dos quatro assets usados. Os cinco arquivos originais permanecem em `referencias/`.

## Itens pendentes

- **Currículo:** adicionar o PDF a `public/` e preencher `contact.resume` em `src/data/site.ts`. O botão aparece como “em breve” até então.
- **Estudos de caso:** os botões “Explorar projeto” estão desabilitados até as páginas de case study serem criadas.

Os links de e-mail, WhatsApp e LinkedIn usam os contatos informados. O formulário abre uma mensagem preenchida no WhatsApp ou no cliente de e-mail, sem backend.

As seções já têm IDs próprios e componentes separados para receber motion mais tarde, sem introduzir GSAP, Three.js ou animações complexas agora.
