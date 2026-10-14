import type { Metadata } from "next";
import { ProjectCase } from "@/components/project-case/ProjectCase";
import { ProjectCaseNoScript } from "@/components/project-case/ProjectCaseNoScript";
import { mfCase } from "@/data/projectCase";

export const metadata: Metadata = mfCase.metadata;

export default function MFConsultoriaPage() {
  return <><ProjectCase project={mfCase} /><ProjectCaseNoScript project={mfCase} /></>;
}
