"use client";

import type { ScoreLabel } from "@/types";
import { getScoreRingColor, getScoreLabelColor } from "@/lib/utils";

type ScoreRingProps = {
  score: number;
  label: ScoreLabel;
  size?: "sm" | "md" | "lg";
};

const SIZES = {
  sm: { viewBox: 120, r: 50, strokeWidth: 9,  textSize: "text-2xl", labelSize: "text-xs" },
  md: { viewBox: 140, r: 58, strokeWidth: 10, textSize: "text-3xl", labelSize: "text-sm" },
  lg: { viewBox: 160, r: 65, strokeWidth: 12, textSize: "text-4xl", labelSize: "text-sm" },
};

export default function ScoreRing({ score, label, size = "lg" }: ScoreRingProps) {
  const { viewBox, r, strokeWidth, textSize, labelSize } = SIZES[size];
  const cx = viewBox / 2;
  const cy = viewBox / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;
  const color = getScoreRingColor(score);
  const labelColor = getScoreLabelColor(label);

  return (
    <div className="relative mx-auto" style={{ width: viewBox, height: viewBox }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${viewBox} ${viewBox}`}>
        {/* Achtergrondcirkel */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Scorecirkel */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Score getal + label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${textSize} font-bold text-gray-900 leading-none`}>{score}</span>
        <span className="text-xs text-gray-400 leading-none mt-0.5">/ 100</span>
        <span className={`${labelSize} font-bold mt-2 ${labelColor}`}>{label}</span>
      </div>
    </div>
  );
}
