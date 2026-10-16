# TASK 15A — Contato e encerramento

> Atualização de 16/10/2026: vídeos de referência e revisão foram retirados da entrega por decisão de Wesley. As descrições abaixo registram testes anteriores; as gravações originais permanecem no backup local.

Implementada em 15/10/2026. Pronta para avaliação visual. TASK 15B não iniciada.

## Checkpoint e prévia

Antes desta etapa, a TASK 14 foi registrada no commit **`4a4fbad` — `feat: complete expertise and process scroll motion`**. As alterações da TASK 15A ficam no diretório de trabalho, sem novo commit.

- [Contato](http://localhost:3000/#contato)
- [Processo → Contato com prévia de motion em desenvolvimento](http://localhost:3000/?motion=preview#processo)
- Vídeo da passagem e microinterações (gravação preservada no backup local)

O Contato não tem timeline de entrada, pin, takeover ou loop. `motion=preview` continua pertencendo ao sistema anterior de Expertise/Processo; não habilita movimento adicional no encerramento. Reduced motion mantém o feedback imediato dos links e elimina o deslocamento das setas.

## Composição

Uma passagem geométrica curta liga o off-white de Processo ao escuro do encerramento. A seção usa exclusivamente os tokens existentes, Inter Tight e Instrument Serif italic, sem nova paleta, fonte ou biblioteca.

- Identificação “Contato”.
- “Toda boa ideia merece sair do papel.”, com ênfase serifada.
- “Vamos conversar?” como link principal para o WhatsApp confirmado.
- Três canais diretos com logos de WhatsApp/LinkedIn e envelope genérico para e-mail.
- Footer com nome, Design & Desenvolvimento, ano e retorno ao início. Os canais ficam reunidos acima dele, sem uma segunda lista repetida.

Hover e foco desenham a linha do convite e deslocam discretamente a seta em 3 px. As setas dos canais deslocam 2 px e os títulos ganham sublinhado; os controles têm foco visível e área de toque mínima de 44 px. Não existe dependência de hover para acessar informação ou destinos.

## Contatos confirmados e pendências

Os destinos foram procurados na configuração/documentação atual; os dados antigos não estavam mais no código da reconstrução. A fonte de confirmação é a mensagem anterior de Wesley nesta conversa, agora centralizada em `src/data/contact.ts`.

| Canal | Destino confirmado | Situação |
| --- | --- | --- |
| WhatsApp | `https://wa.me/5579998356598` | Publicado; número exibido como +55 79 99835-6598. |
| E-mail | `mailto:wesleycaia.dev@gmail.com` | Publicado. |
| LinkedIn | `https://www.linkedin.com/in/wesley-caia-dev/` | Publicado. |
| Currículo | Nenhum arquivo fornecido | Sem link ou botão fictício. |
| Formulário | Nenhum backend/serviço de envio encontrado | Não implementado nesta etapa. |

Para disponibilizar currículo: adicionar o PDF real a `public/`, preencher `contact.resume` com `href` público e `fileName` e gerar uma nova build. O componente só renderiza o download se o caminho for um PDF local existente dentro de `public/`. Enquanto `resume` for `null`, não aparece um controle sem destino.

A proveniência dos SVGs está em [public/assets/contact/README.md](../public/assets/contact/README.md). Os paths das marcas são preservados, com apresentação monocromática por CSS.

## Formulário: proposta técnica separada

Caso os canais diretos não sejam suficientes, uma etapa futura pode adicionar Nome, E-mail e Mensagem com um endpoint de envio no servidor. Antes da implementação, é preciso escolher o serviço de e-mail, confirmar a conta/destinatário e configurar as credenciais reais e o domínio remetente no ambiente de hospedagem.

O endpoint deverá validar os campos no servidor, limitar tamanho/frequência das solicitações e tratar abuso. A interface deverá apresentar estados de envio, sucesso e falha acessíveis, preservando a mensagem em caso de erro. O sucesso só pode ser mostrado após confirmação do serviço. Consentimento/informação sobre o tratamento dos dados e política de retenção precisam ser definidos pelo responsável pelo site. Nenhum formulário, endpoint, dependência ou credencial foi criado nesta TASK.

## Navegação e preservação

- O Hero conserva seus três links originais; o link Contato já aponta para `#contato`.
- Links internos são âncoras nativas: URL, histórico, scroll e foco permanecem sob o comportamento do navegador.
- A seção tem nome semântico e `tabIndex=-1`. Tab a partir dela alcança o CTA principal. O outline permanece nos links, sem desenhar uma moldura em toda a seção.
- O retorno ao início aponta para o `main#conteudo`, levando scroll e foco ao início sem mudar o Hero.
- `ContactAnchor` reutiliza a correção inicial limitada de âncora existente, para acomodar a criação assíncrona dos pins anteriores quando se abre diretamente `/#contato`. A correção cessa na primeira interação ou após quatro segundos; o fallback mantém a âncora nativa.
- O ano é calculado no servidor e reconciliado com o ano do navegador após hidratação/retorno à aba, inclusive quando a build foi gerada em outro ano.
- Hero/WC, Sobre, Projetos/trail, transições, cases, Expertise e Processo não tiveram seus arquivos alterados nesta etapa. Apenas a integração na home substitui o placeholder e acrescenta o footer.

## Validação

- **Lint, typecheck e build: aprovados.** A compilação final inclui a verificação TypeScript.
- **68 verificações funcionais**, cobrindo movimento permitido, reduced motion e prévia local; sem exceções de página.
- Âncora inicial após os pins, foco, teclado, retorno ao início, Hero com três destinos, histórico Back/Forward, canais confirmados, ano, ausência de formulário/download indisponível e acesso sem JavaScript.
- Larguras visuais: 1920, 1440, 1024, 768, 390 e 320 px. Sem overflow horizontal.
- Alvos mínimos e teste de estresse com texto ampliado nas larguras 1920/1024/768/390/320. Emulação automatizada, sem avaliação em dispositivos físicos.
- **13 verificações de regressão**: transições dos dois cases, um único canvas do notebook por case, retorno a Projetos, preservação das seções e navegação posterior ao Contato; sem exceções de página.
- Links externos tiveram sua navegação interceptada no teste para verificar o destino efetivo, sem enviar mensagens. O e-mail foi verificado pelo URI `mailto:`. Não se afirma entrega de mensagem, disponibilidade de aplicativo local ou auditoria da titularidade dos perfis.
- Vídeo em produção com wheel nativo em tempo real, mostrando a saída do Processo em Refinar, a passagem ao escuro, hover, foco e footer. Não há mudança de velocidade ou busca direta da timeline durante o percurso gravado; a posição inicial é preparada antes do percurso.

### Evidências

- [Contato desktop — 1440](previews/task15a-contact-1440.png)
- [Desktop largo — 1920](previews/task15a-contact-1920.png)
- [Hover do convite](previews/task15a-contact-hover.png)
- [Foco por teclado](previews/task15a-contact-focus.png)
- [Footer desktop](previews/task15a-footer-desktop.png)
- [Tablet — 768](previews/task15a-contact-768.png), [1024](previews/task15a-contact-1024.png)
- [Mobile — 390](previews/task15a-contact-390.png), [320](previews/task15a-contact-320.png)
- [Footer mobile](previews/task15a-footer-mobile.png)
- Vídeo Processo → Contato (gravação preservada no backup local)
- [Verificações funcionais](previews/task15a-validation.json)
- [Regressão dos cases](previews/task15a-protected-regression.json)
- [Dados da gravação](previews/task15a-video-validation.json)

## Arquivos criados/modificados

| Arquivo | Mudança |
| --- | --- |
| `src/app/page.tsx` | Modificado: troca o placeholder por Contato e insere Footer após main. |
| `src/data/contact.ts` | Criado: canais confirmados e suporte opcional ao currículo. |
| `src/components/sections/Contact.tsx` | Criado: composição semântica, canais e verificação do PDF. |
| `src/components/sections/Contact.module.scss` | Criado: composição, responsividade e microinterações. |
| `src/components/sections/ContactAnchor.tsx` | Criado: reaproveita a correção de âncora inicial existente. |
| `src/components/layout/Footer.tsx` | Criado: identidade, ano e retorno ao início. |
| `src/components/layout/Footer.module.scss` | Criado: footer responsivo. |
| `src/components/layout/FooterYear.tsx` | Criado: ano do navegador com fallback de servidor. |
| `public/assets/contact/{whatsapp,linkedin}.svg` | Criados: marcas vetoriais reais. |
| `public/assets/contact/README.md` | Criado: proveniência das marcas. |
| `docs/TASK-15A-CONTACT.md` | Criado: decisões, pendências, proposta de formulário e validação. |
| `docs/previews/task15a-*` | Criados: screenshots, vídeo e resultados da avaliação. |

Os scripts intermediários de avaliação ficam em `.tmp-task15a/`, ignorado pelo Git. O servidor principal de desenvolvimento permanece disponível em `localhost:3000`.
