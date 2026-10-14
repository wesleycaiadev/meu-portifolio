import { ProjectCase } from "@/components/project-case/ProjectCase";
import { spaCase } from "@/data/projectCase";

export function ProjectCasePlayground() {
  return <ProjectCase project={spaCase} preview />;
}
