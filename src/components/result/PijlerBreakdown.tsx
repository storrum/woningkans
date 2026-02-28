"use client";

import type { ScoreResult } from "@/types";

type Props = {
  pijlers: ScoreResult["pijlers"];
  baselinePijlers?: ScoreResult["pijlers"];
};

export default function PijlerBreakdown({ pijlers }: Props) {
  const pijlerList = Object.values(pijlers);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
      {pijlerList.map((pijler) => (
        <div
          key={pijler.label}
          style={{
            flex:         1,
            background:   "#ffffff",
            border:       "1px solid #e8e9ec",
            borderRadius: 8,
            padding:      "16px 20px 16px 20px",
            display:      "flex",
            flexDirection: "column",
            minWidth:     0,
          }}
        >
          {/* Titel */}
          <span style={{
            fontSize:    14,
            fontWeight:   700,
            color:        "#000000",
            marginBottom: 3,
            display:      "block",
          }}>
            {pijler.label}
          </span>

          {/* Subtitel */}
          <span style={{
            fontSize:     14,
            fontWeight:   500,
            color:        "#B2B2B2",
            display:      "block",
            marginBottom: "auto",
            paddingBottom: 16,
          }}>
           {pijler.explanation}
          </span>

          {/* Score linksonder */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginTop: 16 }}>
            <span style={{ fontSize: 50, fontWeight: 600, color: "#000000", lineHeight: 1 }}>
              {pijler.score}
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#A8A8A8" }}>
              /100
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
