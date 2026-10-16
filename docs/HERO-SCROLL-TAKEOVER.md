# TASK 05 — WC Scroll Takeover

Implementação concluída; aprovação visual pendente. TASK 06 não iniciada.
Checkpoint anterior à transição: `3117b8d`,
`feat: add ambient flow and pointer energy to wc identity`.

## Testar ao vivo

Abra **http://127.0.0.1:3000/?wc-preview=1**, clique em **Ativar animação**,
observe o ambiente com o mouse fora da marca e role para baixo. Volte ao topo
para conferir a reversão. O mesmo botão desativa a prévia.

A prévia é exclusiva de desenvolvimento, começa desativada e permite avaliar
o movimento sem mudar a preferência de acessibilidade do Windows. A home
normal e o build de produção continuam respeitando reduced motion.
Nenhum vídeo novo foi gerado, conforme a instrução mais recente do usuário.

## Composição e controle

GSAP + ScrollTrigger controlam uma aproximação ao ponto **(63,33%; 73,91%)**
da textura original, na curva inferior da junção WC. A trajetória sai do centro
do enquadramento e aproxima esse ponto do centro da viewport entre 10% e 75%
do progresso. A escala cresce exponencialmente com o progresso; não há
autoplay, snap ou tween que complete a sequência depois de soltar o scroll.
`scrub: true` mantém o controle direto, inclusive na reversão.

Header e Hero são agrupados em um wrapper de cena. O pinning começa em
`top top`, preserva o espaço no fluxo e termina após a distância definida.
O wrapper recorta a marca ampliada, evitando overflow. A marca continua
sendo a superfície que cobre a tela; não há cortina ou overlay preto.

| Viewport | Scroll adicional | Escala final medida |
| --- | --- | --- |
| Desktop 1440 × 900 | 120vh, aproximadamente 1080 px | 26,72× |
| Tablet 900 × 1024 | 90vh, aproximadamente 922 px | 30,40× |
| Mobile 390 × 844 | 55vh, aproximadamente 464 px | 48,51× |
| Mobile 320 × 700 | 55vh, aproximadamente 385 px | 50,20× |

A escala final é responsiva: diagonal da viewport dividida pelo diâmetro
seguro da região preta focal, com margem de 30%. A marca menor no mobile
exige mais ampliação para cobrir a tela; a duração do scroll é bem menor.
Mobile usa somente o SVG estático durante essa aproximação, sem Ambient
Flow, Pointer Energy ou inicialização de Three.js.

No desktop 1440 × 900, a transformação começa em escala 1 e translação
(0; 0). Termina em escala 26,72 e translação CSS aproximada
(−4103,71 px; −4026,84 px), com origem no centro da marca. O ponto focal
termina no centro da viewport. Esses valores são recalculados no resize.

## Faixas de progresso

| Faixa | Comportamento |
| --- | --- |
| 0% | Hero original: mesmo tamanho, posição e navegação |
| 2–15% | Header perde opacity e sobe no máximo 8 px |
| 3–20% | Navegação desaparece gradualmente |
| A partir de 14% | Navegação fica `inert`, sem pointer events e oculta da árvore acessível; foco existente volta ao main |
| 8–68% | Ambient Flow, Pointer Energy e echo diminuem juntos por curva smoothstep |
| 68–100% | Geometria estabilizada; memória do ponteiro limpa; render WebGL deixa de executar frames contínuos |
| 90–96% | A tinta já dominante converge discretamente do preto original para o token `#101010` |
| 98% | Troca da superfície somente após a marca cobrir a viewport; marca oculta, preto contínuo |
| 100% | Estado estável, pronto para a área Sobre |

Na reversão, todas as faixas são percorridas ao contrário. Header e botões
recuperam visibilidade e interação; a influência do movimento volta a 1.
Não existe troca abrupta para uma marca rígida no retorno ao início.

## Runtime e acessibilidade

Lenis **não foi ativado**. O scroll nativo já permite a sequência e preserva
as âncoras, sem introduzir outro ticker.

ScrollTrigger atualiza transformações CSS e um único valor de influência,
publicado ao runtime WebGL existente. Não chama `renderer.render()` nem cria
outro RAF. O drawing buffer mede a caixa sem transformações CSS, para que
a ampliação não gere uma textura de dezenas de milhares de pixels.

Enquanto a influência está em zero, o runtime não mantém o loop ambiente.
Ao retornar, o relógio retoma sem acumular o tempo parado. Aba oculta,
janela sem foco e Hero fora da viewport mantêm as pausas já existentes.
Cleanup remove a timeline, o pin e os listeners locais; alternar a prévia
repetidamente não acumula wrappers.

Reduced motion na visita normal usa scroll nativo entre o Hero estático e
a superfície escura, sem pin, takeover ou movimento automático. Conteúdo e
destinos continuam acessíveis. Nenhuma configuração do sistema foi alterada.

A próxima área contém somente um placeholder escuro de Sobre. Retrato,
texto final, Projetos, Lenis, cursor trail e outras etapas não foram construídos.

## Verificação e evidências

- Lint, typecheck e build aprovados; `git diff --check` sem erros.
- Home de desenvolvimento e build de produção carregados.
- Hero inicial manteve os limites medidos: x 136,5; y 131,078125;
  largura 1152; altura 630,84375 px em 1440 × 900.
- Três ciclos de scroll e reversão, com velocidades diferentes: progress 0,
  influência 1 e navegação novamente interativa ao retornar.
- Resize no meio da sequência para 1200 × 800: pin de 960 px, altura de
  cena 800 px e buffer 1022 × 560; sem overflow.
- Foco em um link durante a saída foi transferido ao `#conteudo`; links
  invisíveis ficaram inertes.
- Desativação da prévia removeu todos os pin-spacers; reativação criou apenas um.
- Âncora Sobre levou ao destino correto, com o topo da seção em y = 0.
- Documento oculto simulado: tempo 0,4794 → 0,4794; retomada: 0,6675.
  No takeover estabilizado: tempo 0,6916 → 0,6916.
- Antes do handoff (97,9%), pixels da viewport útil variaram somente de
  16 a 19 por canal; nenhum pixel claro. Em 100%, todos foram exatamente
  (16,16,16). Mesmo resultado no mobile 390 × 844.
- Mobile 320 × 700 e tablet 900 × 1024 carregados, sem overflow;
  mobile sem canvas e com reversão para o SVG.
- Produção com `?wc-preview=1`: sem painel de desenvolvimento; reduced motion
  sem pin ou canvas. Código/texto do painel ausente de `.next/static`.
- Nenhuma exceção de runtime observada. Nenhuma dependência instalada.
- Identidade e máscara preservadas por hash; referências e manifests intactos.

Capturas diretas do build de produção:

- [0%](previews/task05-hero-0.png)
- [25%](previews/task05-hero-25.png)
- [50%](previews/task05-hero-50.png)
- [75%](previews/task05-hero-75.png)
- [100%](previews/task05-hero-100.png)
- [Mobile 100%](previews/task05-mobile-100.png)

Limite da validação: Edge isolado/headless com SwiftShader e preferências
emuladas para testar os dois modos. O acesso direto ao Edge do usuário foi
interrompido pela ferramenta porque ela não identificou a URL com segurança.
A aprovação visual no navegador real permanece com o usuário.

O asset original contém raster embutido e a máscara tem resolução finita;
bordas podem suavizar durante aproximações extremas. A arte não foi redesenhada.

## Arquivos desta tarefa

Criados:

- `src/components/motion/HeroTakeover.tsx`
- `src/components/motion/HeroTakeover.module.scss`
- `src/lib/motion/wcTakeover.ts`
- este relatório e as seis capturas acima.

Modificados:

- `src/app/page.tsx`
- `src/components/three/WcIdentity.tsx`
- `src/lib/three/wcDeformation.ts`
- `src/lib/three/wcShaders.ts`
- `src/lib/three/wcMotionPreview.ts`

As mudanças da TASK 05 ficam pendentes no Git depois do checkpoint solicitado.
