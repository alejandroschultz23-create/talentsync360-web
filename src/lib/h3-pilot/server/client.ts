import "server-only";

import { getH3PilotConfig, type H3PilotConfig } from "./config";
import { getDefaultIdentityTokenProvider, type IdentityTokenProvider } from "./identity";

/**
 * Server-only H3 Talent Pilot BFF client.
 *
 * - Calls the private Cloud Run pilot service with BOTH the Google IAM identity
 *   token and the H3 application credential (`x-hermes-pilot-credential`).
 * - Strict operation allowlist (mirrors the canonical H3 service surface).
 * - No governance logic, no direct Neon access, no generic SQL.
 * - No Production fallback; failures fail closed.
 * - Credentials are never logged.
 */
export const H3_PILOT_OPERATIONS = [
  "createPilotIntake",
  "recordPilotConsent",
  "recordSourceAuthorization",
  "createAndBindPerson",
  "recordIdentityConfirmation",
  "initiateEvidenceReview",
  "openEvidenceReview",
  "ingestEvidenceArtifact",
  "createClaim",
  "linkClaimEvidence",
  "changeClaimStatus",
  "submitCoherenceAssessment",
  "completeEvidenceReview",
  "generateProfessionalProfileDraft",
  "getProfessionalProfileDraft",
  "recordDraftDecision",
  "grantTalentNetworkOptIn",
  "revokeTalentNetworkOptIn",
  "promoteTalentProfile",
  "withdrawPilot",
  "completePilot",
  "requestRealPersonRemoval",
  "readPilotStatus",
  "readPilotParticipantContext",
] as const;
export type H3PilotOperation = (typeof H3_PILOT_OPERATIONS)[number];

export interface H3PilotCallResult {
  readonly ok: boolean;
  readonly code: string;
  readonly value?: unknown;
}

export interface PilotTransportResponse {
  readonly status: number;
  readonly body: unknown;
}

export interface PilotTransport {
  post(
    url: string,
    body: unknown,
    headers: Readonly<Record<string, string>>,
    timeoutMs: number,
  ): Promise<PilotTransportResponse>;
}

export interface CallH3PilotDependencies {
  readonly config?: H3PilotConfig | null;
  readonly identityTokenProvider?: IdentityTokenProvider;
  readonly transport?: PilotTransport;
  readonly timeoutMs?: number;
}

const defaultTransport: PilotTransport = {
  async post(url, body, headers, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
        cache: "no-store",
      });
      const text = await response.text();
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        parsed = null;
      }
      return { status: response.status, body: parsed };
    } finally {
      clearTimeout(timer);
    }
  },
};

export async function callH3Pilot(
  operation: string,
  payload: Record<string, unknown>,
  dependencies: CallH3PilotDependencies = {},
): Promise<H3PilotCallResult> {
  if (!(H3_PILOT_OPERATIONS as readonly string[]).includes(operation)) {
    return { ok: false, code: "INVALID_REQUEST" };
  }

  const config = dependencies.config ?? getH3PilotConfig();
  if (config === null) return { ok: false, code: "H3_PILOT_NOT_CONFIGURED" };

  const identityTokenProvider = dependencies.identityTokenProvider ?? getDefaultIdentityTokenProvider();
  const identityToken = await identityTokenProvider.getIdentityToken(config.baseUrl);
  if (typeof identityToken !== "string" || identityToken.length === 0) {
    return { ok: false, code: "H3_IAM_NOT_CONFIGURED" };
  }

  const transport = dependencies.transport ?? defaultTransport;
  const timeoutMs = dependencies.timeoutMs ?? 10_000;
  const url = `${config.baseUrl.replace(/\/$/, "")}/`;

  try {
    const response = await transport.post(
      url,
      { operation, payload },
      {
        "content-type": "application/json",
        authorization: `Bearer ${identityToken}`,
        "x-hermes-pilot-credential": config.serviceCredential,
      },
      timeoutMs,
    );
    const body = response.body;
    if (body !== null && typeof body === "object") {
      const record = body as Record<string, unknown>;
      if (record.ok === true) {
        return {
          ok: true,
          code: typeof record.code === "string" ? record.code : "OK",
          ...(record.value !== undefined ? { value: record.value } : {}),
        };
      }
      if (typeof record.code === "string") return { ok: false, code: record.code };
    }
    return { ok: false, code: "INTERNAL_ERROR" };
  } catch {
    return { ok: false, code: "H3_PILOT_UNAVAILABLE" };
  }
}
