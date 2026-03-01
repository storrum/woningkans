"use client";

import type { UserProfile } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

type Props = {
  profile: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
};

// NIBUD 2024 tabel
const NIBUD_TABLE: Array<{ maxIncome: number; factor: number }> = [
  { maxIncome: 20_000,  factor: 3.40 },
  { maxIncome: 25_000,  factor: 3.75 },
  { maxIncome: 30_000,  factor: 4.00 },
  { maxIncome: 35_000,  factor: 4.15 },
  { maxIncome: 40_000,  factor: 4.25 },
  { maxIncome: 50_000,  factor: 4.35 },
  { maxIncome: 60_000,  factor: 4.50 },
  { maxIncome: 75_000,  factor: 4.60 },
  { maxIncome: 90_000,  factor: 4.70 },
  { maxIncome: 110_000, factor: 4.80 },
  { maxIncome: Infinity, factor: 4.87 },
];

function getNibudFactor(toetsinkomen: number): number {
  for (const row of NIBUD_TABLE) {
    if (toetsinkomen <= row.maxIncome) return row.factor;
  }
  return 4.87;
}

function calcMaxMortgagePreview(grossIncome: number, partnerIncome: number, vastContract: boolean, schulden: number = 0): number {
  const hoofd = Math.max(grossIncome, partnerIncome);
  const partner = Math.min(grossIncome, partnerIncome) * 0.9;
  let toetsinkomen = hoofd + partner;
  // Schulden aftrek NIBUD: elke € schuld verlaagt toetsinkomen met 2%/jr
  if (schulden > 0) toetsinkomen = Math.max(0, toetsinkomen - schulden * 0.02);
  const factor = getNibudFactor(toetsinkomen);
  const raw = toetsinkomen * factor;
  return Math.round(raw * (vastContract ? 1.0 : 0.78));
}

// Note: this is a preview function for UI. The official calculation is in scoreEngine.ts

export default function StepInkomen({ profile, onChange }: Props) {
  const grossIncome = profile.grossIncome ?? 0;
  const partnerIncome = profile.partnerIncome ?? 0;
  const vastContract = profile.vastContract ?? true;
  const schulden = profile.schulden ?? 0;

  const maxMortgagePreview = calcMaxMortgagePreview(grossIncome, partnerIncome, vastContract, schulden);

  function handleIncomeChange(val: string) {
    const parsed = parseInt(val.replace(/\D/g, ''), 10);
    onChange({ grossIncome: isNaN(parsed) ? 0 : parsed });
  }

  function handlePartnerIncomeChange(val: string) {
    const parsed = parseInt(val.replace(/\D/g, ''), 10);
    onChange({ partnerIncome: isNaN(parsed) ? 0 : parsed });
  }

  function handleSchuldenChange(val: string) {
    const parsed = parseInt(val.replace(/\D/g, ''), 10);
    onChange({ schulden: isNaN(parsed) ? 0 : parsed });
  }

  // Draggable input
  function DragInput({
    value,
    onChange: onC,
    min = 0,
    max = 200_000,
    step = 1_000,
    placeholder = "0",
  }: {
    value: number;
    onChange: (val: string) => void;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
  }) {
    let startX: number | null = null;
    let startVal: number = value;

    function handleDrag(e: React.MouseEvent<HTMLInputElement>) {
      if (startX === null) return;
      const delta = e.clientX - startX;
      const newVal = Math.min(max, Math.max(startVal + delta * step));
      startX = e.clientX;
      startVal = newVal;
      onC(String(Math.round(newVal / step) * step));
    }

    return (
      <input
        type="text"
        value={value > 0 ? formatCurrency(value) : ""}
        placeholder={placeholder}
        onChange={(e) => onC(e.target.value)}
        onMouseDown={(e) => { startX = e.clientX; startVal = value; }}
        onMouseMove={handleDrag}
        onMouseUp={() => { startX = null; }}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #E8E9EC",
          fontSize: 14,
          fontWeight: 500,
          color: "#111",
          outline: "none",
          cursor: "ew-resize",
          background: "#fff",
        }}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Bruto inkomen */}
      <div style={{ padding: 20, border: "1px solid #e8e9ec", borderRadius: 16, background: "#fff" }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#111" }}>
          Bruto jaarinkomen
        </label>
        <DragInput value={grossIncome} onChange={handleIncomeChange} min={0} max={250_000} step={1_000} placeholder="Bijv. €50.000" />
        <p style={{ marginTop: 8, fontSize: 12, color: "#B2B2B2" }}>Jouw bruto jaarinkomen voor belasting</p>
      </div>

      {/* ── Partner inkomen */}
      <div style={{ padding: 20, border: "1px solid #e8e9ec", borderRadius: 16, background: "#fff" }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#111" }}>
          Bruto jaarinkomen partner <span style={{ fontWeight: 400, color: "#aaa" }}>(optioneel)</span>
        </label>
        <DragInput value={partnerIncome} onChange={handlePartnerIncomeChange} min={0} max={250_000} step={1_000} placeholder="Bijv. €35.000" />
      </div>

      {/* Vast contract toggle */}
      <div style={{ padding: 20, border: "1px solid #e8e9ec", borderRadius: 16, background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Vast contract</p>
            <p style={{ marginTop: 4, fontSize: 12, color: "#aaa" }}>Een vast contract verhoogt je maximale hypotheek</p>
          </div>
          <div
            onClick={() => onChange({ vastContract: !vastContract })}
            style={{
              width: 44, height: 24, borderRadius: 12, background: vastContract ? "#257CFF" : "#E8E9EC",
              cursor: "pointer", position: "relative", transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <div style={{
              position: "absolute", top: 2, left: vastContract ? 22 : 2,
              width: 20, height: 20, borderRadius: 10, background: "#fff",
              transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
          </div>
        </div>
      </div>

      {/* Schulden */}
      <div style={{ padding: 20, border: "1px solid #e8e9ec", borderRadius: 16, background: "#fff" }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#111" }}>
          Lopende schulden <span style={{ fontWeight: 400, color: "#aaa" }}>(optioneel)</span>
        </label>
        <DragInput value={schulden} onChange={handleSchuldenChange} min={0} max={100_000} step={1_000} placeholder="Bijv. €5.000" />
        <p style={{ marginTop: 8, fontSize: 12, color: "#B2B2B2" }}>Studieschuld, autolease, of andere lopende schulden</p>
      </div>

      {/* ── Resultaat */}
      {grossIncome > 0 && (
        <div style={{ padding: 20, border: "1px solid #e8e9ec", borderRadius: 16, background: "#f8f8f8" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <CheckCircle size={20} color="#257CFF" />
            <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Jouw leencapaciteit</p>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>
              {formatCurrency(maxMortgagePreview)}
            </span>
          </div>
          <p style={{ marginTop: 6, fontSize: 12, color: "#aaa" }}>
            Maximale hypotheek op basis van NIBUD 2024 {value= {vastContract ? "" : " (flexcorrectie 78%)"}
          </p>
        </div>
      )}
    </div>
  );
}
