import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Code2 } from "lucide-react";
import { getSnippets } from "@/lib/api/snippets";
import { SnippetCard } from "@/components/snippets/snippet-card";

export const metadata: Metadata = {
  title: "Code Snippets | Spacehole Tech",
  description:
    "Browse curated code snippets, algorithms, and solutions across multiple languages.",
};

export default async function SnippetsPage() {
  const snippets = await getSnippets();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Code Snippets
          </h1>
          <p className="mt-2 text-muted-foreground">
            A collection of useful code snippets, algorithms, and patterns I use
            and reference.
          </p>
        </div>

        {snippets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Code2 className="size-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No snippets yet.</p>
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
