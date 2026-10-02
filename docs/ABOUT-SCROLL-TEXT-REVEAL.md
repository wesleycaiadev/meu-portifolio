# TASK 06.1 — RevealText por caracteres e alinhamento de Sobre

Implementação restrita a Sobre. TASK 07 não iniciada. Checkpoint anterior às alterações: `412992c`, `chore: checkpoint before task 06.1 adjustments`.

## Prévia ao vivo

[Abrir localhost](http://127.0.0.1:3000/?wc-preview=1). Recarregar a página, clicar em **Ativar animação** no desktop e rolar até Sobre. Voltar lentamente para conferir a reversão. O controle de desenvolvimento permite a prévia quando o Windows está configurado para movimento reduzido; a página normal e a produção respeitam essa preferência.

## Componente e conteúdo

`src/components/ui/reveal-text.tsx` adapta o `RevealText` do 21st.dev fornecido por Wesley. Mantém o princípio de opacity + blur + subida, aceita conteúdo React para preservar a palavra em serif e utiliza as classes SCSS existentes.

O original utiliza `useInView`, `once` e stagger temporal por palavras. Nesta integração, ranges de progresso e a timeline compartilhada de GSAP/ScrollTrigger controlam os estados. Conforme a orientação mais recente de Wesley, **headline e parágrafo aparecem por caracteres**, com entradas próximas e sobrepostas, sem saltos por palavra.

O componente fornece os alvos e os parâmetros; `AboutReveal` cuida do ciclo de vida, da preferência de movimento reduzido e da timeline. HTML estático permanece legível antes do JavaScript. Nenhuma dependência nova: não foi necessário adicionar Framer Motion, Tailwind ou shadcn à stack Sass/GSAP existente. Demo, textos, fontes, cores e imagens genéricos do exemplo não foram integrados.

Conteúdo integral:

> Transformo ideias em experiências digitais que ganham forma entre design, código e movimento.

Somente **movimento** utiliza Instrument Serif italic.

> Meu nome é Wesley Caia. Gosto de partir de uma ideia ainda solta e construir, etapa por etapa, uma interface com identidade pensando no visual, na experiência e em como tudo funciona quando chega às mãos de quem vai usar.

## Alinhamento e quebras de texto

- Desktop: grid de 12 colunas; texto em 1–6, respiro na 7, retrato em 8–12. Removido o antigo deslocamento de 64px da foto.
- Em 1440 × 900, headline e retrato iniciam em Y = 115,1875px no estado final. Texto com aproximadamente 633px de largura e retrato com 523px.
- Headline usa o token editorial existente e largura de 20ch no desktop; parágrafo mantém largura máxima de 36ch e corpo menor.
- Abaixo de 1024px: headline, parágrafo, retrato.
- **Palavras são mantidas em wrappers inteiros**: cada caractere anima dentro da palavra, mas o navegador quebra linhas somente entre palavras. Isso corrige fragmentos como “u / ma” e “quan / do”.
- SplitText mede as linhas após as fontes carregarem e recalcula no resize desktop. Nenhuma quebra de linha manual.
- Hero, Header, grid global e seções seguintes preservados.

## Desktop: scroll e permanência da composição

ScrollTrigger `about-sequence`:

- Trigger: seção Sobre.
- Início: `top 76%`.
- Final: `+=${Math.round(innerHeight * 1.86)}`.
- Em 1440 × 900: scroll Y **1296 → 2970**, intervalo de **1674px / 186vh**.
- `scrub: true`, sem autoplay, sem `toggleActions`, sem delay temporal e sem avanço depois de parar a rolagem.
- A composição é mantida em posição por um trigger separado, `about-hold`, quando a seção alcança o topo da viewport. Seu percurso adicional é **110vh**, já incluído nos 186vh acima.
- O hold ocupa aproximadamente **40,9–100%** da sequência; evita que o texto saia da tela antes de completar a leitura. O Hero mantém seu próprio pin, sem alterar os parâmetros aprovados.

Aparição por caracteres:

| Elemento | Faixa total | Faixa por caractere | Y inicial | Blur inicial |
| --- | --- | --- | --- | --- |
| Headline | 10–84% | 14 pontos percentuais | 12px | 6px |
| Parágrafo | 58–98% | 10 pontos percentuais | 6px | 3px |

- Easing: `sine.inOut`, com opacity **0 → 1**, Y **inicial → 0** e blur **inicial → 0**.
- A headline possui 81 caracteres animados; espaços permanecem naturais. Caractere 1: **10–24%**; caractere 41: **40–54%**; caractere 81: **70–84%**. Entradas separadas por aproximadamente **0,75 ponto percentual** de scroll.
- O parágrafo possui 182 caracteres animados. Primeiro: **58–68%**; último: **88–98%**. As entradas se distribuem uniformemente, sem animação nos wrappers das palavras.
- A duração indicada é uma fração do percurso de scroll, não segundos.
- Máscaras verticais por linha na headline desktop acompanham a pequena subida. Seu overflow é liberado ao completar para preservar os glifos italic.
- Filtros removidos (`none`) nos caracteres completos. No final, todo conteúdo está nítido e sem deslocamento.
- Nome acessível completo preservado em cada bloco; divisões decorativas ocultas dos leitores de tela.

## Foto sincronizada

O retrato usa a mesma timeline desktop:

| Faixa | Tratamento |
| --- | --- |
| 0–10% | Texto e retrato ocultos; fundo escuro |
| 20–33,6% | Retrato ganha opacidade |
| 20–40,4% | Blur 20px → 12px |
| 40,4–64,2% | Blur 12px → 5px |
| 64,2–88% | Blur 5px → 0px |
| 88–100% | Fotografia totalmente nítida, `filter: none` |

Tratamento preservado: Y **32px → 0**, scale **1.045 → 1**, clip `inset(10% 6% 14% 6%) → inset(0)`. Easing de foco `sine.inOut` nos dois primeiros estágios e `power2.out` no último.

Arquivo lossless, resolução, recorte 4:5 e posição de imagem preservados. Ao reverter, os caracteres mais recentes perdem presença, o blur retorna e o retrato converge à opacidade zero.

## Mobile e tablet empilhado

Duas timelines, sem hold da seção:

- Texto: topo de Sobre em **92% → 0%** da viewport, percurso de **92vh**. Mesmos ranges de caracteres do desktop, respeitando as quebras naturais.
- Headline: Y **8px → 0**, blur **4px → 0**.
- Parágrafo: Y **6px → 0**, blur **2px → 0**.
- Foto: topo do próprio retrato em **90% → 20%**, percurso de **70vh**, preservando a curva de foco e Y **24px → 0**.
- O retrato acompanha seu próprio trecho visível, após a leitura dos textos empilhados.
- Ambas utilizam `scrub: true`, com reversão completa. Não há timelines independentes por linha ou dependência de hover.

## Movimento reduzido e limpeza

- Conteúdo imediatamente visível; foto nítida; sem blur, translate, máscaras ou divisões por caracteres.
- Alterar a preferência enquanto a animação está ativa restaura HTML e estilos estáticos.
- Cleanup de SplitText, GSAP e listeners; recálculo após resize e mudanças de pin.
- Desativar a prévia de desenvolvimento restaura o conteúdo estático.

## Validação

Build de produção validado em Edge headless isolado. A URL de desenvolvimento na porta 3000 também foi verificada com o botão de ativação.

| Viewport | Range do retrato / sequência desktop | Resultado |
| --- | --- | --- |
| 320 × 700 | 490px | Palavras inteiras; sem overflow; reversão |
| 390 × 844 | 591px | Touch emulado; palavras inteiras; reversão |
| 768 × 1024 | 717px | Composição empilhada; sem overflow |
| 1024 × 768 | 1428px | Topos texto/foto alinhados; palavras inteiras |
| 1440 × 900 | 1674px | Caracteres progressivos; hold e reversão completos |

- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou. O processo auxiliar do build precisou executar fora do sandbox após `spawn EPERM`.
- `git diff --check`: passou.
- Pausa no meio da sequência: propriedades idênticas antes/depois, confirmando ausência de autoplay.
- Em ~35%: 15 caracteres da headline completos e 19 parcialmente visíveis; diferentes letras da mesma palavra possuem diferentes estados.
- Em ~60%: 49 caracteres da headline completos e 18 parciais; início gradual do parágrafo.
- Final: 263 caracteres totalmente visíveis e retrato com `filter: none`.
- Retorno ao início: todos os caracteres com opacity zero; retrato com opacity zero e blur 20px.
- Palavras verificadas geometricamente no estado final: nenhum fragmento em linhas diferentes em 320, 390, 768, 1024 ou 1440px.
- Resize 1440 → 390 → 1024 → 1440: final completo, sem overflow, pins corretos.
- Reduced motion inicial e durante a execução: conteúdo estático, zero caracteres divididos, foto nítida, pins removidos.
- Bounds da WC em 1440 × 900: X 136,5, Y 131,078125, largura 1152 e altura 630,84375; iguais ao estado aprovado.
- Nenhuma exceção de runtime observada.
- Pacotes, lockfile, referências, assets de marca/projetos e fotografia intactos em relação ao checkpoint.
- SHA256 do retrato: `B26B3F862688E20F051EE22D89EA7D52E6F6A2F6E09E396C197408840FDC9A12`.

Limites: touch emulado; Safari, Firefox e aparelhos físicos não testados. A aprovação visual do ritmo permanece com Wesley na prévia ao vivo.

## Registros

- [10%](previews/task061-about-10.png), [35%](previews/task061-about-35.png), [60%](previews/task061-about-60.png), [100%](previews/task061-about-100.png): 1440 × 900.
- [Parágrafo com palavras inteiras](previews/task061-about-copy.png).
- [Mobile](previews/task061-about-mobile.png): 390 × 844.
- [Rolagem lenta com ida e volta](previews/task061-about-slow.webm).
- [Rolagem rápida com ida e volta](previews/task061-about-fast.webm).

Gravações da página renderizada durante rolagem real, incluindo fim do takeover, entrada de Sobre, progressão por caracteres, foco da foto e retorno ao handoff escuro.

## Arquivos e Git

Criados: `src/components/ui/reveal-text.tsx`, este relatório, seis PNGs e dois WebMs listados acima.

Modificados: `src/components/sections/About.tsx`, `src/components/sections/About.module.scss`, `src/components/motion/AboutReveal.tsx`, `src/lib/motion/aboutReveal.ts`.

As alterações permanecem sem commit para revisão visual. TASK 07 não iniciada.

Documentação consultada: [SplitText](https://gsap.com/docs/v3/Plugins/SplitText/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), guia de Server/Client Components no pacote Next.js instalado.
