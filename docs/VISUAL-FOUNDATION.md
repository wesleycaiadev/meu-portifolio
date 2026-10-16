# TASK 01 — fundação visual

Playground temporário: `/playground`. A TASK 01 foi aprovada e registrada no checkpoint `83ec899`. A TASK 02.1 simplifica o Hero e o header; as seis seções seguintes permanecem placeholders. Consulte `STATIC-HERO.md` para a composição e validação atuais.

## Fontes e decisões provisórias

Foram relidos `PORTFOLIO-SPEC.md`, `ASSET-CHECKLIST.md`, `README-FIRST.md` e o Markdown de referência. A revisão visual considerou o contact sheet, sequências do vídeo já estudado na TASK 00, a marca WC e os nove screenshots fornecidos. A referência orienta contraste, hierarquia e espaço; sua tipografia e suas medidas não foram copiadas.

- Sans aprovada na TASK 02: **Inter Tight**, variável, estilo normal.
- Serif editorial aprovada na TASK 02: **Instrument Serif**, peso 400, italic, somente em trechos curtos com a classe `editorial-emphasis`.
- As famílias substituem os fallbacks temporários da TASK 01. São carregadas por `next/font/google` e servidas localmente no build; os tokens consomem suas variáveis CSS.
- A paleta e as escalas desta tarefa são uma base revisável. O Hero, os layouts finais e a coreografia serão aprovados nas tarefas correspondentes.
- Wordmark e retrato continuam ausentes. Nenhum asset foi fabricado.

## Organização dos tokens

`src/styles/_tokens.scss` centraliza os valores visuais. Componentes consomem propriedades CSS sem repetir cores, tamanhos ou durações. Breakpoints ficam no mesmo arquivo, em um mapa Sass, pois propriedades CSS não podem definir condições de media queries. O mixin `emit` é chamado uma única vez pelo stylesheet global; os CSS Modules importam somente os mixins necessários.

| Grupo | Base |
| --- | --- |
| Cores | Preto `#101010`, grafite `#1c1c1c`, papel `#f4f2ed`, branco e cinzas |
| Superfícies | `surface-page`, `surface-raised`, `surface-subtle` |
| Texto | `text-primary`, `text-secondary`, `text-disabled` |
| Bordas | Separação decorativa distinta de controles e foco |
| Spacing | Escala de 0 a 8rem; papéis para gutter, seção, stack e controles |
| Containers | Amplo 90rem, conteúdo 72rem, leitura 62ch |
| Grid | 4 colunas mobile, 8 tablet, 12 desktop; trilhas `minmax(0, 1fr)` |
| Breakpoints | Tablet 48rem, desktop 64rem, wide 90rem reservado |
| Radius | Sem raio, pequeno 0.25rem, pill |
| Z-index | Base, conteúdo, header, foco, overlay; reservado sem criar camadas adicionais |
| Tipografia | H1 2.5–6.5rem; H2 2–4rem; H3 1.375–2rem; corpo 1–1.125rem |
| Feedback | 160ms para cores de botão; 280ms reservado; easing centralizado |

`surface--light` e `surface--dark` redefinem os papéis de cor localmente. As mesmas classes de texto e botão funcionam nas duas superfícies. Bordas decorativas não identificam controles habilitados. O foco usa a cor primária da superfície.

## Layout e interação

- Gutter fluido de 1.25 a 5rem; leitura limitada independentemente do container amplo.
- Header mínimo da TASK 02.1: apenas Wesley Caia. A navegação fica no rodapé do Hero, com três links vazados e visíveis, inclusive em mobile.
- Placeholders empilhados em mobile/tablet; título e descrição dividem o grid no desktop.
- Playground empilhado em mobile; anotação lateral em tablet/desktop.
- Imagens refluem; textos e rótulos longos podem quebrar; não há máscara de overflow no body.
- Links mantêm sublinhado. Botões têm alvo mínimo de 44px, foco visível e estados hover, pressionado e desabilitado.
- `ButtonSample` é apenas uma demonstração local com `aria-pressed` e anúncio de status. Não envia dados. Loading e erro não se aplicam a essa ação síncrona; não há handlers no botão desabilitado.
- Apenas cores de controles usam transição. Reduced motion zera as durações. Não há animações de entrada, rolagem suave, cursor customizado, GSAP, Lenis ou Three.js inicializados.
- O playground usa `noindex`; é temporário e deve ser retirado ou restringido antes da publicação final.

## Validação

Validação realizada em produção com Edge headless:

- `npm.cmd run lint`, `npm.cmd run typecheck` e `npm.cmd run build`: passaram.
- `/` e `/playground`: HTTP 200; sem erros de JavaScript.
- Ambas as rotas em 320, 390, 768, 1024 e 1440px: sem overflow horizontal, um H1, grid de 4/8/12 colunas conforme a largura, nenhum canvas ou animação de entrada.
- Tab percorreu todos os controles habilitados do playground, com outline sólido de 2px visível no viewport; o botão desabilitado foi ignorado.
- Enter e Espaço alternaram as duas amostras de botão. Toque também alternou a amostra escura em 390px.
- Texto redimensionado para 200% em 390px: sem overflow. Reduced motion resultou em transições de 0s.
- Contraste dos textos primários: 17.01:1 em ambas as superfícies. Secundários: 6.00:1 no claro e 9.45:1 no escuro. Nenhum texto habilitado medido no playground ficou abaixo de 4.5:1.
- Bordas de controles: 4.20:1 no claro e 9.45:1 no escuro; foco: 17.01:1. Divisores decorativos e controle desabilitado não são usados como critérios de texto/controle habilitado.
- Os 17 arquivos protegidos mantêm os hashes SHA-256 da TASK 00. Não há alterações nos documentos originais, referências ou assets.
- Referências ausentes dos arquivos gerados de cliente/servidor; a URL do vídeo retorna 404. Nenhuma biblioteca de motion/3D é importada por `src/`.

Esses testes verificam a base implementada; não substituem a revisão de acessibilidade e dispositivos reais das futuras experiências de motion.
