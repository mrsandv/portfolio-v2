import type { Metadata } from "next";
import { getSnippetsByCategory } from "@/lib/api/snippets";
import { CategoryPageContent } from "@/components/snippets/category-page-content";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${label} Snippets | Spacehole Tech`,
    description: `Browse ${label} code snippets, patterns, and solutions.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const snippets = await getSnippetsByCategory(category);

  return <CategoryPageContent category={category} snippets={snippets} />;
}
