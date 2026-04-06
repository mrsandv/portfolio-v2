"use client";

import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import Markdown from "react-markdown";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/snippets/code-block";
import { LikeButton } from "@/components/snippets/like-button";
import { ShareButtons } from "@/components/snippets/share-buttons";
import { useLocale } from "@/components/locale-provider";
import type { Snippet } from "@/lib/types/snippet";

export function SnippetDetailContent({ snippet }: { snippet: Snippet }) {
  const t = useTranslations("snippetsPage");
  const { locale } = useLocale();

  const date = new Date(snippet.createdAt).toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-4xl px-6 pt-28 pb-16">
        <Link
          href="/snippets"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          {t("allSnippets")}
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {snippet.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{snippet.language}</Badge>
            {snippet.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {date}
            </span>
          </div>
        </header>

        {snippet.description && (
          <div className="prose-snippet mb-8">
            <Markdown>{snippet.description}</Markdown>
          </div>
        )}

        <CodeBlock code={snippet.code} language={snippet.language} />

        <div className="mt-8 flex items-center justify-between">
          <LikeButton slug={snippet.slug} initialLikes={snippet.likes ?? 0} />
          <ShareButtons title={snippet.title} slug={snippet.slug} />
        </div>
      </article>
    </main>
  );
}
