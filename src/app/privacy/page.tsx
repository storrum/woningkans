import Link from "next/link";
import { Home, ArrowLeft, Shield, Mail, Database, Eye, Trash2, Lock } from "lucide-react";

export const metadata = {
  title: "Privacybeleid — WoningKans",
  description: "Hoe WoningKans omgaat met jouw gegevens — in gewone taal.",
};

const sections = [
  {
    icon: Shield,
    color: "text-primary-500",
    bg: "bg-primary-50",
    title: "Wie zijn wij?",
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        WoningKans is een online tool waarmee je jouw kansen op de Nederlandse woningmarkt kunt
        berekenen. Wij verwerken alleen de gegevens die strikt noodzakelijk zijn. Vragen? Mail naar{" "}
        <a href="mailto:privacy@woningkans.nl" className="text-primary-600 underline hover:text-primary-700">
          privacy@woningkans.nl
        </a>
      </p>
    ),
  },
  {
    icon: Database,
    color: "text-accent-500",
    bg: "bg-accent-50",
    title: "Welke gegevens verzamelen we?",
    content: (
      <ul className="space-y-2 text-sm text-gray-600">
        {[
          ["Inkomensgegevens", "bruto jaarinkomen en partnerinkomen — geen bankgegevens"],
          ["Vermogensindicatie", "eigen geld (indicatief, niet geverifieerd)"],
          ["Woningwens", "regio en gewenste aankoopprijs"],
          ["Biedstrategie-voorkeuren", "anonieme keuzes"],
          ["E-mailadres", "alleen als je dit vrijwillig invult"],
          ["Anonieme sessie-ID", "voor analytische doeleinden — geen naam, geen e-mail"],
        ].map(([bold, rest]) => (
          <li key={bold} className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-400 flex-shrink-0" />
            <span><strong className="text-gray-800">{bold}</strong> — {rest}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: Eye,
    color: "text-success-600",
    bg: "bg-success-50",
    title: "Waarvoor gebruiken we je gegevens?",
    content: (
      <>
        <ul className="space-y-2 text-sm text-gray-600 mb-3">
          {[
            "Het berekenen en weergeven van je persoonlijke WinScore",
            "Het verbeteren van het score-model op basis van geanonimiseerde data",
            "Het sturen van je resultaten per e-mail als je daarvoor kiest",
            "Analytische doeleinden om de gebruikerservaring te verbeteren",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-success-400 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600 font-medium">
          Wij verkopen jouw gegevens <strong>nooit</strong> aan derden.
        </p>
      </>
    ),
  },
  {
    icon: Lock,
    color: "text-sand-600",
    bg: "bg-sand-100",
    title: "Hoe lang bewaren we je gegevens?",
    content: (
      <ul className="space-y-2 text-sm text-gray-600">
        {[
          "Berekeningen en scores: maximaal 12 maanden, daarna automatisch verwijderd",
          "E-mailadres (indien opgegeven): tot je je uitschrijvt of verwijdering verzoekt",
          "Anonieme sessie-events: maximaal 6 maanden",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sand-400 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: Trash2,
    color: "text-primary-500",
    bg: "bg-primary-50",
    title: "Jouw rechten (AVG / GDPR)",
    content: (
      <>
        <ul className="space-y-2 text-sm text-gray-600 mb-3">
          {[
            ["Inzagerecht", "opvragen welke gegevens we van je hebben"],
            ["Rectificatierecht", "onjuiste gegevens laten corrigeren"],
            ["Verwijderingsrecht", "je gegevens laten wissen"],
            ["Bezwaarrecht", "bezwaar maken tegen bepaalde verwerkingen"],
          ].map(([bold, rest]) => (
            <li key={bold} className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
              <span><strong className="text-gray-800">{bold}</strong> — {rest}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600">
          Stuur een verzoek naar{" "}
          <a href="mailto:privacy@woningkans.nl" className="text-primary-600 underline hover:text-primary-700">
            privacy@woningkans.nl
          </a>
          . We reageren binnen 30 dagen.
        </p>
      </>
    ),
  },
  {
    icon: Mail,
    color: "text-accent-500",
    bg: "bg-accent-50",
    title: "Cookies",
    content: (
      <p className="text-sm text-gray-600 leading-relaxed">
        Wij gebruiken uitsluitend functionele en analytische cookies. Er worden geen tracking-cookies
        van derden geplaatst (geen Facebook Pixel, geen Google Ads). Je kunt cookies weigeren via de
        balk onderaan de pagina — de tool werkt dan gewoon door. Alle gegevens worden opgeslagen op
        Europese servers en versleuteld via TLS/HTTPS.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fafaf8" }}>

      {/* ── Nav ── */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-sand-200/60 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-orange rounded-xl flex items-center justify-center shadow-orange">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">WoningKans</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            Terug
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 py-14">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 rounded-full px-4 py-2 text-sm font-semibold mb-5 border border-primary-100">
            <Shield className="w-4 h-4" />
            AVG / GDPR-conform
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Privacybeleid</h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-lg">
            Wij vinden jouw privacy belangrijk. Hier leer je precies wat we doen met jouw gegevens — in gewone taal.
          </p>
          <p className="text-xs text-sand-400 mt-2">Laatst bijgewerkt: januari 2025</p>
        </div>

        {/* ── Secties ── */}
        <div className="space-y-5">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="bg-white rounded-3xl border border-sand-100 shadow-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${section.bg}`}>
                    <Icon className={`w-4 h-4 ${section.color}`} />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">
                    <span className="text-sand-300 mr-2 font-normal">{i + 1}.</span>
                    {section.title}
                  </h2>
                </div>
                {section.content}
              </div>
            );
          })}
        </div>

        {/* ── Footer note ── */}
        <div className="mt-10 pt-8 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sand-400">
            © {new Date().getFullYear()} WoningKans · Berekeningen zijn indicatief en vormen geen financieel advies.
          </p>
          <Link href="/" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Terug naar WoningKans →
          </Link>
        </div>
      </div>
    </div>
  );
}
