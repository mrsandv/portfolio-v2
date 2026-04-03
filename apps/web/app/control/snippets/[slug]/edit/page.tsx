"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { adminMe, adminGetSnippets, adminUpdateSnippet, type Snippet } from "@/lib/api/admin";

export default function EditSnippet({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Loading snippet...");

  useEffect(() => {
    adminMe()
      .then(() => adminGetSnippets())
      .then((snippets) => {
        const found = snippets.find((s) => s.slug === slug);
        if (!found) {
          setError("Snippet not found");
          setStatus("ERROR: Snippet not found");
          return;
        }
        setSnippet(found);
        setTitle(found.title);
        setCode(found.code);
        setLanguage(found.language);
        setDescription(found.description || "");
        setTags(found.tags?.join(", ") || "");
        setStatus(`Editing: ${found.title}`);
      })
      .catch(() => router.replace("/control"));
  }, [slug, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("Saving changes...");

    try {
      await adminUpdateSnippet(slug, {
        title,
        code,
        language,
        description,
        tags: tags
          ? tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      });
      setStatus("Snippet updated!");
      router.push("/control/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update";
      setError(msg);
      setStatus("Error saving snippet.");
    }
  }

  if (!snippet && !error) {
    return (
      <div className="retro-container" style={{ paddingTop: 20 }}>
        <div className="retro-header">&#9203; LOADING...</div>
        <div className="retro-panel" style={{ textAlign: "center" }}>
          <p>Fetching snippet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: 10 }}>
      <div className="retro-header">
        &#128221; EDIT SNIPPET: {snippet?.title || slug}
      </div>
      <div className="retro-panel">
        <form onSubmit={handleSubmit}>
          <fieldset style={{ border: "2px groove #c0c0c0", padding: 12 }}>
            <legend
              style={{
                fontFamily: "MS Sans Serif, Arial, sans-serif",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              Edit Snippet
            </legend>

            <label className="retro-label">Title:</label>
            <input
              className="retro-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ marginBottom: 8 }}
            />

            <label className="retro-label">Language:</label>
            <input
              className="retro-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
              style={{ marginBottom: 8 }}
            />

            <label className="retro-label">Tags (comma separated):</label>
            <input
              className="retro-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{ marginBottom: 8 }}
            />

            <label className="retro-label">Description (markdown):</label>
            <textarea
              className="retro-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ marginBottom: 8 }}
            />

            <label className="retro-label">Code:</label>
            <textarea
              className="retro-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              required
              style={{ marginBottom: 12 }}
            />

            {error && (
              <div
                style={{
                  color: "#ff0000",
                  fontFamily: "Courier New, monospace",
                  fontSize: 12,
                  marginBottom: 8,
                  fontWeight: "bold",
                }}
              >
                *** ERROR: {error} ***
              </div>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="retro-btn"
                onClick={() => router.push("/control/dashboard")}
              >
                Cancel
              </button>
              <button type="submit" className="retro-btn">
                Save Changes
              </button>
            </div>
          </fieldset>
        </form>
      </div>
      <div className="retro-status">{status}</div>
      <div style={{
        fontFamily: "Courier New, monospace",
        fontSize: 10,
        color: "#808080",
        marginTop: 4,
      }}>
        slug: {slug} | created: {snippet?.createdAt ? new Date(snippet.createdAt).toLocaleDateString() : "—"}
      </div>
    </div>
  );
}
