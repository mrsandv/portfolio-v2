import Link from "next/link";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SnippetNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Code2 className="mx-auto size-12 text-muted-foreground/40 mb-4" />
        <h1 className="text-2xl font-bold text-foreground">
          Snippet not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The snippet you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href="/snippets">Browse all snippets</Link>
        </Button>
      </div>
    </main>
  );
}
