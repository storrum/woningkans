"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("WoningKans global error:", error);
  }, [error]);
  return (
    <html lang="nl">
      <body>
        <div><button onClick={reset}>Opnieuw</button></div>
      </body>
    </html>
  );
}
