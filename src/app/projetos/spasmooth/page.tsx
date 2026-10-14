import type { Metadata } from "next";
import { ProjectCase } from "@/components/project-case/ProjectCase";
import { ProjectCaseNoScript } from "@/components/project-case/ProjectCaseNoScript";

export const metadata: Metadata = {
  title: "SpaSmooth | Wesley Caiã",
  description: "SpaSmooth: design e desenvolvimento de uma experiência digital de massoterapia, Day Spa e bronzeamento. Explore a interface e conheça o projeto de Wesley Caiã.",
};

export default function SpaSmoothPage() {
  return <><ProjectCase /><ProjectCaseNoScript /></>;
}
