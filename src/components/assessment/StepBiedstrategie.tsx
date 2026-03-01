"use client";

import type { UserProfile, BiedStrategie } from "@/types";
import { BIEDKRACHT_POINTS } from "@/lib/scoreConfig";

type Props = {
  profile: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
};

const MAX_POINTS = Object.values(BIEDKRACHT_POINTS).reduce((a, b) => a + b, 0);

// SVG iconen per strategie
const IconBieden = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1L10.163 5.279L15 6.006L11.5 9.402L12.326 14.219L8 11.979L3.674 14.219L4.5 9.402L1 6.006L5.837 5.279L8 1Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSlot = () => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5 7H2.5C1.67157 7 1 7.67157 1 8.5V13.5C1 14.3284 1.67157 15 2.5 15H11.5C12.3284 15 13 14.3284 13 13.5V8.5C13 7.67157 12.3284 7 11.5 7Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 7V4.5C4 3.57174 4.36875 2.6815 5.02513 2.02513C5.6815 1.36875 6.57174 1 7.5 1C8.42826 1 9.3185 1.36875 9.97487 2.02513C10.6313 2.6815 11 3.57174 11 4.5V7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconMakelaar = () => (
  <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5 14C11.5 14 15.75 11.5 15.75 7.75C15.75 5.125 13.625 3 11 3C9.625 3 8.375 3.625 7.5 4.625M5.5 14C5.5 14 1.25 11.5 1.25 7.75C1.25 5.125 3.375 3 6 3C7.375 3 8.625 3.625 9.5 4.625M9.5 9.5C9.5 11.157 8.157 12.5 6.5 12.5C4.843 12.5 3.5 11.157 3.5 9.5C3.5 7.843 4.843 6.5 6.5 6.5C8.157 6.5 9.5 7.843 9.5 9.5Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconDatum = () => (
  <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5 1V3.5M4.5 1V3.5M1 6H14M2.5 2.5H12.5C13.3284 2.5 14 3.17157 14 4V13.5C14 14.3284 13.3284 15 12.5 15H2.5C1.67157 15 1 14.3284 1 13.5V4C1 3.17157 1.67157 2.5 2.5 2.5Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSnel = () => (
  <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.75 1L1 9.25H7L6.25 16L13 7.75H7L7.75 1Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconKeuring = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.25 8C14.25 11.4518 11.4518 14.25 8 14.25C4.54822 14.25 1.75 11.4518 1.75 8C1.75 4.54822 4.54822 1.75 8 1.75C11.4518 1.75 14.25 4.54822 14.25 8Z" stroke="#ffffff" strokeWidth="1.5"/>
    <path d="M5.5 8L7.25 9.75L10.5 6.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconVerkoop = () => (
  <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.75 13.75H2.25M2.25 13.75H6.75M2.25 13.75V6.95037C2.25 6.52531 2.25 6.31267 2.29873 6.11488C2.34191 5.9396 2.41334 5.77373 2.50928 5.62384C2.61753 5.4547 2.76798 5.31444 3.06958 5.03454L6.67077 1.69242C7.22988 1.17353 7.50946 0.914072 7.82431 0.815314C8.10196 0.728229 8.39789 0.728229 8.67554 0.815314C8.99063 0.914146 9.27061 1.17385 9.83057 1.69353L13.4306 5.03454C13.7322 5.31443 13.8827 5.4547 13.9909 5.62384C14.0869 5.77373 14.1577 5.9396 14.2009 6.11488C14.2497 6.31267 14.25 6.52531 14.25 6.95037V13.75M6.75 13.75H9.75M6.75 13.75V10.5681C6.75 9.68942 7.42157 8.97713 8.25 8.97713C9.07843 8.97713 9.75 9.68942 9.75 10.5681V13.75M9.75 13.75H14.25M14.25 13.75H15.75" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const infoSvg = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer", flexShrink: 0 }}>
    <path d="M9.75 13.2998V9.2998M9.75 0.75C14.7206 0.75 18.75 4.77944 18.75 9.75C18.75 14.7206 14.7206 18.75 9.75 18.75C4.77944 18.75 0.75 14.7206 0.75 9.75C0.75 4.77944 4.77944 0.75 9.75 0.75ZM9.7002 6.2998V6.1998L9.7998 6.2002V6.2998H9.7002Z" stroke="#ADADAD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const tooltipArrow = (
  <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #111111" }} />
);

const tooltipBoxStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#111111",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.5,
  padding: "8px 12px",
  borderRadius: 8,
  width: 240,
  pointerEvents: "none",
  opacity: 0,
  transition: "opacity 0.15s ease",
  zIndex: 10,
  whiteSpace: "normal",
};

const STRATEGIEEN_CONFIG: {
  key: keyof BiedStrategie;
  label: string;
  tooltip: string;
  isVoorbehoud?: boolean;
  Icon: React.FC;
}[] = [
  {
    key: "bovenVraagprijs",
    label: "Boven vraagprijs bieden",
    tooltip: "Je bent bereid meer te bieden dan de vraagprijs. Dit vergroot je kansen aanzienlijk in een gespannen markt.",
    Icon: IconBieden,
  },
  {
    key: "zonderFinancieringsvoorbehoud",
    label: "Zonder financieringsvoorbehoud",
    tooltip: "Je biedt zonder voorbehoud van financiering. Dit maakt je bod direct aantrekkelijker voor de verkoper.",
    Icon: IconSlot,
  },
  {
    key: "aankoopmakelaar",
    label: "Aankoopmakelaar inschakelen",
    tooltip: "Een aankoopmakelaar kent de markt, adviseert je over de waarde en onderhandelt namens jou.",
    Icon: IconMakelaar,
  },
  {
    key: "flexibeleOpleverdatum",
    label: "Flexibele opleverdatum",
    tooltip: "Je past de overdrachtsdatum aan op de wens van de verkoper — een sterke troef in onderhandelingen.",
    Icon: IconDatum,
  },
  {
    key: "snelleOverdracht",
    label: "Snelle overdracht mogelijk",
    tooltip: "Je kunt de woning snel overdragen als de verkoper dat wenst. Verkopers waarderen dit.",
    Icon: IconSnel,
  },
  {
    key: "voorbehoudKeuring",
    label: "Voorbehoud aankoop keuring",
    tooltip: "Je kunt de koop ontbinden als een bouwkundige keuring ernstige gebreken aan het licht brengt. Dit beschermt jou als koper.",
    isVoorbehoud: true,
    Icon: IconKeuring,
  },
  {
    key: "voorbehoudVerkoop",
    label: "Voorbehoud verkoop eigen woning",
    tooltip: "Je koop is afhankelijk van de verkoop van je huidige woning. Let op: dit kan je bod minder aantrekkelijk maken.",
    isVoorbehoud: true,
    Icon: IconVerkoop,
  },
];

export default function StepBiedstrategie({ profile, onChange }: Props) {
  const strategie = profile.biedStrategie ?? {
    bovenVraagprijs: false,
    zonderFinancieringsvoorbehoud: false,
    flexibeleOpleverdatum: false,
    snelleOverdracht: false,
    aankoopmakelaar: false,
    voorbehoudKeuring: false,
    voorbehoudVerkoop: false,
  };

  function toggle(key: keyof BiedStrategie) {
    onChange({
      biedStrategie: { ...strategie, [key]: !strategie[key] },
    });
  }

  const totalPoints = (Object.keys(BIEDKRACHT_POINTS) as Array<keyof BiedStrategie>)
    .reduce((sum, key) => sum + (strategie[key] ? BIEDKRACHT_POINTS[key] : 0), 0);

  const pct = Math.round((totalPoints / MAX_POINTS) * 100);

  // Badge label + kleur op basis van punten
  const badgeColor = totalPoints >= 80 ? "#00CA22"
    : totalPoints >= 50 ? "#257CFF"
    : totalPoints >= 25 ? "#FF7525"
    : "#FF7525";


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── 0. Biedkracht potentieel ── */}
      <div style={{ padding: 20, border: "1px solid #e8e9ec", borderRadius: 16, background: "#ffffff" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 28, height: 28, background: "#FF7525", borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 13L5.5 7.5L9 10.5L13.5 4M13.5 4H10.5M13.5 4V7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ marginLeft: 16, fontSize: 18, fontWeight: 600, color: "#111111" }}>Jouw biedkracht</p>
          </div>
          {/* Score rechts */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: "#000000" }}>{totalPoints}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#ADADAD" }}>/100</span>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: badgeColor, borderRadius: 99, transition: "width 0.4s ease" }} />
        </div>
        {/* Subtekst */}
        <p style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: "#B2B2B2" }}>
          Selecteer strategiën hieronder om je biedkracht te vergroten
        </p>
      </div>

      {/* ── Strategieën ── */}
      {STRATEGIEEN_CONFIG.filter((s) => !s.isVoorbehoud).map((s) => {
        const isActive = strategie[s.key];
        const pts = BIEDKRACHT_POINTS[s.key];

        return (
          <div
            key={s.key}
            onClick={() => toggle(s.key)}
            style={{
              padding: 20,
              border: isActive ? "1px solid #257CFF" : "1px solid #e8e9ec",
              borderRadius: 16,
              background: isActive ? "rgba(37,124,255,0.04)" : "#ffffff",
              cursor: "pointer",
              transition: "all 0.15s",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Checkbox links */}
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                border: isActive ? "2px solid #257CFF" : "2px solid #D5D5D5",
                background: isActive ? "#257CFF" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s",
              }}>
                {isActive && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              {/* Label */}
              <p style={{ marginLeft: 16, fontSize: 14, fontWeight: 600, color: isActive ? "#257CFF" : "#111111", flex: 1, transition: "color 0.15s" }}>
                {s.label}
              </p>
              {/* Punten badge + tooltip rechts */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#B2B2B2", border: "1px solid rgba(178,178,178,0.2)", borderRadius: 8, padding: "4px 12px", background: "#F7F7F7" }}>
                  +{pts} pts
                </span>
                <div style={{ position: "relative", display: "inline-flex" }} className="tooltip-wrapper" onClick={(e) => e.stopPropagation()}>
                  {infoSvg}
                  <div className="tooltip-box" style={{ ...tooltipBoxStyle, width: 220 }}>
                    {s.tooltip}
                    {tooltipArrow}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Voorbehouden ── */}
      <div style={{ padding: 20, border: "1px solid #e8e9ec", borderRadius: 16, background: "#ffffff" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, background: "#257CFF", borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 1L14 4.5V8C14 11.5 11.5 14.74 7.5 15.75C3.5 14.74 1 11.5 1 8V4.5L7.5 1Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ marginLeft: 16, fontSize: 18, fontWeight: 600, color: "#111111" }}>Voorbehouden</p>
          <div style={{ marginLeft: "auto", position: "relative", display: "inline-flex" }} className="tooltip-wrapper">
            {infoSvg}
            <div className="tooltip-box" style={{ ...tooltipBoxStyle, width: 260 }}>
              Voorbehouden beschermen jou als koper, maar maken je bod minder aantrekkelijk voor verkopers. Kies bewust.
              {tooltipArrow}
            </div>
          </div>
        </div>

        {/* Voorbehoud rijen */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STRATEGIEEN_CONFIG.filter((s) => s.isVoorbehoud).map((s) => {
            const isActive = strategie[s.key];

            return (
              <div
                key={s.key}
                onClick={() => toggle(s.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 16px",
                  border: isActive ? "1px solid #257CFF" : "1px solid #e8e9ec",
                  borderRadius: 12,
                  background: isActive ? "rgba(37,124,255,0.04)" : "#ffffff",
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "all 0.15s",
                }}
              >
                {/* Checkbox links */}
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: isActive ? "2px solid #257CFF" : "2px solid #D5D5D5",
                  background: isActive ? "#257CFF" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShring: 0, transition: "all 0.15s",
                }}>
                  {isActive && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                {/* Label */}
                <p style={{ marginLeft: 16, fontSize: 14, fontWeight: 600, color: isActive ? "#257CFF" : "#111111", flex: 1, transition: "color 0.15s" }}>
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
