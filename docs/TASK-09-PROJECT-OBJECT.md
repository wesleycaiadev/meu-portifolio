# TASK 09 · Estrutura editorial articulada

Protótipo isolado em `http://127.0.0.1:3000/playground/project-object`.
Checkpoint anterior: `ad26f30` (`feat: refine continuous projects signature motion`).
A home e seus componentes não foram modificados nesta tarefa. Nenhuma dependência foi instalada.

## Geometria e relações

Cinco painéis reais, com corpos extrudados, superfícies frontais, laterais, bevel, pinos e colares de dobradiça. A imagem é uma superfície aplicada ao corpo físico; não substitui a geometria.

O núcleo tem duas nervuras tubulares com diagonais alternadas e curvas, inspiradas nas relações da WC. Barras conectam os pontos de articulação. A forma não é uma extrusão literal da logo. As abas neutras possuem relevos discretos.

Dimensões em unidades da cena; os pivôs permanecem fixos na estrutura. Os painéis giram em torno desses pivôs, sem deslocamentos aleatórios.

| Painel | Dimensões aproximadas (largura × altura × espessura) | Pivô (x, y, z) | Eixo | Fechado → expandido |
| --- | --- | --- | --- | --- |
| Hero desktop | 4,12 × 2,13 × 0,20 | −2,05; 0; 0,50 | Y | 0 → −1,08 rad |
| Hero mobile | 1,46 × 3,02 × 0,16 | 2,10; 0,22; −0,36 | Y | −0,88 → −0,12 rad |
| Localização | 2,82 × 2,02 × 0,18 | −2,05; −0,16; −0,43 | Y | 0,87 → 0,10 rad |
| Aba superior | 3,40 × 0,86 × 0,14 | 0; 1,12; −0,18 | X | 1,20 → 0,30 rad |
| Aba inferior | 3,40 × 1,00 × 0,14 | 0; −1,12; −0,18 | X | −1,15 → −0,30 rad |

O painel principal abre cerca de 62° e revela o núcleo. Os painéis lateral e vertical se abrem em torno das respectivas laterais; as abas superior e inferior articulam em eixos horizontais. Posições e proporções são próprias deste protótipo.

## Materiais e iluminação

- Corpos: grafite `#242629`, `MeshStandardMaterial`, roughness 0,76 e metalness 0,32.
- Laterais: cinza `#606266`, roughness 0,48 e metalness 0,67.
- Nervuras e pinos: cinza `#77797b`, roughness 0,58 e metalness 0,72.
- Screenshots: `MeshBasicMaterial`, sem tone mapping, textura sRGB. Assim a iluminação da estrutura não altera as cores das capturas.
- Hemisphere light e duas luzes direcionais neutras; sombra suave de 1024 px sobre um receptor transparente preto. Sem mapas externos de ambiente, glow ou emissive.
- ACES Filmic, exposição 1,1, aplicado aos materiais estruturais. Acabamento neutro sem textura procedural de metal escovado.

## Câmera e interação

Câmera perspectiva: FOV 35°, near 0,1, far 80; alvo `(0; 0,05; 0)`.

| Estado | Posição base | Articulação |
| --- | --- | --- |
| A · Frontal | 0,35; 0,45; 10,80 | Configuração fechada |
| B · Três quartos | 6,60; 3,10; 9,20 | Configuração fechada vista em profundidade |
| C · Expandido | −4,20; 3,50; 13,20 | Painéis abertos, núcleo exposto |

A distância se adapta à proporção do viewer via ResizeObserver. A prévia mobile tem altura menor para aproximar o objeto e manter os controles acessíveis.

Drag modifica a orientação do conjunto, com limites de yaw ±0,95 rad (aproximadamente 54°) e pitch ±0,30 rad (17°), relativos a cada câmera. Damping exponencial com coeficiente 10/s, sem giro automático. As setas ajustam yaw em 0,12 rad e pitch em 0,06 rad. Escape e Reset restauram o estado frontal. Captura do ponteiro encerra em pointerup, pointercancel ou lostpointercapture.

GSAP já existente no projeto controla as transições: câmera em 1,25 s e painéis em 1,15 s, easing `power2.inOut`, defasagem estrutural de 0,055 s entre painéis. A sequência demonstrativa vai para expandido em 1,55 s e começa o retorno em 3,50 s. Não há loop. Selecionar um estado interrompe a sequência anterior a partir da pose atual.

## Texturas e performance

Capturas existentes do SpaSmooth, carregadas uma vez e em paralelo:

| Asset | Resolução | Superfície |
| --- | --- | --- |
| `spasmooth-hero-desktop.png` | 1905 × 956 | Principal |
| `spasmooth-hero-mobile.png` | 402 × 870 | Vertical |
| `spasmooth-localizacao.png` | 1354 × 952 | Secundária |

Os arquivos originais permanecem intactos. A superfície frontal usa ajuste por proporção, sem esticar nem cortar as capturas. Texturas sRGB, anisotropia limitada a 4 e mipmaps padrão do Three.js. As três imagens representam aproximadamente 13,8 MB de pixels RGBA antes de mipmaps, sem contar outras alocações de GPU.

`ProjectObjectContent` separa os papéis main/mobile/detail da geometria. A construção recebe esse conteúdo; uma futura instância pode usar assets do MF Consultoria e proporções correspondentes. A troca entre projetos não foi implementada nesta etapa.

DPR limitado a 1,5, ou 1,25 quando o viewer tem menos de 640 px. Render por demanda durante transformação, drag/damping, carregamento e resize. Em repouso o RAF para. Aba oculta ou viewer fora de tela pausam também a timeline. O cleanup elimina listeners, observers, timeline, RAF, texturas, geometrias, materiais, shadow map e renderer. Carregamentos concluídos após desmontagem descartam a textura.

Perda do contexto WebGL mostra fallback estático e pausa a animação. A restauração retoma o contexto e o objeto. WebGL indisponível também mostra a captura principal. Com movimento reduzido, não é criado renderer por padrão. Um botão opcional de avaliação permite ativar o 3D exclusivamente no playground; desativá-lo descarta o renderer, sem modificar a preferência do sistema.

## Validação e evidências

- `npm run lint`, `npm run typecheck` e `npm run build`: aprovados.
- Testes no Microsoft Edge/Chromium, incluindo contextos com toque emulado. Nenhum erro JavaScript de página.
- Estados A/B/C, demonstração, reset, drag até os limites, damping e teclado: funcionais. Render em repouso confirmado parado.
- 1440, 1024, 820, 390 e 320 px: sem overflow horizontal, estados frontal/expandido acessíveis.
- DPR 2/3 emulado: respeitou os limites de 1,5 e 1,25.
- Perda/restauração pelo `WEBGL_lose_context`: fallback visível e retorno funcional.
- Caminho de pausa/retomada de aba validado por evento controlado de `visibilitychange`; não equivale a um teste de suspensão pelo sistema operacional.
- Reduced motion: captura estática, zero canvas. Opt-in cria o renderer; opt-out o remove. WebGL indisponível: fallback visível.
- Navegação de volta à home: canvas do protótipo desmontado.
- Produção: `/playground/project-object` respondeu HTTP **404**, sem objeto nem controles. Home respondeu 200, sem painel de prévia mesmo com os parâmetros de desenvolvimento na URL.
- Assets e dependências preservados, comprovados pela ausência de alterações nesses caminhos no Git.

Gravações reais do navegador, sem aceleração: [desktop](previews/task09-object.webm) e [mobile](previews/task09-object-mobile.webm). Desktop mostra frontal, três quartos, lateral, drag, expansão, retorno e sequência demonstrativa. Mobile mostra os controles de estado por toque.

Screenshots: [frontal](previews/task09-front.png), [três quartos](previews/task09-quarter.png), [expandido](previews/task09-expanded.png), [lateral](previews/task09-side.png), [mobile](previews/task09-mobile.png) e [home em produção](previews/task09-production-home.png).

Dados da validação: [task09-validation.json](previews/task09-validation.json).

## Arquivos

Fontes criadas:

1. `src/app/playground/project-object/page.tsx`
2. `src/components/three/ProjectObjectPlayground.tsx`
3. `src/components/three/ProjectObjectPlayground.module.scss`
4. `src/data/projectObject.ts`
5. `src/lib/three/projectObject.ts`

Documentação criada: este relatório, seis PNGs, dois WebMs e um JSON listados acima em `docs/previews/task09-*`.
Nenhum arquivo existente modificado na TASK 09. Alterações ainda não commitadas, aguardando revisão visual.

## Limitações

O protótipo usa SpaSmooth; MF Consultoria ainda não possui seleção ou transição. As superfícies mostram capturas estáticas, não páginas web interativas. A articulação é cinemática, sem simulação física ou detecção automática de colisões. As poses e limites definidos foram inspecionados visualmente, mas combinações futuras de geometria exigirão nova verificação.

Mobile permite inspecionar o conjunto e suas poses; textos pequenos das screenshots não têm legibilidade equivalente ao desktop. Dispositivos físicos e GPUs diferentes ainda precisam de avaliação visual, além da emulação realizada. Não foi adicionado gerenciamento para redesenhar a cena inteira após falha de carregamento de textura; o fallback permanece disponível.

TASK 09 concluída como protótipo. Sem integração à home e sem início da TASK 10.
