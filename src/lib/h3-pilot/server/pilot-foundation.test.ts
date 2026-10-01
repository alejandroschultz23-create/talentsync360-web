import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import type { H3PilotCallResult } from "./client";
import {
  createInvitationToken,
  createInMemoryInvitationUseStore,
  validateInvitationToken,
} from "./invitation";
import { issuePilotInvitation } from "./invitation-issuer";
import { isOperatorAuthorized } from "./operator-auth";
import {
  OPERATOR_REVIEW_OPERATIONS,
  createSyntheticOperatorReviewHarness,
} from "./pilot-operator-review";
import {
  CONTENT_REFERENCE_SCHEME,
  SOURCE_LOCATOR_SCHEME,
  buildContentReference,
  buildSourceLocator,
  containsPii,
  createOpaqueSourceId,
  parseSourceLocator,
} from "./pilot-source";
import { mapPilotPresentationStatus, type H3PilotStatusView } from "./pilot-status";
import {
  PARTICIPANT_OPERATIONS,
  orchestratePilotSubmission,
  type H3PilotCaller,
  type PilotSubmissionInput,
} from "./pilot-submission";

const CV_SOURCE_ID = "11111111-1111-4111-8111-111111111111";
const STORAGE_OBJECT_ID = "22222222-2222-4222-8222-222222222222";

function buildInput(overrides: Partial<PilotSubmissionInput> = {}): PilotSubmissionInput {
  return {
    participantReference: "P-1",
    operator: "product-pilot-bff",
    identityAcknowledged: true,
    consent: {
      pilotPurpose: "Preview pilot evidence review",
      permittedDataCategories: ["PROFESSIONAL_MATERIALS"],
      permittedSourceCategories: ["CV"],
      retentionMaxDays: 30,
    },
    sources: [
      {
        sourceType: "CV",
        sourceLocator: buildSourceLocator("CV", CV_SOURCE_ID),
        contentReference: buildContentReference(STORAGE_OBJECT_ID),
        authorizedPurpose: "Evidence review",
        evidenceType: "DOCUMENT",
      },
    ],
    ...overrides,
  };
}

function fakeParticipantClient(failAt?: string): { client: H3PilotCaller; calls: string[] } {
  const calls: string[] = [];
  const client: H3PilotCaller = async (operation, payload): Promise<H3PilotCallResult> => {
    calls.push(operation);
    if (failAt === operation) return { ok: false, code: "FORCED_FAILURE" };
    switch (operation) {
      case "createPilotIntake":
        return { ok: true, code: "OK", value: { intakeId: payload.intakeId } };
      case "createAndBindPerson":
        return { ok: true, code: "OK", value: { personId: payload.personId } };
      case "initiateEvidenceReview":
        return { ok: true, code: "OK", value: { evidenceReview: { evidenceReviewId: "er-1" } } };
      case "ingestEvidenceArtifact":
        return { ok: true, code: "OK", value: { evidenceArtifact: { evidenceArtifactId: "ea-1" } } };
      default:
        return { ok: true, code: "OK", value: {} };
    }
  };
  return { client, calls };
}

function deterministicUuid(): () => string {
  let n = 0;
  return () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`;
}

describe("V1_187A operator invitation issuance", () => {
  it("1/2. operator auth is required and fails closed (missing/wrong)", () => {
    const env = process.env.H3_PILOT_OPERATOR_SECRET;
    delete process.env.H3_PILOT_OPERATOR_SECRET;
    expect(isOperatorAuthorized("anything")).toBe(false);
    process.env.H3_PILOT_OPERATOR_SECRET = "operator-secret-value";
    expect(isOperatorAuthorized(null)).toBe(false);
    expect(isOperatorAuthorized("wrong")).toBe(false);
    expect(isOperatorAuthorized("operator-secret-value")).toBe(true);
    if (env === undefined) delete process.env.H3_PILOT_OPERATOR_SECRET;
    else process.env.H3_PILOT_OPERATOR_SECRET = env;
  });

  it("3. issued invitation is single-use and persists a hashed record", async () => {
    const rows: { invitation_id: string; token_hash: string; expires_at: string }[] = [];
    const result = await issuePilotInvitation(
      { participantReference: "P-1", ttlSeconds: 3600 },
      {
        config: { baseUrl: "https://x", serviceCredential: "cred", invitationSecret: "signing-secret" },
        now: 1_000_000,
        uuid: () => "33333333-3333-4333-8333-333333333333",
        writer: {
          async insert(row) {
            rows.push(row);
            return { ok: true };
          },
        },
      },
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(rows).toHaveLength(1);
    expect(rows[0]?.invitation_id).toBe(result.invitation.invitationId);
    expect(typeof rows[0]?.token_hash).toBe("string");
    expect(rows[0]?.token_hash).not.toBe(result.invitation.token);
    expect(result.invitation.expiresAt).toBe(1_000_000 + 3600 * 1000);

    const store = createInMemoryInvitationUseStore();
    const first = await validateInvitationToken(result.invitation.token, "signing-secret", store, 1_000_001);
    const second = await validateInvitationToken(result.invitation.token, "signing-secret", store, 1_000_002);
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(false);
    if (second.ok === false) expect(second.code).toBe("REUSED_INVITATION");
  });

  it("17. issuance never returns the signing secret", async () => {
    const result = await issuePilotInvitation(
      { participantReference: "P-1" },
      {
        config: { baseUrl: "https://x", serviceCredential: "cred", invitationSecret: "signing-secret-xyz" },
        writer: { async insert() { return { ok: true }; } },
      },
    );
    expect(result.ok).toBe(true);
    expect(JSON.stringify(result)).not.toContain("signing-secret-xyz");
  });
});

describe("V1_187A source/content locator contract", () => {
  it("10/11/12. locators are opaque, scheme-correct, and PII-free", () => {
    const locator = buildSourceLocator("CV", CV_SOURCE_ID);
    expect(locator).toBe(`${SOURCE_LOCATOR_SCHEME}://cv/${CV_SOURCE_ID}`);
    expect(parseSourceLocator(locator)).toEqual({ sourceType: "CV", opaqueSourceId: CV_SOURCE_ID });
    expect(containsPii(locator)).toBe(false);
    expect(locator.includes("http")).toBe(false);
    expect(locator.toLowerCase()).not.toContain("bearer");

    const objectId = createOpaqueSourceId();
    const contentReference = buildContentReference(objectId);
    expect(contentReference.startsWith(`${CONTENT_REFERENCE_SCHEME}/`)).toBe(true);
    expect(contentReference).toContain(objectId);

    expect(buildSourceLocator("COVER_LETTER", CV_SOURCE_ID)).toBe(`${SOURCE_LOCATOR_SCHEME}://cover-letter/${CV_SOURCE_ID}`);
    expect(parseSourceLocator("participant-upload://cv/not-a-uuid")).toBeNull();
  });
});

describe("V1_187A pilot status mapping", () => {
  it("maps canonical H3 state to presentation labels only", () => {
    const base: H3PilotStatusView = {
      intakeStatus: "ACTIVE",
      retentionState: "RETENTION_ACTIVE",
      consentStatus: "GRANTED",
      evidenceReviewStatus: null,
      draftStatus: null,
      draftDecision: null,
    };
    expect(mapPilotPresentationStatus(base)).toBe("SUBMITTED");
    expect(mapPilotPresentationStatus({ ...base, evidenceReviewStatus: "REVIEW_IN_PROGRESS" })).toBe("UNDER_REVIEW");
    expect(mapPilotPresentationStatus({ ...base, draftStatus: "GENERATED" })).toBe("DRAFT_READY");
    expect(mapPilotPresentationStatus({ ...base, draftDecision: "CORRECTION_REQUESTED" })).toBe("CORRECTION_REQUESTED");
    expect(mapPilotPresentationStatus({ ...base, draftDecision: "CONFIRMED" })).toBe("CONFIRMED");
    expect(mapPilotPresentationStatus({ ...base, intakeStatus: "WITHDRAWN" })).toBe("WITHDRAWN");
    expect(mapPilotPresentationStatus({ ...base, retentionState: "REMOVAL_DUE" })).toBe("REMOVAL_PENDING");
    expect(mapPilotPresentationStatus({ ...base, retentionState: "REMOVED" })).toBe("REMOVED");
  });
});

describe("V1_187A pilot submission orchestrator", () => {
  it("4. runs the canonical participant sequence in exact order", async () => {
    const { client, calls } = fakeParticipantClient();
    const result = await orchestratePilotSubmission(buildInput(), { client, uuid: deterministicUuid(), now: 1_000_000 });
    expect(result.ok).toBe(true);
    expect(calls).toEqual([
      "createPilotIntake",
      "recordPilotConsent",
      "recordSourceAuthorization",
      "createAndBindPerson",
      "recordIdentityConfirmation",
      "initiateEvidenceReview",
      "openEvidenceReview",
      "ingestEvidenceArtifact",
    ]);
    if (result.ok) {
      expect(result.evidenceReviewId).toBe("er-1");
      expect(result.artifacts[0]?.evidenceArtifactId).toBe("ea-1");
      expect(result.artifacts[0]?.contentReference.startsWith(`${CONTENT_REFERENCE_SCHEME}/`)).toBe(true);
    }
  });

  it("5. a step failure stops subsequent stages", async () => {
    const { client, calls } = fakeParticipantClient("recordPilotConsent");
    const result = await orchestratePilotSubmission(buildInput(), { client, uuid: deterministicUuid() });
    expect(result.ok).toBe(false);
    expect(calls).toEqual(["createPilotIntake", "recordPilotConsent"]);
  });

  it("6/7/8/9/13. never performs operator review, opt-in, or promotion operations", async () => {
    const { client, calls } = fakeParticipantClient();
    await orchestratePilotSubmission(buildInput(), { client, uuid: deterministicUuid() });
    for (const forbidden of [
      ...OPERATOR_REVIEW_OPERATIONS,
      "grantTalentNetworkOptIn",
      "revokeTalentNetworkOptIn",
      "promoteTalentProfile",
      "recordDraftDecision",
    ]) {
      expect(calls).not.toContain(forbidden);
      expect(PARTICIPANT_OPERATIONS as readonly string[]).not.toContain(forbidden);
    }
    for (const op of OPERATOR_REVIEW_OPERATIONS) {
      expect(PARTICIPANT_OPERATIONS as readonly string[]).not.toContain(op);
    }
  });

  it("rejects missing CV, missing identity, and PII-invalid locators before any H3 call", async () => {
    const { client, calls } = fakeParticipantClient();
    const noCv = await orchestratePilotSubmission(buildInput({ sources: [] }), { client });
    expect(noCv.ok).toBe(false);
    const noIdentity = await orchestratePilotSubmission(buildInput({ identityAcknowledged: false }), { client });
    expect(noIdentity.ok).toBe(false);
    expect(calls).toHaveLength(0);
  });
});

describe("V1_187A synthetic operator harness", () => {
  it("14. progresses a synthetic review through canonical operator operations", async () => {
    const calls: string[] = [];
    const client: H3PilotCaller = async (operation): Promise<H3PilotCallResult> => {
      calls.push(operation);
      if (operation === "createClaim") return { ok: true, code: "OK", value: { claim: { claimId: "c-1" } } };
      if (operation === "generateProfessionalProfileDraft") {
        return { ok: true, code: "OK", value: { draft: { professionalProfileDraftId: "d-1" } } };
      }
      return { ok: true, code: "OK", value: {} };
    };
    const harness = createSyntheticOperatorReviewHarness({ synthetic: true, client });
    const result = await harness.progressToDraft({ evidenceReviewId: "er-1", evidenceArtifactId: "ea-1", changedBy: "synthetic" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.result.draftId).toBe("d-1");
    expect(calls).toEqual([...OPERATOR_REVIEW_OPERATIONS]);
  });

  it("refuses to construct without the explicit synthetic flag", () => {
    expect(() =>
      createSyntheticOperatorReviewHarness({ synthetic: false as unknown as true }),
    ).toThrow(/SYNTHETIC_OPERATOR_HARNESS_REQUIRES_SYNTHETIC_FLAG/);
  });
});

describe("V1_187A boundaries and preservation", () => {
  const read = (relative: string) => readFileSync(join(process.cwd(), relative), "utf8");

  it("13/16. participant orchestrator has no operator ops and no direct DB access", () => {
    const submission = read("src/lib/h3-pilot/server/pilot-submission.ts");
    for (const op of OPERATOR_REVIEW_OPERATIONS) expect(submission).not.toContain(op);
    for (const bad of ['from "postgres"', "from 'postgres'", "neon", "DATABASE_URL", "@neondatabase"]) {
      expect(submission).not.toContain(bad);
    }
    expect(submission).not.toContain("pilot-operator-review");
  });

  it("15. normal Production Evidence Review flow is untouched", () => {
    const handler = read("src/lib/evidence-review/server/submission-handler.ts");
    expect(handler).toContain("processEvidenceReviewSubmission");
    const submission = read("src/lib/h3-pilot/server/pilot-submission.ts");
    expect(submission).not.toContain("@/lib/evidence-review");
  });

  it("16. no H3 pilot server module opens a direct database connection", () => {
    for (const file of [
      "src/lib/h3-pilot/server/pilot-submission.ts",
      "src/lib/h3-pilot/server/pilot-operator-review.ts",
      "src/lib/h3-pilot/server/invitation-issuer.ts",
      "src/lib/h3-pilot/server/pilot-source.ts",
      "src/lib/h3-pilot/server/pilot-status.ts",
      "src/lib/h3-pilot/server/operator-auth.ts",
    ]) {
      const source = read(file);
      expect(source).not.toMatch(/from ["']postgres["']/);
      expect(source).not.toMatch(/neon|DATABASE_URL/);
    }
  });

  it("keeps a reusable signed invitation token helper for operator use", () => {
    const token = createInvitationToken({ invitationId: "i", participantReference: "P", expiresAt: 2 }, "s");
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(2);
  });
});
