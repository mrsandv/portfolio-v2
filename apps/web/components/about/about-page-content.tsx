"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, GraduationCap, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/components/locale-provider";
import { ProcessSteps } from "@/components/about/process-steps";
import type { Profile } from "@/lib/types/profile";

export function AboutPageContent({ profile }: { profile: Profile | null }) {
  const t = useTranslations("about");
  const { locale } = useLocale();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Home
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {profile?.location?.[locale] ?? t("location")}
          </div>
        </header>

        <section className="mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {profile?.bio?.[locale] ?? t("bio")}
          </p>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {profile?.bioPersonal?.[locale] ?? t("bioPersonal")}
          </p>
        </section>

        {/* Skills as tags sorted by relevance */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">
            {t("skillsTitle")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(profile?.skills ?? defaultSkills)
              .sort((a, b) => b.relevance - a.relevance)
              .map((skill) => (
                <span
                  key={skill.name}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    skill.relevance >= 8
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : skill.relevance >= 5
                        ? "bg-secondary text-foreground border border-border"
                        : "bg-secondary/50 text-muted-foreground border border-border/50"
                  }`}
                >
                  {skill.name}
                </span>
              ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">
            {t("processTitle")}
          </h2>
          <ProcessSteps profile={profile} />
        </section>

        {/* Experience - simplified: role, company, period */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">
            {t("experienceTitle")}
          </h2>
          <div className="space-y-0">
            {(profile?.experience ?? defaultExperience).map((job, i, arr) => (
              <div key={`${job.company}-${job.period}`} className="relative flex gap-4 pb-6 last:pb-0">
                {i < arr.length - 1 && (
                  <div className="absolute left-[7px] top-[18px] h-[calc(100%-6px)] w-px bg-border" />
                )}
                <div className="mt-1.5 size-4 shrink-0 rounded-full border-2 border-primary bg-background" />
                <div>
                  <h3 className="font-semibold text-foreground">{job.role}</h3>
                  <p className="text-sm text-primary">{job.company}</p>
                  <p className="text-xs text-muted-foreground">{job.period}</p>
                  {/* SEO: hidden details */}
                  {job.details?.[locale] && (
                    <p className="sr-only">{job.details[locale]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Languages - simple list */}
        <section className="mb-12 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <GraduationCap className="size-5 text-primary" />
              {t("educationTitle")}
            </h2>
            <div className="space-y-3">
              {(profile?.education ?? defaultEducation).map((edu) => (
                <div key={edu.school}>
                  <p className="font-medium text-foreground">{edu.degree[locale]}</p>
                  <p className="text-sm text-muted-foreground">{edu.school} · {edu.period}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Globe className="size-5 text-primary" />
              {t("languagesTitle")}
            </h2>
            <div className="space-y-2">
              {(profile?.languages ?? [t("spanish"), t("english")]).map((lang) => (
                <p key={lang} className="text-muted-foreground">{lang}</p>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// Fallback data when API is not available
const defaultSkills = [
  { name: "Go", relevance: 10 },
  { name: "TypeScript", relevance: 10 },
  { name: "React", relevance: 9 },
  { name: "Next.js", relevance: 9 },
  { name: "Node.js", relevance: 8 },
  { name: "PostgreSQL", relevance: 8 },
  { name: "MongoDB", relevance: 8 },
  { name: "Docker", relevance: 8 },
  { name: "REST APIs", relevance: 9 },
  { name: "Microservices", relevance: 8 },
  { name: "AWS", relevance: 7 },
  { name: "GCP", relevance: 7 },
  { name: "CI/CD", relevance: 7 },
  { name: "Redis", relevance: 6 },
  { name: "React Native", relevance: 6 },
  { name: "Tailwind CSS", relevance: 7 },
  { name: "Claude Code", relevance: 7 },
  { name: "Cursor", relevance: 6 },
  { name: "Python", relevance: 5 },
  { name: "SQL", relevance: 7 },
  { name: "Linux", relevance: 6 },
  { name: "Git", relevance: 8 },
  { name: "Svelte", relevance: 4 },
  { name: "Bash", relevance: 5 },
];

const defaultExperience = [
  { role: "Sr. Software Engineer", company: "Commando Studio", period: "Dec 2025 — Present", details: { es: "", en: "" } },
  { role: "Web Tech Lead", company: "Flink / Webull MX", period: "Jan 2020 — Jul 2025", details: { es: "", en: "" } },
  { role: "Frontend Developer", company: "Forward Company", period: "Nov 2018 — Jan 2020", details: { es: "", en: "" } },
  { role: "Technology Consultant", company: "Spanish Training Academy", period: "Nov 2018 — Jan 2020", details: { es: "", en: "" } },
];

const defaultEducation = [
  { degree: { es: "Ingeniería en Software y Redes", en: "Software and Networks Engineer" }, school: "UVM", period: "2023 — present" },
  { degree: { es: "Licenciatura en Física", en: "Physics BS" }, school: "UNAM", period: "2009 — 2015" },
];
