"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import type { MaandKans } from "@/types";

interface Props {
  maandKansen: MaandKans[];
  besteKoopMaanden: number[];
  huidigeMaand?: number;
}

const KORT: Record<number, string> = {
  1: "Jan", 2: "Feb", 3: "Mrt", 4: "Apr", 5: "Mei", 6: "Jun",
  7: "Jul", 8: "Aug", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Dec",
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: MaandKans }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload[0]) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background:   "#ffffff",
      border:       "1px solid #e8e9ec",
      borderRadius: 8,
      padding:      "10px 12px",
      fontSize:     12,
      maxWidth:     180,
      boxShadow:    "0 4px 12px rgba(0,0,0,0.08)",
    }}>
      <p style={{ fontWeight: 700, color: "#111111", marginBottom: 4 }}>{d.naam}</p>
      <p style={{ color: "#257CFF", fontWeight: 600, marginBottom: 2 }}>Kans-score: {d.kansScore}/100</p>
      <p style={{ color: "#ADADAD", lineHeight: "16px" }}>{d.label}</p>
    </div>
  );
}

export default function MaandKansenChart({ maandKansen, besteKoopMaanden }: Props) {
  const [geselecteerd, setGeselecteerd] = useState<MaandKans | null>(null);
  const huidigeMaand = maandKansen.find((m) => m.isHuidigeMaand);

  const besteNamen = besteKoopMaanden
    .map((nr) => maandKansen.find((m) => m.maand === nr)?.naam)
    .filter(Boolean)
    .join(", ");

  function getBarKleur(m: MaandKans): string {
    if (m.isHuidigeMaand) return "#FF7525";
    if (besteKoopMaanden.includes(m.maand)) return "#22c55e";
    if (m.kansScore >= 70) return "#86efac";
    if (m.kansScore >= 50) return "#93c5fd";
    return "#d1d5db";
  }

  const geselecteerdeMaand = geselecteerd ?? huidigeMaand ?? maandKansen[0];

  const gemScore = maandKansen.reduce((s, m) => s + m.kansScore, 0) / 12;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Beste maanden badge */}
      <div style={{
        border:       "1px solid #e8e9ec",
        borderRadius: 8,
        padding:      "12px 20px",
        display:      "flex",
        alignItems:   "flex-start",
        justifyContent: "space-between",
        flexWrap:     "wrap",
        gap:          8,
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111111" }}>Beste koopmaanden</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#B2B2B2" }}>{besteNamen}</span>
      </div>

      {/* Grafiek */}
      <div style={{ height: 176, width: "100%", marginLeft: -4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={maandKansen}
            margin={{ top: 4, right: 0, left: -24, bottom: 0 }}
            barCategoryGap="18%"
            onClick={(data) => {
              if (data?.activePayload?.[0]) {
                setGeselecteerd(data.activePayload[0].payload as MaandKans);
              }
            }}
          >
            <XAxis
              dataKey="maand"
              tickFormatter={(v: number) => KORT[v] ?? ""}
              tick={{ fontSize: 10, fill: "#ADADAD" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: "#ADADAD" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(37,124,255,0.06)" }} />
            <ReferenceLine y={gemScore} stroke="#e8e9ec" strokeDasharray="4 2" />
            <Bar dataKey="kansScore" radius={[4, 4, 0, 0]}>
              {maandKansen.map((m) => (
                <Cell key={m.maand} fill={getBarKleur(m)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail geselecteerde maand */}
      {geselecteerdeMaand && (
        <div style={{
          border:       "1px solid #e8e9ec",
          borderRadius: 8,
          padding:      "12px 20px",
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#111111", marginBottom: 2 }}>
            {geselecteerdeMaand.naam}
            {geselecteerdeMaand.isHuidigeMaand && (
              <span style={{ marginLeft: 6, fontSize: 11, color: "#FF7525", fontWeight: 600 }}>
                (huidige maand)
              </span>
            )}
          </p>
          <p style={{ fontSize: 12, color: "#ADADAD", lineHeight: "18px", marginBottom: 6 }}>
            {geselecteerdeMaand.label}
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <span style={{ fontSize: 11, color: "#ADADAD" }}>
              Kans-score: <strong style={{ color: "#111111" }}>{geselecteerdeMaand.kansScore}</strong>
            </span>
            <span style={{ fontSize: 11, color: "#ADADAD" }}>
              Aanbod-index: <strong style={{ color: "#111111" }}>{geselecteerdeMaand.aanbodIndex}×</strong>
            </span>
          </div>
        </div>
      )}

      {/* Legenda */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, paddingLeft: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: "#FF7525" }} />
          <span style={{ fontSize: 11, color: "#ADADAD" }}>Nu</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: "#22c55e" }} />
          <span style={{ fontSize: 11, color: "#ADADAD" }}>Beste maanden</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, border: "1px dashed #ADADAD" }} />
          <span style={{ fontSize: 11, color: "#ADADAD" }}>Gem. jaar</span>
        </div>
      </div>

    </div>
  );
}
