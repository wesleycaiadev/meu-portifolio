import { spaObjectContent } from "./projectObject";
import { projectTechnologyStacks } from "./projectTechnologies";

export type CaseTab = "about" | "aesthetics" | "features" | "technologies";
export const caseTabs: { id: CaseTab; label: string }[] = [
  { id: "about", label: "Sobre" }, { id: "aesthetics", label: "Estética" },
  { id: "features", label: "Funcionalidades" }, { id: "technologies", label: "Tecnologias" },
];

// Visual descriptions use supplied captures; stack and authorship were confirmed by Wesley.
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
  technologies: projectTechnologyStacks.spasmooth,
  content: {
    about: {
      title: "Sobre o projeto",
      paragraphs: ["O SpaSmooth apresenta serviços de massoterapia, Day Spa e bronzeamento. A interface reúne a apresentação do espaço, informações de localização e chamadas para agendamento, com uma experiência adaptada para desktop e mobile.",
        "Concebi o projeto desde a ideia inicial e fui responsável pelo design, pelo desenvolvimento, pelas integrações e pela publicação."],
      items: [],
    },
    aesthetics: {
      title: "Sistema visual",
      paragraphs: ["Uma linguagem visual que aproxima o visitante do espaço e organiza a descoberta dos serviços. Cor, tipografia, imagens e hierarquia trabalham juntas em desktop e mobile."],
      principles: [
        { label: "Paleta", description: "Fundos claros criam respiro. Os azuis marcam a identidade e orientam a leitura; as chamadas de agendamento recebem contraste próprio." },
        { label: "Tipografia", description: "Títulos serifados, com ênfases em itálico, contrastam com textos de apoio mais simples. A escala distingue apresentação, serviços e informação prática." },
        { label: "Imagem e composição", description: "Fotografias apresentam o ambiente. Espaços entre blocos e agrupamentos de conteúdo conduzem dos serviços à localização e às dúvidas." },
        { label: "Responsividade", description: "No mobile, texto e fotografia seguem uma leitura vertical, com navegação própria e destinos de agendamento visíveis." },
      ],
      items: [],
    },
    features: {
      title: "Funcionalidades",
      paragraphs: [],
      items: ["Apresentação de serviços", "Menu mobile expandido", "Localização, mapa e contato", "Perguntas frequentes", "Chamadas para agendamento"],
    },
    technologies: {
      title: "Tecnologias",
      paragraphs: [],
      items: [],
    },
  },
} as const;
