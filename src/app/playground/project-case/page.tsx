import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCasePlayground } from "@/components/three/ProjectCasePlayground";

export const metadata: Metadata = {
  title: "SpaSmooth · Apresentação do projeto | Wesley Caia",
  robots: { index: false, follow: false },
};

export default function ProjectCasePage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ProjectCasePlayground />;
}
