"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type EnterState = "entering" | "invalid";

/**
 * Client-side pilot entry wrapper (V1_192).
 *
 * Reads the bearer token from `window.location.hash` (never from a query param),
 * posts it once to the entry endpoint, then replaces the URL to drop the token
 * from the address bar and browser history. Never persists the token, never
 * sends analytics for this path (it is a private route), and fails closed.
 */
export default function PilotEnterClient() {
  const router = useRouter();
  const [state, setState] = useState<EnterState>("entering");

  useEffect(() => {
    const rawHash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
    const token = new URLSearchParams(rawHash).get("token") ?? "";

    // Remove the bearer token from the address bar/history before any async work.
    window.history.replaceState(null, "", window.location.pathname);

    let active = true;
    void (async () => {
      // Defer state changes out of the synchronous effect body.
      await Promise.resolve();
      if (!active) return;
      if (token.length === 0) {
        setState("invalid");
        return;
      }
      try {
        const response = await fetch("/api/h3-pilot/enter", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token }),
          cache: "no-store",
          credentials: "same-origin",
        });
        if (!active) return;
        if (response.ok) {
          router.replace("/talents/evidence-review");
          return;
        }
      } catch {
        // Fail closed.
      }
      if (active) setState("invalid");
    })();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-24">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/55 p-8 text-center shadow-2xl">
        {state === "entering" ? (
          <>
            <h1 className="text-2xl font-bold text-white">Verificando tu acceso</h1>
            <p className="mt-4 text-base text-slate-400">
              Estamos validando tu invitación privada. Esto toma solo un momento.
            </p>
            <div
              aria-hidden="true"
              className="mx-auto mt-8 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"
            />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white">Este acceso ya no es válido</h1>
            <p className="mt-4 text-base text-slate-400">
              La invitación pudo haberse usado, vencido o no ser reconocida. Si necesitás ayuda,
              contactanos para recibir un nuevo acceso.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
