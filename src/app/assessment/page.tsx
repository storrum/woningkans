"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { assessmentSteps } from "@/lib/assessmentSteps";
import { safeValidateProfile } from "@/lib/validation";
import { useSession, trackEvent } from "@/hooks/useSession";
import type { UserProfile } from "@/types";
import StepRegio from "@/components/assessment/StepRegio";
import StepInkomen from "@/components/assessment/StepInkomen";
import StepBiedstrategie from "@/components/assessment/StepBiedstrategie";
import { Home, ChevronRight, ChevronLeft, Loader2, Sparkles } from "lucide-react";

const DEFAULT_PROFILE: Partial<UserProfile> = {
  location:      "",
  desiredPrice:  350_000,
  grossIncome:   0,
  partnerIncome: 0,
  eigenGeld:     0,
  schulden:      0,
  nhg:           false,
  vastContract:  true,
  isStarter:     true,
  biedStrategie: {
    bovenVraagprijs:               false,
    zonderFinancieringsvoorbehoud: false,
    flexibeleOpleverdatum:         false,
    snelleOverdracht:              false,
    aankoopmakelaar:               false,
    voorbehoudKeuring:             false,
    voorbehoudVerkoop:             false,
  },
};

const STEP_EVENTS = ["step1_completed", "step2_completed", "step3_completed"];


export default function AssessmentPage() {
  const router    = useRouter();
  const sessionId = useSession();

  const [currentStep, setCurrentStep] = useState(0);
  const [profile,     setProfile]     = useState<Partial<UserProfile>>(DEFAULT_PROFILE);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [hasUsed,     setHasUsed]     = useState(false);

  const step     = assessmentSteps[currentStep];
  const isLast   = currentStep === assessmentSteps.length - 1;
  const progress = ((currentStep + 1) / assessmentSteps.length) * 100;

  useEffect(() => {
    // DEV MODE: gratis beurt check tijdelijk uitgeschakeld
    // const used = localStorage.getItem("woningkans_used");
    // if (used === "true") {
    //   setHasUsed(true);
    // }
    if (sessionId) {
      trackEvent(sessionId, "click_start_flow");
    }
  }, [sessionId]);

  function updateProfile(updates: Partial<UserProfile>) {
    setProfile((prev) => ({ ...prev, ...updates }));
    setError("");
  }

  async function handleNext() {
    setError("");

    if (!isLast) {
      if (sessionId) trackEvent(sessionId, STEP_EVENTS[currentStep]);
      setCurrentStep((s) => s + 1);
      return;
    }

    const validation = safeValidateProfile(profile);
    if (!validation.success) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    try {
      if (sessionId) trackEvent(sessionId, STEP_EVENTS[currentStep]);

      const res = await fetch("/api/calculate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ profile: validation.data, sessionId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
        return;
      }

      const { assessmentId, result } = await res.json();

      sessionStorage.setItem("woningkans_profile",       JSON.stringify(validation.data));
      sessionStorage.setItem("woningkans_result",        JSON.stringify(result));
      sessionStorage.setItem("woningkans_assessment_id", assessmentId ?? "");

      router.push("/result");
    } catch {
      setError("Er ging iets mis. Controleer je verbinding en probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setError("");
    }
  }

  // Gratis beurt op → betaalmuur tonen
  if (hasUsed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F1F7FF" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: "0 24px" }}>
          <div style={{ width: 64, height: 64, background: "#FF7525", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Sparkles style={{ width: 28, height: 28, color: "#ffffff" }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111111", marginBottom: 12 }}>
            Je gratis berekening is verbruikt
          </h1>
          <p style={{ fontSize: 16, color: "#ADADAD", fontWeight: 500, lineHeight: 1.6, marginBottom: 32 }}>
            Je hebt jouw gratis WinScore al berekend. Om opnieuw te berekenen heb je een Premium account nodig.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              href="/upgrade"
              style={{ display: "block", background: "#257CFF", color: "#ffffff", borderRadius: 16, padding: "16px 24px", fontSize: 16, fontWeight: 600, textDecoration: "none" }}
            >
              Upgrade naar Premium
            </Link>
            <Link
              href="/"
              style={{ display: "block", background: "#ffffff", color: "#111111", border: "1px solid #e8e9ec", borderRadius: 16, padding: "16px 24px", fontSize: 16, fontWeight: 600, textDecoration: "none" }}
            >
              Terug naar home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F1F7FF", position: "relative", overflow: "hidden" }}>

      {/* ── Decoratieve achtergrond blob ── */}
      <div style={{
        position: "fixed",
        width: 2458,
        height: 1382,
        top: -999,
        left: "50%",
        transform: "translateX(-50%) rotate(180deg)",
        background: "#ffffff",
        borderRadius: "50%",
        filter: "blur(130px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Navigatie: 80px hoog, wit, 1px bottom border 8% zwart ── */}
      <nav className="assessment-nav-height fixed top-0 w-full z-50 bg-white" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="mx-auto h-full flex items-center justify-between" style={{ maxWidth: 1440, paddingLeft: 23, paddingRight: 23 }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-orange rounded-xl flex items-center justify-center shadow-orange">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">WoningKans</span>
          </Link>
          <span className="text-sm font-medium text-sand-500">
            {currentStep + 1} / {assessmentSteps.length}
          </span>
        </div>
      </nav>

      {/* ── Progress bar ── */}
      <div className="assessment-progress-top" style={{ position: "relative", zIndex: 1 }}>
        <div className="col-6">
          {/* Balk zelf */}
          <div className="relative w-full overflow-visible" style={{ height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 0 }}>
            <div
              className="absolute left-0 top-0 h-full flex items-center transition-all duration-500"
              style={{
                width: currentStep === 0 ? 0 : `${(currentStep / (assessmentSteps.length - 1)) * 100}%`,
                background: "#FF7525",
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
              style={{
                left: currentStep === 0
                  ? 0
                  : `calc(${(currentStep / (assessmentSteps.length - 1)) * 100}%)`,
                transform: currentStep === 0
                  ? "translateY(-50%)"
                  : currentStep === assessmentSteps.length - 1
                  ? "translateY(-50%) translateX(-100%)"
                  : "translateY(-50%) translateX(-50%)",
              }}
            >
              <span
                className="inline-block text-white whitespace-nowrap"
                style={{
                  background: "#FF7525",
                  fontSize: 14,
                  fontWeight: 600,
                  paddingTop: 6,
                  paddingBottom: 6,
                  paddingLeft: 12,
                  paddingRight: 12,
                  lineHeight: 1,
                  borderRadius: 60,
                }}
              >
                Stap {currentStep + 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-16 assessment-content-top" style={{ position: "relative", zIndex: 1 }}>
        <div className="col-6">

          {/* ── Stap header ── */}
          <div className="animate-slide-up" style={{ marginTop: 0, textAlign: "center" }}>
            <h1 className="h2-section" style={{ color: "#111111", lineHeight: 1.15, marginBottom: 8 }}>
              {currentStep === 0 ? "Bepaal jouw ideale woning" : currentStep === 1 ? "Jouw financiën" : "Kies hoe je wilt bieden"}
            </h1>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#B6B6B6", marginBottom: 32 }}>
              {currentStep === 0
                ? "Vertel ons waar je wilt kopen en wat je budget is."
                : currentStep === 1 ? "Vul je inkomen en eigen middelen in."
                : "Hoe wil je bieden om je kansen te maximaliseren?"}
            </p>
          </div>

          {/* ── Stap content ── */}
          <div className="animate-slide-up" style={{ marginTop: 32, background: "#ffffff", border: "1px solid #e8e9ec", borderRadius: 16, padding: 20, paddingBottom: 120, minHeight: "calc(100vh - 280px)", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
            {step.id === "regio"         && <StepRegio         profile={profile} onChange={updateProfile} />}
            {step.id === "inkomen"       && <StepInkomen       profile={profile} onChange={updateProfile} />}
            {step.id === "biedstrategie" && <StepBiedstrategie profile={profile} onChange={updateProfile} />}
          </div>

        </div>
      </div>

      {/* ── Sticky knop balk onderaan ── */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
      }}>
        <div className="col-6" style={{ background: "#ffffff", borderLeft: "1px solid #e8e9ec", borderRight: "1px solid #e8e9ec", boxShadow: "0 -1px 0 #e8e9ec", padding: "24px 20px 0 20px" }}>

            {/* Foutmelding */}
            {error && (
              <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-2xl text-sm text-danger-600">
                {error}
              </div>
            )}

            {/* Knoppen */}
            <div style={{ display: "flex", gap: 10 }}>
              {currentStep === 0 ? (
                <Link
                  href="/"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e8e9ec",
                    borderRadius: 16,
                    padding: "14px 24px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#111111",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Terug
                </Link>
              ) : (
                <button
                  onClick={handleBack}
                  disabled={loading}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e8e9ec",
                    borderRadius: 16,
                    padding: "14px 24px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#111111",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Terug
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={loading}
                style={{
                  flex: 1,
                  background: "#257CFF",
                  border: "none",
                  borderRadius: 16,
                  padding: "14px 24px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Berekenen...
                  </>
                ) : isLast ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Bereken mijn WinScore
                  </>
                ) : (
                  <>
                    Volgende stap
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Privacy tekst */}
            <p style={{ textAlign: "center", fontSize: 14, fontWeight: 500, color: "#B2B2B2", marginTop: 24, paddingBottom: 24 }}>
              Je gegevens worden veilig verwerkt.{" "}
              <Link href="/privacy" style={{ color: "#B2B2B2", textDecoration: "underline" }}>
                Privacybeleid
              </Link>
            </p>

        </div>{/* einde col-8 */}
      </div>{/* einde sticky balk */}
    </div>
  );
}
