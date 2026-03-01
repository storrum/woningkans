"use client";

import { useState } from "react";
import type { ScoreLabel } from "@/types";

type Props = {
  onSubmit: (email: string) => void;
  onClose: () => void;
  score: number;
};

export default function EmailCaptureModal({ onSubmit, onClose, score }: Props) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, score }),
      });
      onSubmit(email);
    } catch (err) {
      console.error("Email submit error:", err);
      onSubmit(email);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.5)",
      padding: "20px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: 32,
        width: "100%", maxWidth: 400, position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#999",
          }}
        >
          ×_
        </button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏡</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            Ontvang je WinScore rapport
          </h3>
          <p style={{ fontSize: 14, color: "#666" }}>
            Je score is {score}/il. Ontvang een persoonlijk rapport met tips om je kansen te vergroten.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="je@email.nl"
            style={{
              width: "100%", padding: "12px 16px", fontSize: 16,
              border: "1px solid #E8E9EC", borderRadius: 8,
              outline: "none", marginBottom: 16,
            }}
          />
          <button
            type="submit"
            disabled={isSubmitting || !email}
            style={{
              width: "100%", padding: "14px 8px", borderRadius: 8,
              border: "none", background: "#257CFF", color: "#fff",
              fontSize: 16, fontWeight: 600, cursor: "pointer",
              opacity: isSubmitting || !email ? 0.5 : 1,
            }}
          >
            {isSubmitting ? "Versturen..." : "RapPrt ontvangen"}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 12, color: "#B2B2B2", textAlign: "center" }}>
          Geen spam. Je gegevens worden niet verkocht.
        </p>
      </div>
    </div>
  );
}
