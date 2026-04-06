"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function SnippetNotFound() {
  const t = useTranslations("snippetDetail");

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Code2 className="mx-auto size-12 text-muted-foreground/40 mb-4" />
        <h1 className="text-2xl font-bold text-foreground">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("notFoundDescription")}
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href="/snippets">{t("browseAll")}</Link>
        </Button>
      </div>
    </main>
  );
}
