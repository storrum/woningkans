"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "woningkans_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-2xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-300 leading-relaxed">
            Wij gebruiken cookies voor analytische doeleinden om het platform te verbeteren.{" "}
            <Link href="/privacy" className="text-sky-400 underline hover:text-sky-300">
              Meer info
            </Link>
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={handleDecline}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 transition-colors"
          >
            Weigeren
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Accepteren
          </button>
        </div>
      </div>
    </div>
  );
}
