"cuse client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useSession(): string {
  const [sessionId, setSessionId] = useState<string>("");
  useEffect(() => {
    let sid = sessionStorage.getItem("woningkans-session");
    if (!sid) { sid = uuidv4(); sessionStorage.setItem("woningkans-session", sid); }
    setSessionId(sid);
  }, []);
  return sessionId;
}

export async function trackEvent(sessionId: string, eventName: string, props?: Record<string, unknown>) {
  try {
    await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, eventName, props }) });
  } catch { /* silent */ }
}
