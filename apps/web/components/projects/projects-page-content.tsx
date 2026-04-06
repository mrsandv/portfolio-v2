"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/locale-provider";
import type { Project } from "@/lib/types/project";

export function ProjectsPageContent({ projects }: { projects: Project[] }) {
  const t = useTranslations("projectsPage");
  const { locale } = useLocale();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          {t("back")}
        </Link>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h1>
          </div>
          <p className="mt-2 text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/proyectos/${project.slug}`}
              className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:bg-secondary/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {project.featured && (
                    <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Featured
                    </span>
                  )}
                  <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {project.shortDescription[locale]}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="border-border bg-secondary text-muted-foreground"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ArrowRight className="mt-1 size-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
