"use client";

import type { ConcurrentieInsight } from "@/types";

interface Props {
  concurrentie: ConcurrentieInsight;
  location: string;
  showHeader?: boolean;
}

export default function ConcurrentieBlock({ concurrentie, location, showHeader = true }: Props) {
  const overbiedProcent   = Math.round(concurrentie.overbiedKans * 100);
  const aanbevolenProcent = Math.round(concurrentie.aanbevolenOverbiedPct * 100);

  const aantalBieders = concurrentie.verwachtAantalBieders;
  const risicoKleur =
    aantalBieders > 5 ? "#FF4444" : aantalBieders > 3 ? "#257CFF" : "#00CA22";
  const risicoBg =
    aantalBieders > 5 ? "rgba(255,68,68,0.06)" : aantalBieders > 3 ? "rgba(37,124,255,0.06)" : "rgba(0,202,34,0.06)";
  const risicoBorder =
    aantalBieders > 5 ? "rgba(255,68,68,0.2)" : aantalBieders > 3 ? "rgba(37,124,255,0.2)" : "rgba(0,202,34,0.2)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Aantal bieders */}
      <div style={{
        background:   risicoBg,
        border:       `1px solid ${risicoBorder}`,
        borderRadius: 8,
        padding:      20,
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111111" }}>Verwacht aantal bieders</span>
        <p style={{ fontSize: 36, fontWeight: 700, color: risicoKleur, lineHeight: 1.1, marginTop: 4 }}>
          ~{aantalBieders}
        </p>
      </div>

      {/* Overbied kansen – 2 kolommen */}
      <div className="concurrentie-grid">
        <div style={{ border: "1px solid #e8e9ec", borderRadius: 8, padding: "16px 20px" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111111" }}>Kans op overbieden</span>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#111111", marginTop: 4 }}>{overbiedProcent}%</p>
        </div>
        <div style={{ border: "1px solid #e8e9ec", borderRadius: 8, padding: "16px 20px" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111111" }}>Aanbevolen overbod</span>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#111111", marginTop: 4 }}>
            {aanbevolenProcent > 0 ? `+${aanbevolenProcent}%` : "Vraagprijs"}
          </p>
        </div>
      </div>


    </div>
  );
}
