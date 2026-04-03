"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminMe, adminChangePassword } from "@/lib/api/admin";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    adminMe()
      .then(() => setLoading(false))
      .catch(() => router.replace("/control"));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setSubmitting(true);
    try {
      await adminChangePassword(currentPassword, newPassword);
      setSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="retro-container" style={{ paddingTop: 20 }}>
        <div className="retro-header">&#9203; LOADING...</div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: 10 }}>
      <div
        className="retro-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span>&#128274; CHANGE PASSWORD</span>
        <button
          className="retro-btn"
          onClick={() => router.push("/control/dashboard")}
          style={{ fontSize: 10, minWidth: 50 }}
        >
          Back
        </button>
      </div>

      <div className="retro-panel">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label className="retro-label">Current Password *</label>
            <input
              type="password"
              className="retro-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <hr className="retro-hr" />

          <div style={{ marginBottom: 10 }}>
            <label className="retro-label">New Password * (min. 8 chars)</label>
            <input
              type="password"
              className="retro-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label className="retro-label">Confirm New Password *</label>
            <input
              type="password"
              className="retro-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {error && (
            <div
              style={{
                color: "#800000",
                fontFamily: "Courier New, monospace",
                fontSize: 12,
                marginBottom: 8,
                padding: "4px 8px",
                background: "#fff",
                border: "2px inset #808080",
              }}
            >
              *** ERROR: {error}
            </div>
          )}

          {success && (
            <div
              style={{
                color: "#008000",
                fontFamily: "Courier New, monospace",
                fontSize: 12,
                marginBottom: 8,
                padding: "4px 8px",
                background: "#fff",
                border: "2px inset #808080",
              }}
            >
              *** {success}
            </div>
          )}

          <button
            type="submit"
            className="retro-btn"
            disabled={submitting}
            style={{ marginTop: 4 }}
          >
            {submitting ? "Saving..." : "Change Password"}
          </button>
        </form>
      </div>

      <div className="retro-status">
        Enter your current password to verify identity, then set a new one.
      </div>
    </div>
  );
}
