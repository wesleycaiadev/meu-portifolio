import { spaObjectContent } from "./projectObject";

export type CaseTab = "about" | "aesthetics" | "features" | "technologies";
export const caseTabs: { id: CaseTab; label: string }[] = [
  { id: "about", label: "Sobre" }, { id: "aesthetics", label: "Estética" },
  { id: "features", label: "Funcionalidades" }, { id: "technologies", label: "Tecnologias" },
];

// These statements describe only the supplied screenshots, not backend behaviour.
export const spaCase = {
  name: "SpaSmooth",
  category: "Website · Bem-estar",
  description: "Uma apresentação digital de massoterapia, Day Spa e bronzeamento.",
  summary: "Serviços, localização e chamadas para agendamento, em uma interface com versões desktop e mobile.",
  captures: [
    { ...spaObjectContent.main, label: "Apresentação" },
    { ...spaObjectContent.detail, label: "Localização" },
    { src: "/assets/projects/spasmooth/spasmooth-faq-footer.png", width: 1344, height: 955, label: "Perguntas frequentes" },
  ],
  mobile: spaObjectContent.mobile,
  content: {
    about: {
      title: "Sobre o projeto",
      paragraphs: ["O SpaSmooth apresenta serviços de massoterapia, Day Spa e bronzeamento. A interface reúne a apresentação do espaço, informações de localização e chamadas para agendamento.",
        "As capturas mostram a organização do conteúdo em desktop e mobile, com uma navegação expandida na versão mobile."],
      items: [],
      note: "Participação de Wesley Caia: escopo de design, desenvolvimento e publicação ainda pendente de confirmação.",
    },
    aesthetics: {
      title: "Estética e composição",
      paragraphs: ["A interface combina fundos claros, tons de azul e fotografias do espaço. Títulos serifados e trechos em itálico criam contraste com os textos de apoio.",
        "Na versão mobile, a imagem e os textos se reorganizam para uma leitura vertical, mantendo a identidade visual apresentada no desktop."],
      items: [], note: "Descrição visual baseada nas capturas fornecidas.",
    },
    features: {
      title: "O que a interface apresenta",
      paragraphs: [],
      items: ["Apresentação de serviços", "Menu mobile expandido", "Localização, mapa e contato", "Perguntas frequentes", "Chamadas para agendamento"],
      note: "Esses elementos aparecem nas capturas. O funcionamento de agendamento e integrações não foi validado.",
    },
    technologies: {
      title: "Tecnologias e participação",
      paragraphs: ["A stack do SpaSmooth ainda não foi confirmada. Linguagens, framework, backend e serviços externos serão identificados a partir das informações do projeto.",
        "Também falta confirmar o escopo da participação de Wesley Caia em design, desenvolvimento, integrações e publicação."],
      items: [], note: "Informações pendentes. A stack deste portfólio não foi atribuída ao SpaSmooth.",
    },
  },
} as const;
