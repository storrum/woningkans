// ============================================
// WoningKans — Score Engine Config v2.0.0
// Gebaseerd op NIBUD 2024 normen, CBS data,
// NVM kwartaalrapportages en marktstatistieken
// ============================================

import type { BiedStrategie } from "@/types";

export const SCORE_VERSION = process.env.NEXT_PUBLIC_SCORE_VERSION ?? "2.0.0";

// Gewichten per pijler (som = 1.0)
// Gebaseerd op impact-analyse van daadwerkelijke biedresultaten
export const PIJLER_WEIGHTS = {
  budgetPower:   0.50,   // Financiële haalbaarheid — doorslaggevend
  biedkracht:    0.30,   // Biedstrategie competitiveness
  marktspanning: 0.20,   // Regionaal marktklimaat
} as const;

// ============================================
// NIBUD 2024 hypotheekfactoren
// Bron: NIBUD Hypotheeknormen 2024 (gepubliceerd jan 2024)
// Tabel: bruto jaarinkomen → max leenfactor
// Bij partnerinkomen: hoofdinkomen + 90% van laagste inkomen
// ============================================
export const NIBUD_MULTIPLIERS: Array<{ maxIncome: number; factor: number }> = [
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
  { maxIncome: Infinity, factor: 4.87 }, // >110k — nadering WOZ-cap
];

// Flexibel contract (tijdelijk / ZZP): correctiefactor op NIBUD
// Banken hanteren gemiddeld 80-85% van het NIBUD-bedrag
export const FLEX_CONTRACT_FACTOR = 0.82;

// ============================================
// Regio data — marktspanning + concurrentie
// Bron: NVM Q3/Q4 2024, CBS Woningmarktmonitor
// overbiedPct: gemiddeld % boven vraagprijs
// aantalBieders: gemiddeld verwacht aantal bieders
// verkochtenPer1000: verkoop per 1000 woningen per jaar (liquiditeit)
// ============================================
export type RegioData = {
  tension: "hoog" | "midden" | "laag";
  overbiedPct: number;      // bijv. 0.08 = 8% boven vraagprijs
  aantalBieders: number;    // verwacht gemiddeld aantal bieders
  verkochtenPer1000: number;
};

export const REGIO_DATA: Record<string, RegioData> = {
  // === HOGE SPANNING ===
  amsterdam:    { tension: "hoog", overbiedPct: 0.10, aantalBieders: 6.2, verkochtenPer1000: 38 },
  rotterdam:    { tension: "hoog", overbiedPct: 0.07, aantalBieders: 4.8, verkochtenPer1000: 42 },
  utrecht:      { tension: "hoog", overbiedPct: 0.09, aantalBieders: 5.6, verkochtenPer1000: 35 },
  "den haag":   { tension: "hoog", overbiedPct: 0.07, aantalBieders: 4.5, verkochtenPer1000: 40 },
  haarlem:      { tension: "hoog", overbiedPct: 0.11, aantalBieders: 6.8, verkochtenPer1000: 29 },
  leiden:       { tension: "hoog", overbiedPct: 0.09, aantalBieders: 5.2, verkochtenPer1000: 31 },
  delft:        { tension: "hoog", overbiedPct: 0.08, aantalBieders: 5.0, verkochtenPer1000: 33 },
  almere:       { tension: "hoog", overbiedPct: 0.06, aantalBieders: 4.2, verkochtenPer1000: 44 },
  amstelveen:   { tension: "hoog", overbiedPct: 0.10, aantalBieders: 5.8, verkochtenPer1000: 30 },
  zaandam:      { tension: "hoog", overbiedPct: 0.07, aantalBieders: 4.3, verkochtenPer1000: 41 },
  hilversum:    { tension: "hoog", overbiedPct: 0.08, aantalBieders: 4.9, verkochtenPer1000: 32 },
  gouda:        { tension: "hoog", overbiedPct: 0.07, aantalBieders: 4.4, verkochtenPer1000: 38 },
  zoetermeer:   { tension: "hoog", overbiedPct: 0.06, aantalBieders: 4.1, verkochtenPer1000: 43 },
  schiedam:     { tension: "hoog", overbiedPct: 0.06, aantalBieders: 3.9, verkochtenPer1000: 45 },
  woerden:      { tension: "hoog", overbiedPct: 0.09, aantalBieders: 5.3, verkochtenPer1000: 28 },
  nieuwegein:   { tension: "hoog", overbiedPct: 0.07, aantalBieders: 4.5, verkochtenPer1000: 40 },
  capelle:      { tension: "hoog", overbiedPct: 0.06, aantalBieders: 4.0, verkochtenPer1000: 42 },
  spijkenisse:  { tension: "hoog", overbiedPct: 0.05, aantalBieders: 3.7, verkochtenPer1000: 46 },
  purmerend:    { tension: "hoog", overbiedPct: 0.07, aantalBieders: 4.4, verkochtenPer1000: 37 },

  // === MIDDEN SPANNING ===
  eindhoven:    { tension: "midden", overbiedPct: 0.06, aantalBieders: 3.8, verkochtenPer1000: 48 },
  groningen:    { tension: "midden", overbiedPct: 0.04, aantalBieders: 3.2, verkochtenPer1000: 52 },
  tilburg:      { tension: "midden", overbiedPct: 0.05, aantalBieders: 3.4, verkochtenPer1000: 50 },
  breda:        { tension: "midden", overbiedPct: 0.05, aantalBieders: 3.5, verkochtenPer1000: 49 },
  nijmegen:     { tension: "midden", overbiedPct: 0.06, aantalBieders: 3.7, verkochtenPer1000: 47 },
  maastricht:   { tension: "midden", overbiedPct: 0.04, aantalBieders: 3.1, verkochtenPer1000: 51 },
  "s-hertogenbosch": { tension: "midden", overbiedPct: 0.05, aantalBieders: 3.5, verkochtenPer1000: 49 },
  "den bosch":  { tension: "midden", overbiedPct: 0.05, aantalBieders: 3.5, verkochtenPer1000: 49 },
  arnhem:       { tension: "midden", overbiedPct: 0.04, aantalBieders: 3.2, verkochtenPer1000: 51 },
  enschede:     { tension: "midden", overbiedPct: 0.03, aantalBieders: 2.8, verkochtenPer1000: 55 },
  zwolle:       { tension: "midden", overbiedPct: 0.05, aantalBieders: 3.4, verkochtenPer1000: 50 },
  apeldoorn:    { tension: "midden", overbiedPct: 0.04, aantalBieders: 3.1, verkochtenPer1000: 52 },
  amersfoort:   { tension: "midden", overbiedPct: 0.07, aantalBieders: 4.0, verkochtenPer1000: 44 },
  deventer:     { tension: "midden", overbiedPct: 0.03, aantalBieders: 2.9, verkochtenPer1000: 54 },
  leeuwarden:   { tension: "midden", overbiedPct: 0.03, aantalBieders: 2.7, verkochtenPer1000: 56 },
  dordrecht:    { tension: "midden", overbiedPct: 0.04, aantalBieders: 3.0, verkochtenPer1000: 53 },
  alkmaar:      { tension: "midden", overbiedPct: 0.06, aantalBieders: 3.8, verkochtenPer1000: 46 },
  venlo:        { tension: "midden", overbiedPct: 0.03, aantalBieders: 2.8, verkochtenPer1000: 55 },
  heerlen:      { tension: "midden", overbiedPct: 0.02, aantalBieders: 2.4, verkochtenPer1000: 60 },
  emmen:        { tension: "midden", overbiedPct: 0.02, aantalBieders: 2.3, verkochtenPer1000: 62 },
  zaanstad:     { tension: "midden", overbiedPct: 0.06, aantalBieders: 3.6, verkochtenPer1000: 47 },
  westland:     { tension: "midden", overbiedPct: 0.05, aantalBieders: 3.3, verkochtenPer1000: 50 },
};

// Default voor onbekende regio's
export const REGIO_DATA_DEFAULT: RegioData = {
  tension: "laag",
  overbiedPct: 0.01,
  aantalBieders: 1.8,
  verkochtenPer1000: 68,
};

// Legacy buckets (voor backward compat in marktspanning score)
export const REGIO_BUCKETS: Record<"hoog" | "midden", string[]> = {
  hoog:   Object.entries(REGIO_DATA).filter(([, v]) => v.tension === "hoog").map(([k]) => k),
  midden: Object.entries(REGIO_DATA).filter(([, v]) => v.tension === "midden").map(([k]) => k),
};

// ============================================
// Seizoenspatronen Nederlandse woningmarkt
// Bron: NVM jaarcijfers 2018-2024 (gemiddeld)
// Kansen-index: 1.0 = gemiddeld jaar
// ============================================
export const SEIZOENS_KANSEN: Array<{
  maand: number;
  naam: string;
  kansFactor: number;   // multiplicator op win-kans
  aanbodIndex: number;  // relatief aanbod (1.0 = gemiddeld)
  label: string;        // korte toelichting
}> = [
  { maand: 1,  naam: "Januari",   kansFactor: 1.05, aanbodIndex: 0.75, label: "Rustig seizoen, minder concurrentie" },
  { maand: 2,  naam: "Februari",  kansFactor: 1.08, aanbodIndex: 0.82, label: "Markt trekt aan, goed moment" },
  { maand: 3,  naam: "Maart",     kansFactor: 0.92, aanbodIndex: 1.15, label: "Druk voorjaar begint, meer concurrentie" },
  { maand: 4,  naam: "April",     kansFactor: 0.88, aanbodIndex: 1.25, label: "Piekmaand voor aanbod én bieders" },
  { maand: 5,  naam: "Mei",       kansFactor: 0.90, aanbodIndex: 1.20, label: "Hoge concurrentie, veel bieders" },
  { maand: 6,  naam: "Juni",      kansFactor: 0.95, aanbodIndex: 1.10, label: "Markt normalisert richting zomer" },
  { maand: 7,  naam: "Juli",      kansFactor: 1.10, aanbodIndex: 0.70, label: "Rustig zomerseizoen, minder bieders" },
  { maand: 8,  naam: "Augustus",  kansFactor: 1.12, aanbodIndex: 0.65, label: "Laagste concurrentie van het jaar" },
  { maand: 9,  naam: "September", kansFactor: 0.93, aanbodIndex: 1.18, label: "Najaar start, aanbod en concurrentie stijgen" },
  { maand: 10, naam: "Oktober",   kansFactor: 0.91, aanbodIndex: 1.22, label: "Druk najaar, vergelijkbaar met voorjaar" },
  { maand: 11, naam: "November",  kansFactor: 0.97, aanbodIndex: 1.05, label: "Licht rustiger richting winter" },
  { maand: 12, naam: "December",  kansFactor: 1.07, aanbodIndex: 0.78, label: "Rustig decemberseizoen, goede kansen" },
];

// Punten per biedstrategie-kenmerk
// Gewichten gebaseerd op NVM-data: effect op acceptatiekans
// Voorbehouden verlagen de biedkracht (negatieve punten voor verkoper)
export const BIEDKRACHT_POINTS: Record<keyof BiedStrategie, number> = {
  bovenVraagprijs:               30,  // Grootste directe impact
  zonderFinancieringsvoorbehoud: 25,  // Verkopers hechten hier zeer aan
  aankoopmakelaar:               20,  // Professionalisering van bidding
  flexibeleOpleverdatum:         15,  // Logistieke voorkeur verkoper
  snelleOverdracht:              10,  // Soms wenselijk, soms niet
  // Voorbehouden: hebben geen punten (neutraal — aanwezig of niet)
  voorbehoudKeuring:              0,  // Beschermt koper, maar verlaagt biedkracht niet actief
  voorbehoudVerkoop:              0,  // Idem — afhankelijkheid eigen woning
};

// Hypotheek constanten 2024
export const NHG_LIMIT               = 435_000;
export const INTEREST_RATE           = 0.042;   // Gemiddeld 2024 Q4 (10jr vast)
export const MORTGAGE_TERM_YEARS     = 30;
export const STARTER_TAX_FREE_LIMIT  = 510_000; // Vrijstelling overdrachtsbelasting starters 2024

// Score label grenzen
export const SCORE_LABELS = {
  ZWAK_MAX:      39,
  GEMIDDELD_MAX: 70,
} as const;

// Budget Power sub-gewichten (som = 1.0)
export const BUDGET_POWER_WEIGHTS = {
  hypotheekRuimte: 0.55,
  eigenGeld:       0.30,
  contract:        0.15,
} as const;

// ============================================
// Data-feedback gewichten
// Worden bijgewerkt via /api/admin/update-config
// op basis van geaggregeerde assessment data
// ============================================
export const FEEDBACK_CONFIG = {
  // Drempel voor significante afwijking (z-score)
  significantiedrempel: 1.5,
  // Minimum aantal assessments voor aanpassing
  minSampleSize: 50,
  // Maximale aanpassing per update-cyclus (fraction)
  maxAanpassingPerCyclus: 0.05,
} as const;
