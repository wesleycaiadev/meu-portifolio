import { ProjectCase } from "@/components/project-case/ProjectCase";
import { ProjectCaseNoScript } from "@/components/project-case/ProjectCaseNoScript";
import { mfCase } from "@/data/projectCase";
import { portfolioMetadata } from "@/lib/siteMetadata";

export const metadata = portfolioMetadata(mfCase.metadata.title, mfCase.metadata.description, mfCase.path, mfCase.captures[0].src);

export default async function MFConsultoriaPage({ searchParams }: PageProps<"/projetos/mf-consultoria">) {
  const preview = process.env.NODE_ENV === "development" && (await searchParams).motion === "preview";
  return <><ProjectCase key={preview ? "preview" : "standard"} project={mfCase} preview={preview} initialMotionPreview={preview} /><ProjectCaseNoScript project={mfCase} /></>;
}
