import { ProjectCase } from "@/components/project-case/ProjectCase";
import { ProjectCaseNoScript } from "@/components/project-case/ProjectCaseNoScript";
import { spaCase } from "@/data/projectCase";
import { portfolioMetadata } from "@/lib/siteMetadata";

export const metadata = portfolioMetadata(spaCase.metadata.title, spaCase.metadata.description, spaCase.path, spaCase.captures[0].src);

export default async function SpaSmoothPage({ searchParams }: PageProps<"/projetos/spasmooth">) {
  const preview = process.env.NODE_ENV === "development" && (await searchParams).motion === "preview";
  return <><ProjectCase key={preview ? "preview" : "standard"} project={spaCase} preview={preview} /><ProjectCaseNoScript project={spaCase} /></>;
}
