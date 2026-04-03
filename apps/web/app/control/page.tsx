"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, adminMe } from "@/lib/api/admin";

export default function ControlLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminMe()
      .then(() => router.replace("/control/dashboard"))
      .catch(() => setLoading(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await adminLogin(username, password);
      router.push("/control/dashboard");
    } catch {
      setError("ACCESS DENIED - Invalid credentials");
    }
  }

  if (loading) {
    return (
      <div className="retro-container" style={{ paddingTop: 40 }}>
        <div className="retro-panel" style={{ textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: 40 }}>
      <div className="retro-header">
        &#128187; CONTROL PANEL - SYSTEM LOGIN
      </div>
      <div className="retro-panel">
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ width: 200, verticalAlign: "top", paddingRight: 20 }}>
                <div
                  style={{
                    border: "2px inset #808080",
                    padding: 10,
                    background: "#fff",
                    textAlign: "center",
                  }}
                >
                  <pre
                    style={{
                      fontFamily: "Courier New, monospace",
                      fontSize: 10,
                      lineHeight: 1.1,
                      margin: 0,
                    }}
                  >
{`
 _______________
|  ___________  |
| |           | |
| |  CONTROL  | |
| |  PANEL    | |
| |   v1.0    | |
| |___________| |
|     _____     |
|    |     |    |
|    |_____|    |
|_______________|
`}
                  </pre>
                </div>
                <div className="retro-status">
                  Status: Awaiting authentication...
                </div>
              </td>
              <td style={{ verticalAlign: "top" }}>
                <form onSubmit={handleSubmit}>
                  <fieldset
                    style={{
                      border: "2px groove #c0c0c0",
                      padding: 12,
                    }}
                  >
                    <legend
                      style={{
                        fontFamily: "MS Sans Serif, Arial, sans-serif",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      User Authentication
                    </legend>

                    <label className="retro-label">Username:</label>
                    <input
                      className="retro-input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoFocus
                      style={{ marginBottom: 8 }}
                    />

                    <label className="retro-label">Password:</label>
                    <input
                      className="retro-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                        *** {error} ***
                      </div>
                    )}

                    <div style={{ textAlign: "right" }}>
                      <button className="retro-btn" type="submit">
                        Login
                      </button>
                    </div>
                  </fieldset>
                </form>

                <hr className="retro-hr" />
                <div
                  style={{
                    fontFamily: "MS Sans Serif, Arial, sans-serif",
                    fontSize: 10,
                    color: "#808080",
                    textAlign: "center",
                  }}
                >
                  Unauthorized access is prohibited.
                  <br />
                  Best viewed with Netscape Navigator 4.0
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="marquee-bar">
        *** AUTHORIZED PERSONNEL ONLY *** SYSTEM ADMIN CONTROL PANEL ***
      </div>
    </div>
  );
}
