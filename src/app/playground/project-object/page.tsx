import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectObjectPlayground } from "@/components/three/ProjectObjectPlayground";

export const metadata: Metadata = {
  title: "Protótipo do objeto de projeto | Wesley Caia",
  robots: { index: false, follow: false },
};

export default function ProjectObjectPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ProjectObjectPlayground />;
}
