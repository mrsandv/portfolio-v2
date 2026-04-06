"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/locale-provider";
import type { Project } from "@/lib/types/project";

export function CaseStudyContent({ project }: { project: Project }) {
  const t = useTranslations("projectsPage");
  const { locale } = useLocale();

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          {t("backToProjects")}
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {project.shortDescription[locale]}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              {t("visitSite")}
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            {t("problem")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {project.problem[locale]}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            {t("solution")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {project.solution[locale]}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            {t("techStack")}
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            {t("results")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {project.results[locale]}
          </p>
        </section>

        {project.testimonial && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              {t("testimonial")}
            </h2>
            <blockquote className="rounded-xl border border-border bg-secondary/50 p-6">
              <Quote className="mb-3 size-5 text-primary" />
              <p className="text-foreground italic leading-relaxed">
                &ldquo;{project.testimonial.quote[locale]}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-muted-foreground">
                <strong className="text-foreground">
                  {project.testimonial.author}
                </strong>
                {" — "}
                {project.testimonial.role}
              </footer>
            </blockquote>
          </section>
        )}
      </article>
    </main>
  );
}
