import type { Metadata } from "next";
import { getSnippets, getCategories } from "@/lib/api/snippets";
import { SnippetsPageContent } from "@/components/snippets/snippets-page-content";

export const metadata: Metadata = {
  title: "Code Snippets | Spacehole Tech",
  description:
    "Browse curated code snippets, algorithms, and solutions across multiple languages.",
};

export default async function SnippetsPage() {
  const [snippets, categories] = await Promise.all([
    getSnippets(),
    getCategories(),
  ]);

  return <SnippetsPageContent snippets={snippets} categories={categories} />;
}
