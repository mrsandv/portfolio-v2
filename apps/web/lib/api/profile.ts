import type { Profile } from "@/lib/types/profile";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function getProfile(): Promise<Profile | null> {
  try {
    const res = await fetch(`${API_BASE}/api/profile`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
