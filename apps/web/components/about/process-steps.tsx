"use client";

import { Lightbulb, FileText, Code2, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/components/locale-provider";
import type { Profile } from "@/lib/types/profile";

const iconMap: Record<string, typeof Lightbulb> = {
  lightbulb: Lightbulb,
  "file-text": FileText,
  code: Code2,
  rocket: Rocket,
};

const defaultSteps = [
  { icon: "lightbulb", titleKey: "processStep1Title", descKey: "processStep1Description" },
  { icon: "file-text", titleKey: "processStep2Title", descKey: "processStep2Description" },
  { icon: "code", titleKey: "processStep3Title", descKey: "processStep3Description" },
  { icon: "rocket", titleKey: "processStep4Title", descKey: "processStep4Description" },
] as const;

export function ProcessSteps({ profile }: { profile?: Profile | null }) {
  const t = useTranslations("about");
  const { locale } = useLocale();

  const steps = profile?.process?.length
    ? profile.process.map((step) => ({
        icon: iconMap[step.icon] ?? Lightbulb,
        title: step.title[locale],
        description: step.description[locale],
      }))
    : defaultSteps.map((step) => ({
        icon: iconMap[step.icon],
        title: t(step.titleKey),
        description: t(step.descKey),
      }));

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
            {i < steps.length - 1 && (
              <div className="absolute left-[19px] top-10 h-[calc(100%-24px)] w-px bg-border" />
            )}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary">
              <Icon className="size-4 text-primary" />
            </div>
            <div className="pt-1">
              <h3 className="font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
