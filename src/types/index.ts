// ============================================
// WoningKans — Core Types v2 (WinScore 3-pijler)
// ============================================

// --- Biedstrategie input ---

export type BiedStrategie = {
  bovenVraagprijs:               boolean;
  zonderFinancieringsvoorbehoud: boolean;
  flexibeleOpleverdatum:         boolean;
  snelleOverdracht:              boolean;
  aankoopmakelaar:               boolean;
  voorbehoudKeuring:             boolean;
  voorbehoudVerkoop:             boolean;
};

// --- Gebruikersprofiel (3-stappen flow) ---

export type UserProfile = {
  // Stap 1: Woningcontext
  location:     string;
  desiredPrice: number;

  // Stap 2: Financiële uitgangspositie
  grossIncome:    number;
  partnerIncome?: number;
  eigenGeld:      number;    // spaargeld + schenkingen + overwaarde
  schulden:       number;    // studieschuld, persoonlijke lening, etc.
  vastContract:   boolean;   // vast dienstverband
  isStarter:      boolean;   // starter op de woningmarkt
  nhg:            boolean;   // valt binnen NHG-grens

  // Stap 3: Biedstrategie
  biedStrategie: BiedStrategie;
};

// --- Score output types ---

export type ScoreLabel = "Zwak" | "Gemiddeld" | "Sterk";

export type PijlerScore = {
  score:       number;    // 0-100
  label:       string;    // "Budget Power", "Biedkracht", "Marktspanning"
  explanation: string;
  weight:      number;
};

export type ActionPoint = {
  id:          string;
  priority:    "high" | "medium" | "low";
  title:       string;
  description: string;
  impactScore: number;   // verwachte score verbetering
  timeframe:   string;
};

// --- Concurrentie-inschatting ---
export type ConcurrentieInsight = {
  verwachtAantalBieders: number;      // gemiddeld verwacht in regio/prijsklasse
  overbiedKans: number;               // kans dat je moet overbieden (0-1)
  aanbevolenOverbiedPct: number;      // aanbevolen % boven vraagprijs om mee te dingen
  regioBenchmark: string;             // bijv. "In Amsterdam bieden gemiddeld 6 partijen mee"
};

// --- Maandelijkse kans (seizoenspatroon) ---
export type MaandKans = {
  maand: number;
  naam: string;
  kansScore: number;         // 0-100, gecombineerde kans voor DEZE gebruiker die maand
  kansFactor: number;        // relatieve factor t.o.v. gemiddeld jaar
  aanbodIndex: number;       // relatief aanbod
  label: string;             // toelichting
  isHuidigeMaand: boolean;
};

export type ScoreResult = {
  totalScore:    number;
  label:         ScoreLabel;
  scoreVersion:  string;
  pijlers: {
    budgetPower:   PijlerScore;
    biedkracht:    PijlerScore;
    marktspanning: PijlerScore;
  };
  maxMortgage:          number;
  maxPurchasePrice:     number;
  shortfall:            number;
  canAfford:            boolean;
  monthlyPayment:       number;   // bruto maandlast
  monthlyPaymentNetto:  number;   // netto na belastingaftrek (2024: 36.97%)
  nhgApplies:           boolean;  // of NHG van toepassing is
  actionPoints:    ActionPoint[];   // max 3
  // Nieuwe velden v2.0
  concurrentie:    ConcurrentieInsight;
  maandKansen:     MaandKans[];     // 12 maanden cyclus
  besteKoopMaanden: number[];       // maandnummers met hoogste kans
};

// --- Email capture ---

export type EmailCaptureContext =
  | "tweede_simulatie"
  | "opslaan"
  | "vergelijk_scenarios";

// --- Assessment flow metadata ---

export type AssessmentStepId = "regio" | "inkomen" | "biedstrategie";

export type AssessmentStep = {
  id:          AssessmentStepId;
  title:       string;
  description: string;
};

// --- Upgrade/waitlist ---

export type WaitlistEntry = {
  email:     string;
  createdAt: Date;
};

export type PricingPlan = "free" | "starter" | "pro";
