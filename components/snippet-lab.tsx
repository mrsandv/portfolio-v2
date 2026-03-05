"use client";

import { useState } from "react";
import { Search, Lock, Eye, Beaker, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const snippets = [
  {
    id: 1,
    title: "useDebounce Hook",
    description:
      "A custom React hook for debouncing values with configurable delay.",
    category: "React",
    locked: false,
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
  },
  {
    id: 2,
    title: "API Route with Zod Validation",
    description:
      "Type-safe Next.js API route handler with request body validation.",
    category: "Next.js",
    locked: false,
    code: `import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json({ data: result.data });
}`,
  },
  {
    id: 3,
    title: "Retry with Exponential Backoff",
    description:
      "A utility function for retrying async operations with exponential backoff.",
    category: "TypeScript",
    locked: true,
    code: `// Premium snippet — unlock to view the full implementation
async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  // ...locked content
}`,
  },
  {
    id: 4,
    title: "Optimistic UI Update Pattern",
    description:
      "SWR-based optimistic update pattern with rollback on failure.",
    category: "React",
    locked: true,
    code: `// Premium snippet — unlock to view the full implementation
function useOptimisticUpdate() {
  // ...locked content
}`,
  },
  {
    id: 5,
    title: "JWT Auth Middleware",
    description:
      "Edge-compatible JWT verification middleware for Next.js routes.",
    category: "Next.js",
    locked: false,
    code: `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}`,
  },
  {
    id: 6,
    title: "Go Concurrent Worker Pool",
    description:
      "Generic worker pool pattern in Go for processing jobs concurrently.",
    category: "Go",
    locked: true,
    code: `// Premium snippet — unlock to view the full implementation
func WorkerPool[T any](jobs <-chan T, workers int) {
  // ...locked content
}`,
  },
];

const categories = [
  "All",
  ...Array.from(new Set(snippets.map((s) => s.category))),
];

function CodeBlock({ code, locked }: { code: string; locked: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {locked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2 text-center">
            <Lock className="h-6 w-6 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Premium Snippet
            </p>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Unlock Access
            </Button>
          </div>
        </div>
      )}
      <div className="relative overflow-hidden rounded-lg border border-border bg-secondary">
        {!locked && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-3 right-3 z-10 rounded-md border border-border bg-background p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        <pre
          className={`overflow-x-auto p-4 font-mono text-xs leading-relaxed text-muted-foreground ${locked ? "select-none blur-[2px]" : ""}`}
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export function SnippetLab() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedSnippet, setExpandedSnippet] = useState<number | null>(null);

  const filtered = snippets.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="snippets" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-3">
          <Beaker className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Snippet Lab
          </h2>
        </div>

        {/* Search and filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Snippet grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((snippet) => (
            <div
              key={snippet.id}
              className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {snippet.title}
                    </h3>
                    {snippet.locked && (
                      <Lock className="h-3.5 w-3.5 text-primary" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {snippet.description}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="shrink-0 border-border bg-secondary text-muted-foreground"
                >
                  {snippet.category}
                </Badge>
              </div>

              <button
                type="button"
                onClick={() =>
                  setExpandedSnippet(
                    expandedSnippet === snippet.id ? null : snippet.id,
                  )
                }
                className="mb-3 flex items-center gap-1.5 text-xs text-primary transition-colors hover:text-primary/80"
              >
                <Eye className="h-3.5 w-3.5" />
                {expandedSnippet === snippet.id
                  ? "Hide Preview"
                  : "Show Preview"}
              </button>

              {expandedSnippet === snippet.id && (
                <CodeBlock code={snippet.code} locked={snippet.locked} />
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No snippets match your search. Try a different keyword.
          </div>
        )}
      </div>
    </section>
  );
}
