# Movimento automático do portfólio

Decisão atualizada em **19/10/2026**: Wesley solicitou animações automáticas, inclusive quando o navegador informa movimento reduzido, **sem botão de ativação ou desativação**.

## Comportamento

- Hero/WC, Sobre, Projetos, Expertise, Processo, efeitos CSS e cases iniciam automaticamente conforme a capacidade e o tamanho da tela.
- Nenhum controle público de movimento, script de preferência ou leitura/gravação de uma escolha de movimento em `localStorage`.
- Valores antigos de `portfolio-motion-preference` não são consultados e não impedem a inicialização.
- As configurações do Windows e do navegador permanecem intactas.
- Os parâmetros e painéis de depuração permanecem restritos ao desenvolvimento. O visitante não precisa de query string para ver as animações.
- Breakpoints, limites de DPR, adaptação para toque e fallback sem WebGL foram preservados. A apresentação mobile dos cases continua usando capturas exploráveis.

## Escopo técnico

A implementação com controle, preparada no commit `2cb7448`, não chegou à produção e foi retirada da versão final deste PR. `MotionControl`, seu CSS, o módulo de preferência e o script inicial foram removidos. Os controladores originais continuam responsáveis pelo carregamento e descarte dos recursos.

Os estilos CSS também deixaram de ser condicionados à preferência de movimento do sistema. Timings, trajetórias, câmera, modelos, composição e conteúdo permanecem os aprovados. Nenhuma biblioteca foi adicionada.

Esta decisão substitui as políticas anteriores registradas nos relatórios das TASKS 16/17. Aqueles documentos descrevem as versões auditadas em suas respectivas datas.

## Validação local

- Lint, TypeScript e build de produção aprovados.
- 23 verificações automatizadas aprovadas no Edge, incluindo movimento reduzido ativo, preferência antiga salva, scroll, pointer, transições, ambos os notebooks, retorno aos projetos, mobile e fallback sem WebGL.
- Nenhum erro de página ou hidratação registrado.
- Evidência: [automatic-motion-local.json](previews/task17/automatic-motion-local.json).
- A verificação automatizada cobre os cenários acima; não representa teste físico em todos os navegadores e dispositivos.
