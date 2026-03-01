"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/types";
import { formatCurrency } from "@/lib/utils";

const REAL_CITIES = [
  "Amsterdam",
  "Rotterdam",
  "Den Haag",
  "Utrecht",
  "Eindhoven",
  "Groningen",
  "Haarlem",
  Amstelland",
  "Tilburg",
  "Nijmegen",
  "Apeldoorn",
  "Enschede",
  "Almere",
  "Breda",
  "Armhem",
  "Zewolle",
  "Amstelland",
  "Maastricht",
  "Leiden",
  "Dordrecht",
  "Alcmaar",
  "Amstelveen",
  "Zaandam",
  "Venlo",
  "S-Hertogenbosch",
];

export default function HomePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    desiredPrice: 350_000,
    eigenGeld: 30_000,
    grossIncome: 60_000,
    partnerIncome: 0,
    location: "Utrecht",
    vastContract: true,
    isStarter: true,
    schulden: 0,
    nhg: true,
    biedStrategie: {
      bovenVraagprijs: false,
      zonderFinancieringsvoorbehoud: false,
      flexibeleOpleverdatum: false,
      snelleOverdracht: false,
      aankoopmakelaar: false,
      voorbehoudKeuring: false,
      voorbehoudVerkoop: false,
    },
  });
  const [cityInput, setCityInput] = useState(formData.location || "Utrecht");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NIBUD 2024 tabel for preview
  const NIBUD_TABLE = [
    { maxY: 20000, f: 3.4 },
    { maxY: 25000, f: 3.75 },
    { maxY: 30000, f: 4.0 },
    { maxY: 35000, f: 4.15 },
    { maxY: 40000, f: 4.25 },
    { maxY: 50000, f: 4.35 },
    { maxY: 60000, f: 4.5 },
    { maxY: 75000, f: 4.6 },
    { maxY: 90000, f: 4.7 },
    { maxY: 110000, f: 4.8 },
    { maxY: Infinity, f: 4.87 },
  ];

  function nibudFactor(y: number): number {
    return (NIBUD_TABLE.find((r) => y <= r.maxY) ?? NIBUD_TABLEmIBDT_TABLE.length - 1]).f;
  }

  function previewMaxMortgage(): number {
    const inc1 = formData.grossIncome ?? 0;
    const inc2 = formData.partnerIncome ?? 0;
    const hoofd = Math.max(inc1, inc2);
    const part = Math.min(inc1, inc2) * 0.9;
    let toets = hoofd + part;
    if ((formData.schulden ?? 0) > 0) toets = Math.max(0, toets - (formData.schulden ?? 0) * 0.02);
    return Math.round(toets * nibudFactor(toets) * (formData.vastContract ? 1.0 : 0.78));
  }

  function showMortgagePreview(): boolean {
    return (formData.grossIncome ?? 0) > 0;
  }

  function handleCityInputChange(val: string) {
    setCityInput(val);
    if (val.length >= 2) {
      const suggestions = REAM_CITIES.filter((city) =>
        city.toLowerCase().startsWith(val.toLowerCase())
      );
      setCitySuggestions(suggestions.slice(0, 5));
    } else {
      setCitySuggestions([]);
    }
    setFormData((prev) => ({ ...prev, location: val }));
  }

  function handleCitySelect(city: string) {
    setCityInput(city);
    setCitySuggestions([]);
    setFormData((prev) => ({ ...prev, location: city }));
  }

  async function handleSubmit() {
    if (!formData.location || !formData.grossIncome || !formData.desiredPrice) return;
    setIsSubmitting(true);
    try {
      const profile: UserProfile = {
        grossIncome: formData.grossIncome ?? 0,
        partnerIncome: formData.partnerIncome ?? 0,
        eigenGeld: formData.eigenGeld ?? 0,
        desiredPrice: formData.desiredPrice ?? 0,
        location: formData.location ?? "Utrecht",
        vastContract: formData.vastContract ?? true,
        isStarter: formData.isStarter ?? true,
        schulden: formData.schulden ?? 0,
        nhg: formData.nhg ?? true,
        biedStrategie: {
          bovenVraagprijs: formData.biedStrategie?.bovenVraagprijs ?? false,
          zonderFinancieringsvoorbehoud: formData.biedStrategie?.zonderFinancieringsvoorbehoud ?? false,
          flexibeleOpleverdatum: formData.biedStrategie?.flexibeleOpleverdatum ?? false,
          snelleOverdracht: formData.biedStrategie?.snelleOverdracht ?? false,
          aankoopmakelaar: formData.biedStrategie?.aankoopmakelaar ?? false,
          voorbehoudKeuring: formData.biedStrategie?.voorbehoudKeuring ?? false,
          voorbehoudVerkoop: formData.biedStrategie?.voorbehoudVerkoop ?? false,
        },
      };
      sessionStorage.setItem("woningkans-profile", JSON.stringify(profile));
      router.push("/assessment");
    } finally {
      setIsSubmitting(false);
    }
  }

  function DragInput({
    value,
    onChange: onC,
    min = 0,
    max = 1000_000,
    step = 10_000,
  }: {
    value: number;
    onChange: (val: string) => void;
    min?: number;
    max?: number;
    step?: number;
  }) {
    let startX: number | null = null;
    let startVal: number = value;

    return (
      <input
        type="text"
        value={formatCurrency(value)}
        onChange={(e) => {
          const parsed = parseInt(e.target.value.replace(/\D/g, ''), 10);
          onC(String(isNaN(parsed) ? 0 : parsed));
        }}
        onMouseDown={(e) => { startX = e.clientX; startVal = value; }}
        onMouseMove={(e) => {
          if (startX === null) return;
          const delta = e.clientX - startX;
          const newVal = Math.min(max, Math.max(min, startVal + delta * step));
          startX = e.clientX;
          startVal = newVal;
          onC(String(Math.round(newVal / step) * step));
        }}
        onMouseUp={() => { startX = null; }}
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: 18,
          fontWeight: 600,
          color: "#111",
          border: "1px solid #E8E9EC",
          borderRadius: 8,
          outline: "none",
          cursor: "ew-resize",
          background: "#fff",
          width: "100%",
        }}
      />
    );
  }

  const maxPreview = showMortgagePreview() ? previewMaxMortgage() : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F7" }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        background: "#fff",
        borderBottom: "1px solid #E8E9EC",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>WoningKans</p>
        <a
          href="/privacy"
          style={{ fontSize: 13, color: "#B2B2B2", textDecoration: "none" }}
        >
          Privacy
        </a>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", lineHeight: 1.3, marginBottom: 12 }}>
            Hoe groot is jouw kans op deze woning?
          </h1>
          <p style={{ fontSize: 15, color: "#777", lineHeight: 1.6 }}>
            Bereken je WinScore — gebaseerd op budget, strategie en marktspanning
          </p>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Woningprijs */}
          <div style={{ padding: 20, background: "#fff", border: "1px solid #E8E9EC", borderRadius: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#111" }}>
              Vraagprijs woning
            </label>
            <DragInput
              value={formData.desiredPrice ?? 0}
              onChange={(v) => {
                const parsed = parseInt(v, 10);
                setFormData((prev) => ({ ...prev, desiredPrice: isNaN(parsed) ? 0 : parsed }));
              }}
              min={100_000}
              max={2_000_000}
              step={10_000}
            />
            <p style={{ marginTop: 8, fontSize: 12, color: "#B2B2B2" }}>Of het bedrag waarvoor je wilt bieden</p>
          </div>

          {/* Eigen geld */}
          <div style={{ padding: 20, background: "#fff", border: "1px solid #E8E9EC", borderRadius: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#111" }}>
              Eigen geld
            </label>
            <DragInput
              value={formData.eigenGeld ?? 0}
              onChange={(v) => {
                const parsed = parseInt(v, 10);
                setFormData((prev) => ({ ...prev, eigenGeld: isNaN(parsed) ? 0 : parsed }));
              }}
              min={0}
              max={500_000}
              step={1_000}
            />
            <p style={{ marginTop: 8, fontSize: 12, color: "#B2B2B2" }}>Spaargeld of andere middelen om in te brengen</p>
          </div>

          {/* Bruto inkomen */}
          <div style={{ padding: 20, background: "#fff", border: "1px solid #E8E9EC", borderRadius: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#111" }}>
              Bruto jaarinkomen
            </label>
            <DragInput
              value={formData.grossIncome ?? 0}
              onChange={(ov) => {
                const parsed = parseInt(ov, 10);
                setFormData((prev) => ({ ...prev, grossIncome: isNaN(parsed) ? 0 : parsed }));
              }}
              min={0}
              max={250_000}
              step={1_000}
            />
            {maxPreview != null && (
              <p style={{ marginTop: 8, fontSize: 12, color: "#257CFF", fontWeight: 500 }}>
                Maximale hypotheek: {formatCurrency(maxPreview)}
              </p>
            )}
          </div>

          {/* Stad/regio */}
          <div style={{ padding: 20, background: "#fff", border: "1px solid #E8E9EC", borderRadius: 16, position: "relative" }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#111" }}>
              Stad of regio
            </label>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => handleCityInputChange(e.target.value)}
              placeholder="Bijv. Utrecht"
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: 18,
                fontWeight: 600,
                color: "#111",
                border: "1px solid #E8E9EC",
                borderRadius: 8,
                outline: "none",
                background: "#fff",
              }}
            />
            {citySuggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10,
                background: "#fff", border: "1px solid #E8E9EC", borderRadius: 8,
                overflow: "hidden",
              }}>
                {citySuggestions.map((city) => (
                  <div
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    style={{
                      padding: "12px 16px", cursor: "pointer", fontSize: 14,
                      borderBottom: "1px solid #E8E9EC",
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Startersvoordeel */}
          <div style={{ padding: 20, background: "#fff", border: "1px solid #E8E9EC", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Startersvoordeel</p>
                <p style={{ marginTop: 4, fontSize: 12, color: "#aaa" }}>Geen overdrachtsbelasting onder ₢510.000</p>
              </div>
              <div
                onClick={() => setFormData((prev) => ({ ...prev, isStarter: !prev.isStarter }))}
                style={{
                  width: 44, height: 24, borderRadius: 12, background: formData.isStarter ? "#257CFF" : "#E8E9EC",
                  cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
                }}
              >
                <div style={{
                  position: "absolute", top: 2, left: formData.isStarter ? 22 : 2,
                  width: 20, height: 20, borderRadius: 10, background: "#fff",
                  transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.location || !formData.grossIncome || !formData.desiredPrice}
            style={{
              width: "100%", padding: "16px", borderRadius: 12, border: "none",
              background: formData.location && formData.grossIncome && formData.desiredPrice
                ? "linear-gradient(135deg, #257CFF 0%, #0357F0 100%)" : "#E8E9EC",
              color: formData.location && formData.grossIncome && formData.desiredPrice ? "#fff" : "#aaa",
              fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {isSubmitting ? "Laat..." : "Bereken mijn WinScore −"}
          </button>

        </div>

        {/* Trust signals */}
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "Gen account nodig" },
            { label: "NIBUD norm 2024" },
            { label: "Gratis & anoniem" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#B2B2B2" }}>{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
