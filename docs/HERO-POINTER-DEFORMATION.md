# TASK 04 — WC local pointer deformation

> Registro da implementação inicial, ainda não aprovada visualmente. A troca
> HTML/canvas, os parâmetros e a evidência atual foram revisados na
> [TASK 04.1](HERO-POINTER-DEFORMATION-TUNING.md). Os valores abaixo descrevem
> a versão anterior ao ajuste, não a configuração atual.

Checkpoint anterior à tarefa: `0f8db2b`,
`feat: add hero navigation border interaction`.

## Comportamento e escopo

Somente a WC recebe deformação. Header, tipografia, fundo, dimensões, posições,
altura do Hero, controles HTML e animação de borda da TASK 03 foram preservados.
O início do vídeo fornecido foi revisto, incluindo os estados de 8–8,5 s e
14,25–15 s: a região próxima ao ponteiro responde com direção e recuperação,
sem inclinação global. A geometria e o código da referência não foram copiados.

A WC HTML original aparece no SSR, durante o carregamento e em repouso.
Um canvas absoluto aparece somente após um frame WebGL válido com deformação;
ao estabilizar, a apresentação retorna ao HTML. Falhas de importação, contexto,
compilação do shader ou textura conservam esse fallback. O canvas e a identidade
decorativa ficam fora da árvore semântica; Wesley Caia continua sendo o H1.

## Shader e parâmetros

Three.js direto, sem React Three Fiber, com `ShaderMaterial`, câmera ortográfica
e `PlaneGeometry(1, 1, 96, 52)`: 5.141 vértices e 9.984 triângulos.
Sem normais, iluminação, pós-processamento ou movimento em Z.

O vertex shader mede a distância entre UV e ponteiro suavizado, corrigindo X
pelo aspect ratio. Assim, a influência é radial na tela, mesmo com a marca larga.
O falloff é `(1 - smoothstep(0, raio, distância))²`, com deslocamento zero fora
do campo. A direção vem da velocidade amortecida; os vértices recebem arrasto
local em XY. O fragment shader usa o alpha da máscara e mantém a marca preta.
Não existe deslocamento global, tilt, lente, bolha, ruído ou autoplay.

| Parâmetro | Valor |
| --- | --- |
| Raio | 0,24 × altura do frame; cerca de 151 px em 1440×900 |
| Força máxima | 0,018 × altura; limite de aproximadamente 11,35 px nessa viewport |
| Velocidade de entrada | Limitada a 2,4 alturas/s e normalizada a magnitude ≤ 1 |
| Damping da posição | 16 s⁻¹; `1 - exp(-16 × dt)` |
| Damping da velocidade | 12 s⁻¹; `1 - exp(-12 × dt)` |
| Decaimento da entrada | `exp(-18 × dt)` |
| Limiar de repouso | Magnitude normalizada 0,001; encerra o RAF |
| Limite de dt | 32 ms; amostra de velocidade com mínimo de 1/120 s |
| Teleporte/intervalo inválido | Salto > 0,25 altura ou intervalo > 120 ms reinicia a amostra |
| DPR | `Math.min(devicePixelRatio || 1, 1.5)` |

Entrar apenas inicializa a amostra; não aplica um impulso. Mover produz velocidade
direcional; parar reduz a entrada e a resposta suavemente. Ao sair, o alvo de
velocidade vai a zero, mantendo a recuperação amortecida. Resize, blur e pausa
reiniciam as amostras, evitando picos na retomada. Não há spring com overshoot.
Listeners de ponteiro ficam exclusivamente no frame da WC, longe do Header e nav.

## Composição do canvas

A máscara possui transparência. O renderer compõe essa máscara sobre a cor
computada do fundo atual da página, sem criar um novo valor de cor ou painel.
O buffer de saída é opaco para evitar artefatos de composição transparente na
troca entre SVG e canvas, encontrados no Edge headless durante a validação.
No fundo uniforme aprovado, o canvas se funde à página sem borda visível.
`preserveDrawingBuffer` continua no padrão `false` em produção.

## Asset derivado

Criado `public/assets/brand/wc-mask.png`: **1680×920**, RGBA, 343.134 bytes.
O original `logo-symbol.svg` permanece intacto, com SHA-256:

`d2a294e2bf31b2aaae8bdeb574775fbf8837d15df4f4679c52176b68afc8de35`.

Transformação não destrutiva, sem redesenho ou vetorização:

1. Manter integralmente os elementos, pattern e JPEG embutido do SVG fornecido.
2. Usar o mesmo enquadramento aprovado: `viewBox="300 440 420 230"`.
3. Aplicar o mesmo matte SVG estático do fallback, em sRGB: RGB preto; alpha
   a partir de `1 - luminância`, com slope `1.111111` e intercept `-0.111111`.
   Brancos com luminância ≥ 90% ficam transparentes.
4. Rasterizar esse SVG no navegador a 4× o viewBox e exportar PNG RGBA.

A proporção 420:230 é preservada. A textura é exclusivamente um derivado de
renderização; o raster embutido original continua sendo a fonte da geometria.

## Início, pausa e descarte

- O componente só importa Three.js quando existe hover/ponteiro fino, sem reduced
  motion, com marca visível e documento ativo. Mobile/touch não cria canvas.
- Primeiro frame após carregar a máscara; depois, apenas movimento, recuperação
  ou necessidade de atualização de tamanho acordam `requestAnimationFrame`.
- Repouso cancela a continuidade do RAF, inclusive com ponteiro ainda sobre a WC.
- `IntersectionObserver` pausa quando a marca deixa a viewport, antes mesmo de
  todo o Hero sair. `visibilitychange` pausa ao ocultar a aba.
- `ResizeObserver` acompanha o tamanho; atualizações de buffer ficam adiadas
  enquanto a marca/documento estão ocultos. DPR também é atualizado em resize.
- Mudança para coarse/reduced motion e unmount removem canvas, listeners,
  observers, RAF, textura, geometria, material e renderer, liberando o contexto.
- Promessas de importação verificam descarte/eligibilidade antes de inicializar.
  AbortController e limpeza idempotente evitam recursos duplicados.

## Validação

- **Lint, typecheck e build passaram.** Home continua prerenderizada.
- Produção iniciada em `http://127.0.0.1:3000`.
- Repouso comparado no mesmo navegador com o markup da WC aprovada: screenshots
  idênticos. As dimensões de Header, WC, Hero e três links coincidem também em
  390×844 e 320×700; nenhum overflow horizontal.
- Movimento para direita/esquerda produziu velocidades com os respectivos sinais,
  ponteiro suavizado atrasado e retorno não instantâneo. Entrada sem movimento e
  teleporte não produziram deformação. A magnitude permanece limitada.
- Teste de pixels da GPU: 8.043 pixels mudaram; nenhum fora do campo local com
  tolerância de uma célula da malha. Distância máxima observada de 131,35 px,
  dentro do raio de 151,2 px. Esse readback usou buffer preservado apenas no teste.
- Nenhuma alteração nas caixas de layout durante o movimento; zero eventos de
  layout shift na interação. Redimensionar a viewport deliberadamente foi medido
  separadamente, pois essa operação naturalmente reposiciona conteúdo.
- Um frame inicial e **zero novos draws** em repouso. Zero draws adicionais fora
  da viewport e com `document.hidden`/visibilitychange simulados.
- Redução da malha de 192×104 para 96×52 trouxe os intervalos observados de cerca
  de 40 ms para 18–23 ms em movimento na GPU por software, mantendo o campo local.
- Device DPR 2 produziu buffer **1728×946** para frame **1152×630,84**, respeitando 1,5.
- Três ciclos de reduced motion liberaram os contextos anteriores e conservaram
  exatamente um canvas/contexto ativo. Desenvolvimento com React Strict Mode
  também apresentou um canvas, um contexto e um único draw inicial.
- Perda real do contexto via `WEBGL_lose_context`, máscara bloqueada na rede e
  WebGL indisponível: fallback visível e nenhum canvas restante.
- Reduced motion inicial: zero contexto/canvas e sem download da máscara ou do
  chunk de Three.js. Touch emulado em 390/320 px: zero contexto/canvas; link de
  Projetos continua navegando. A implementação da TASK 03 não foi alterada.
- Zero exceções de runtime nos testes. Nenhuma dependência nova; documentos,
  referências, original da marca e screenshots dos projetos sem alterações.

Limites da validação: Edge headless com GPU por software; touch e ocultação de
documento emulados. Sem teste em dispositivo físico, Safari ou Firefox. As
medidas de frame não garantem o mesmo desempenho em todo hardware.

## Evidências

- [Vídeo WebM — arrasto e recuperação](previews/task04-wc-pointer.webm): 5,15 s,
  gravação direta do canvas WebGL. Contém apenas a marca, sem cursor nativo,
  Header ou controles; não representa uma mudança na composição da página.
- [Hero desktop em repouso](previews/task04-hero-desktop.png): 1440×900.
- [Hero mobile estático](previews/task04-hero-mobile.png): 390×844.

## Arquivos

Modificados:

- `src/components/sections/Hero.tsx`.
- `src/components/sections/Hero.module.scss`.

Criados:

- `src/components/three/WcIdentity.tsx`.
- `src/components/three/WcIdentity.module.scss`.
- `src/lib/three/wcDeformation.ts`.
- `src/lib/three/wcShaders.ts`.
- `public/assets/brand/wc-mask.png`.
- `docs/HERO-POINTER-DEFORMATION.md`.
- `docs/previews/task04-wc-pointer.webm`.
- `docs/previews/task04-hero-desktop.png`.
- `docs/previews/task04-hero-mobile.png`.
- `AGENTS.md` e `CLAUDE.md`: gerados automaticamente pelo `next dev` instalado
  durante o check de Strict Mode; preservados com o conteúdo padrão.

API consultada: [ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html),
[WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html) e guias locais
de Client Components/lazy loading distribuídos com o Next.js instalado.

TASK 05 não iniciada.
