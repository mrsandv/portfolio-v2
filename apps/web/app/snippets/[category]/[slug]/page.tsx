import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSnippetBySlug } from "@/lib/api/snippets";
import { SnippetDetailContent } from "@/components/snippets/snippet-detail-content";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const snippet = await getSnippetBySlug(slug);
  if (!snippet) return { title: "Snippet Not Found" };
  return {
    title: `${snippet.title} | Code Snippets | Spacehole Tech`,
    description: snippet.description?.slice(0, 160),
  };
}

export default async function CategorySnippetPage({ params }: Props) {
  const { slug } = await params;
  const snippet = await getSnippetBySlug(slug);
  if (!snippet) notFound();

  return <SnippetDetailContent snippet={snippet} />;
}
