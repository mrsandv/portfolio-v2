import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { ProjectsPageContent } from "@/components/projects/projects-page-content";

export const metadata: Metadata = {
  title: "Proyectos | Spacehole Tech",
  description:
    "Explora los proyectos en los que he trabajado. Case studies con problemas reales y soluciones técnicas.",
};

export default function ProjectsPage() {
  return <ProjectsPageContent projects={projects} />;
}
