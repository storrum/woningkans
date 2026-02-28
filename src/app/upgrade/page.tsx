"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home, CheckCircle, Star, Zap, ArrowLeft, Lock,
  FileText, BarChart2, Sparkles, Shield, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, trackEvent } from "@/hooks/useSession";

const plans = [
  {
    id: "free",
    name: "Gratis",
    price: "€0",
    period: "",
    description: "Voor iedereen die wil starten",
    features: [
      "WinScore berekenen",
      "Max. hypotheek indicatie",
      "Score per pijler",
      "1 actiepunt",
      "2 simulaties",
    ],
    notIncluded: [
      "Volledig PDF-rapport",
      "Onbeperkte simulaties",
      "Score tracking",
      "Marktdata & kansen",
    ],
    cta: "Gratis starten",
    href: "/assessment",
    highlighted: false,
    badge: null,
  },
  {
    id: "starter",
    name: "Starter",
    price: "€9",
    period: "/ maand",
    description: "Voor serieuze kopers",
    features: [
      "Alles in Gratis",
      "Volledig PDF-rapport",
      "Onbeperkte simulaties",
      "Persoonlijk actieplan (alle punten)",
      "Score tracking — wekelijkse updates",
      "Kans op overbieden (jouw regio)",
      "Score vs. andere kopers",
    ],
    notIncluded: ["Hypotheekadviseur koppeling"],
    cta: "Start met Starter",
    href: "#",
    highlighted: true,
    badge: "Meest gekozen",
  },
  {
    id: "pro",
    name: "Pro",
    price: "€19",
    period: "/ maand",
    description: "Voor maximale kansen",
    features: [
      "Alles in Starter",
      "Live woningmarkt data",
      "Koppeling met hypotheekadviseur",
      "Makelaar introductie",
      "Gem. overbiedpercentage regio",
      "Vergelijkbare woningen (90d)",
      "Prioriteit support",
    ],
    notIncluded: [],
    cta: "Start met Pro",
    href: "#",
    highlighted: false,
    badge: null,
  },
];

const premiumFeatures = [
  {
    icon: <FileText className="w-5 h-5 text-accent-500" />,
    bg: "bg-accent-50",
    title: "Volledig PDF-rapport",
    desc: "Professioneel rapport om te delen met je partner of hypotheekadviseur.",
  },
  {
    icon: <BarChart2 className="w-5 h-5 text-success-600" />,
    bg: "bg-success-50",
    title: "Score tracking",
    desc: "Volg hoe je WinScore verbetert naarmate jij actie onderneemt.",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-primary-500" />,
    bg: "bg-primary-50",
    title: "Marktdata & kansen",
    desc: "Kans op overbieden, gem. overbiedpercentage en score vs. andere kopers.",
  },
  {
    icon: <Shield className="w-5 h-5 text-sand-600" />,
    bg: "bg-sand-100",
    title: "Onbeperkte simulaties",
    desc: "Speel zoveel scenario's door als je wil zonder limiet.",
  },
];

export default function UpgradePage() {
  const sessionId = useSession();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (sessionId) trackEvent(sessionId, "waitlist_submit");
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#fafaf8" }}>

      {/* ── Nav ── */}
      <nav className="glass border-b border-sand-200/60 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-orange rounded-xl flex items-center justify-center shadow-orange">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">WoningKans</span>
          </Link>
          <Link href="/result" className="btn-ghost text-sm">
            <ArrowLeft className="w-4 h-4" />
            Terug naar resultaat
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-5 py-16">

        {/* ── Hero ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 rounded-full px-4 py-2 text-sm font-semibold mb-5 border border-primary-100">
            <Star className="w-4 h-4 fill-primary-500" />
            Premium inzichten
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Vergroot je{" "}
            <span className="text-gradient-orange">woningkansen</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Ontgrendel alle data en tools die je nodig hebt om als winnaar uit de bus te komen.
          </p>
        </div>

        {/* ── Wat je mist (feature row) ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {premiumFeatures.map((f) => (
            <div key={f.title} className="card p-5">
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3", f.bg)}>
                {f.icon}
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">{f.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Pricing cards ── */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-3xl p-7",
                plan.highlighted
                  ? "bg-white border-2 border-primary-400 shadow-lifted"
                  : "bg-white border border-sand-200 shadow-card"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="gradient-orange text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-orange">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {plan.id === "pro" && <Zap className="w-5 h-5 text-accent-500" />}
                  {plan.id === "starter" && <Star className="w-5 h-5 fill-primary-500 text-primary-500" />}
                  <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 text-sm mb-1.5">{plan.period}</span>}
                </div>
                <p className="text-sm text-sand-500">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-7">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-sand-400">
                    <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                onClick={() => sessionId && trackEvent(sessionId, plan.id === "free" ? "click_free_plan" : "click_paid_plan", { plan: plan.id })}
                className={cn(
                  "block text-center py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95",
                  plan.highlighted
                    ? "btn-primary w-full"
                    : plan.id === "free"
                    ? "bg-sand-100 text-gray-600 hover:bg-sand-200"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                )}
              >
                {plan.cta}
              </Link>

              {plan.highlighted && (
                <p className="text-center text-xs text-sand-400 mt-3">Opzegbaar per maand · Geen verborgen kosten</p>
              )}
            </div>
          ))}
        </div>

        {/* ── Wachtlijst ── */}
        <div className="max-w-lg mx-auto">
          <div className="card border-2 border-primary-100 bg-gradient-to-b from-primary-50/60 to-white text-center">
            <div className="w-12 h-12 gradient-orange rounded-2xl flex items-center justify-center shadow-orange mx-auto mb-4">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Betaalde plannen komen binnenkort
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Zet je op de wachtlijst en ontvang als eerste toegang +{" "}
              <span className="font-semibold text-primary-600">20% korting</span> bij lancering.
            </p>
            {submitted ? (
              <div className="flex items-center justify-center gap-2 text-success-600 font-semibold py-2">
                <CheckCircle className="w-5 h-5" />
                Je staat op de wachtlijst! We laten je weten wanneer we live gaan.
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="jouw@email.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Aanmelden
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
