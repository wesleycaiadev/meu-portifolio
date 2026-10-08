export type ProjectTechnology = {
  name: string;
  role: string;
  icon: string;
};

// Stacks and roles supplied by Wesley. No framework versions inferred from a deploy.
export const projectTechnologyStacks = {
  spasmooth: [
    { name: "Next.js", role: "Aplicação web", icon: "nextdotjs" },
    { name: "React", role: "Componentes e interfaces interativas", icon: "react" },
    { name: "TypeScript", role: "Desenvolvimento tipado", icon: "typescript" },
    { name: "Tailwind CSS", role: "Estilização e responsividade", icon: "tailwindcss" },
    { name: "Supabase", role: "Banco de dados e serviços de backend", icon: "supabase" },
    { name: "Clerk", role: "Autenticação e gerenciamento de usuários", icon: "clerk" },
  ],
  "mf-consultoria": [
    { name: "Angular", role: "Framework principal do front-end", icon: "angular" },
    { name: "TypeScript", role: "Desenvolvimento tipado", icon: "typescript" },
    { name: "SCSS", role: "Estilização e responsividade", icon: "sass" },
    { name: "Supabase", role: "Serviços de backend", icon: "supabase" },
    { name: "PostgreSQL", role: "Banco de dados relacional", icon: "postgresql" },
    { name: "Vercel", role: "Hospedagem e deploy", icon: "vercel" },
  ],
} as const satisfies Record<string, readonly ProjectTechnology[]>;
