export type ObjectSurface = {
  src: string;
  width: number;
  height: number;
  label: string;
};

export type ProjectObjectContent = {
  name: string;
  main: ObjectSurface;
  mobile: ObjectSurface;
  detail: ObjectSurface;
};

// Factual screenshots only. Geometry consumes roles rather than project names.
export const spaObjectContent: ProjectObjectContent = {
  name: "SpaSmooth",
  main: { src: "/assets/projects/spasmooth/spasmooth-hero-desktop.png", width: 1905, height: 956, label: "Hero desktop" },
  mobile: { src: "/assets/projects/spasmooth/spasmooth-hero-mobile.png", width: 402, height: 870, label: "Hero mobile" },
  detail: { src: "/assets/projects/spasmooth/spasmooth-localizacao.png", width: 1354, height: 952, label: "Localização" },
};
