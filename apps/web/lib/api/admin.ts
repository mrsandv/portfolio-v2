const API_BASE = "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return { "X-API-Key": API_KEY, ...extra };
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function adminLogout() {
  await fetch(`${API_BASE}/api/admin/logout`, {
    method: "POST",
    headers: authHeaders(),
  });
}

export async function adminMe() {
  const res = await fetch(`${API_BASE}/api/admin/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

export async function adminGetFlags() {
  const res = await fetch(`${API_BASE}/api/admin/flags`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch flags");
  return res.json() as Promise<Record<string, boolean>>;
}

export async function adminToggleFlag(key: string, enabled: boolean) {
  const res = await fetch(`${API_BASE}/api/admin/flags`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ key, enabled }),
  });
  if (!res.ok) throw new Error("Failed to toggle flag");
  return res.json();
}

export interface Snippet {
  id: string;
  title: string;
  slug: string;
  code: string;
  language: string;
  description: string;
  tags: string[];
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export async function adminGetSnippets(): Promise<Snippet[]> {
  const res = await fetch(`${API_BASE}/api/admin/snippets`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch snippets");
  return res.json();
}

export async function adminCreateSnippet(data: {
  title: string;
  code: string;
  language: string;
  description?: string;
  tags?: string[];
}) {
  const res = await fetch(`${API_BASE}/api/admin/snippets`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create snippet");
  }
  return res.json();
}

export async function adminUpdateSnippet(
  slug: string,
  data: {
    title?: string;
    code?: string;
    language?: string;
    description?: string;
    tags?: string[];
  }
) {
  const res = await fetch(`${API_BASE}/api/admin/snippets/${slug}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update snippet");
  return res.json();
}

export async function adminChangePassword(
  currentPassword: string,
  newPassword: string
) {
  const res = await fetch(`${API_BASE}/api/admin/password`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to change password");
  }
  return res.json();
}

export async function adminDeleteSnippet(slug: string) {
  const res = await fetch(`${API_BASE}/api/admin/snippets/${slug}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete snippet");
}
