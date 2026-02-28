"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("WoningKans error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "#fafaf8" }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-danger-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Er ging iets mis</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Er is een onverwachte fout opgetreden. Probeer het opnieuw of ga terug naar de homepage.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-primary"
          >
            <RotateCcw className="w-4 h-4" />
            Opnieuw proberen
          </button>
          <Link href="/" className="btn-secondary">
            <Home className="w-4 h-4" />
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
