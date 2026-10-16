# TASK 04.2 — Ambient Flow + Pointer Energy

> Atualização de 16/10/2026: vídeos de referência e revisão foram retirados da entrega por decisão de Wesley. As descrições abaixo registram testes anteriores; as gravações originais permanecem no backup local.

Implementação concluída; aprovação visual pendente. TASK 05 não iniciada.
Esta revisão substitui o modelo de movimento da TASK 04.1. Mantém o HTML,
CSS, enquadramento, escala, Header e navegação existentes.

## Referência e resultado

Foram comparados o vídeo da TASK 04.1, o material em `reference/gustavo/`
e a nova captura de Gustavo de 2026-10-01 às 22:55:43 (28,21 s).
A diferença observada foi a continuidade da flexão em repouso e o atraso local
da silhueta durante o movimento, além de um contorno secundário discreto.
Esses princípios orientaram a revisão; identidade e composição continuam WC.

- Vídeo final, MP4, 1440 × 900, 27,51 s (gravação preservada no backup local)
- [Desktop](previews/task042-hero-desktop.png)
- [Mobile estático, 390 × 844](previews/task042-hero-mobile.png)

O vídeo foi produzido em tempo real com os frames do canvas WebGL do build
de produção sobre a captura do Hero. Ponteiro e legendas identificam o teste
somente na gravação; não fazem parte da aplicação. Não houve aceleração temporal.
Mostra aproximadamente: 0–6,4 s repouso com ponteiro fora; 6,4–12,7 s percurso
lento pela esquerda, centro e C; 12,7–17,2 s passagens rápidas nos dois sentidos,
diagonal e círculo; 17,2–21,2 s ponteiro parado; restante saída e repouso.

## Arquitetura do shader

Three.js direto, uma cena ortográfica, um material e um plano de 96 × 52
segmentos (5.141 vértices, 9.984 triângulos). Sem pós-processamento.

O vertex shader calcula os campos espaciais. Aplica 22% do Ambient Flow
à posição XY dos vértices e transmite, por interpolação, os 78% restantes
mais o Pointer Energy ao fragment shader. O fragment desloca as UVs da
máscara. A silhueta é efetivamente deformada, sem transformar o objeto inteiro.

`ambientFlow()` combina três ondas espaciais com fases diferentes e
`noise()` 2D suave, implementado com hash, interpolação bilinear e curva
Hermite. O noise se desloca lentamente pelo campo; não há seno temporal
uniforme aplicado à marca nem necessidade de FBM em múltiplas oitavas.

As medidas abaixo usam a altura da tinta visível da WC, não a altura total
da textura transparente. Em 1440 × 900, essa altura é aproximadamente 509 px.

| Parâmetro | Implementação |
| --- | --- |
| Amplitude ambiente | 1,1% por componente, aproximadamente 5,6 px de amplitude nominal máxima; entrada progressiva em 1,4 s |
| Frequências temporais | 0,67 / 0,49 / 0,91 rad/s; períodos individuais de 9,38 / 12,82 / 6,90 s |
| Noise | Escala espacial 1,35; deslocamento temporal de (0,055; −0,037) por segundo |
| Raio principal | 28–41% da altura da tinta, aproximadamente 142–209 px, conforme velocidade |
| Propagação | Campo principal com peso 82%; campo secundário de raio 1,85× com peso 18%; falloff `smoothstep` |
| Força máxima | Limite combinado de 8% da altura da tinta, aproximadamente 40,7 px; força efetiva depende da velocidade e distância |
| Velocidade | Vetor normalizado por 1,6 alturas de tinta/s e limitado a magnitude 1; preserva direção |
| Damping | Exponencial independente de FPS: posição 10 s⁻¹; velocidade 8 s⁻¹ |
| Decay da entrada | 9 s⁻¹ após 50 ms sem nova amostra |
| Memória | Seis amostras, espaçadas em pelo menos 70 ms; pesos 0,28 / 0,24 / 0,19 / 0,14 / 0,10 / 0,05 e ganho 0,25 |
| Decay da memória | `exp(-4 × idade)`; expira em 1,8 s; raio capturado cresce até 55% com a idade |
| Motion echo | Duas amostras extras da máscara, a 45% e 100% do offset; offset máximo 0,6% da altura, aproximadamente 3,1 px |
| Intensidade do echo | Ganho máximo 0,10, pesos 0,7 / 0,3; ativação gradual entre velocidades normalizadas 0,38 e 0,82; zero em idle |
| FPS alvo | 30 em repouso; até 60 durante interação e decay |
| Estabilidade de FPS | Janela de interação de 1 s, prolongada enquanto houver energia; evita alternância a cada evento |
| Custo | DPR limitado a 1,5; um draw por frame; uma amostra da máscara em idle e até três durante echo |

O echo usa o máximo entre a máscara principal e o contorno secundário,
preservando o preto sólido. Não clareia o interior nem aplica blur geral.
A memória conserva o raio da velocidade capturada, independentemente da
velocidade atual, para dissipar energia sem contrair abruptamente o rastro.

O tempo avança somente durante render elegível. Aba oculta, janela sem foco
ou Hero completamente fora da viewport pausam o loop; a retomada não acumula
tempo oculto. Ao parar ou sair com o ponteiro, a energia decai até zero e o
Ambient Flow continua. Touch/coarse pointer e reduced motion usam o SVG
estático, sem inicializar Three.js.

## Padding e preservação

A máscara existente continua em 1680 × 920. Limites da tinta com alpha ≥ 0,5:
x = 89…1572, y = 93…834. A menor margem transparente equivale a cerca de
11,45% da altura da tinta. O limite conservador de deslocamento por eixo é
9,7% (ambiente + ponteiro + echo). Não foi necessário gerar outro asset.

Nenhum arquivo original de identidade ou referência foi alterado.
Hashes SHA-256 preservados:

```text
logo-symbol.svg D2A294E2BF31B2AAAE8BDEB574775FBF8837D15DF4F4679C52176B68AFC8DE35
wc-mask.png     8048302BCDA3B9D37A47282CEF5546A15196F0D9A4FFFF2DD6797E138E590126
```

## Validação

- `npm run lint`, `npm run typecheck` e `npm run build`: aprovados.
- Build de produção iniciado e home carregada; nenhuma exceção de runtime no teste.
- Leitura dos pixels renderizados em dois instantes de idle: 15.868 pixels da
  silhueta binária mudaram com velocidade do ponteiro em zero. O movimento
  não foi validado somente pela existência de uniforms atualizados.
- Faixa externa de 5 px do canvas sem tinta em idle e no teste de arrasto forte.
- Comparação echo ligado/desligado no mesmo estado: 245 pixels modificados,
  nenhum pixel preto sólido modificado; diferença máxima de 14/255 por canal.
- Após parar, velocidade chegou a zero e a memória expirou; o tempo ambiente
  continuou avançando.
- Retângulos de Header, Hero, marca e navegação idênticos antes/depois da
  interação; nenhuma entrada de layout shift no percurso; sem overflow.
- Mobile 390 × 844 e 320 × 700: sem canvas, sem overflow; três destinos visíveis
  e navegação por âncora funcional.
- Reduced motion: SVG estático, sem canvas, sem download da máscara, inclusive
  com os antigos parâmetros `?wc-preview=1&wc-debug=1`.
- Pausa confirmada em simulação de documento oculto, perda de foco e Hero
  completamente fora da viewport. Contador de draws e tempo permaneceram
  constantes; voltaram a avançar na retomada.
- Perda de contexto WebGL e falha no carregamento da máscara restauraram o SVG.
- Requisição pública a `/reference/gustavo/reference-video.mp4` retornou 404.
- Nenhuma dependência instalada; manifests e lockfile preservados.

### Limites da medição

Validação automatizada em Edge headless com GPU por software (SwiftShader),
emulando `no-preference` para poder testar o movimento. Não é uma medição da
GPU nem uma validação visual no navegador aberto pelo usuário.

Idle medido: 30,00 FPS (intervalo p50 33,1 ms, p95 34,1 ms). Interação medida:
47,49 FPS (p50 21,0 ms, p95 23,2 ms), com alvo de 60. O teste confirma o teto
e a alternância; não demonstra 60 FPS sustentados em hardware real.

O ambiente Windows consultado informa reduced motion ativo. Esta tarefa
exige respeitar essa preferência: o bypass antigo `wc-preview=1` foi removido.
Para avaliar a animação sem alterar configurações do sistema, use o MP4.
Na página ao vivo, movimento requer desktop com ponteiro fino e reduced
motion desligado. Configurações do Windows não foram alteradas.

## Arquivos desta revisão

Código alterado:

- `src/lib/three/wcShaders.ts`
- `src/lib/three/wcDeformation.ts`
- `src/lib/three/wcDebug.ts`
- `src/components/three/WcIdentity.tsx` (somente ciclo de vida/elegibilidade; HTML preservado)

Documentação criada: este relatório. Documentação atualizada:
`docs/HERO-POINTER-DEFORMATION-TUNING.md`, com aviso de versão histórica.
Evidências criadas: os três arquivos `task042-*` vinculados acima.
As outras alterações pendentes no Git pertencem às tarefas anteriores.
