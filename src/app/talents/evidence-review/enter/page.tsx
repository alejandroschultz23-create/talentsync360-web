import type { Metadata } from "next";

import PilotEnterClient from "./PilotEnterClient";

export const metadata: Metadata = {
  title: "Acceso al piloto",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

/**
 * Private pilot entry wrapper (V1_192).
 *
 * The participant link carries the single-use invitation token in the URL
 * FRAGMENT (`#token=...`). Fragments are never sent to the server, so the bearer
 * token never reaches server logs, access logs, or the `Referer` header. This
 * server component renders nothing secret; the client wrapper posts the token
 * from the fragment to `POST /api/h3-pilot/enter` and clears it immediately.
 */
export default function PilotEnterPage() {
  return <PilotEnterClient />;
}
