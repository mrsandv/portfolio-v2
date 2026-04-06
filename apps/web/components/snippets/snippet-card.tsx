"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/locale-provider";
import type { Snippet } from "@/lib/types/snippet";

export function SnippetCard({ snippet }: { snippet: Snippet }) {
  const { locale } = useLocale();
  const date = new Date(snippet.createdAt).toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <Link
      href={snippet.category ? `/snippets/${snippet.category}/${snippet.slug}` : `/snippets/${snippet.slug}`}
      className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {snippet.title}
        </h3>
        <Badge variant="secondary" className="shrink-0">
          {snippet.language}
        </Badge>
      </div>

      {snippet.description && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {snippet.description.replace(/[#*`_~\[\]]/g, "").slice(0, 120)}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {snippet.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {(snippet.likes ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="size-3" />
              {snippet.likes}
            </span>
          )}
          <span className="text-xs text-muted-foreground" suppressHydrationWarning>{date}</span>
        </div>
      </div>
    </Link>
  );
}
