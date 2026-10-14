import type { Metadata } from "next";
import { ProjectCase } from "@/components/project-case/ProjectCase";
import { ProjectCaseNoScript } from "@/components/project-case/ProjectCaseNoScript";
import { spaCase } from "@/data/projectCase";

export const metadata: Metadata = spaCase.metadata;

export default function SpaSmoothPage() {
  return <><ProjectCase project={spaCase} /><ProjectCaseNoScript project={spaCase} /></>;
}
