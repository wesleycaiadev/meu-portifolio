# Portfólio V2 — Wesley Caiã

Portfólio construído com Next.js (App Router), TypeScript e SCSS. A página mantém as oito seções aprovadas na Tarefa 01. A Tarefa 02 adiciona a fundação de movimento com GSAP, ScrollTrigger, SplitText e Lenis, sem 3D.

## Executar

Requer Node.js 20.9 ou superior.

```bash
npm install
npm run dev
npm run lint
npm run build
```

No PowerShell do Windows, se `npm` apontar para `npm.ps1` e a execução de scripts estiver bloqueada, use `npm.cmd run dev` (e `npm.cmd run lint` / `npm.cmd run build`). Isso usa o mesmo npm sem alterar a política de execução.

## Organização

- `src/app`: entrada da home e metadados.
- `src/components/layout`: header e footer.
- `src/components/motion`: entrada do hero, transição para projetos, smooth scroll e Trace Field.
- `src/components/sections`: seções e formulário.
- `src/components/ui`: ícones simples.
- `src/lib/motion/gsap.ts`: registro compartilhado dos plugins GSAP.
- `src/data/site.ts`: projetos, tecnologias, etapas, navegação e contatos.
- `src/styles/globals.scss`: base visual e breakpoints.
- `public/images`: cópias dos quatro assets usados. Os cinco arquivos originais permanecem em `referencias/`.

## Itens pendentes

- **Currículo:** adicionar o PDF a `public/` e preencher `contact.resume` em `src/data/site.ts`. O CTA do hero foi removido até o arquivo estar disponível.
- **Estudos de caso:** os botões “Explorar projeto” estão desabilitados até as páginas de case study serem criadas.

Os links de e-mail, WhatsApp e LinkedIn usam os contatos informados. O formulário abre uma mensagem preenchida no WhatsApp ou no cliente de e-mail, sem backend.

## Motion

- A entrada do hero dura cerca de 2,35 segundos: luz discreta atrás da foto, header, headline por linhas com ritmo variável, parágrafo, CTAs e retrato expandido por máscara com leve profundidade.
- A fotografia e a luz atrás dela reagem de forma mínima ao ponteiro no desktop. Um ScrollTrigger sem pinning desloca headline, foto e atmosfera em velocidades diferentes ao chegar a Projetos; o título da seção entra por máscara.
- Signal / Path (Tarefa 02.2): o TraceField mantém apenas grain global. Dez paths SVG locais ao Hero oscilam por CSS, com ciclos alternados de 32 a 56,3 segundos e opacidade constante. Máscaras protegem a headline e suavizam as extremidades; o ScrollTrigger existente reduz paths, luz e grid durante a saída do Hero. Não há novo ticker, RAF ou listener de scroll.
- As atmosferas são locais às seções: Projetos tem grid quase invisível e luz mínima; Expertise reduz o grid; Processo reduz ainda mais; Sobre mantém apenas grain; Contato fecha com luz radial discreta. No mobile a camada fica na região da fotografia. Com movimento reduzido, os paths ficam estáticos e a rolagem natural remove a camada junto com o Hero.
- Lenis é ativado apenas em dispositivos com ponteiro fino e sem preferência por movimento reduzido. Seu `raf` usa o ticker do GSAP, sem loop próprio. Âncoras mantêm hash e foco.
- `prefers-reduced-motion: reduce` desativa os tweens, parallax, profundidade por ponteiro e smooth scroll, mantendo o conteúdo visível.

Os componentes de motion ficam isolados para que a Tarefa 03 possa adicionar as experiências dos projetos sem reestruturar a home.

Para conferir o motion, abra `http://localhost:3000/` no desktop e recarregue a página no topo. A entrada do hero acontece apenas no carregamento; o título de Projetos aparece ao rolar. Se nada se mover, execute `matchMedia("(prefers-reduced-motion: reduce)").matches` no console do navegador. O valor `true` indica que o navegador solicitou movimento reduzido, então as animações ficam desativadas. Para pré-visualizar sem mudar a configuração do sistema, abra `http://localhost:3000/?motion=preview`. Esse parâmetro funciona somente em desenvolvimento local. Após executar `npm run build`, reinicie `npm run dev` antes de voltar à prévia local.
