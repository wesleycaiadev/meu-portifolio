# Revisão de conceito da TASK 09

Status: protótipo anterior rejeitado visualmente por Wesley. Nova direção proposta, ainda sem implementação.
Checkpoint anterior à revisão: `f5abce7`.

## Diagnóstico

A construção atual apresenta uma máquina de telas. Nervuras, pinos, abas e molduras metálicas dominam a leitura e não possuem uma relação clara com o SpaSmooth. O objeto demonstra articulação, mas não explica o projeto.

O texto do playground amplia o problema: o título e a coluna lateral descrevem hardware, superfícies e estrutura. Esses dados pertencem à documentação técnica. A apresentação precisa mostrar o nome do projeto, seu contexto, suas telas e as tecnologias efetivamente utilizadas.

Os controles de desenvolvimento podem continuar existindo, separados da apresentação. Eles não devem ocupar o lugar do conteúdo do case.

## Direção proposta: abrir o projeto

O visitante começa reconhecendo o preview do SpaSmooth. A transformação espacial abre esse conteúdo e revela partes do mesmo trabalho: interface desktop, versão mobile e detalhes da experiência. A ação tem um significado legível: explorar o que foi construído.

A geometria deverá nascer da composição dessas superfícies como um conjunto editorial dobrável, com profundidade e continuidade próprias. Dobras e relações diagonais podem usar a linguagem da WC. Não é necessário adicionar pinos, trilhos, abas vazias ou aparência de equipamento para comunicar tridimensionalidade.

O nome, o contexto e a stack ficam em HTML semântico legível, associados ao conjunto visual. Não devem desaparecer atrás da geometria nem ficar disponíveis apenas após drag. A narrativa permanece compreensível com movimento reduzido.

Esta é uma proposta para revisão, não uma decisão final sobre o formato do objeto.

## Sequência a estudar

1. Identificação: SpaSmooth, contexto curto e preview desktop dominante.
2. Exploração: abertura controlada expõe a versão mobile, preservando a ligação com o preview inicial.
3. Detalhe: localização ou navegação mostra uma parte real da interface, com descrição factual breve.
4. Leitura: composição chega a uma pose estável em que imagem e informações podem ser lidas.
5. Retorno: o conjunto recompõe o preview, sem rotação infinita.

No playground, os estados podem ser inspecionados por controles. A futura integração ao scroll da home continua fora desta revisão.

## Conteúdo confirmado e pendências

Nome confirmado: **SpaSmooth**.
Descrição de contexto sustentada pelas capturas: **Site de massoterapia, Day Spa e bronzeamento.**

As capturas fornecem evidências visuais de versão desktop, mobile, menu, localização e FAQ. Elas não comprovam a tecnologia usada na implementação, autoria de cada etapa, métricas de resultado ou funcionamento de integrações.

Pendência: Wesley confirmar a stack do SpaSmooth. Não transferir automaticamente Next.js, Three.js ou GSAP do portfólio para a ficha desse projeto.

Também continuam pendentes descrição factual mais completa, papel de Wesley e URLs de código/site, caso sejam exibidos. Não são bloqueios para discutir a geometria, mas precisam de confirmação antes de serem publicados como fatos.

## Critérios para a próxima prévia

- Reconhecer o SpaSmooth antes de perceber o efeito.
- Entender o que a transformação revela, sem explicações sobre hardware.
- Mostrar nome e contexto com boa leitura; stack somente após confirmação.
- A geometria precisa conservar interesse espacial sem telas montadas em uma máquina.
- Screenshots reais, sem deformação ou cortes que escondam conteúdo importante.
- Poucos estados claros e tempo de leitura em repouso.
- Teclado, touch e fallback estático preservam a informação.
- Home e partes já aprovadas continuam intactas.

Nenhum código foi alterado nesta revisão. A reconstrução depende da definição da direção conceitual apresentada ao usuário.
