"use client";

import { useState } from "react";
import type { UserProfile } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { parseFundaUrl, isFundaUrl } from "@/lib/fundaParser";
import { Link2, CheckCircle, AlertCircle, Loader2, X, ChevronDown } from "lucide-react";

type Props = {
  profile: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
};

type FundaState = "idle" | "loading" | "success" | "error";

const PRICE_PRESETS = [300_000, 400_000, 500_000, 600_000, 750_000];

export default function StepRegio({ profile, onChange }: Props) {
  const [fundaInput, setFundaInput]     = useState("");
  const [fundaState, setFundaState]     = useState<FundaState>("idle");
  const [fundaMessage, setFundaMessage] = useState("");
  const [showFunda, setShowFunda]       = useState(false);

  const price = profile.desiredPrice ?? 350_000;

  function handleFundaInputChange(val: string) {
    setFundaInput(val);
    if (fundaState !== "idle") {
      setFundaState("idle");
      setFundaMessage("");
    }
    if (isFundaUrl(val)) {
      setFundaState("loading");
      setFundaMessage("");
      setTimeout(() => {
        const result = parseFundaUrl(val);
        if (result.success && result.location) {
          onChange({ location: result.location });
          setFundaState("success");
          setFundaMessage(`Locatie "${result.location}" ingeladen.`);
        } else {
          setFundaState("error");
          setFundaMessage(result.error ?? "Kon de URL niet verwerken.");
        }
      }, 700);
    }
  }

  function clearFunda() {
    setFundaInput("");
    setFundaState("idle");
    setFundaMessage("");
  }

  function handlePriceInput(val: string) {
    const num = parseFloat(val.replace(/\./g, "").replace(",", ".")) || 0;
    onChange({ desiredPrice: num });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── 1. Funda link sectie ── */}
      <div style={{ padding: 20, border: "1px solid #e8e9ec", borderRadius: 16, background: "#ffffff" }}>
        {/* Header rij */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 28, height: 28, background: "#FF7525", borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.75 8.25H4.91667M0.75 8.25C0.75 12.3921 4.10786 15.75 8.25 15.75M0.75 8.25C0.75 4.10786 4.10786 0.75 8.25 0.75M4.91667 8.25H11.5833M4.91667 8.25C4.91667 12.3921 6.40905 15.75 8.25 15.75M4.91667 8.25C4.91667 4.10786 6.40905 0.75 8.25 0.75M11.5833 8.25H15.75M11.5833 8.25C11.5833 4.10786 10.0909 0.75 8.25 0.75M11.5833 8.25C11.5833 12.3921 10.0909 15.75 8.25 15.75M15.75 8.25C15.75 4.10786 12.3921 0.75 8.25 0.75M15.75 8.25C15.75 12.3921 12.3921 15.75 8.25 15.75" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ marginLeft: 16, fontSize: 18, fontWeight: 600, color: "#111111" }}>Plak hier je funda-link</p>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#B2B2B2" }}>(optioneel)</span>
        </div>
        <div style={{ position: "relative" }}>
          <input
            type="url"
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: 8,
              border: "1px solid rgba(178,178,178,0.2)",
              background: "#f7f7f7",
              fontSize: 14,
              fontWeight: 500,
              color: fundaInput ? "#111111" : "#ADADAD",
              outline: "none",
            }}
            placeholder="https://www.funda.nl/koop/amsterdam/huis-..."
            value={fundaInput}
            onChange={(e) => handleFundaInputChange(e.target.value)}
          />
          <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
            {fundaState === "loading" && <Loader2 className="w-4 h-4 text-sand-400 animate-spin" />}
            {fundaState === "success" && <CheckCircle className="w-4 h-4 text-success-500" />}
            {fundaState === "error"   && <AlertCircle className="w-4 h-4 text-danger-500" />}
          </div>
        </div>

        {fundaMessage && (
          <div className={cn(
            "flex items-start gap-2 text-xs rounded-xl px-3 py-2.5 mt-3",
            fundaState === "success" ? "bg-success-50 text-success-700" : "bg-danger-50 text-danger-600"
          )}>
            {fundaState === "success"
              ? <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              : <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            }
            <span>{fundaMessage}</span>
          </div>
        )}
      </div>{/* einde funda wrapper */}

      {/* ── 2. Locatie ── */}
      <div style={{ padding: 20, border: "1px solid #e8e9ec", borderRadius: 16, background: "#ffffff" }}>
        {/* Header rij */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, background: "#257CFF", borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.75 6.60154C0.75 10.7025 4.38814 14.0939 5.99848 15.3941C6.22894 15.5802 6.34556 15.6744 6.5175 15.7221C6.65138 15.7593 6.84843 15.7593 6.98232 15.7221C7.15458 15.6743 7.27038 15.5811 7.50171 15.3943C9.11205 14.094 12.75 10.7029 12.75 6.60192C12.75 5.04994 12.1179 3.56135 10.9927 2.46393C9.86744 1.36652 8.34141 0.75 6.7501 0.75C5.1588 0.75 3.63259 1.36661 2.50737 2.46403C1.38214 3.56144 0.75 5.04957 0.75 6.60154Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.03574 5.8215C5.03574 6.75514 5.80326 7.512 6.75003 7.512C7.69681 7.512 8.46433 6.75514 8.46433 5.8215C8.46433 4.88787 7.69681 4.131 6.75003 4.131C5.80326 4.131 5.03574 4.88787 5.03574 5.8215Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ marginLeft: 16, fontSize: 18, fontWeight: 600, color: "#111111" }}>In welke regio of stad bevindt de woning zich?</p>
        </div>
        <input
          type="text"
          style={{
            width: "100%",
            padding: "14px 20px",
            borderRadius: 8,
            border: "1px solid rgba(178,178,178,0.2)",
            background: "#f7f7f7",
            fontSize: 14,
            fontWeight: 500,
            color: profile.location ? "#111111" : "#ADADAD",
            outline: "none",
          }}
          placeholder="Bijv. Amsterdam, Utrecht, Eindhoven…"
          value={profile.location ?? ""}
          onChange={(e) => onChange({ location: e.target.value })}
        />
      </div>{/* einde locatie wrapper */}

      {/* ── 3. Richtprijs ── */}
      <div style={{ padding: 20, border: "1px solid #e8e9ec", borderRadius: 16, background: "#ffffff" }}>
        {/* Header rij */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, background: "#257CFF", borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8.25V12.9375C12 14.4908 9.4816 15.75 6.375 15.75C3.2684 15.75 0.75 14.4908 0.75 12.9375V8.25M12 8.25V3.5625M12 8.25C12 9.8033 9.4816 11.0625 6.375 11.0625C3.2684 11.0625 0.75 9.8033 0.75 8.25M12 3.5625C12 2.0092 9.4816 0.75 6.375 0.75C3.2684 0.75 0.75 2.0092 0.75 3.5625M12 3.5625C12 5.1158 9.4816 6.375 6.375 6.375C3.2684 6.375 0.75 5.1158 0.75 3.5625M0.75 8.25V3.5625" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ marginLeft: 16, fontSize: 18, fontWeight: 600, color: "#111111" }}>Wat is het budget dat je in gedachten hebt?</p>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 14,
            fontWeight: 500,
            color: "#ADADAD",
            pointerEvents: "none",
            userSelect: "none",
          }}>€</span>
          <input
            type="text"
            inputMode="numeric"
            style={{
              width: "100%",
              padding: "14px 20px 14px 36px",
              borderRadius: 8,
              border: "1px solid rgba(178,178,178,0.2)",
              background: "#f7f7f7",
              fontSize: 14,
              fontWeight: 500,
              color: profile.desiredPrice ? "#111111" : "#ADADAD",
              outline: "none",
            }}
            placeholder="350000"
            value={profile.desiredPrice || ""}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, "");
              onChange({ desiredPrice: onlyNums ? parseInt(onlyNums) : 0 });
            }}
          />
        </div>
      </div>{/* einde richtprijs wrapper */}


    </div>
  );
}
