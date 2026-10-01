/**
 * Invited H3 Preview pilot — participant policy contract (V1_187B).
 *
 * Pure module: no I/O, no server-only, no framework imports. Shared by the
 * participant UI, the participant BFF services, and the test suite.
 *
 * The canonical governance truth remains H3 Preview. These constants are the
 * participant-facing policy binding only.
 */
export const PILOT_POLICY_VERSION = "PILOT_GOVERNANCE_V1_175";

/** Maximum post-pilot retention the participant acknowledges (V1_187A decision). */
export const PILOT_MAX_RETENTION_DAYS = 30;

/** Canonical participant authorisation purposes for the first pilot. */
export const PILOT_AUTHORIZED_PURPOSE = "Evidence Review and Professional Profile Draft";
export const PILOT_EVIDENCE_TYPE = "DOCUMENT";

export const PILOT_REQUIRED_SOURCE_TYPES = ["CV"] as const;
export const PILOT_OPTIONAL_SOURCE_TYPES = ["COVER_LETTER"] as const;

/**
 * The twelve independent acknowledgements required before a pilot participant
 * can submit. There is NO single catch-all checkbox: every key must be
 * explicitly acknowledged. Silence is NOT consent.
 */
export const PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS = [
  "preview_test_understanding",
  "pilot_purpose_understood",
  "authorized_sources_only",
  "authorization_not_truth",
  "unknown_may_remain",
  "external_presentation_disabled",
  "talent_network_separate",
  "correction_right",
  "withdrawal_right",
  "removal_right",
  "retention_max_30_days",
  "materials_refer_to_participant",
] as const;

export type PilotConsentAcknowledgementKey = (typeof PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS)[number];

export type PilotConsentAcknowledgements = Record<PilotConsentAcknowledgementKey, boolean>;

export interface PilotConsentValidation {
  readonly ok: boolean;
  readonly missing: readonly PilotConsentAcknowledgementKey[];
}

export function validatePilotConsent(
  acknowledgements: Partial<PilotConsentAcknowledgements> | null | undefined,
): PilotConsentValidation {
  const missing: PilotConsentAcknowledgementKey[] = [];
  if (acknowledgements === null || acknowledgements === undefined) {
    return { ok: false, missing: [...PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS] };
  }
  for (const key of PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS) {
    if (acknowledgements[key] !== true) missing.push(key);
  }
  return { ok: missing.length === 0, missing };
}

/** Exact identity confirmation shown to the participant (PART E). */
export const PILOT_IDENTITY_CONFIRMATION_TEXT =
  "Confirmo que los materiales profesionales que presenté o autoricé se refieren a mí.";

export const PILOT_IDENTITY_CONFIRMATION_STATUS = "CONFIRMED";

/** Server-derived pilot mode value; never trusted from the client. */
export const PILOT_MODE_COOKIE = "h3_pilot_session";
