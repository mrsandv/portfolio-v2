"use client";

import Link from "next/link";
import { ArrowLeft, Code2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { SnippetCard } from "@/components/snippets/snippet-card";
import type { Snippet } from "@/lib/types/snippet";

export function CategoryPageContent({
  category,
  snippets,
}: {
  category: string;
  snippets: Snippet[];
}) {
  const t = useTranslations("snippetsPage");
  const label = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-16">
        <Link
          href="/snippets"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          {t("backToSnippets")}
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("categoryTitle", { category: label })}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("categoryDescription", { category: label })}
          </p>
        </div>

        {snippets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Code2 className="size-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
