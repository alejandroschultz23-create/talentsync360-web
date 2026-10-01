import "server-only";

/**
 * Server-only configuration for the private H3 Talent Pilot service.
 *
 * Values are read from the Product server environment (Vercel encrypted env /
 * secret reference). They are NEVER exposed to the browser and NEVER logged.
 *
 * Fail closed: if any value is missing the pilot BFF cannot call H3 and the
 * pilot must fail closed (no Production fallback).
 */
export interface H3PilotConfig {
  readonly baseUrl: string;
  readonly serviceCredential: string;
  readonly invitationSecret: string;
}

export function getH3PilotConfig(): H3PilotConfig | null {
  const baseUrl = process.env.H3_TALENT_PILOT_SERVICE_URL?.trim();
  const serviceCredential = process.env.H3_TALENT_PILOT_SERVICE_CREDENTIAL;
  const invitationSecret = process.env.H3_PILOT_INVITATION_SECRET;

  if (
    typeof baseUrl !== "string" ||
    baseUrl.length === 0 ||
    typeof serviceCredential !== "string" ||
    serviceCredential.length === 0 ||
    typeof invitationSecret !== "string" ||
    invitationSecret.length === 0
  ) {
    return null;
  }

  return { baseUrl, serviceCredential, invitationSecret };
}
