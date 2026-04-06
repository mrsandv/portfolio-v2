"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    title: "Antojo",
    slug: "antojo",
    descriptionKey: "antojo.description" as const,
    tags: ["React", "Tailwind", "Sockets", "MongoDB", "Go"],
    featured: true,
  },
  {
    title: "Luna de Miel salon SPA",
    slug: "luna-de-miel",
    descriptionKey: "lunaDeMiel.description" as const,
    tags: ["React", "Tailwind", "MongoDB", "Go"],
    featured: false,
  },
  {
    title: "Pal' chesco",
    slug: "pal-chesco",
    descriptionKey: "palChesco.description" as const,
    tags: ["Go"],
    featured: false,
  },
];

export function BentoPortfolio() {
  const t = useTranslations("projects");

  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-3">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {t("sectionTitle")}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <Link
              key={project.title}
              href={`/proyectos/${project.slug}`}
              className={`group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:bg-secondary/50 ${
                project.featured && index === 0 ? "md:col-span-2" : ""
              }`}
            >
              {project.featured && (
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {t("inProgress")}
                </span>
              )}

              <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {t(project.descriptionKey)}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="border-border bg-secondary text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
