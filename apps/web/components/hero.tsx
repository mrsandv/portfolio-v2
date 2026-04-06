"use client";

import { ArrowRight, Briefcase, Code2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function Hero({ staticLinks }: { staticLinks: Record<string, string> }) {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.25 290 / 0.3), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {t("status")}
          </span>
        </div>

        <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {t.rich("title", {
            highlight: (chunks) => (
              <span className="text-primary">{chunks}</span>
            ),
          })}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {t("description")}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <a target="_blank" href={staticLinks.linkedIn}>
              <Briefcase className="mr-2 h-4 w-4" />
              {t("hireMe")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-border text-foreground hover:bg-secondary"
            asChild
          >
            <a href="#projects">
              <Code2 className="mr-2 h-4 w-4" />
              {t("browseProjects")}
            </a>
          </Button>
        </div>

        <div className="mx-auto mt-12 max-w-md rounded-lg border border-border bg-secondary p-4 font-mono text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-primary">$</span>
            <span className="text-foreground">whoami</span>
          </div>
          <div className="mt-2 text-muted-foreground text-left ml-4">
            {t("terminal.stack")}
          </div>
          <div className="text-muted-foreground text-left ml-4">
            {t("terminal.experience")}
          </div>
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <span className="text-primary">$</span>
            <span className="animate-caret-blink text-primary">_</span>
          </div>
        </div>
      </div>
    </section>
  );
}
