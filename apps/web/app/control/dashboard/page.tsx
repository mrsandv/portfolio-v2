"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  adminMe,
  adminLogout,
  adminGetFlags,
  adminToggleFlag,
  adminGetSnippets,
  adminDeleteSnippet,
  type Snippet,
} from "@/lib/api/admin";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Loading system...");

  const loadData = useCallback(async () => {
    try {
      const me = await adminMe();
      setUser(me.username);
      const [f, s] = await Promise.all([adminGetFlags(), adminGetSnippets()]);
      setFlags(f);
      setSnippets(s);
      setStatus(`Ready. ${Object.keys(f).length} flags, ${s.length} snippets loaded.`);
      setLoading(false);
    } catch {
      router.replace("/control");
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleToggleFlag(key: string, current: boolean) {
    setStatus(`Toggling ${key}...`);
    await adminToggleFlag(key, !current);
    setFlags((prev) => ({ ...prev, [key]: !current }));
    setStatus(`Flag "${key}" set to ${!current}`);
  }

  async function handleDelete(slug: string) {
    if (!confirm(`DELETE snippet "${slug}"?\n\nThis action cannot be undone.`)) return;
    setStatus(`Deleting ${slug}...`);
    await adminDeleteSnippet(slug);
    setSnippets((prev) => prev.filter((s) => s.slug !== slug));
    setStatus(`Snippet "${slug}" deleted.`);
  }

  async function handleLogout() {
    await adminLogout();
    router.replace("/control");
  }

  if (loading) {
    return (
      <div className="retro-container" style={{ paddingTop: 20 }}>
        <div className="retro-header">&#9203; LOADING SYSTEM...</div>
        <div className="retro-panel" style={{ textAlign: "center" }}>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: 10 }}>
      <div className="retro-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>&#128187; CONTROL PANEL - {user.toUpperCase()}</span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            className="retro-btn"
            onClick={() => router.push("/control/password")}
            style={{ fontSize: 10, minWidth: 50 }}
          >
            Password
          </button>
          <button className="retro-btn" onClick={handleLogout} style={{ fontSize: 10, minWidth: 50 }}>
            Logout
          </button>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="retro-panel">
        <div className="retro-header" style={{ marginBottom: 8 }}>
          &#9873; FEATURE FLAGS
        </div>
        <table className="retro-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Flag Key</th>
              <th style={{ width: 80 }}>Status</th>
              <th style={{ width: 80 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(flags).map(([key, enabled], i) => (
              <tr key={key}>
                <td>{i + 1}</td>
                <td style={{ fontFamily: "Courier New, monospace" }}>{key}</td>
                <td>
                  <span
                    style={{
                      color: enabled ? "#008000" : "#ff0000",
                      fontWeight: "bold",
                      fontFamily: "Courier New, monospace",
                    }}
                  >
                    {enabled ? "[ON]" : "[OFF]"}
                  </span>
                </td>
                <td>
                  <button className="retro-btn" onClick={() => handleToggleFlag(key, enabled)} style={{ fontSize: 10 }}>
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
            {Object.keys(flags).length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#808080" }}>
                  No flags found. Run seed to create defaults.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <hr className="retro-hr" />

      {/* Snippets */}
      <div className="retro-panel">
        <div className="retro-header" style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>&#128196; SNIPPETS</span>
          <button
            className="retro-btn"
            onClick={() => router.push("/control/snippets/new")}
            style={{ fontSize: 10 }}
          >
            + New Snippet
          </button>
        </div>
        <table className="retro-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}>#</th>
              <th>Title</th>
              <th style={{ width: 80 }}>Language</th>
              <th style={{ width: 50 }}>Likes</th>
              <th style={{ width: 130 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {snippets.map((s, i) => (
              <tr key={s.slug}>
                <td>{i + 1}</td>
                <td>
                  <span
                    className="retro-link"
                    onClick={() => router.push(`/control/snippets/${s.slug}/edit`)}
                  >
                    {s.title}
                  </span>
                </td>
                <td style={{ fontFamily: "Courier New, monospace" }}>{s.language}</td>
                <td style={{ textAlign: "center" }}>{s.likes}</td>
                <td>
                  <button
                    className="retro-btn"
                    onClick={() => router.push(`/control/snippets/${s.slug}/edit`)}
                    style={{ fontSize: 10, marginRight: 4 }}
                  >
                    Edit
                  </button>
                  <button
                    className="retro-btn-danger"
                    onClick={() => handleDelete(s.slug)}
                    style={{ fontSize: 10 }}
                  >
                    Del
                  </button>
                </td>
              </tr>
            ))}
            {snippets.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#808080" }}>
                  No snippets found. Create one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div className="retro-status">{status}</div>
      <div
        style={{
          fontFamily: "MS Sans Serif, Arial, sans-serif",
          fontSize: 10,
          color: "#808080",
          textAlign: "center",
          marginTop: 8,
        }}
      >
        Control Panel v1.0 | Best viewed at 800x600 | &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
