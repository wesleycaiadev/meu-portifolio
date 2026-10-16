# Preferência de movimento do portfólio

Data: 16/10/2026. Wesley solicitou que a versão publicada inicie com animações mesmo quando o Windows/navegador informe movimento reduzido, mantendo um controle próprio para o visitante.

## Comportamento

- **Padrão: animações habilitadas**, independentemente da preferência do sistema.
- Controle público discreto em todas as rotas: **Reduzir movimento** quando ativo; **Ativar animações** quando reduzido.
- A escolha reduzida remove WC WebGL, pins/timelines de scroll, transições cinematográficas e notebooks 3D; mantém o conteúdo e as capturas acessíveis. Também reduz os efeitos CSS de botões, contato e abas.
- A escolha é persistida localmente como `portfolio-motion-preference`, sem conta, envio de dados ou alteração do Windows. Se o armazenamento estiver indisponível, o controle funciona no documento atual.
- Todas as rotas usam a mesma preferência; mudanças são observadas também entre abas. O script inicial restaura a escolha salva antes da hidratação e o controle não é mostrado quando JavaScript está indisponível.
- Breakpoints, suporte a WebGL, limites de DPR e adaptação para toque permanecem. Habilitar animações não força um notebook 3D em dispositivos sem capacidade ou na apresentação mobile.
- Os parâmetros e painéis de depuração continuam exclusivos do desenvolvimento; não são a origem da preferência pública.

## Escopo técnico

`src/lib/motion/preference.ts` centraliza a escolha, notificação e persistência. Os controladores existentes consultam essa escolha e continuam responsáveis pelo próprio descarte. Não houve alteração de trajetórias, câmera, timings, composição, conteúdo ou biblioteca.

`MotionControl` é um controle de ação por teclado/toque, com foco visível e confirmação textual em região de status. Os estilos usam a mesma escolha via `html[data-motion]`, evitando divergência entre CSS e JavaScript.

Esta decisão substitui a política anterior dos relatórios das TASKS 16/17, em que a preferência do sistema desativava automaticamente as animações. Esses relatórios permanecem como registros das versões auditadas anteriormente.

## Verificação antes do envio

- Lint, typecheck e build de produção aprovados.
- **23 verificações em produção local**, todas aprovadas, incluindo sistema com movimento reduzido, cinco pins e um canvas WC, efeitos CSS, desligar/religar sem duplicação, preferência salva no reload e navegação, os dois notebooks, transição cinematográfica (seleção/navegação/transferência), teclado, armazenamento indisponível, mobile e ausência de JavaScript.
- Nenhum erro de página ou hidratação registrado. Testes executados em Edge automatizado; não se declara validação em todos os navegadores ou aparelhos físicos.
- [Resultados locais](previews/task17/motion-preference-local.json).
