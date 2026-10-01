import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import type { H3PilotCallResult } from "../server/client";
import type { H3PilotCaller } from "../server/pilot-submission";
import type { H3PilotStatusView } from "../server/pilot-status";
import {
  decideTalentNetworkOptIn,
  recordPilotDraftDecisionAction,
  revokeTalentNetworkOptInAction,
} from "./actions-service";
import { PILOT_OPT_IN_SOURCE, PILOT_PARTICIPANT_ACTOR } from "./policy";
import {
  parsePilotParticipantContext,
  resolvePilotParticipantContext,
  type PilotParticipantContext,
} from "./context-resolver";
import { createInMemoryPilotProgressStore, type PilotProgressRecord } from "./progress";
import { readPilotParticipantState } from "./state-service";

const ROOT = process.cwd();
const read = (relative: string) => readFileSync(join(ROOT, relative), "utf8");

const INTAKE = "11111111-1111-4111-8111-111111111111";
const PERSON = "22222222-2222-4222-8222-222222222222";
const REVIEW = "33333333-3333-4333-8333-333333333333";
const DRAFT = "44444444-4444-4444-8444-444444444444";
const GRANT = "55555555-5555-4555-8555-555555555555";

const VALID_VIEW: H3PilotStatusView = {
  intakeStatus: "ACTIVE",
  retentionState: "RETENTION_ACTIVE",
  consentStatus: "GRANTED",
  evidenceReviewStatus: "REVIEW_COMPLETED",
  draftStatus: "GENERATED",
  draftDecision: null,
};

function context(overrides: Partial<PilotParticipantContext> = {}): PilotParticipantContext {
  return {
    intakeId: INTAKE,
    personId: PERSON,
    evidenceReviewId: REVIEW,
    professionalProfileDraftId: DRAFT,
    talentNetworkOptInPermissionGrantId: null,
    talentProfileId: null,
    ...overrides,
  };
}

interface RecordedCall {
  readonly operation: string;
  readonly payload: Record<string, unknown>;
}

function makeClient(options: {
  contextValue?: unknown;
  statusValue?: unknown;
  draftValue?: unknown;
  failAt?: string;
}): { client: H3PilotCaller; calls: RecordedCall[] } {
  const calls: RecordedCall[] = [];
  const client: H3PilotCaller = async (operation, payload): Promise<H3PilotCallResult> => {
    calls.push({ operation, payload });
    if (options.failAt === operation) return { ok: false, code: "FORCED_FAILURE" };
    switch (operation) {
      case "readPilotParticipantContext":
        return { ok: true, code: "OK", value: options.contextValue ?? context() };
      case "readPilotStatus":
        return { ok: true, code: "OK", value: options.statusValue ?? VALID_VIEW };
      case "getProfessionalProfileDraft":
        return { ok: true, code: "OK", value: options.draftValue ?? { draft: { content: "draft" } } };
      default:
        return { ok: true, code: "OK", value: {} };
    }
  };
  return { client, calls };
}

function progressRecord(overrides: Partial<PilotProgressRecord> = {}): PilotProgressRecord {
  return {
    participantReference: "P-1",
    invitationId: "inv-1",
    intakeId: INTAKE,
    personId: PERSON,
    evidenceReviewId: REVIEW,
    fileKeys: [],
    submittedAt: "2026-10-01T00:00:00.000Z",
    uiStage: "SUBMITTED",
    talentNetworkDeclined: false,
    cleanupPendingFileKeys: [],
    ...overrides,
  };
}

describe("V1_187E context client + resolver (PARTS B/C)", () => {
  it("1. resolves a typed context from readPilotParticipantContext", async () => {
    const { client, calls } = makeClient({});
    const result = await resolvePilotParticipantContext(INTAKE, { client });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.context).toEqual(context());
    expect(calls.map((call) => call.operation)).toEqual(["readPilotParticipantContext"]);
    expect(calls[0]?.payload).toEqual({ intakeId: INTAKE });
  });

  it("2. malformed context response fails closed", () => {
    expect(parsePilotParticipantContext({ intakeId: INTAKE }, INTAKE)).toEqual({
      ok: false,
      code: "INVALID_CONTEXT_PAYLOAD",
    });
    expect(
      parsePilotParticipantContext({ ...context(), personId: 42 }, INTAKE).ok,
    ).toBe(false);
    expect(parsePilotParticipantContext(null, INTAKE).ok).toBe(false);
  });

  it("3. intakeId mismatch fails closed", () => {
    const result = parsePilotParticipantContext(
      { ...context(), intakeId: "99999999-9999-4999-8999-999999999999" },
      INTAKE,
    );
    expect(result).toEqual({ ok: false, code: "PILOT_CONTEXT_SCOPE_MISMATCH" });
  });

  it("26. H3 failure fails closed", async () => {
    const { client } = makeClient({ failAt: "readPilotParticipantContext" });
    const result = await resolvePilotParticipantContext(INTAKE, { client });
    expect(result).toEqual({ ok: false, code: "FORCED_FAILURE" });
  });

  it("27. context contract carries only opaque ids (no PII)", async () => {
    const { client } = makeClient({});
    const result = await resolvePilotParticipantContext(INTAKE, { client });
    expect(result.ok).toBe(true);
    const serialized = JSON.stringify(result);
    for (const pii of ["@", "email", "phone", "canonicalName", "http://", "https://"]) {
      expect(serialized).not.toContain(pii);
    }
    expect(Object.keys((result as { context: object }).context).sort()).toEqual([
      "evidenceReviewId",
      "intakeId",
      "personId",
      "professionalProfileDraftId",
      "talentNetworkOptInPermissionGrantId",
      "talentProfileId",
    ]);
  });
});

describe("V1_187E status + draft read (PARTS E/F)", () => {
  it("4. status resolves personId before readPilotStatus", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = makeClient({});
    const result = await readPilotParticipantState(
      { participantReference: "P-1", language: "es" },
      { progress, client },
    );
    expect(result.ok).toBe(true);
    const status = calls.find((call) => call.operation === "readPilotStatus");
    expect(status?.payload.personId).toBe(PERSON);
    expect(status?.payload.intakeId).toBe(INTAKE);
    expect(status?.payload.evidenceReviewId).toBe(REVIEW);
    expect(status?.payload.professionalProfileDraftId).toBe(DRAFT);
    // context MUST be resolved before status.
    expect(calls.findIndex((c) => c.operation === "readPilotParticipantContext")).toBeLessThan(
      calls.findIndex((c) => c.operation === "readPilotStatus"),
    );
  });

  it("5. draft null returns a not-ready state and never reads a guessed draft", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = makeClient({ contextValue: context({ professionalProfileDraftId: null }) });
    const result = await readPilotParticipantState(
      { participantReference: "P-1", language: "en" },
      { progress, client },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.draft).toBeNull();
      expect(result.state.draftDecisionOpen).toBe(false);
    }
    expect(calls.some((call) => call.operation === "getProfessionalProfileDraft")).toBe(false);
  });

  it("6. draft non-null calls getProfessionalProfileDraft with the exact draft id", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = makeClient({});
    await readPilotParticipantState({ participantReference: "P-1", language: "en" }, { progress, client });
    const draftCall = calls.find((call) => call.operation === "getProfessionalProfileDraft");
    expect(draftCall?.payload.professionalProfileDraftId).toBe(DRAFT);
  });

  it("fails closed when the draft scope mismatches the context", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client } = makeClient({
      draftValue: { personId: "99999999-9999-4999-8999-999999999999" },
    });
    const result = await readPilotParticipantState(
      { participantReference: "P-1", language: "en" },
      { progress, client },
    );
    expect(result).toEqual({ ok: false, code: "PILOT_DRAFT_SCOPE_MISMATCH" });
  });
});

describe("V1_187E draft decision (PART G)", () => {
  it("7/8. CONFIRMED resolves fresh context and uses professionalProfileDraftId", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = makeClient({});
    const result = await recordPilotDraftDecisionAction(
      { participantReference: "P-1", decision: "CONFIRM" },
      { progress, client },
    );
    expect(result.ok).toBe(true);
    expect(calls.map((call) => call.operation)).toEqual([
      "readPilotParticipantContext",
      "recordDraftDecision",
    ]);
    const decision = calls.find((call) => call.operation === "recordDraftDecision");
    expect(decision?.payload.professionalProfileDraftId).toBe(DRAFT);
    expect(decision?.payload.decision).toBe("CONFIRMED");
    expect(decision?.payload.changedBy).toBe(PILOT_PARTICIPANT_ACTOR);
    expect(decision?.payload.intakeId).toBe(INTAKE);
  });

  it("9/10. CORRECTION_REQUESTED and REJECTED map exactly with the canonical draft id", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = makeClient({});
    await recordPilotDraftDecisionAction(
      { participantReference: "P-1", decision: "REQUEST_CORRECTION" },
      { progress, client },
    );
    await recordPilotDraftDecisionAction(
      { participantReference: "P-1", decision: "REJECT" },
      { progress, client },
    );
    const decisions = calls
      .filter((call) => call.operation === "recordDraftDecision")
      .map((call) => call.payload);
    expect(decisions.map((payload) => payload.decision)).toEqual([
      "CORRECTION_REQUESTED",
      "REJECTED",
    ]);
    for (const payload of decisions) expect(payload.professionalProfileDraftId).toBe(DRAFT);
    expect(calls.some((call) => call.operation === "promoteTalentProfile")).toBe(false);
  });

  it("11. no draft blocks the draft decision", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = makeClient({ contextValue: context({ professionalProfileDraftId: null }) });
    const result = await recordPilotDraftDecisionAction(
      { participantReference: "P-1", decision: "CONFIRM" },
      { progress, client },
    );
    expect(result).toEqual({ ok: false, code: "DRAFT_NOT_READY" });
    expect(calls.some((call) => call.operation === "recordDraftDecision")).toBe(false);
  });
});

describe("V1_187E talent opt-in + revocation (PARTS H/I)", () => {
  it("12/13/14/15. opt-in resolves fresh context and passes canonical ids + source", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = makeClient({
      statusValue: { ...VALID_VIEW, draftStatus: "CONFIRMED", draftDecision: "CONFIRMED" },
    });
    const result = await decideTalentNetworkOptIn(
      { participantReference: "P-1", action: "JOIN" },
      { progress, client },
    );
    expect(result.ok).toBe(true);
    const grant = calls.find((call) => call.operation === "grantTalentNetworkOptIn");
    expect(grant?.payload.personId).toBe(PERSON);
    expect(grant?.payload.evidenceReviewId).toBe(REVIEW);
    expect(grant?.payload.source).toBe(PILOT_OPT_IN_SOURCE);
    expect(grant?.payload.changedBy).toBe(PILOT_PARTICIPANT_ACTOR);
    // context resolved immediately before the mutation
    const grantIndex = calls.findIndex((call) => call.operation === "grantTalentNetworkOptIn");
    const contextIndex = calls.map((c) => c.operation).lastIndexOf("readPilotParticipantContext");
    expect(contextIndex).toBeLessThan(grantIndex);
  });

  it("16. opt-in never creates presentation permission or promotion", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = makeClient({
      statusValue: { ...VALID_VIEW, draftStatus: "CONFIRMED", draftDecision: "CONFIRMED" },
    });
    await decideTalentNetworkOptIn({ participantReference: "P-1", action: "JOIN" }, { progress, client });
    expect(calls.some((call) => call.operation === "promoteTalentProfile")).toBe(false);
    expect(calls.some((call) => call.operation.includes("PRESENTATION"))).toBe(false);
  });

  it("17/18. revoke resolves fresh context and uses the current canonical grant id", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = makeClient({
      contextValue: context({ talentNetworkOptInPermissionGrantId: GRANT }),
    });
    const result = await revokeTalentNetworkOptInAction(
      { participantReference: "P-1" },
      { progress, client },
    );
    expect(result).toEqual({ ok: true, revoked: true });
    expect(calls.map((call) => call.operation)).toEqual([
      "readPilotParticipantContext",
      "revokeTalentNetworkOptIn",
    ]);
    const revoke = calls.find((call) => call.operation === "revokeTalentNetworkOptIn");
    expect(revoke?.payload.permissionGrantId).toBe(GRANT);
    expect(revoke?.payload.personId).toBe(PERSON);
  });

  it("19. null permission grant is a safe idempotent no-op", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = makeClient({});
    const result = await revokeTalentNetworkOptInAction(
      { participantReference: "P-1" },
      { progress, client },
    );
    expect(result).toEqual({ ok: true, revoked: false });
    expect(calls.some((call) => call.operation === "revokeTalentNetworkOptIn")).toBe(false);
  });

  it("20. a stored permission id is never trusted over the canonical resolver", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(
      progressRecord({ lastKnownPermissionGrantId: "stale-grant-id" }),
    );
    const stale = makeClient({});
    const staleResult = await revokeTalentNetworkOptInAction(
      { participantReference: "P-1" },
      { progress, client: stale.client },
    );
    expect(staleResult).toEqual({ ok: true, revoked: false });
    expect(stale.calls.some((call) => call.operation === "revokeTalentNetworkOptIn")).toBe(false);

    const current = makeClient({
      contextValue: context({ talentNetworkOptInPermissionGrantId: GRANT }),
    });
    await revokeTalentNetworkOptInAction({ participantReference: "P-1" }, { progress, client: current.client });
    const revoke = current.calls.find((call) => call.operation === "revokeTalentNetworkOptIn");
    expect(revoke?.payload.permissionGrantId).toBe(GRANT);
    expect(revoke?.payload.permissionGrantId).not.toBe("stale-grant-id");
  });
});

describe("V1_187E boundaries and preservation (PARTS D/J/K/L)", () => {
  it("21. progress-store ids are documented non-authoritative and mutations re-resolve", () => {
    const progress = read("src/lib/h3-pilot/participant/progress.ts");
    expect(progress).toContain("NON-AUTHORITATIVE");
    expect(progress).toContain("as the source for a canonical mutation");
    expect(progress).toContain("MUST NEVER");
    const actions = read("src/lib/h3-pilot/participant/actions-service.ts");
    expect(actions).toContain("resolvePilotParticipantContext");
    expect(actions).toContain("CANONICAL ID INVARIANT");
  });

  it("22. no H3 pilot participant module opens a direct database connection", () => {
    for (const file of [
      "src/lib/h3-pilot/participant/context-resolver.ts",
      "src/lib/h3-pilot/participant/state-service.ts",
      "src/lib/h3-pilot/participant/actions-service.ts",
      "src/lib/h3-pilot/participant/synthetic-operator-runner.ts",
    ]) {
      const source = read(file);
      expect(source).not.toMatch(/from ["']postgres["']/);
      expect(source).not.toMatch(/neon|DATABASE_URL|@neondatabase/);
    }
  });

  it("23. operator actions are unreachable from participant routes/UI", () => {
    const participantSurface = [
      "src/app/api/h3-pilot/participant/submission/route.ts",
      "src/app/api/h3-pilot/participant/state/route.ts",
      "src/app/api/h3-pilot/participant/draft/route.ts",
      "src/app/api/h3-pilot/participant/opt-in/route.ts",
      "src/app/api/h3-pilot/participant/lifecycle/route.ts",
      "src/app/talents/evidence-review/apply/PilotApplyForm.tsx",
      "src/app/talents/evidence-review/submitted/PilotStatusPanel.tsx",
      "src/app/talents/evidence-review/PilotLanding.tsx",
    ];
    const forbidden = [
      "createClaim",
      "linkClaimEvidence",
      "changeClaimStatus",
      "submitCoherenceAssessment",
      "completeEvidenceReview",
      "generateProfessionalProfileDraft",
      "promoteTalentProfile",
      "synthetic-operator-runner",
      "pilot-operator-review",
    ];
    for (const file of participantSurface) {
      const source = read(file);
      for (const token of forbidden) expect(source).not.toContain(token);
    }
  });

  it("K. the synthetic operator runner is guarded, server-only, and not routed", () => {
    const runner = read("src/lib/h3-pilot/participant/synthetic-operator-runner.ts");
    expect(runner).toContain('import "server-only"');
    expect(runner).toContain("SYNTHETIC_OPERATOR_RUNNER_REQUIRES_SYNTHETIC_FLAG");
    // no route imports it
    for (const route of [
      "src/app/api/h3-pilot/participant/submission/route.ts",
      "src/app/api/h3-pilot/participant/state/route.ts",
      "src/app/api/h3-pilot/participant/draft/route.ts",
      "src/app/api/h3-pilot/participant/opt-in/route.ts",
      "src/app/api/h3-pilot/participant/lifecycle/route.ts",
    ]) {
      expect(read(route)).not.toContain("synthetic-operator-runner");
    }
  });

  it("24. participant services never fall back to the legacy Supabase flow", () => {
    for (const file of [
      "src/lib/h3-pilot/participant/context-resolver.ts",
      "src/lib/h3-pilot/participant/state-service.ts",
      "src/lib/h3-pilot/participant/actions-service.ts",
      "src/lib/h3-pilot/participant/synthetic-operator-runner.ts",
      "src/app/api/h3-pilot/participant/draft/route.ts",
      "src/app/api/h3-pilot/participant/opt-in/route.ts",
      "src/app/api/h3-pilot/participant/lifecycle/route.ts",
    ]) {
      expect(read(file)).not.toContain("@/lib/evidence-review");
    }
  });

  it("25. normal Production Evidence Review flow is preserved", () => {
    expect(read("src/app/talents/evidence-review/page.tsx")).toContain("EvidenceReviewLandingClient");
    expect(read("src/app/talents/evidence-review/apply/page.tsx")).toContain("EvidenceReviewForm");
    expect(read("src/app/talents/evidence-review/submitted/page.tsx")).toContain("EvidenceReviewSubmittedClient");
    expect(read("src/lib/evidence-review/server/submission-handler.ts")).toContain(
      "processEvidenceReviewSubmission",
    );
  });

  it("28. no secrets or server env in participant client modules", () => {
    for (const file of [
      "src/app/talents/evidence-review/PilotLanding.tsx",
      "src/app/talents/evidence-review/apply/PilotApplyForm.tsx",
      "src/app/talents/evidence-review/submitted/PilotStatusPanel.tsx",
    ]) {
      const source = read(file);
      for (const secret of [
        "H3_PILOT_OPERATOR_SECRET",
        "H3_PILOT_INVITATION_SECRET",
        "H3_TALENT_PILOT_SERVICE_CREDENTIAL",
        "SUPABASE_SECRET_KEY",
        "NEXT_PUBLIC_",
      ]) {
        expect(source).not.toContain(secret);
      }
    }
  });

  it("client allowlist exposes readPilotParticipantContext and no generic operation", () => {
    const source = read("src/lib/h3-pilot/server/client.ts");
    expect(source).toContain("readPilotParticipantContext");
    expect(source).not.toContain("NEXT_PUBLIC_");
  });
});
