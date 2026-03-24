import type { Snippet } from "@/lib/types/snippet";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function getSnippets(): Promise<Snippet[]> {
  const res = await fetch(`${API_BASE}/api/snippets`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getSnippetBySlug(
  slug: string
): Promise<Snippet | null> {
  const res = await fetch(`${API_BASE}/api/snippets/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getTopSnippets(): Promise<Snippet[]> {
  const res = await fetch(`${API_BASE}/api/snippets/top`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function likeSnippet(
  slug: string
): Promise<{ liked: boolean; likes: number }> {
  const res = await fetch(`/api/snippets/${slug}/like`, { method: "POST" });
  return res.json();
}
