export const navigation = [
  { label: "Projetos", href: "#projetos" },
  { label: "Expertise", href: "#expertise" },
  { label: "Processo", href: "#processo" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
] as const;

export const projects = [
  {
    name: "SpaSmooth",
    description:
      "Uma experiência digital criada para apresentar serviços, fortalecer a marca e transformar descoberta em agendamento.",
    image: "/images/spasmooth.png",
    imageAlt: "Página inicial real do projeto SpaSmooth, com tipografia azul e ambiente de spa",
    technologies: ["Next.js", "TypeScript", "SEO", "Product"],
  },
  {
    name: "MF Consultoria Automotiva",
    description:
      "Curadoria automotiva, showroom e gestão reunidos em uma experiência digital premium.",
    image: "/images/mf-consultoria.png",
    imageAlt: "Página inicial real da MF Consultoria Automotiva, com apresentação editorial e retrato do consultor",
    technologies: ["Angular", "TypeScript", "Supabase", "PostgreSQL"],
  },
] as const;

export const expertise = [
  { category: "Front-end", skills: ["Angular", "TypeScript", "JavaScript", "React", "Next.js", "HTML", "SCSS / CSS"] },
  { category: "Design & Product", skills: ["Figma", "Canva", "UI/UX", "Prototyping", "Design Systems"] },
  { category: "Backend & Data", skills: ["Supabase", "PostgreSQL", "SQLite", "APIs", "Authentication"] },
  { category: "Engineering", skills: ["Git", "GitHub", "Docker", "CI/CD", "Jest", "Storybook", "Architecture", "Performance", "SEO"] },
  { category: "Motion", skills: ["GSAP", "Three.js", "Scroll Experiences", "Microinteractions"] },
] as const;

export const processSteps = [
  { number: "01", title: "Entender", description: "Escutar, pesquisar e compreender o problema antes de desenhar a solução." },
  { number: "02", title: "Estruturar", description: "Organizar a informação e definir os caminhos da experiência." },
  { number: "03", title: "Projetar", description: "Traduzir ideias em interfaces claras, úteis e consistentes." },
  { number: "04", title: "Construir", description: "Desenvolver com atenção ao detalhe, desempenho e manutenção." },
  { number: "05", title: "Refinar", description: "Testar, ajustar e lapidar o que pode funcionar melhor." },
  { number: "06", title: "Entregar", description: "Colocar a experiência no mundo com qualidade e cuidado." },
] as const;

export const contact = {
  email: "wesleycaia.dev@gmail.com",
  whatsapp: "5579998356598",
  linkedin: "https://www.linkedin.com/in/wesley-caia-dev/",
  // Placeholder: adicionar o PDF em public e trocar pelo caminho, por exemplo "/curriculo-wesley-caia.pdf".
  resume: "",
} as const;
