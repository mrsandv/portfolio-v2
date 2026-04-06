"use client";

import { Heart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Snippet } from "@/lib/types/snippet";

export function TopSnippets() {
  const t = useTranslations("topSnippets");
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    fetch("/api/snippets/top")
      .then((res) => (res.ok ? res.json() : []))
      .then(setSnippets)
      .catch(() => {});
  }, []);

  if (snippets.length === 0) return null;

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/snippets"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {t("viewAll")}
          </Link>
        </div>

        <div className="grid gap-3">
          {snippets.map((snippet, i) => (
            <Link
              key={snippet.id}
              href={snippet.category ? `/snippets/${snippet.category}/${snippet.slug}` : `/snippets/${snippet.slug}`}
              className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-sm font-semibold text-muted-foreground">
                {i + 1}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-foreground group-hover:text-primary transition-colors">
                  {snippet.title}
                </h3>
              </div>

              <Badge variant="secondary" className="shrink-0">
                {snippet.language}
              </Badge>

              <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                <Heart className="size-3.5 fill-red-500 text-red-500" />
                {snippet.likes}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
