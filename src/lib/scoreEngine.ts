// ============================================
// WoningKans — WinScore Engine v2.0.0
// 3-pijler systeem: Budget Power, Biedkracht, Marktspanning
// + Concurrentie-inschatting + Maandelijkse kansen
//
// Gebaseerd op:
// - NIBUD Hypotheeknormen 2024
// - NVM marktdata Q3/Q4 2024
// - CBS Woningmarktmonitor
// ============================================

import type {
  UserProfile,
  ScoreResult,
  PijlerScore,
  ActionPoint,
  ScoreLabel,
  ConcurrentieInsight,
  MaandKans,
} from "@/types";

import {
  SCORE_VERSION,
  PIJLER_WEIGHTS,
  REGIO_DATA,
  REGIO_DATA_DEFAULT,
  BIEDKRACHT_POINTS,
  INTEREST_RATE,
  MORTGAGE_TERM_YEARS,
  STARTER_TAX_FREE_LIMIT,
  SCORE_LABELS,
  BUDGET_POWER_WEIGHTS,
  NIBUD_MULTIPLIERS,
  FLEX_CONTRACT_FACTOR,
  SEIZOENS_KANSEN,
} from "./scoreConfig";

// ============================================
// Interne helpers
// ============================================

function getRegioData(location: string) {
  const normalized = location.toLowerCase().trim();
  // Exacte match eerst
  if (REGIO_DATA[normalized]) return REGIO_DATA[normalized];
  // Gedeeltelijke match (bijv. "Amsterdam Oost" → amsterdam)
  const match = Object.keys(REGIO_DATA).find((r) => normalized.includes(r));
  return match ? REGIO_DATA[match] : REGIO_DATA_DEFAULT;
}

function getRegioTension(location: string): "hoog" | "midden" | "laag" {
  return getRegioData(location).tension;
}

function getScoreLabel(score: number): ScoreLabel {
  if (score <= SCORE_LABELS.ZWAK_MAX) return "Zwak";
  if (score <= SCORE_LABELS.GEMIDDELD_MAX) return "Gemiddeld";
  return "Sterk";
}

/**
 * NIBUD 2024 correcte hypotheekberekening
 * Bij twee inkomens: hoogste inkomen + 90% van het laagste inkomen
 * Bron: NIBUD Hypotheeknormen 2024, tabel 1
 */
function getNibudMultiplier(toetsinkomen: number): number {
  for (const row of NIBUD_MULTIPLIERS) {
    if (toetsinkomen <= row.maxIncome) return row.factor;
  }
  return NIBUD_MULTIPLIERS[NIBUD_MULTIPLIERS.length - 1].factor;
}

// NHG grens 2024
const NHG_LIMIT = 435_000;
// Belastingaftrek hypotheekrente 2024 (box 1, schijf 1)
const BELASTINGAFTREK_PCT = 0.3697;

function calcMaxMortgage(profile: UserProfile): number {
  const income1 = profile.grossIncome;
  const income2 = profile.partnerIncome ?? 0;

  // NIBUD-regel: hoogste inkomen volledig, laagste voor 90%
  const hoofdInkomen = Math.max(income1, income2);
  const partnerBijdrage = Math.min(income1, income2) * 0.9;
  let toetsinkomen = hoofdInkomen + partnerBijdrage;

  // Schulden aftrek (NIBUD 2024): elke € schuld verlaagt toetsinkomen met 2%/jaar
  // Bijv. €10.000 studieschuld → toetsinkomen -€200/jr
  const schulden = profile.schulden ?? 0;
  if (schulden > 0) {
    toetsinkomen = Math.max(0, toetsinkomen - schulden * 0.02);
  }

  const multiplier = getNibudMultiplier(toetsinkomen);
  const rawMortgage = toetsinkomen * multiplier;

  // Correctiefactor voor flexibel/tijdelijk contract
  const contractFactor = profile.vastContract ? 1.0 : FLEX_CONTRACT_FACTOR;

  return Math.max(0, Math.round(rawMortgage * contractFactor));
}

function calcNhgApplies(profile: UserProfile): boolean {
  return (profile.nhg ?? false) && (profile.desiredPrice ?? 0) <= NHG_LIMIT;
}

function calcMonthlyPaymentNetto(loanAmount: number): number {
  if (loanAmount <= 0) return 0;
  const r = INTEREST_RATE / 12;
  const n = MORTGAGE_TERM_YEARS * 12;
  const bruto = (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  // Renteportie in jaar 1 (annuïteit): loanAmount × maandelijkse rente
  const rentePortieJaar1 = loanAmount * r;
  // Fiscaal voordeel: aftrekbare rente × belastingpercentage / 12 maanden
  const maandelijksBelastingVoordeel = (rentePortieJaar1 * BELASTINGAFTREK_PCT) / 12;
  return Math.round(bruto - maandelijksBelastingVoordeel);
}

function calcMonthlyPayment(loanAmount: number): number {
  if (loanAmount <= 0) return 0;
  const r = INTEREST_RATE / 12;
  const n = MORTGAGE_TERM_YEARS * 12;
  return Math.round((loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1));
}

function calcMonthlyPaymentBruto(loanAmount: number): number {
  return calcMonthlyPayment(loanAmount);
}

function calcMaxPurchasePrice(profile: UserProfile, maxMortgage: number): number {
  const transferTax =
    profile.isStarter && profile.desiredPrice <= STARTER_TAX_FREE_LIMIT ? 0 : 0.02;
  const buyingCosts = 0.04 + transferTax;
  const costsKoper = profile.desiredPrice * buyingCosts;
  const usableOwnFunds = Math.max(0, profile.eigenGeld * 0.85 - costsKoper);
  return Math.round(maxMortgage + usableOwnFunds);
}

// ============================================
// Pijler 1: Budget Power (gewicht: 50%)
// ============================================

function calcBudgetPower(profile: UserProfile, maxMortgage: number): PijlerScore {
  const mortgageRatio = maxMortgage / profile.desiredPrice;
  let mortgageScore: number;
  if (mortgageRatio >= 0.95)      mortgageScore = 100;
  else if (mortgageRatio >= 0.85) mortgageScore = 82;
  else if (mortgageRatio >= 0.75) mortgageScore = 65;
  else if (mortgageRatio >= 0.60) mortgageScore = 45;
  else if (mortgageRatio >= 0.40) mortgageScore = 25;
  else                            mortgageScore = 10;

  // Eigen geld: dekking van kosten koper (gemiddeld 6% van koopsom)
  const ownFundsCoverageRatio = profile.eigenGeld / (profile.desiredPrice * 0.06);
  let eigenGeldScore: number;
  if (ownFundsCoverageRatio >= 3)        eigenGeldScore = 100;
  else if (ownFundsCoverageRatio >= 2)   eigenGeldScore = 85;
  else if (ownFundsCoverageRatio >= 1)   eigenGeldScore = 65;
  else if (ownFundsCoverageRatio >= 0.5) eigenGeldScore = 35;
  else                                   eigenGeldScore = 15;

  // Contract: vast 100%, flex 55% (weerspiegelt lagere hypotheek)
  const contractScore = profile.vastContract ? 100 : 55;

  const score = Math.round(
    mortgageScore  * BUDGET_POWER_WEIGHTS.hypotheekRuimte +
    eigenGeldScore * BUDGET_POWER_WEIGHTS.eigenGeld +
    contractScore  * BUDGET_POWER_WEIGHTS.contract
  );

  return {
    score: Math.min(100, Math.max(0, score)),
    label: "Budget Power",
    explanation: `Hypotheek €${maxMortgage.toLocaleString("nl-NL")} · Eigen geld €${profile.eigenGeld.toLocaleString("nl-NL")} · ${profile.vastContract ? "Vast contract" : "Flex contract"}`,
    weight: PIJLER_WEIGHTS.budgetPower,
  };
}

// ============================================
// Pijler 2: Biedkracht (gewicht: 30%)
// ============================================

function calcBiedkracht(profile: UserProfile): PijlerScore {
  const maxPoints = Object.values(BIEDKRACHT_POINTS).reduce((a, b) => a + b, 0);
  const earnedPoints = (Object.keys(BIEDKRACHT_POINTS) as Array<keyof typeof BIEDKRACHT_POINTS>)
    .reduce((sum, key) => sum + (profile.biedStrategie[key] ? BIEDKRACHT_POINTS[key] : 0), 0);

  const score = Math.round((earnedPoints / maxPoints) * 100);
  const activeCount = Object.values(profile.biedStrategie).filter(Boolean).length;

  const explanation = activeCount === 0
    ? "Geen biedstrategie ingevuld. Elke strategie vergroot je kansen aanzienlijk."
    : `${activeCount} van 5 strategieën actief — elke extra strategie verhoogt je score.`;

  return {
    score,
    label: "Biedkracht",
    explanation,
    weight: PIJLER_WEIGHTS.biedkracht,
  };
}

// ============================================
// Pijler 3: Marktspanning (gewicht: 20%)
// ============================================

function calcMarktspanning(profile: UserProfile): PijlerScore {
  const tension = getRegioTension(profile.location);
  const regioData = getRegioData(profile.location);

  let score: number;
  let explanation: string;

  if (tension === "hoog") {
    score = 30;
    explanation = `${profile.location} heeft een hoge marktspanning (gem. ${regioData.aantalBieders.toFixed(1)} bieders per woning). Een sterke biedstrategie is cruciaal.`;
  } else if (tension === "midden") {
    score = 60;
    explanation = `${profile.location} heeft een gemiddelde marktspanning (gem. ${regioData.aantalBieders.toFixed(1)} bieders per woning). Een goede biedstrategie maakt het verschil.`;
  } else {
    score = 90;
    explanation = `${profile.location} heeft een lagere marktspanning (gem. ${regioData.aantalBieders.toFixed(1)} bieders per woning). Je hebt meer ruimte om te onderhandelen.`;
  }

  return {
    score,
    label: "Marktspanning",
    explanation,
    weight: PIJLER_WEIGHTS.marktspanning,
  };
}

// ============================================
// Concurrentie-inschatting
// Gebaseerd op regio-data + prijsklasse + biedstrategie
// ============================================

function calcConcurrentie(profile: UserProfile, totalScore: number): ConcurrentieInsight {
  const regioData = getRegioData(profile.location);

  // Prijsklasse correctie: hogere prijsklasse = minder concurrentie
  // Gebaseerd op NVM-data: boven ₢600k significant minder bieders
  let prijsKlasseFactor = 1.0;
  if (profile.desiredPrice > 700_000) prijsKlasseFactor = 0.55;
  else if (profile.desiredPrice > 600_000) prijsKlasseFactor = 0.65;
  else if (profile.desiredPrice > 500_000) prijsKlasseFactor = 0.78;
  else if (profile.desiredPrice > 400_000) prijsKlasseFactor = 0.88;
  else if (profile.desiredPrice < 250_000) prijsKlasseFactor = 1.25; // starters-segment erg druk

  const verwachtAantalBieders = Math.max(
    1.0,
    Math.round((regioData.aantalBieders * prijsKlasseFactor) * 10) / 10
  );

  // Kans dat je moet overbieden (> vraagprijs)
  // Logistieke functie op basis van regio-overbiedpercentage
  const baseOverbiedKans = Math.min(0.98, regioData.overbiedPct * 8 + 0.20);
  const overbiedKans = Math.round(baseOverbiedKans * 100) / 100;

  // Aanbevolen overbiedpercentage
  // Gebaseerd op regio-benchmark + seizoen
  const huidigeMaand = new Date().getMonth() + 1;
  const seizoen = SEIZOENS_KANSEN.find((s) => s.maand === huidigeMaand)!;
  const aanbevolenOverbiedPct = Math.round(
    regioData.overbiedPct * seizoen.aanbodIndex * 100
  ) / 100;

  // Benchmark tekst
  const locatieNaam = profile.location.charAt(0).toUpperCase() + profile.location.slice(1);
  const regioBenchmark = `In ${locatieNaam} bieden gemiddeld ${verwachtAantalBieders} partijen mee op een vergelijkbare woning. Het gemiddelde overbiedpercentage is ${Math.round(regioData.overbiedPct * 100)}%.`;

  return {
    verwachtAantalBieders,
    overbiedKans,
    aanbevolenOverbiedPct,
    regioBenchmark,
  };
}

// ============================================
// Maandelijkse kansen (12 maanden cyclus)
// Combineert basis-WinScore met seizoenspatroon
// ============================================

function calcMaandKansen(totalScore: number): { maandKansen: MaandKans[]; besteKoopMaanden: number[] } {
  const huidigeMaand = new Date().getMonth() + 1;

  const maandKansen: MaandKans[] = SEIZOENS_KANSEN.map((seizoen) => {
    // Gecombineerde kans: basis-score aangepast voor seizoen
    // Hoger seizoensfactor = meer kans voor deze gebruiker
    const kansScore = Math.round(
      Math.min(100, Math.max(0, totalScore * seizoen.kansFactor))
    );

    return {
      maand: seizoen.maand,
      naam: seizoen.naam,
      kansScore,
      kansFactor: seizoen.kansFactor,
      aanbodIndex: seizoen.aanbodIndex,
      label: seizoen.label,
      isHuidigeMaand: seizoen.maand === huidigeMaand,
    };
  });

  // Beste maanden = top 3 op kansScore
  const gesorteerd = [...maandKansen].sort((a, b) => b.kansScore - a.kansScore);
  const besteKoopMaanden = gesorteerd.slice(0, 3).map((m) => m.maand);

  return { maandKansen, besteKoopMaanden };
}

// ============================================
// Actiepunten (max 3)
// ============================================

function generateActionPoints(
  profile: UserProfile,
  pijlers: ScoreResult["pijlers"],
  shortfall: number
): ActionPoint[] {
  const actions: ActionPoint[] = [];

  // Budget Power acties
  if (pijlers.budgetPower.score < 65) {
    if (shortfall > 10_000) {
      actions.push({
        id: "vergroot-eigen-geld",
        priority: "high",
        title: "Vergroot je eigen geld",
        description: `Je hebt nog €${shortfall.toLocaleString("nl-NL")} tekort. Extra spaargeld of een schenking dicht dit gat en verhoogt je Budget Power direct.`,
        impactScore: 15,
        timeframe: "6-18 maanden",
      });
    }
    if (!profile.vastContract && actions.length < 3) {
      actions.push({
        id: "vast-contract",
        priority: "high",
        title: "Zorg voor een vast contract",
        description: "Een vast arbeidscontract verhoogt je maximale hypotheek met ~22% (NIBUD-norm). Bespreek dit met je werkgever.",
        impactScore: 12,
        timeframe: "3-12 maanden",
      });
    }
  }

  // Biedkracht acties
  if (pijlers.biedkracht.score < 60 && actions.length < 3) {
    const activeCount = Object.values(profile.biedStrategie).filter(Boolean).length;
    if (activeCount < 3) {
      actions.push({
        id: "verbeter-biedstrategie",
        priority: "medium",
        title: "Verbeter je biedstrategie",
        description: "Overweeg: boven vraagprijs bieden, een aankoopmakelaar inschakelen, of zonder financieringsvoorbehoud bieden. Dit vergroot je kansen direct.",
        impactScore: 10,
        timeframe: "Direct",
      });
    }
  }

  // Marktspanning acties
  if (pijlers.marktspanning.score < 40 && actions.length < 3) {
    actions.push({
      id: "overweeg-regio",
      priority: "low",
      title: "Verbreed je zoekgebied",
      description: `${profile.location} is een gespannen markt. Omliggende gemeenten bieden vaak meer kansen bij een vergelijkbaar budget.`,
      impactScore: 8,
      timeframe: "Direct",
    });
  }

  // Fallback
  if (actions.length === 0) {
    actions.push({
      id: "aankoopmakelaar",
      priority: "medium",
      title: "Schakel een aankoopmakelaar in",
      description: "Een aankoopmakelaar kent de markt en helpt je strategisch bieden. Gemiddeld bespaar je meer dan de makelaar kost.",
      impactScore: 8,
      timeframe: "Direct",
    });
  }

  return actions.slice(0, 3);
}

// ============================================
// Hoofdfuncties (exports)
// ============================================

export function calculateWinScore(profile: UserProfile): ScoreResult {
  const maxMortgage      = calcMaxMortgage(profile);
  const maxPurchasePrice = calcMaxPurchasePrice(profile, maxMortgage);
  const shortfall        = Math.max(0, profile.desiredPrice - maxPurchasePrice);
  const canAfford        = maxPurchasePrice >= profile.desiredPrice;
  const loanAmount       = Math.min(maxMortgage, profile.desiredPrice);
  const monthlyPayment   = calcMonthlyPaymentBruto(loanAmount);
  const monthlyPaymentNetto = calcMonthlyPaymentNetto(loanAmount);
  const nhgApplies       = calcNhgApplies(profile);

  const pijlers = {
    budgetPower:   calcBudgetPower(profile, maxMortgage),
    biedkracht:    calcBiedkracht(profile),
    marktspanning: calcMarktspanning(profile),
  };

  const totalScore = Math.round(
    pijlers.budgetPower.score   * PIJLER_WEIGHTS.budgetPower +
    pijlers.biedkracht.score    * PIJLER_WEIGHTS.biedkracht +
    pijlers.marktspanning.score * PIJLER_WEIGHTS.marktspanning
  );

  const concurrentie = calcConcurrentie(profile, totalScore);
  const { maandKansen, besteKoopMaanden } = calcMaandKansen(totalScore);

  return {
    totalScore,
    label:        getScoreLabel(totalScore),
    scoreVersion: SCORE_VERSION,
    pijlers,
    maxMortgage,
    maxPurchasePrice,
    shortfall,
    canAfford,
    monthlyPayment,
    monthlyPaymentNetto,
    nhgApplies,
    actionPoints: generateActionPoints(profile, pijlers, shortfall),
    concurrentie,
    maandKansen,
    besteKoopMaanden,
  };
}

export function calculateSimulation(
  base: UserProfile,
  changes: Partial<UserProfile>,
  bidAmount?: number
): ScoreResult {
  const merged: UserProfile = {
    ...base,
    ...changes,
    desiredPrice: bidAmount !== undefined ? bidAmount : (changes.desiredPrice ?? base.desiredPrice),
    biedStrategie: {
      ...base.biedStrategie,
      ...(changes.biedStrategie ?? {}),
    },
  };
  return calculateWinScore(merged);
}
