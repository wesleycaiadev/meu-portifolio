import { spaObjectContent } from "./projectObject";
import { projectTechnologyStacks } from "./projectTechnologies";
import type { ProjectTechnology } from "./projectTechnologies";
import type { ObjectSurface } from "./projectObject";
import type { ProjectId } from "./projects";

export type CaseTab = "about" | "aesthetics" | "features" | "technologies";
export const caseTabs: { id: CaseTab; label: string }[] = [
  { id: "about", label: "Sobre" }, { id: "aesthetics", label: "Estética" },
  { id: "features", label: "Funcionalidades" }, { id: "technologies", label: "Tecnologias" },
];

type CaseContent = {
  title: string;
  paragraphs: readonly string[];
  items: readonly string[];
  principles?: readonly { label: string; description: string }[];
};

export type ProjectCaseData = {
  slug: ProjectId;
  path: `/projetos/${ProjectId}`;
  name: string;
  category: string;
  description: string;
  summary: string;
  participation: string;
  metadata: { title: string; description: string };
  links: readonly { label: string; href: string }[];
  captures: readonly ObjectSurface[];
  mobile: ObjectSurface;
  screenFit: "scroll" | "contain";
  simulationNote: string;
  technologies: readonly ProjectTechnology[];
  content: Record<CaseTab, CaseContent>;
};

// Visual descriptions use supplied captures; stack and authorship were confirmed by Wesley.
export const spaCase = {
  slug: "spasmooth",
  path: "/projetos/spasmooth",
  name: "SpaSmooth",
  category: "Website · Bem-estar",
  description: "Uma apresentação digital de massoterapia, Day Spa e bronzeamento.",
  summary: "Serviços, localização e chamadas para agendamento, em uma interface com versões desktop e mobile.",
  participation: "Concebi o projeto desde a ideia inicial e fui responsável pelo design, pelo desenvolvimento, pelas integrações e pela publicação.",
  metadata: {
    title: "SpaSmooth | Wesley Caiã",
    description: "SpaSmooth: design e desenvolvimento de uma experiência digital de massoterapia, Day Spa e bronzeamento. Explore a interface e conheça o projeto de Wesley Caiã.",
  },
  links: [],
  screenFit: "scroll",
  simulationNote: "Prévia visual em capturas. Apresentação, localização e dúvidas frequentes.",
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
      paragraphs: ["O SpaSmooth apresenta serviços de massoterapia, Day Spa e bronzeamento. A interface reúne a apresentação do espaço, informações de localização e chamadas para agendamento, com uma experiência adaptada para desktop e mobile."],
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
} as const satisfies ProjectCaseData;

// Stack recorded in PROJECT-CASE-NOTEBOOK.md; complete authorship confirmed by Wesley.
// No public deployment URL was provided, so no external destination is invented.
export const mfCase = {
  slug: "mf-consultoria",
  path: "/projetos/mf-consultoria",
  name: "MF Consultoria",
  category: "Website · Curadoria automotiva",
  description: "Uma experiência de curadoria automotiva para compreender a escolha do próximo veículo.",
  summary: "Apresentação da curadoria, processo de escolha e chamadas para contato, em uma interface editorial com versões desktop e mobile.",
  participation: "Concebi o projeto e fui responsável pelo design, pelo desenvolvimento, pelas integrações e pela publicação.",
  metadata: {
    title: "MF Consultoria | Wesley Caiã",
    description: "MF Consultoria: design e desenvolvimento de uma experiência digital de curadoria automotiva. Explore as capturas e conheça o projeto de Wesley Caiã.",
  },
  links: [],
  screenFit: "contain",
  simulationNote: "Simulação visual em capturas de seções distintas: apresentação, curadoria e contato. Não é uma reprodução integral do site.",
  captures: [
    { src: "/assets/projects/mf-consultoria/mf-consultoria-hero-desktop.png", width: 1345, height: 947, label: "Apresentação da curadoria automotiva" },
    { src: "/assets/projects/mf-consultoria/mf-consultoria-curadoria-processo.png", width: 1341, height: 568, label: "Processo: perfil, curadoria, validação e negociação" },
    { src: "/assets/projects/mf-consultoria/mf-consultoria-cta-footer.png", width: 1347, height: 766, label: "Chamada para contato e rodapé" },
  ],
  mobile: { src: "/assets/projects/mf-consultoria/mf-consultoria-hero-mobile.png", width: 396, height: 869, label: "Apresentação mobile" },
  technologies: projectTechnologyStacks["mf-consultoria"],
  content: {
    about: {
      title: "Sobre o projeto",
      paragraphs: ["A MF Consultoria apresenta uma proposta de curadoria automotiva: ajudar o visitante a compreender o processo de encontrar, avaliar e escolher um veículo a partir de sua rotina e prioridades. A interface organiza a apresentação do serviço, as etapas da escolha e os caminhos para iniciar uma conversa."],
      items: [],
    },
    aesthetics: {
      title: "Sistema visual",
      paragraphs: ["Uma composição editorial que combina títulos expressivos, imagens e informação prática. Os contrastes entre blocos claros e escuros organizam a leitura da proposta até o contato."],
      principles: [
        { label: "Paleta e contraste", description: "Fundos claros dão espaço à apresentação. Blocos escuros destacam a curadoria; acentos quentes marcam categorias e etapas do processo." },
        { label: "Tipografia e hierarquia", description: "Títulos serifados, com passagens em itálico, contrastam com textos de apoio e navegação mais simples. A escala distingue proposta, etapas e chamadas para ação." },
        { label: "Imagem e composição", description: "O retrato aproxima o visitante do consultor. Linhas finas, alinhamentos e agrupamentos separam as informações sem depender de uma sequência de cards." },
        { label: "Adaptação mobile", description: "No mobile, o retrato ocupa o fundo da apresentação, com texto e chamadas sobrepostos. A navegação é compacta e a descoberta segue uma leitura vertical." },
      ],
      items: [],
    },
    features: {
      title: "Funcionalidades",
      paragraphs: [],
      items: ["Navegação com destinos para Curadoria, Showroom, Entregas e Sobre", "Apresentação do serviço de curadoria automotiva", "Processo de escolha: perfil, curadoria, validação e negociação", "Chamadas para iniciar contato com o consultor", "Apresentação adaptada para desktop e mobile"],
    },
    technologies: { title: "Tecnologias", paragraphs: [], items: [] },
  },
} as const satisfies ProjectCaseData;
