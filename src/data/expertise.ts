import { projectTechnologyStacks } from "./projectTechnologies";
import { selectedProjects } from "./projects";

export type ExpertiseTechnology = {
  icon: string;
  name: string;
  description: string;
  color?: string;
  multicolor?: boolean;
};

export const expertiseGroups = [
  {
    id: "interfaces", title: "Interfaces e aplicações",
    technologies: [
      { icon: "react", name: "React", description: "Componentes reutilizáveis para organizar interfaces e seus estados de interação." },
      { icon: "nextdotjs", name: "Next.js", description: "Estrutura de aplicações web, com rotas, renderização e integração de conteúdo." },
      { icon: "angular", name: "Angular", description: "Organização de aplicações em componentes, com navegação e lógica de interface." },
      { icon: "typescript", name: "TypeScript", description: "Tipos explícitos para dar consistência aos dados e ao desenvolvimento da aplicação." },
      { icon: "javascript", name: "JavaScript", description: "Linguagem para escrever lógica, comportamento e configurações para a web." },
      { icon: "html5", name: "HTML", description: "Estrutura semântica para organizar o conteúdo e tornar as interfaces acessíveis." },
    ],
  },
  {
    id: "styles", title: "Estilos e apresentação",
    technologies: [
      { icon: "sass", name: "SCSS", description: "Estilos organizados em módulos, com variáveis, composição e regras responsivas." },
      { icon: "tailwindcss", name: "Tailwind CSS", description: "Classes utilitárias para compor o visual e adaptar as interfaces a diferentes telas." },
      { icon: "css", name: "CSS", description: "Tipografia, grid, proporções e estados visuais que dão forma à interface." },
    ],
  },
  {
    id: "data", title: "Dados e serviços",
    technologies: [
      { icon: "supabase", name: "Supabase", description: "Serviços de backend para conectar a interface aos dados da aplicação." },
      { icon: "postgresql", name: "PostgreSQL", description: "Organização de dados relacionais e consultas SQL para acessar informações estruturadas." },
      { icon: "clerk", name: "Clerk", description: "Autenticação e gerenciamento de usuários, conforme a implementação do SpaSmooth." },
      { icon: "vercel", name: "Vercel", description: "Hospedagem e publicação da aplicação, conforme a stack confirmada da MF Consultoria." },
    ],
  },
  {
    id: "motion", title: "Movimento e experiências",
    technologies: [
      { icon: "gsap", name: "GSAP", description: "Animações por scroll, deslocamentos em parallax e transições de interface." },
      { icon: "threedotjs", name: "Three.js", description: "Cenas WebGL para a identidade interativa e a exploração dos notebooks dos projetos." },
    ],
  },
  {
    id: "design", title: "Design e desenvolvimento",
    technologies: [
      { icon: "figma", name: "Figma", description: "Composição de interfaces e protótipos para explorar hierarquia, proporções e direção visual.", multicolor: true },
    ],
  },
] as const satisfies readonly { id: string; title: string; technologies: readonly ExpertiseTechnology[] }[];

export const expertiseTechnologies: readonly ExpertiseTechnology[] = expertiseGroups.flatMap(group => [...group.technologies]);

// A working approach, not a vendor badge or a claim of AI model specialization.
export const aiDevelopmentApproach = {
  title: "IA aplicada ao desenvolvimento",
  description: "Uso IA como apoio para analisar problemas, estruturar soluções e revisar código. As decisões técnicas e a validação continuam sob minha responsabilidade.",
} as const;

// Repository evidence: package.json, src/**/*.tsx, src/**/*.scss and eslint.config.mjs.
// Case associations come only from the stacks confirmed by Wesley, not framework inference.
const portfolioTechnologyIcons = new Set(["react", "nextdotjs", "typescript", "javascript", "html5", "sass", "css", "gsap", "threedotjs"]);

// Simple Icons color metadata, with the red Angular treatment requested by Wesley.
// Black marks use white on this dark surface. Figma retains its original five fills.
export const technologyColors: Readonly<Record<string, string>> = {
  react: "#61DAFB", nextdotjs: "#F4F2ED", angular: "#DD0031", typescript: "#3178C6",
  javascript: "#F7DF1E", html5: "#E34F26", sass: "#CC6699", tailwindcss: "#06B6D4",
  css: "#663399", supabase: "#3FCF8E", postgresql: "#4169E1", gsap: "#0AE448", threedotjs: "#F4F2ED",
  clerk: "#6C47FF", vercel: "#F4F2ED",
};

export function technologyProjects(icon: string) {
  const cases: { label: string; href: string }[] = selectedProjects
    .filter(project => projectTechnologyStacks[project.id].some(technology => technology.icon === icon))
    .map(project => ({ label: project.title, href: project.casePath }));
  if (portfolioTechnologyIcons.has(icon)) cases.push({ label: "Este portfólio", href: "#conteudo" });
  return cases;
}
