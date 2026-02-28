"use client";

import type { ActionPoint } from "@/types";
import { Clock, TrendingUp } from "lucide-react";

type Props = {
  actionPoints: ActionPoint[];
};

const PRIORITY_BADGE_BG: Record<ActionPoint["priority"], string> = {
  high:   "#FF4444",
  medium: "#FF7525",
  low:    "#257CFF",
};

const PRIORITY_LABELS: Record<ActionPoint["priority"], string> = {
  high:   "Prioriteit",
  medium: "Aanbevolen",
  low:    "Overweeg dit",
};

export default function ActionPoints({ actionPoints }: Props) {
  if (actionPoints.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {actionPoints.map((ap) => (
        <div
          key={ap.id}
          style={{
            background:   "#ffffff",
            border:       "1px solid #e8e9ec",
            borderRadius: 8,
            padding:      16,
            position:     "relative",
          }}
        >
          {/* Prioriteit badge rechtsboven */}
          <div style={{
            position:     "absolute",
            top:          14,
            right:        14,
            background:   PRIORITY_BADGE_BG[ap.priority],
            color:        "#ffffff",
            fontSize:     12,
            fontWeight:   500,
            padding:      "2.5px 8px",
            borderRadius: 40,
            flexShrink:   0,
          }}>
            {PRIORITY_LABELS[ap.priority]}
          </div>

          {/* Titel */}
          <h3 style={{
            fontSize:    16,
            fontWeight:  700,
            color:       "#000000",
            marginBottom: 6,
            paddingRight: 90,
          }}>
            {ap.title}
          </h3>

          {/* Beschrijving */}
          <p style={{
            fontSize:   14,
            fontWeight: 500,
            color:      "#B2B2B2",
            lineHeight: "20px",
            marginBottom: 10,
          }}>
            {ap.description}
          </p>

          {/* Footer: tijdsindicatie + impact */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              display:      "flex",
              alignItems:   "center",
              gap:          4,
              fontSize:     12,
              color:        "#B2B2B2",
              background:   "#ffffff",
              border:       "1px solid #E8E9EC",
              borderRadius: 8,
              padding:      "3px 8px",
            }}>
              <Clock style={{ width: 12, height: 12 }} />
              {ap.timeframe}
            </span>
            <span style={{
              display:      "flex",
              alignItems:   "center",
              gap:          4,
              fontSize:     12,
              color:        "#B2B2B2",
              background:   "#ffffff",
              border:       "1px solid #E8E9EC",
              borderRadius: 8,
              padding:      "3px 8px",
            }}>
              <TrendingUp style={{ width: 12, height: 12 }} />
              {ap.impactScore} punten verwacht
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
