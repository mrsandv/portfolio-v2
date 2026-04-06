"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminMe, adminCreateSnippet } from "@/lib/api/admin";

export default function NewSnippet() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Ready to create snippet.");

  useEffect(() => {
    adminMe().catch(() => router.replace("/control"));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("Creating snippet...");

    try {
      const snippet = await adminCreateSnippet({
        title,
        code,
        language,
        category: category || undefined,
        description: description || undefined,
        tags: tags
          ? tags.split(",").map((t) => t.trim()).filter(Boolean)
          : undefined,
      });
      setStatus(`Snippet "${snippet.title}" created!`);
      router.push("/control/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create";
      setError(msg);
      setStatus("Error creating snippet.");
    }
  }

  return (
    <div className="retro-container" style={{ paddingTop: 10 }}>
      <div className="retro-header">
        &#128196; NEW SNIPPET
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
              Snippet Data
            </legend>

            <label className="retro-label">Title: *</label>
            <input
              className="retro-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ marginBottom: 8 }}
            />

            <label className="retro-label">Language: *</label>
            <input
              className="retro-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="go, typescript, python..."
              required
              style={{ marginBottom: 8 }}
            />

            <label className="retro-label">Category:</label>
            <input
              className="retro-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="react, rust, algorithms..."
              style={{ marginBottom: 8 }}
            />

            <label className="retro-label">Tags (comma separated):</label>
            <input
              className="retro-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, hooks, basics"
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

            <label className="retro-label">Code: *</label>
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
                Create
              </button>
            </div>
          </fieldset>
        </form>
      </div>
      <div className="retro-status">{status}</div>
    </div>
  );
}
