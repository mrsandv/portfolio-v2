import type { Project } from "@/lib/types/project";

import antojo from "@/content/projects/antojo.json";
import lunaDeMiel from "@/content/projects/luna-de-miel.json";
import palChesco from "@/content/projects/pal-chesco.json";

export const projects: Project[] = [antojo, lunaDeMiel, palChesco];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
