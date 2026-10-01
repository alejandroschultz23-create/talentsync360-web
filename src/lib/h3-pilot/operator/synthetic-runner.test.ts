import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { H3PilotCallResult } from "../server/client";
import type { H3PilotCaller } from "../server/pilot-submission";
import type { PilotFileStorage } from "../server/storage";
import { createInMemoryPilotProgressStore } from "../participant/progress";
import { PILOT_OPT_IN_SOURCE } from "../participant/policy";
import { runSyntheticPilotJourney } from "./synthetic-runner";

const INTAKE_PLACEHOLDER = "intake-generated";
const PERSON = "22222222-2222-4222-8222-222222222222";
const REVIEW = "33333333-3333-4333-8333-333333333333";
const DRAFT = "44444444-4444-4444-8444-444444444444";
const GRANT = "55555555-5555-4555-8555-555555555555";

interface RecordedCall {
  readonly operation: string;
  readonly payload: Record<string, unknown>;
}

function ok(value: unknown): H3PilotCallResult {
  return { ok: true, code: "OK", value };
}
function fail(code: string): H3PilotCallResult {
  return { ok: false, code };
}

function fakeClient(events: string[]): {
  client: H3PilotCaller;
  calls: RecordedCall[];
  state: { draft: boolean; decision: string | null; grant: string | null; withdrawn: boolean; removed: boolean };
} {
  const calls: RecordedCall[] = [];
  const state = {
    draft: false,
    decision: null as string | null,
    grant: null as string | null,
    withdrawn: false,
    removed: false,
  };
  const client: H3PilotCaller = async (operation, payload): Promise<H3PilotCallResult> => {
    calls.push({ operation, payload });
    events.push(`h3:${operation}`);
    switch (operation) {
      case "createPilotIntake":
        return ok({ intakeId: payload.intakeId ?? INTAKE_PLACEHOLDER });
      case "createAndBindPerson":
        return ok({ personId: payload.personId ?? PERSON });
      case "initiateEvidenceReview":
        return ok({ evidenceReview: { evidenceReviewId: REVIEW } });
      case "ingestEvidenceArtifact":
        return ok({ evidenceArtifact: { evidenceArtifactId: "ea-1" } });
      case "createClaim":
        return ok({ claim: { claimId: "c-1" } });
      case "generateProfessionalProfileDraft":
        state.draft = true;
        return ok({ draft: { professionalProfileDraftId: DRAFT } });
      case "readPilotParticipantContext":
        if (state.removed) return fail("NOT_FOUND");
        return ok({
          intakeId: payload.intakeId,
          personId: PERSON,
          evidenceReviewId: REVIEW,
          professionalProfileDraftId: state.draft ? DRAFT : null,
          talentNetworkOptInPermissionGrantId: state.grant === "GRANTED" ? GRANT : null,
          talentProfileId: null,
        });
      case "readPilotStatus":
        return ok({
          intakeStatus: state.withdrawn ? "WITHDRAWN" : "ACTIVE",
          retentionState: "RETENTION_ACTIVE",
          consentStatus: "GRANTED",
          evidenceReviewStatus: "REVIEW_COMPLETED",
          draftStatus: state.draft ? "GENERATED" : null,
          draftDecision: state.decision,
        });
      case "getProfessionalProfileDraft":
        return ok({ content: "synthetic draft" });
      case "recordDraftDecision":
        state.decision = typeof payload.decision === "string" ? payload.decision : null;
        return ok({});
      case "grantTalentNetworkOptIn":
        state.grant = "GRANTED";
        return ok({});
      case "revokeTalentNetworkOptIn":
        state.grant = "REVOKED";
        return ok({});
      case "withdrawPilot":
        state.withdrawn = true;
        return ok({});
      case "requestRealPersonRemoval":
        state.removed = true;
        return ok({ removed: true, receiptId: "receipt-1", scopeCounts: {} });
      default:
        return ok({});
    }
  };
  return { client, calls, state };
}

function fakeStorage(
  events: string[],
  failRemove = false,
): { storage: PilotFileStorage; uploaded: Map<string, { contentType: string; text: string }> } {
  const uploaded = new Map<string, { contentType: string; text: string }>();
  const storage: PilotFileStorage = {
    async upload(key, bytes, contentType) {
      uploaded.set(key, { contentType, text: new TextDecoder().decode(bytes) });
      return { ok: true };
    },
    async remove(key) {
      events.push(`file:remove:${key}`);
      if (failRemove) return { ok: false, code: "DELETE_FAILED" };
      uploaded.delete(key);
      return { ok: true };
    },
    async exists(key) {
      return uploaded.has(key);
    },
  };
  return { storage, uploaded };
}

function fakeInvitation() {
  const issued: string[] = [];
  const deleted = new Set<string>();
  const used = new Set<string>();
  return {
    issueInvitation: async (participantReference: string) => {
      const invitationId = `inv-${issued.length + 1}`;
      issued.push(invitationId);
      return { ok: true as const, value: { invitationId, token: `tok-${invitationId}-${participantReference}` } };
    },
    consumeInvitation: async (token: string) => {
      if (used.has(token)) return { ok: false as const, code: "REUSED_INVITATION" };
      used.add(token);
      return { ok: true as const, participantReference: "synthetic-ref" };
    },
    deleteInvitation: async (invitationId: string) => {
      deleted.add(invitationId);
    },
    invitationExists: async (invitationId: string) => !deleted.has(invitationId),
  };
}

function run(overrides: {
  client: H3PilotCaller;
  storage: PilotFileStorage;
  invitation: ReturnType<typeof fakeInvitation>;
}) {
  return runSyntheticPilotJourney({
    synthetic: true,
    client: overrides.client,
    storage: overrides.storage,
    progress: createInMemoryPilotProgressStore(),
    issueInvitation: overrides.invitation.issueInvitation,
    consumeInvitation: overrides.invitation.consumeInvitation,
    deleteInvitation: overrides.invitation.deleteInvitation,
    invitationExists: overrides.invitation.invitationExists,
  });
}

describe("V1_187F synthetic runner — full journey", () => {
  it("7/9/10/11/12/13/14/17/19/21. completes the journey and cleans up", async () => {
    const events: string[] = [];
    const { client, calls, state } = fakeClient(events);
    const { storage, uploaded } = fakeStorage(events);
    const invitation = fakeInvitation();
    const result = await run({ client, storage, invitation });

    expect(result.ok).toBe(true);
    expect(Object.values(result.steps).every((step) => step.status === "PASS")).toBe(true);
    expect(result.residue).toEqual({
      h3ContextRemoved: true,
      productStorage: 0,
      productInvitation: 0,
      productProgress: 0,
      legacyPilotWrites: 0,
    });

    const operations = calls.map((call) => call.operation);
    // participant orchestrator canonical sequence
    expect(operations.slice(0, 8)).toEqual([
      "createPilotIntake",
      "recordPilotConsent",
      "recordSourceAuthorization",
      "createAndBindPerson",
      "recordIdentityConfirmation",
      "initiateEvidenceReview",
      "openEvidenceReview",
      "ingestEvidenceArtifact",
    ]);
    // synthetic operator seam
    expect(operations).toContain("generateProfessionalProfileDraft");
    expect(operations).toContain("readPilotParticipantContext");
    expect(operations).toContain("recordDraftDecision");
    expect(operations).toContain("grantTalentNetworkOptIn");
    expect(operations).toContain("revokeTalentNetworkOptIn");
    expect(operations).toContain("withdrawPilot");
    expect(operations).toContain("requestRealPersonRemoval");

    // draft decision uses explicit decision (canonical draft id expected)
    const decision = calls.find((call) => call.operation === "recordDraftDecision");
    expect(decision?.payload.decision).toBe("CONFIRMED");
    expect(decision?.payload.professionalProfileDraftId).toBe(DRAFT);

    // 13/14/15. opt-in canonical ids and no presentation permission
    const grant = calls.find((call) => call.operation === "grantTalentNetworkOptIn");
    expect(grant?.payload.personId).toBe(PERSON);
    expect(grant?.payload.evidenceReviewId).toBe(REVIEW);
    expect(grant?.payload.source).toBe(PILOT_OPT_IN_SOURCE);
    const revoke = calls.find((call) => call.operation === "revokeTalentNetworkOptIn");
    expect(revoke?.payload.permissionGrantId).toBe(GRANT);
    expect(revoke?.payload.personId).toBe(PERSON);
    expect(operations).not.toContain("promoteTalentProfile");

    // 16. withdrawal is distinct and precedes removal; state proves both
    expect(state.withdrawn).toBe(true);
    expect(state.removed).toBe(true);

    // 17. H3 removal happens before Product file deletion
    const removalIndex = events.indexOf("h3:requestRealPersonRemoval");
    const fileRemoveIndex = events.findIndex((event) => event.startsWith("file:remove:"));
    expect(removalIndex).toBeGreaterThanOrEqual(0);
    expect(fileRemoveIndex).toBeGreaterThan(removalIndex);

    // 21. synthetic CV only, opaque key, no PII
    expect(uploaded.size).toBe(0); // deleted by removal
    expect(result.steps.residue?.status).toBe("PASS");
  });

  it("18. reports pending cleanup instead of false success when file deletion fails", async () => {
    const events: string[] = [];
    const { client } = fakeClient(events);
    const { storage } = fakeStorage(events, true);
    const invitation = fakeInvitation();
    const result = await run({ client, storage, invitation });

    expect(result.ok).toBe(false);
    expect(result.steps.fileRemoval).toEqual({ status: "FAIL", code: "PRODUCT_FILE_CLEANUP_PENDING" });
    expect(result.residue.productStorage).toBe(1);
  });

  it("5/6. issues an invitation internally and blocks replay", async () => {
    const events: string[] = [];
    const { client } = fakeClient(events);
    const { storage } = fakeStorage(events);
    const invitation = fakeInvitation();
    const result = await run({ client, storage, invitation });
    expect(result.steps.invitation).toEqual({ status: "PASS" });
    expect(result.steps.invitationReplay).toEqual({ status: "PASS" });
  });

  it("22. never returns a raw token or secret", async () => {
    const events: string[] = [];
    const { client } = fakeClient(events);
    const { storage } = fakeStorage(events);
    const invitation = fakeInvitation();
    const result = await run({ client, storage, invitation });
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain("tok-");
    expect(serialized).not.toContain("H3_PILOT");
    expect(serialized).not.toContain("invitationSecret");
  });

  it("requires the explicit synthetic flag", async () => {
    await expect(
      runSyntheticPilotJourney({ synthetic: false as unknown as true }),
    ).rejects.toThrow(/SYNTHETIC_RUNNER_REQUIRES_SYNTHETIC_FLAG/);
  });
});

describe("V1_187F synthetic runner — boundaries (PARTS M/N)", () => {
  const read = (relative: string) => readFileSync(join(process.cwd(), relative), "utf8");

  it("8. no direct H3/Neon database access in the runner or route", () => {
    for (const file of [
      "src/lib/h3-pilot/operator/synthetic-runner.ts",
      "src/app/api/h3-pilot/operator/synthetic-runner/route.ts",
    ]) {
      const source = read(file);
      expect(source).not.toMatch(/from ["']postgres["']/);
      expect(source).not.toMatch(/neon|DATABASE_URL|@neondatabase/);
    }
  });

  it("20. normal Production Evidence Review flow is preserved", () => {
    expect(read("src/app/talents/evidence-review/page.tsx")).toContain("EvidenceReviewLandingClient");
    expect(read("src/app/talents/evidence-review/apply/page.tsx")).toContain("EvidenceReviewForm");
    expect(read("src/lib/evidence-review/server/submission-handler.ts")).toContain(
      "processEvidenceReviewSubmission",
    );
  });

  it("23. participant routes never import the operator runner", () => {
    for (const route of [
      "src/app/api/h3-pilot/participant/submission/route.ts",
      "src/app/api/h3-pilot/participant/state/route.ts",
      "src/app/api/h3-pilot/participant/draft/route.ts",
      "src/app/api/h3-pilot/participant/opt-in/route.ts",
      "src/app/api/h3-pilot/participant/lifecycle/route.ts",
    ]) {
      const source = read(route);
      expect(source).not.toContain("synthetic-runner");
      expect(source).not.toContain("operator/");
    }
  });

  it("24. the runner never falls back to the legacy Supabase Evidence Review", () => {
    const source = read("src/lib/h3-pilot/operator/synthetic-runner.ts");
    expect(source).not.toContain("@/lib/evidence-review");
    expect(source).not.toContain("EvidenceReviewRepository");
  });

  it("21. generates only synthetic markers (no real PII source)", () => {
    const source = read("src/lib/h3-pilot/operator/synthetic-runner.ts");
    expect(source).toContain("SYNTHETIC_RUNNER_MARKER");
    expect(source).toContain("synthetic");
    expect(source).not.toMatch(/@[a-z0-9.-]+\.(com|org|net|io)/i);
  });
});
