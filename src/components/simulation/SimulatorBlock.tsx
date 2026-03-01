"use client";

import { useState, useEffect, useRef } from "react";
import type { UserProfile, ScoreResult, EmailCaptureContext } from "@/types";
import { calculateSimulation } from "@/lib/scoreEngine";
import { formatCurrency, cn } from "@/lib/utils";
import { RefreshCcw, TrendingUp, TrendingDown, Minus } from "lucide-react";

type Props = {
  baseProfile: UserProfile;
  baseResult: ScoreResult;
  assessmentId: string | null;
  onEmailCapture: (context: EmailCaptureContext) => void;
  simulationCount: number;
  onSimulationCountChange: (count: number) => void;
  onHasChanges?: (hasChanges: boolean, reset: () => void) => void;
};

// ── Slider component met blauwe stijl ──
function StyledSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  leftLabel,
  rightLabel,
  displayValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  leftLabel: string;
  rightLabel: string;
  displayValue: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      {/* Titel + huidige waarde */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#000000" }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#257CFF" }}>{displayValue}</span>
      </div>

      {/* Slider wrapper */}
      <div style={{ position: "relative", height: 8, marginBottom: 8 }}>
        <div style={{
          position:     "absolute",
          top:          0,
          left:         0,
          right:        0,
          height:       8,
          background:   "#F7F7F7",
          borderRadius: 8,
          overflow:     "hidden",
        }}>
          {/* Fill — stopt bij midden van thumb */}
          <div style={{
            position:     "absolute",
            top:          0,
            left:         0,
            width:        `calc(${pct}% * (100% - 16px) / 100% + 8px)`,
            height:       "100%",
            background:   "#257CFF",
            borderRadius: 8,
          }} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position:    "absolute",
            top:         0,
            left:        0,
            width:       "100%",
            height:      "100%",
            opacity:     0,
            cursor:      "pointer",
            margin:      0,
            padding:     0,
          }}
        />
        {/* Custom thumb — gecorrigeerd voor thumb-breedte zodat hij niet buiten de baan valt */}
        <div style={{
          position:     "absolute",
          top:          "50%",
          left:         `calc(${pct}% * (100% - 16px) / 100%)`,
          transform:    "translateY(-50%)",
          width:        16,
          height:       16,
          background:   "#257CFF",
          borderRadius: 8,
          border:       "2px solid #ffffff",
          boxShadow:    "0 1px 4px rgba(37,124,255,0.4)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Labels */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: "#B2B2B2" }}>{leftLabel}</span>
        <span style={{ fontSize: 13, color: "#B2B2B2" }}>{rightLabel}</span>
      </div>
    </div>
  );
}

export default function SimulatorBlock({
  baseProfile,
  baseResult,
  assessmentId,
  onEmailCapture,
  simulationCount,
  onSimulationCountChange,
  onHasChanges,
}: Props) {
  const [extraEigenGeld, setExtraEigenGeld] = useState(0);
  const [extraInkomen,   setExtraInkomen]   = useState(0);
  const [vastContract,   setVastContract]   = useState(baseProfile.vastContract);
  const [bidAmount,      setBidAmount]      = useState(baseProfile.desiredPrice);
  const [simResult,      setSimResult]      = useState<ScoreResult>(baseResult);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasChanges =
    extraEigenGeld > 0 ||
    extraInkomen > 0 ||
    vastContract !== baseProfile.vastContract ||
    bidAmount !== baseProfile.desiredPrice;

  // Informeer parent over hasChanges + reset functie
  useEffect(() => {
    onHasChanges?.(hasChanges, reset);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasChanges]);

  useEffect(() => {
    if (!hasChanges) {
      setSimResult(baseResult);
      return;
    }

    const changes: Partial<UserProfile> = {
      eigenGeld:   baseProfile.eigenGeld + extraEigenGeld,
      grossIncome: baseProfile.grossIncome + extraInkomen,
      vastContract,
    };

    const result = calculateSimulation(baseProfile, changes, bidAmount);
    setSimResult(result);

    const newCount = simulationCount + 1;
    onSimulationCountChange(newCount);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!assessmentId) return;
      try {
        await fetch("/api/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ baseProfile, changes, assessmentId, bidAmount }),
        });
      } catch { /* stil falen */ }
    }, 1200);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraEigenGeld, extraInkomen, vastContract, bidAmount]);

  const scoreDiff = simResult.totalScore - baseResult.totalScore;

  function reset() {
    setExtraEigenGeld(0);
    setExtraInkomen(0);
    setVastContract(baseProfile.vastContract);
    setBidAmount(baseProfile.desiredPrice);
    setSimResult(baseResult);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Nu / Scenario balk ── */}
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        gap:            32,
        padding:        "16px 40px",
        border:         "1px solid #e8e9ec",
        borderRadius:   16,
        background:     !hasChanges ? "#fafafa"
          : scoreDiff > 0 ? "rgba(0,202,34,0.04)"
          : scoreDiff < 0 ? "rgba(255,68,68,0.04)"
          : "#fafafa",
      }}>
        {/* Nu */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#ADADAD", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Nu</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: "#111111", lineHeight: 1 }}>{baseResult.totalScore}</p>
          <p style={{ fontSize: 11, color: "#ADADAD", marginTop: 2 }}>{baseResult.label}</p>
        </div>

        {/* Delta */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{
            display:      "flex",
            alignItems:   "center",
            gap:          4,
            fontSize:     13,
            fontWeight:   700,
            padding:      "4px 12px",
            borderRadius: 40,
            background:   !hasChanges || scoreDiff === 0 ? "#F0F0F0"
              : scoreDiff > 0 ? "rgba(0,202,34,0.12)"
              : "rgba(255,68,68,0.12)",
            color: !hasChanges || scoreDiff === 0 ? "#ADADAD"
              : scoreDiff > 0 ? "#00CA22"
              : "#FF4444",
          }}>
            {!hasChanges || scoreDiff === 0 ? (
              <Minus style={{ width: 12, height: 12 }} />
            ) : scoreDiff > 0 ? (
              <TrendingUp style={{ width: 12, height: 12 }} />
            ) : (
              <TrendingDown style={{ width: 12, height: 12 }} />
            )}
            <span>
              {!hasChanges || scoreDiff === 0 ? "Pas aan"
                : scoreDiff > 0 ? `+${scoreDiff} pts`
                : `${scoreDiff} pts`}
            </span>
          </div>
        </div>

        {/* Scenario */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#ADADAD", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Scenario</p>
          <p style={{
            fontSize: 32, fontWeight: 700, lineHeight: 1,
            color: !hasChanges ? "#CCCCCC"
              : scoreDiff > 0 ? "#00CA22"
              : scoreDiff < 0 ? "#FF4444"
              : "#111111",
          }}>
            {simResult.totalScore}
          </p>
          <p style={{ fontSize: 11, color: "#ADADAD", marginTop: 2 }}>{simResult.label}</p>
        </div>
      </div>

      {/* ── Sliders ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Biedprijs */}
        <StyledSlider
          label="Biedprijs"
          value={bidAmount}
          min={baseProfile.desiredPrice * 0.7}
          max={baseProfile.desiredPrice * 1.4}
          step={1000}
          onChange={setBidAmount}
          leftLabel={formatCurrency(baseProfile.desiredPrice * 0.7)}
          rightLabel={formatCurrency(baseProfile.desiredPrice * 1.4)}
          displayValue={formatCurrency(bidAmount)}
        />

        {/* Extra eigen geld */}
        <StyledSlider
          label="Extra eigen geld"
          value={extraEigenGeld}
          min={0}
          max={150000}
          step={5000}
          onChange={setExtraEigenGeld}
          leftLabel="€ 0"
          rightLabel="+ € 150.000"
          displayValue={extraEigenGeld > 0 ? `+${formatCurrency(extraEigenGeld)}` : "€ 0"}
        />

        {/* Extra inkomen */}
        <StyledSlider
          label="Extra jaarinkomen"
          value={extraInkomen}
          min={0}
          max={50000}
          step={1000}
          onChange={setExtraInkomen}
          leftLabel="€ 0"
          rightLabel="+ € 50.000/jr"
          displayValue={extraInkomen > 0 ? `+${formatCurrency(extraInkomen)}/jr` : "€ 0"}
        />

        {/* Vast contract toggle */}
        {!baseProfile.vastContract && (
          <div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#000000", marginBottom: 12 }}>Vast contract scenario</p>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { val: false, txt: "Huidig (flex)" },
                { val: true,  txt: "Met vast contract" },
              ].map((opt) => (
                <button
                  key={String(opt.val)}
                  type="button"
                  onClick={() => setVastContract(opt.val)}
                  style={{
                    flex:         1,
                    padding:      "10px 16px",
                    borderRadius: 8,
                    border:       vastContract === opt.val ? "1px solid #257CFF" : "1px solid #e8e9ec",
                    background:   vastContract === opt.val ? "rgba(37,124,255,0.06)" : "#ffffff",
                    fontSize:     14,
                    fontWeight:   600,
                    color:        vastContract === opt.val ? "#257CFF" : "#ADADAD",
                    cursor:       "pointer",
                  }}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
