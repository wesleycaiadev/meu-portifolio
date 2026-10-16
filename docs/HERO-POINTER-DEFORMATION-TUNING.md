# TASK 04.1 — diagnóstico e ajuste da WC

> Atualização de 16/10/2026: vídeos de referência e revisão foram retirados da entrega por decisão de Wesley. As descrições abaixo registram testes anteriores; as gravações originais permanecem no backup local.

> Registro histórico. O modelo atual, os parâmetros e a validação estão em
> [TASK 04.2 — Ambient Flow + Pointer Energy](HERO-AMBIENT-FLOW.md).
> A TASK 04.2 removeu o bypass `wc-preview=1`: reduced motion agora permanece
> sempre estático, conforme a instrução mais recente.

Escopo: somente a deformação local. Hero, Header, navegação da TASK 03,
tipografia, fundo, proporção e posição da WC não foram alterados nesta revisão.
Nenhuma dependência instalada. TASK 05 não iniciada. Aprovação visual pendente.

## Causa encontrada e investigação antes do tuning

A cadeia estava conectada: eventos locais alimentavam `uPointer` e `uVelocity`,
os uniforms chegavam ao programa WebGL e o vertex shader deslocava a malha em XY.
O HTML estava oculto durante o movimento; não estava cobrindo a deformação.

A resposta era pequena por uma combinação de fatores:

- força máxima de 1,8% da altura do frame;
- normalização da velocidade por um limite alto de 2,4 alturas/s;
- decaimento da entrada em todos os frames, inclusive entre eventos recentes;
- falloff elevado ao quadrado, concentrando a resposta no centro do campo.

No percurso inicial medido, a magnitude normalizada máxima foi 0,192: apenas
**2,18 px de deslocamento máximo**, antes da redução espacial do falloff.
A troca de volta ao HTML em repouso também dificultava acompanhar o retorno.
O vídeo anterior tinha somente 5 s e não mostrava o ponteiro.

Antes do ajuste final, a força foi temporariamente alterada de 0,018 para 0,072
(4×), mantendo o restante da resposta original. O shader recebeu esse valor,
a velocidade chegou a 0,615 e o diagnóstico calculou um pico de aproximadamente
28 px. A silhueta apresentada no navegador mudou visivelmente:
[screenshot do diagnóstico 4×](previews/task041-diagnostic-4x.png).
Esse valor temporário foi removido do código final.

Após o ajuste, um readback real da GPU comparou o frame em repouso com um frame
de arrasto: **3.047 pixels mudaram**, com distância máxima de 128,9 px ao centro
do campo, dentro do raio rasterizado de 132,1 px. Zero pixels mudaram fora do
campo com tolerância de deslocamento + célula da malha. O readback ocorreu
imediatamente após o draw; `preserveDrawingBuffer` permanece desativado.
Esse teste verifica o frame renderizado, independentemente do cálculo do debug.

## Ordem final de apresentação

1. SSR/carregamento: SVG HTML visível, canvas absoluto com opacity 0.
2. Textura carregada e primeiro render sem falha: `data-wc-ready="true"` revela
   o canvas (z-index 1) e oculta o SVG (visibility hidden, z-index 0).
3. Repouso: canvas permanece visível com deslocamento zero; o RAF encerra.
4. Falha/descarte: canvas é removido, readiness é apagada e o SVG volta a aparecer.

O canvas usa a mesma caixa da WC e a cor computada do fundo já aprovado.
Nenhuma transição de opacity, transformação de layout ou cor de painel foi criada.
Durante resize, o SVG cobre a preparação do novo buffer até seu primeiro draw.
Blur zera a velocidade e redesenha o estado de repouso; pausa fora da viewport
ou com documento oculto marca a superfície como suja para o retorno.

## Coordenadas e geometria

`getBoundingClientRect()` é lido no frame da WC, não na viewport. O UV da textura
é `(x-local / largura, 1 - y-local / altura)`:

| Ponto no frame | UV confirmado |
| --- | --- |
| Superior esquerdo | (0, 1) |
| Centro | (0.5, 0.5) |
| Inferior direito | (1, 0) |

A máscara continua **1680×920**, sem alteração no enquadramento aprovado.
Os bounds com alpha ≥ 0,5 são x=89…1572 e y=93…834, inclusive: **1484×742**.
A altura de tinta equivale a 742/920 da altura do frame. Raio, força e velocidade
usam essa altura real; UVs continuam no espaço da textura para preservar o
alinhamento da máscara. O debug mostra também UV normalizado pelos bounds da
tinta. Não houve recorte, mudança de escala, margem ou edição do asset.

`PlaneGeometry(1, 1, 96, 52)`: **5.141 vértices / 9.984 triângulos**.
A proporção da grade 96/52 aproxima 420/230: células aproximadamente quadradas,
com cerca de onze células por raio de influência no desktop. Essa densidade
preserva suavidade local sem o custo desnecessário da malha 192×104 anterior.
Não há normais, iluminação ou pós-processamento.

Displacement exclusivamente **XY**, com direção da velocidade amortecida.
Z permanece fixo; câmera frontal ortográfica. Distância corrigida pelo aspect
ratio e falloff `1 - smoothstep(0, raio, distância)`, zero fora do campo.
Não há ruído, oscilação, fisheye, tilt ou movimento global da marca.

## Parâmetros finais

| Parâmetro | Valor |
| --- | --- |
| Raio | **26% da altura real da tinta**, aproximadamente 132 px no desktop |
| Força máxima | **3,8% da altura real da tinta**, aproximadamente 19,3 px |
| Velocidade máxima | **1,5 alturas de tinta/s**, normalizada e limitada a magnitude 1 |
| Damping da posição | **16 s⁻¹**, `1 - exp(-16 × dt)` |
| Damping da velocidade | **14 s⁻¹**, `1 - exp(-14 × dt)` |
| Retenção de amostra recente | **50 ms**, sem decaimento da entrada durante esse período |
| Decaimento após parar | **18 s⁻¹**, `exp(-18 × dt)` |
| Repouso | magnitude < 0,001; velocidade zerada e RAF encerrado |
| DPR máximo | 1,5 |

Entrar inicializa a amostra sem impulso. Movimento lento gera deslocamento
pequeno; moderado acompanha a região; rápido satura no limite com breve arrasto.
Parar inicia o decaimento após 50 ms. Sair zera o alvo e mantém a recuperação
amortecida da velocidade atual. Não há spring ou overshoot.

No teste moderado, o pico calculado foi aproximadamente **10 px**, contra 2,18 px
da resposta inicial. No teste rápido, a velocidade permaneceu abaixo de 1.
Depois do leave, o estado ainda era ativo no primeiro instante e retornou a
idle/velocidade zero; nenhum draw adicional foi observado durante 500 ms de repouso.

## Debug removível

Em `npm run dev`, abrir `http://localhost:3000/?wc-debug` (adaptar a porta).
O módulo `wcDebug.ts` só é importado pelo ramo de desenvolvimento com esse parâmetro.
Remover o parâmetro e recarregar elimina o overlay. Produção ignora o parâmetro.

O overlay absoluto e sem pointer-events exibe UV da textura/tinta, posição
amortecida, raio, vetor e intensidade normalizada da velocidade, força, segmentos
e estimativa analítica do deslocamento nos vértices. A estimativa não é apresentada
como leitura da GPU; essa confirmação foi realizada separadamente acima.
O debug acompanha apenas draws existentes, sem RAF próprio.

[Screenshot do debug final](previews/task041-debug-final.png).
O multiplicador 4× não permanece em settings, shader ou controles de debug.

### Prévia explícita com movimento

Para revisar a interação quando o Windows solicita reduced motion, usar
`http://localhost:3000/?wc-preview=1` no servidor de desenvolvimento.
Esse opt-in ignora somente a preferência de reduzir movimento nessa visita;
não altera configurações do Windows, intensidade, layout ou comportamento touch.
Sem esse parâmetro, e em qualquer build de produção, reduced motion continua
estático. O diagnóstico pode ser combinado com `&wc-debug=1`.

## Validação e evidências

- Lint, typecheck e build de produção passaram; home permanece prerenderizada.
- Servidor de produção validado em `http://127.0.0.1:3002`.
- Mesmas caixas de Header, Hero, WC e links antes/depois do movimento;
  zero eventos de layout shift na interação. Nenhum overflow horizontal.
- Textura deliberadamente retida antes do primeiro frame: HTML visível,
  opacity do canvas 0 e zero draws. Após liberar: um draw, canvas visível e HTML
  oculto; caixas de layout idênticas e zero layout shift na troca.
- Blur redesenhou velocidade zero. Fora da viewport: zero draws adicionais;
  retorno redesenhou a forma de repouso, sem velocidade residual.
- Perda real de contexto via `WEBGL_lose_context`: canvas removido e SVG visível.
- Textura bloqueada e WebGL indisponível: fallback visível, sem canvas restante.
- Reduced motion: zero contexto/canvas, sem download da máscara; identidade estática.
- Touch emulado em **390×844** e **320×700**: zero contexto/canvas, três destinos
  visíveis, link Projetos funcional e nenhum overflow. Dimensões iguais às aprovadas.
- Debug ausente em produção, mesmo com `?wc-debug`; zero exceções de runtime.
- Original da marca intacto (SHA-256 `d2a294e2bf31b2aaae8bdeb574775fbf8837d15df4f4679c52176b68afc8de35`).
  Nenhum asset, referência, pacote ou lockfile foi alterado nesta revisão.

Vídeo final — nove estados (gravação preservada no backup local), 1440×900, cerca de
21 s: repouso → entrada lenta → percurso pelas partes pretas → esquerda/direita →
direita/esquerda → movimento rápido → parada sobre a marca → saída → recuperação.
A gravação combina o Hero estático capturado do navegador com os frames reais do
canvas WebGL. Ponteiro e legendas são indicadores exclusivos da gravação de QA,
não elementos da aplicação. Não há deformação sintetizada pelo gravador.

[Desktop em repouso](previews/task041-hero-desktop.png) ·
[Mobile estático](previews/task041-hero-mobile.png).

Limites: Edge headless com GPU por software; touch e reduced motion emulados.
Não houve teste físico de touch nem validação em Safari/Firefox.

## Arquivos desta revisão

Alterados: `src/components/three/WcIdentity.module.scss`,
`src/lib/three/wcDeformation.ts`, `src/lib/three/wcShaders.ts`,
`docs/HERO-POINTER-DEFORMATION.md` (nota de registro histórico).

Criados: `src/lib/three/wcDebug.ts`, este relatório e evidências
`docs/previews/task041-*`. As alterações pendentes da TASK 04 continuam preservadas,
sem novo commit solicitado nesta revisão.
