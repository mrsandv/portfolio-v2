"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Code2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { SnippetCard } from "@/components/snippets/snippet-card";
import type { Snippet } from "@/lib/types/snippet";

export function SnippetsPageContent({
  snippets,
  categories,
}: {
  snippets: Snippet[];
  categories: string[];
}) {
  const t = useTranslations("snippetsPage");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? snippets.filter((s) => s.category === activeCategory)
    : snippets;

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("description")}</p>
        </div>

        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("allCategories")}
            </button>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/snippets/${cat}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCategory(activeCategory === cat ? null : cat);
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Code2 className="size-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
