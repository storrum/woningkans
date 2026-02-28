import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "WoningKans — Bereken jouw WinScore",
  description:
    "Ontdek in 2 minuten hoe realistisch jouw woningdroom is. Eerlijk, persoonlijk en gratis — inclusief concrete stappen om je kansen te vergroten.",
  keywords: ["hypotheek", "woning kopen", "WinScore", "koopkans", "biedstrategie", "starter"],
  openGraph: {
    title: "WoningKans — Bereken jouw WinScore",
    description: "Ontdek in 2 minuten hoe realistisch jouw woningdroom is.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={dmSans.className}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
