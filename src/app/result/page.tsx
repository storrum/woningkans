"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserProfile, ScoreResult } from "@/types";
import { calculateWinScore } from "@/lib/scoreEngine";
import ScoreRing from "@/components/result/ScoreRing";
import PijlerBreakdown from "@/components/result/PijlerBreakdown";
import ActionPoints from "@/components/result/ActionPoints";
import ConcurrentieBlock from "@/components/result/ConcurrentieBlock";
import MaandKansenChart from "@/components/result/MaandKansenChart";
import EmailCaptureModal from "@/components/EmailCaptureModal";

export default function ResultPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [emailCaptured, setEmailCaptured] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("woningkans-profile");
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        setProfile(parsed);
        const calc = calculateWinScore(parsed);
        setResult(calc);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Show email modal when result is loaded (after a short delay)
  useEffect(() => {
    if (result && !emailCaptured) {
      const timeout = setTimeout(() => {
        setShowEmailModal(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [result, emailCaptured]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Ladt...</p>
      </div>
    );
  }

  if (!result || !profile) {
    return null;
  }

  function formatPrice(n: number) {
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
  }

  function handleRecalculate() {
    router.push("/assessment");
  }

  function handleEmailSubmit(email: string) {
    setEmailCaptured(true);
    setShowEmailModal(false);
  }

  function handleEmailClose() {
    setShowEmailModal(false);
  }

  return (
    <>
      {showEmailModal && (
        <EmailCaptureModal
          onSubmit={handleEmailSubmit}
          onClose={handleEmailClose}
          score={result.totalScore}
        />
      )}

      <div style={{
        minHeight: "100vh",
        background: "#F7F7F7",
        paddingBottom: 80,
      }}>

        {/* Sticky header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #E8E9EC",
          padding: "12px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#111111" }}>WoningKans</p>
          <button
            onClick={handleRecalculate}
            style={{
              padding: "8px 20px", borderRadius: 20, border: "1px solid #257CFF",
              background: "transparent", color: "#257CFF", fontSize: 14, fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Aanpassen
          </button>
        </div>

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>

          {/* ScoreRing */}
          <div style={{ marginTop: 32 }}>
            <ScoreRing score={result.totalScore} label={result.label} />
          </div>

          {/* Financieel overzicht */}
          <div style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 16,
            background: "#ffffff",
            border: "1px solid #E8E9EC",
          }}>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Financieel overzich</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "#666" }}>Maximale hypotheek</span>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{formatPrice(result.maxMortgage)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "#666" }}>Maximale koopsin</span>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{formatPrice(result.maxPurchasePrice)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style=={{ fontSize: 14, color: "#666" }}>Maandlast bruto</span>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{formatPrice(result.monthlyPayment)}/maand</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "#666" }}>Maandlast netto</span>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{formatPrice(result.monthlyPaymentNetto)}/maand</span>
              </div>
              {!result.canAfford && result.shortfall > 0 && (
                <div style={{ background: "#FFF8F5", border: "1px solid #FFB38B", borderRadius: 8, padding: "10px 12px" }}>
                  <p style={{ fontSize: 13, color: "#FF7525" }}>
                    Je komst {formatPrice(result.shortfall)} tekort voor deze woning.
                  </p>
                </div>
              )}
              {result.nhgApplies && (
                <div style={{ background: "#F0F7FF", border: "1px solid #B3D3FF", borderRadius: 8, padding: "10px 12px" }}>
                  <p style={{ fontSize: 13, color: "#257CFF" }}>
                    NHG van kopassing (NHg aanvraag mogelijk)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pijler Breakdown */}
          <div style={{ marginTop: 24 }}>
            <PijlerBreakdown pijlers={result.pijlers} />
          </div>

          {/* ConcurrentieBlock */}
          <div style={{ marginTop: 24 }}>
            <ConcurrentieBlock concurrentie={result.concurrentie} />
          </div>

          {/* MaandKansenChart */}
          <div style={{ marginTop: 24 }}>
            <MaandKansenChart
              maandKansen={result.maandKansen}
              besteKoopMaanden={result.besteKoopMaanden}
            />
          </div>

          {/* ActionPoints */}
          <div style={{ marginTop: 24 }}>
            <ActionPoints actionPoints={result.actionPoints} />
          </div>

          {/* Upgrade CTA */}
          <div style={{
            marginTop: 32,
            padding: 24,
            borderRadius: 16,
            background: "linear-gradient(135deg, #257CFF 0%, #0357F0 100%)",
            textAlign: "center",
          }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
              Win nog sneller
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 20 }}>
              Week een aankoopmakelaar, marktanalyse of persoonlijk advies aan
            </p>
            <a
              href="/upgrade"
              style={{
                display: "inline-block", padding: "12px 24px", borderRadius: 20,
                background: "#fff", color: "#257CFF", fontSize: 14, fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Bekijk opties
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
