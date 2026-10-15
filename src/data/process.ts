export const processSteps = [
  {
    id: "understand", number: "01", title: "Entender",
    description: "Compreender o contexto, o objetivo e o que a experiência precisa comunicar.",
    visualDescription: "Linhas orientadoras e fragmentos de conteúdo delimitam as primeiras possibilidades.",
  },
  {
    id: "structure", number: "02", title: "Estruturar",
    description: "Organizar conteúdo, navegação e hierarquia das interfaces.",
    visualDescription: "Os fragmentos se alinham em um grid: navegação, título, conteúdo e área visual encontram seu lugar.",
  },
  {
    id: "build", number: "03", title: "Construir",
    description: "Transformar a direção visual em interfaces funcionais, responsivas e coerentes.",
    visualDescription: "O wireframe recebe tipografia, superfícies e contraste. A estrutura se torna uma interface.",
  },
  {
    id: "refine", number: "04", title: "Refinar",
    description: "Ajustar comportamento, movimento, detalhes visuais e experiência de uso.",
    visualDescription: "Alinhamentos, espaçamentos e detalhes da identidade completam a mesma composição.",
  },
] as const;

export type ProcessState = (typeof processSteps)[number]["id"];
