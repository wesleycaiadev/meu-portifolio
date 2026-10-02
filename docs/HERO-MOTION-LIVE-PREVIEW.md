# TASK 04.3 — movimento e prévia ao vivo

Prévia: `http://127.0.0.1:3000/?wc-preview=1`.
Clique em **Ativar animação**. A prévia começa estática, mesmo quando a
preferência de movimento reduzido está desligada. O botão permite ativar e
desativar explicitamente o movimento somente em desenvolvimento. Não muda
configurações do Windows nem aparece no build de produção.

## Diagnóstico

O Windows informa `MinAnimate=0`; o navegador isolado confirma
`prefers-reduced-motion: reduce`. A versão 04.2 respeitava essa preferência
e havia removido o bypass anterior. No início desta tarefa não havia servidor
escutando nas portas 3000–3002. O servidor de desenvolvimento agora está na
porta 3000; a porta 3002 foi usada somente na validação de produção.

## Movimento revisado

As ondas da 04.2 tinham amplitude nominal de 1,1% e muitos nós estacionários.
A revisão usa fases que viajam através da superfície, com amplitude nominal
de 3,2% da altura da tinta. Subtrair o campo no centro ancora a identidade;
os pesos e o fator 0,5 limitam a amplitude sem mover a logo como um bloco.

Vertex + fragment continuam combinados: 22% do ambiente no plano XY e 78%
nas UVs, junto com o campo de ponteiro. Três ondas com noise suave têm
velocidades 0,78 / 0,51 / 1,02 rad/s, períodos de 8,06 / 12,32 / 6,16 s.

O campo secundário ganhou peso (32%, raio 1,85×), e as seis amostras de
memória agora espalham uma crista perpendicular ao gesto, com atraso local.
Raio principal: 32–48% da altura da tinta. Força combinada limitada a 7%.
Velocidade normalizada por 1,3 alturas/s. Damping: posição 8 s⁻¹ e velocidade
5 s⁻¹; decay de entrada 6 s⁻¹. Amostras a cada 90 ms; memória expira em
2,4 s, com `exp(-2,8 × idade)` e ganho 0,40. O echo discreto anterior permanece.

O limite conservador de ambiente + ponteiro + echo é 10,8% da altura da tinta,
inferior à margem transparente mínima existente de 11,45%.

## Verificação

- Lint, typecheck e build aprovados.
- Prévia reduzida inicialmente sem canvas; clique e Enter ativam; desativação
  remove o canvas e restaura o SVG. Home normal com reduced motion fica estática.
- Código/texto do painel ausente de `.next/static` de produção. Parâmetros da
  prévia/debug em produção não ativam painel, movimento ou diagnóstico reduzido.
- 53.231 pixels da silhueta mudaram entre duas amostras de repouso com
  velocidade zero. Bordas externas sem tinta no idle e no teste de arrasto.
- Depois da parada, velocidade zero, memória expirada e retorno a 30 FPS alvo;
  depois da saída, draws continuam para o ambiente.
- Layout medido idêntico durante a interação, sem layout shift ou overflow.
- Hero totalmente fora da viewport: draws 192 → 192; retorno: 206.
- Perda de contexto restaura SVG. Touch 390 × 844 e 320 × 700 estático,
  três links visíveis, sem overflow. Referência pública retorna 404.
- Nenhuma exceção de runtime no teste e nenhuma dependência instalada.
- Assets originais e máscara preservados por hash.

Medição em Edge headless/SwiftShader: idle 27,50 FPS (p50 36,1 ms; p95 37,1 ms),
interação 47,91 FPS (p50 21,0 ms; p95 22,1 ms). Alvos continuam 30/60.
Não é uma medição da GPU do usuário. A validação direta no Edge aberto foi
interrompida pela ferramenta por não conseguir identificar a URL com segurança.

Nenhum vídeo novo foi gerado, conforme o pedido de avaliar ao vivo.

## Arquivos

Alterados: `src/lib/three/wcShaders.ts`, `src/lib/three/wcDeformation.ts`,
`src/components/three/WcIdentity.tsx`.
Criados: `src/lib/three/wcMotionPreview.ts` e este relatório.
Hero, Header, CSS, botões, tipografia e assets não foram alterados nesta tarefa.
