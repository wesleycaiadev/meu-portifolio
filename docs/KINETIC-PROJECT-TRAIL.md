# TASK 08: kinetic project trail

> Atualização de 16/10/2026: vídeos de referência e revisão foram retirados da entrega por decisão de Wesley. As descrições abaixo registram testes anteriores; as gravações originais permanecem no backup local.

Checkpoint anterior à implementação: `1431f9b` (`feat: refine editorial projects composition`).

Este relatório registra a versão inicial da TASK 08. A correção posterior de origem presa à borda e seleção automática pelo scroll está documentada em [PROJECT-TRAIL-CONTINUITY.md](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/PROJECT-TRAIL-CONTINUITY.md>).

## Ver ao vivo

[Abrir o localhost](http://127.0.0.1:3000/?wc-preview=1), recarregar e clicar em **Ativar animação**. Rolar até Projetos, primeiro sem mover o mouse; retornar lentamente e depois experimentar o ponteiro próximo ao traço.

O controle existente continua exclusivo de desenvolvimento com `?wc-preview=1`. Sua ativação manual permite testar movimento mesmo quando o sistema pede reduced motion. Essa exceção não existe em produção. A visita normal com reduced motion não inicializa nem mostra o traço. Confirmado também em produção com o parâmetro de preview na URL: nenhum painel é criado.

## Solução

SVG dinâmico, sem Canvas, Three.js ou dependências novas. Um path com cap/join arredondados recebe 28 pontos amostrados de uma trajetória com 10 pontos-guia. A curva usa Catmull-Rom uniforme convertido em segmentos Bézier cúbicos. As mudanças de direção e o retorno da curva interpretam o ritmo da WC; não reproduzem o path da referência.

O vídeo local da referência foi revisto na região dos projetos, com atenção às curvas amplas, travessia dos nomes e continuidade da trajetória. O resultado usa o off-white do token `--text-primary`, sem glow ou gradiente. A linha ocupa principalmente a lista. Pode aproximar-se da borda esquerda do preview; não cobre sua área central.

Espessura: `clamp(largura da seção × 0.017, 18, 28)` CSS px. Resultados: 18px em 1024, 24.48px em 1440 e 28px em 1920. Nenhuma largura, posição, fonte ou dimensão do layout aprovado foi alterada.

## Scroll e inércia

- ScrollTrigger `project-trail`, `scrub: true`, easing linear.
- Início: `top 90%`. Fim: `clamp(bottom 10%)`, limitado ao fim real do documento.
- `refreshPriority: -10` resolve o range após o espaço ocupado pelos pins do Hero e Sobre, independentemente da ordem dos imports dinâmicos.
- Na produção de 1440 × 900 testada: 3060–4459px, com o topo de Projetos em 3870px. Valores são recalculados por viewport/conteúdo.
- 0–15%: sem path visível. 15–35%: entrada física. 35–70%: curvas atravessam os dois nomes. 70–90%: a janela de curva continua para fora. 90–100%: sem traço.
- Uma janela de comprimento 0.34 percorre a trajetória. Cabeça e cauda avançam juntas; não é um path inteiro que apenas muda de opacity.
- Progresso acompanha o scrub com amortecimento exponencial de constante 120ms. Os pontos acompanham seus alvos com taxas de 8/s na cauda a 13/s na cabeça, independentes do frame rate. Não há oscilação ou autoplay.
- Scroll reverso recompõe a trajetória e devolve a seção ao estado sem traço. O movimento residual termina em repouso após o usuário parar.

## Ponteiro e camadas

Somente `(hover: hover) and (pointer: fine)`, ignorando eventos touch. A velocidade é normalizada e limitada a 2000px/s. A perturbação tem raio de 260px, queda quadrática e deslocamento máximo de 32px por eixo. Sua energia decai exponencialmente a 5.5/s; não permanece presa ao cursor.

O SVG é absoluto dentro da seção, decorativo, `aria-hidden`, com `pointer-events: none` e z-index 3. O isolamento local mantém a camada dentro de Projetos. Passa sobre partes dos nomes, enquanto os controles continuam recebendo ponteiro, clique e foco. Os previews e sua transição não foram modificados.

## Mobile e acessibilidade

Desativado abaixo de 1024px. O layout vertical intercala nomes e screenshots; preservar a leitura e as imagens é mais adequado nesta etapa do que aplicar a travessia desktop. Não há influência do ponteiro nem loop do trail nesse modo. Touch continua selecionando projetos.

Reduced motion normal: path vazio, SVG oculto e nenhum ScrollTrigger/RAF do trail. Os botões, imagens e foco acessível continuam funcionando. O override manual de desenvolvimento descrito acima é a única exceção.

## Performance e validação

RAF próprio somente quando a seção está visível, a página não está oculta e há progresso/energia/posição a amortecer. Para ao atingir repouso. IntersectionObserver limpa o desenho e cancela o frame fora da seção; `visibilitychange` pausa o trabalho; a volta sincroniza com o progresso corrente. Cleanup cancela RAF, timeline, trigger, observers e listeners. Não altera o loop/WebGL do Hero.

Validação em Edge/Chromium isolado:

- Lint, typecheck e build de produção passaram.
- Entrada, passagem e saída em 10%, 25%, 40%, 55%, 70%, 85% e 100%; reversão pelos mesmos estados.
- Scroll sozinho movimenta o traço; ponteiro altera o path localmente mantendo o progresso de scroll.
- RAF parado em repouso, fora da seção e na simulação do evento de página oculta.
- Bounds da seção, nomes e figuras idênticos durante troca de projeto; nenhum overflow em 320, 390, 1024, 1440 e 1920px.
- Hover seleciona MF; Tab seleciona os dois projetos com outline de 2px. Toque em viewport mobile com touch emulado também seleciona MF.
- Alterar reduced motion remove trigger e path, preservando seleção. Painel ausente em produção mesmo com `?wc-preview=1`.
- Nenhuma exceção de runtime. Assets, referências, dependências, Hero, WC, Sobre, fontes e tokens globais iguais ao checkpoint.
- `/reference/gustavo/reference-video.mp4` retorna 404 na aplicação de produção.

Os testes não substituem a aprovação visual do usuário nem um teste físico em Safari/iOS.

## Evidências

- Desktop, scroll sem mouse, reversão e depois pointer (gravação preservada no backup local), aproximadamente 38s, 1440 × 900. Primeira passagem e retorno sem eventos de ponteiro; trecho final com ponteiro.
- Mobile, entrada e retorno sem trail (gravação preservada no backup local), 12.48s, 390 × 844.
- [25%](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task08-desktop-25.png>), [40%](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task08-desktop-40.png>), [55%](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task08-desktop-55.png>), [70%](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task08-desktop-70.png>).
- [1024px](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task08-1024.png>), [1920px](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task08-1920.png>), [390px](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task08-mobile-390.png>), [reduced motion](<C:/Users/wesley/Documents/PORTIFOLIO V2/docs/previews/task08-reduced-motion.png>).

## Arquivos

Criados: `src/components/motion/ProjectTrail.tsx`, `src/components/motion/ProjectTrail.module.scss`, `src/lib/motion/projectTrail.ts`, este relatório e as dez evidências listadas acima.

Modificados: `src/components/sections/Projects.tsx` (inclusão do overlay), `src/components/sections/Projects.module.scss` (posicionamento relativo e isolamento da seção).

Implementação sem commit para revisão. TASK 08 concluída; objeto 3D e etapas seguintes não implementados.
