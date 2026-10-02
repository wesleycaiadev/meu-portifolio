// Only supplied screenshots and confirmed project names belong in this index.
export const selectedProjects = [
  {
    id: "spasmooth", index: "01", title: "SpaSmooth",
    alt: "Página inicial do SpaSmooth, com serviços de spa e uma sala de tratamento.",
    preview: {
      desktop: { src: "/assets/projects/spasmooth/spasmooth-hero-desktop.png", width: 1905, height: 956 },
      mobile: { src: "/assets/projects/spasmooth/spasmooth-hero-mobile.png", width: 402, height: 870 },
    },
  },
  {
    id: "mf-consultoria", index: "02", title: "MF Consultoria",
    alt: "Página inicial da MF Consultoria, com apresentação da curadoria automotiva e um retrato.",
    preview: {
      desktop: { src: "/assets/projects/mf-consultoria/mf-consultoria-hero-desktop.png", width: 1345, height: 947 },
      mobile: { src: "/assets/projects/mf-consultoria/mf-consultoria-hero-mobile.png", width: 396, height: 869 },
    },
  },
] as const;

export type Project = (typeof selectedProjects)[number];
export type ProjectId = Project["id"];

// Reserve the taller desktop ratio so switching never moves surrounding content.
export const sharedPreviewAspect = Math.min(...selectedProjects.map(project =>
  project.preview.desktop.width / project.preview.desktop.height));
