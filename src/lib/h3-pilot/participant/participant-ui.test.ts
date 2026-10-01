import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import type { H3PilotConfig } from "../server/config";
import type { IdentityTokenProvider } from "../server/identity";
import type { H3PilotCallResult, PilotTransport } from "../server/client";
import { requestPilotRemoval } from "../server/removal";
import type { H3PilotCaller } from "../server/pilot-submission";
import { buildSourceLocator } from "../server/pilot-source";
import type { H3PilotStatusView } from "../server/pilot-status";
import type { PilotFileStorage } from "../server/storage";
import {
  PARTICIPANT_DECISION_OPERATIONS,
  PARTICIPANT_FORBIDDEN_OPERATIONS,
  decideTalentNetworkOptIn,
  recordPilotDraftDecisionAction,
  requestPilotRemovalAction,
  revokeTalentNetworkOptInAction,
  withdrawPilotParticipant,
} from "./actions-service";
import { PILOT_CONSENT_ITEMS, pilotContent } from "./content";
import {
  mapPilotDraftDecision,
  isDraftDecisionOpen,
  isTalentNetworkOptInEligible,
} from "./decisions";
import {
  PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS,
  PILOT_IDENTITY_CONFIRMATION_TEXT,
  PILOT_POLICY_VERSION,
  validatePilotConsent,
  type PilotConsentAcknowledgements,
} from "./policy";
import {
  createInMemoryPilotProgressStore,
  type PilotProgressRecord,
} from "./progress";
import {
  composePilotParticipantState,
  parsePilotStatusView,
} from "./state-service";
import { submitPilotParticipant, type PilotUpload } from "./submission-service";

const CV_OBJECT_KEY = "pilot/11111111-1111-4111-8111-111111111111";
const COVER_OBJECT_KEY = "pilot/22222222-2222-4222-8222-222222222222";

const ROOT = process.cwd();
const read = (relative: string) => readFileSync(join(ROOT, relative), "utf8");

function fullAcks(): PilotConsentAcknowledgements {
  const acks = {} as PilotConsentAcknowledgements;
  for (const key of PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS) acks[key] = true;
  return acks;
}

function upload(contentType: string, byteLength: number): PilotUpload {
  return { contentType, byteLength, bytes: new Uint8Array(Math.min(byteLength, 4)) };
}

function deterministicUuid(): () => string {
  let n = 0;
  return () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`;
}

interface RecordedCall {
  readonly operation: string;
  readonly payload: Record<string, unknown>;
}

function recordingClient(
  statusValue?: unknown,
  failAt?: string,
): { client: H3PilotCaller; calls: RecordedCall[] } {
  const calls: RecordedCall[] = [];
  const client: H3PilotCaller = async (operation, payload): Promise<H3PilotCallResult> => {
    calls.push({ operation, payload });
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
      case "readPilotStatus":
        return { ok: true, code: "OK", value: statusValue ?? {} };
      case "getProfessionalProfileDraft":
        return { ok: true, code: "OK", value: { draft: { content: "draft" } } };
      default:
        return { ok: true, code: "OK", value: {} };
    }
  };
  return { client, calls };
}

function fakeStorage(failKeys: readonly string[] = []): {
  storage: PilotFileStorage;
  removed: string[];
  uploaded: string[];
} {
  const removed: string[] = [];
  const uploaded: string[] = [];
  return {
    removed,
    uploaded,
    storage: {
      async upload(key) {
        uploaded.push(key);
        return { ok: true };
      },
      async remove(key) {
        removed.push(key);
        return failKeys.includes(key) ? { ok: false, code: "DELETE_FAILED" } : { ok: true };
      },
      async exists() {
        return false;
      },
    },
  };
}

function progressRecord(overrides: Partial<PilotProgressRecord> = {}): PilotProgressRecord {
  return {
    participantReference: "P-1",
    invitationId: "inv-1",
    intakeId: "intake-1",
    personId: "person-1",
    evidenceReviewId: "er-1",
    fileKeys: [CV_OBJECT_KEY, COVER_OBJECT_KEY],
    submittedAt: "2026-10-01T00:00:00.000Z",
    uiStage: "SUBMITTED",
    talentNetworkDeclined: false,
    cleanupPendingFileKeys: [],
    ...overrides,
  };
}

const BASE_STATUS: H3PilotStatusView = {
  intakeStatus: "ACTIVE",
  retentionState: "RETENTION_ACTIVE",
  consentStatus: "GRANTED",
  evidenceReviewStatus: "REVIEW_IN_PROGRESS",
  draftStatus: null,
  draftDecision: null,
};

const CONFIRMED_DRAFT_STATUS: H3PilotStatusView = {
  intakeStatus: "ACTIVE",
  retentionState: "RETENTION_ACTIVE",
  consentStatus: "GRANTED",
  evidenceReviewStatus: "REVIEW_COMPLETED",
  draftStatus: "GENERATED",
  draftDecision: "CONFIRMED",
};

const REMOVAL_CONFIG: H3PilotConfig = {
  baseUrl: "https://pilot.example.invalid",
  serviceCredential: "app-credential",
  invitationSecret: "invite-secret",
};
const REMOVAL_IDENTITY: IdentityTokenProvider = { getIdentityToken: async () => "iam-token" };
const REMOVAL_TRANSPORT: PilotTransport = {
  async post() {
    return { status: 200, body: { ok: true, code: "OK", value: { removed: true } } };
  },
};

describe("V1_187B consent (PART C)", () => {
  it("4. requires all twelve independent acknowledgements (no catch-all)", () => {
    expect(PILOT_CONSENT_ITEMS).toHaveLength(12);
    expect(PILOT_CONSENT_ACKNOWLEDGEMENT_KEYS).toHaveLength(12);
    expect(PILOT_POLICY_VERSION).toBe("PILOT_GOVERNANCE_V1_175");
    expect(validatePilotConsent({}).ok).toBe(false);
    expect(validatePilotConsent(null).ok).toBe(false);
    expect(validatePilotConsent(fullAcks()).ok).toBe(true);

    const partial = fullAcks();
    partial.correction_right = false;
    const result = validatePilotConsent(partial);
    expect(result.ok).toBe(false);
    expect(result.missing).toEqual(["correction_right"]);
  });

  it("9. identity confirmation uses the exact participant text", () => {
    expect(PILOT_IDENTITY_CONFIRMATION_TEXT).toBe(
      "Confirmo que los materiales profesionales que presenté o autoricé se refieren a mí.",
    );
  });
});

describe("V1_187B participant submission (PARTS D/E/F)", () => {
  it("5/6/7/8/9/10. orchestrates the canonical sequence and maps source auth", async () => {
    const { client, calls } = recordingClient();
    const { storage, uploaded } = fakeStorage();
    const progress = createInMemoryPilotProgressStore();
    const result = await submitPilotParticipant(
      {
        participantReference: "P-1",
        invitationId: "inv-1",
        identityAcknowledged: true,
        acknowledgements: fullAcks(),
        cv: upload("application/pdf", 1_024),
        coverLetter: upload(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          2_048,
        ),
      },
      { storage, progress, client, uuid: deterministicUuid(), now: 1_000_000 },
    );

    expect(result.ok).toBe(true);
    expect(calls.map((call) => call.operation)).toEqual([
      "createPilotIntake",
      "recordPilotConsent",
      "recordSourceAuthorization",
      "recordSourceAuthorization",
      "createAndBindPerson",
      "recordIdentityConfirmation",
      "initiateEvidenceReview",
      "openEvidenceReview",
      "ingestEvidenceArtifact",
      "ingestEvidenceArtifact",
    ]);

    const auth = calls.find((call) => call.operation === "recordSourceAuthorization");
    expect(auth?.payload.status).toBe("GRANTED");
    expect(auth?.payload.submittedByParticipant).toBe(true);
    expect(auth?.payload.publicSource).toBe(false);
    expect(auth?.payload.authorizedPurpose).toBe("Evidence Review and Professional Profile Draft");
    expect(String(auth?.payload.sourceLocator)).toMatch(/^participant-upload:\/\/cv\/[0-9a-f-]{36}$/);

    const ingest = calls.find((call) => call.operation === "ingestEvidenceArtifact");
    expect(String(ingest?.payload.contentReference)).toMatch(
      /^product-storage:\/\/h3-pilot-evidence\/pilot\/[0-9a-f-]{36}$/,
    );
    expect(String(ingest?.payload.source)).toMatch(/^participant-upload:\/\//);

    const identity = calls.find((call) => call.operation === "recordIdentityConfirmation");
    expect(identity?.payload.status).toBe("CONFIRMED");

    expect(uploaded).toHaveLength(2);
  });

  it("5. CV is required and cover letter is optional", async () => {
    const { client } = recordingClient();
    const { storage } = fakeStorage();
    const progress = createInMemoryPilotProgressStore();
    const noCv = await submitPilotParticipant(
      {
        participantReference: "P-1",
        invitationId: null,
        identityAcknowledged: true,
        acknowledgements: fullAcks(),
        cv: null,
        coverLetter: null,
      },
      { storage, progress, client, uuid: deterministicUuid() },
    );
    expect(noCv).toMatchObject({ ok: false, code: "CV_REQUIRED" });

    const cvOnly = await submitPilotParticipant(
      {
        participantReference: "P-1",
        invitationId: null,
        identityAcknowledged: true,
        acknowledgements: fullAcks(),
        cv: upload("application/pdf", 10),
        coverLetter: null,
      },
      { storage, progress, client, uuid: deterministicUuid() },
    );
    expect(cvOnly.ok).toBe(true);
  });

  it("6/7. validates file type and size before any H3 call", async () => {
    const { client, calls } = recordingClient();
    const { storage } = fakeStorage();
    const progress = createInMemoryPilotProgressStore();
    const badType = await submitPilotParticipant(
      {
        participantReference: "P-1",
        invitationId: null,
        identityAcknowledged: true,
        acknowledgements: fullAcks(),
        cv: upload("image/png", 100),
        coverLetter: null,
      },
      { storage, progress, client, uuid: deterministicUuid() },
    );
    expect(badType).toMatchObject({ ok: false, code: "UNSUPPORTED_FILE_TYPE" });

    const tooLarge = await submitPilotParticipant(
      {
        participantReference: "P-1",
        invitationId: null,
        identityAcknowledged: true,
        acknowledgements: fullAcks(),
        cv: upload("application/pdf", 6 * 1024 * 1024),
        coverLetter: null,
      },
      { storage, progress, client, uuid: deterministicUuid() },
    );
    expect(tooLarge).toMatchObject({ ok: false, code: "FILE_TOO_LARGE" });
    expect(calls).toHaveLength(0);
  });

  it("4/9. rejects incomplete consent and missing identity before any H3 call", async () => {
    const { client, calls } = recordingClient();
    const { storage } = fakeStorage();
    const progress = createInMemoryPilotProgressStore();

    const noConsent = await submitPilotParticipant(
      {
        participantReference: "P-1",
        invitationId: null,
        identityAcknowledged: true,
        acknowledgements: {},
        cv: upload("application/pdf", 10),
        coverLetter: null,
      },
      { storage, progress, client, uuid: deterministicUuid() },
    );
    expect(noConsent).toMatchObject({ ok: false, code: "CONSENT_INCOMPLETE" });

    const noIdentity = await submitPilotParticipant(
      {
        participantReference: "P-1",
        invitationId: null,
        identityAcknowledged: false,
        acknowledgements: fullAcks(),
        cv: upload("application/pdf", 10),
        coverLetter: null,
      },
      { storage, progress, client, uuid: deterministicUuid() },
    );
    expect(noIdentity).toMatchObject({ ok: false, code: "IDENTITY_CONFIRMATION_REQUIRED" });
    expect(calls).toHaveLength(0);
  });

  it("11/12/13. never performs operator, opt-in, or promotion operations", async () => {
    const { client, calls } = recordingClient();
    const { storage } = fakeStorage();
    const progress = createInMemoryPilotProgressStore();
    await submitPilotParticipant(
      {
        participantReference: "P-1",
        invitationId: null,
        identityAcknowledged: true,
        acknowledgements: fullAcks(),
        cv: upload("application/pdf", 10),
        coverLetter: null,
      },
      { storage, progress, client, uuid: deterministicUuid() },
    );
    const operations = calls.map((call) => call.operation);
    for (const forbidden of [
      ...PARTICIPANT_FORBIDDEN_OPERATIONS,
      "grantTalentNetworkOptIn",
      "revokeTalentNetworkOptIn",
      "recordDraftDecision",
      "withdrawPilot",
    ]) {
      expect(operations).not.toContain(forbidden);
    }
  });

  it("26. locators carry no public URL, no HTTP, and no participant PII", () => {
    const locator = buildSourceLocator("CV", CV_OBJECT_KEY.replace("pilot/", ""));
    expect(locator.startsWith("participant-upload://cv/")).toBe(true);
    expect(locator).not.toContain("http");
    expect(locator).not.toContain("P-1");
    expect(locator).not.toContain("@");
  });

  it("fails closed and cleans up uploaded files when H3 rejects", async () => {
    const { client } = recordingClient(undefined, "recordPilotConsent");
    const { storage, removed } = fakeStorage();
    const progress = createInMemoryPilotProgressStore();
    const result = await submitPilotParticipant(
      {
        participantReference: "P-1",
        invitationId: null,
        identityAcknowledged: true,
        acknowledgements: fullAcks(),
        cv: upload("application/pdf", 10),
        coverLetter: null,
      },
      { storage, progress, client, uuid: deterministicUuid() },
    );
    expect(result).toMatchObject({ ok: false, code: "FORCED_FAILURE" });
    expect(removed).toHaveLength(1);
  });
});

describe("V1_187B status + decisions (PARTS G/H/I/J/K/L/M)", () => {
  it("15. maps canonical status to presentation labels only", () => {
    expect(composePilotParticipantState({
      hasProgress: false,
      statusView: null,
      draft: null,
      cleanupPending: false,
      talentNetworkDeclined: false,
      optInStatus: null,
      language: "es",
    }).label).toBe("Sin enviar");

    expect(composePilotParticipantState({
      hasProgress: true,
      statusView: BASE_STATUS,
      draft: null,
      cleanupPending: false,
      talentNetworkDeclined: false,
      optInStatus: null,
      language: "es",
    }).label).toBe("En revisión");

    expect(composePilotParticipantState({
      hasProgress: true,
      statusView: { ...BASE_STATUS, retentionState: "REMOVED" },
      draft: null,
      cleanupPending: false,
      talentNetworkDeclined: false,
      optInStatus: null,
      language: "en",
    }).label).toBe("Removed");
  });

  it("15. defensively parses the canonical status payload", () => {
    expect(parsePilotStatusView({ intakeStatus: "ACTIVE", retentionState: "RETENTION_ACTIVE" })).not.toBeNull();
    expect(parsePilotStatusView({ intakeStatus: "NOPE", retentionState: "RETENTION_ACTIVE" })).toBeNull();
    expect(parsePilotStatusView(null)).toBeNull();
  });

  it("16/17/18. maps confirm/correction/reject exactly", () => {
    expect(mapPilotDraftDecision("CONFIRM")).toBe("CONFIRMED");
    expect(mapPilotDraftDecision("REQUEST_CORRECTION")).toBe("CORRECTION_REQUESTED");
    expect(mapPilotDraftDecision("REJECT")).toBe("REJECTED");
  });

  it("16/17/18/23. participant decision actions call canonical operations only", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = recordingClient();
    const deps = { progress, client };

    await recordPilotDraftDecisionAction(
      { participantReference: "P-1", decision: "CONFIRM" },
      deps,
    );
    await recordPilotDraftDecisionAction(
      { participantReference: "P-1", decision: "REQUEST_CORRECTION", correctionMessage: "fix it" },
      deps,
    );
    await recordPilotDraftDecisionAction(
      { participantReference: "P-1", decision: "REJECT" },
      deps,
    );

    const decisions = calls
      .filter((call) => call.operation === "recordDraftDecision")
      .map((call) => call.payload.decision);
    expect(decisions).toEqual(["CONFIRMED", "CORRECTION_REQUESTED", "REJECTED"]);
    expect(calls.some((call) => call.operation === "promoteTalentProfile")).toBe(false);
  });

  it("19/20. opt-in is hidden before a confirmed draft and is a separate action", async () => {
    expect(isTalentNetworkOptInEligible(BASE_STATUS)).toBe(false);
    expect(
      isTalentNetworkOptInEligible({ ...CONFIRMED_DRAFT_STATUS, draftDecision: "CORRECTION_REQUESTED" }),
    ).toBe(false);
    expect(isTalentNetworkOptInEligible(CONFIRMED_DRAFT_STATUS)).toBe(true);

    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());

    const ineligible = recordingClient({
      intakeStatus: "ACTIVE",
      retentionState: "RETENTION_ACTIVE",
      consentStatus: "GRANTED",
      evidenceReviewStatus: "REVIEW_COMPLETED",
      draftStatus: "GENERATED",
      draftDecision: "CORRECTION_REQUESTED",
    });
    const denied = await decideTalentNetworkOptIn(
      { participantReference: "P-1", action: "JOIN" },
      { progress, client: ineligible.client },
    );
    expect(denied).toMatchObject({ ok: false, code: "OPT_IN_NOT_ELIGIBLE" });
    expect(ineligible.calls.some((call) => call.operation === "grantTalentNetworkOptIn")).toBe(false);

    const eligible = recordingClient({
      intakeStatus: "ACTIVE",
      retentionState: "RETENTION_ACTIVE",
      consentStatus: "GRANTED",
      evidenceReviewStatus: "REVIEW_COMPLETED",
      draftStatus: "GENERATED",
      draftDecision: "CONFIRMED",
    });
    const joined = await decideTalentNetworkOptIn(
      { participantReference: "P-1", action: "JOIN" },
      { progress, client: eligible.client },
    );
    expect(joined.ok).toBe(true);
    expect(eligible.calls.some((call) => call.operation === "grantTalentNetworkOptIn")).toBe(true);
  });

  it("21. withdrawal maps to canonical withdrawPilot", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = recordingClient();
    const result = await withdrawPilotParticipant(
      { participantReference: "P-1", reason: "participant request" },
      { progress, client },
    );
    expect(result.ok).toBe(true);
    expect(calls.map((call) => call.operation)).toEqual(["withdrawPilot"]);
    expect(calls[0]?.payload.intakeId).toBe("intake-1");
  });

  it("22. opt-in revocation maps to canonical revokeTalentNetworkOptIn", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { client, calls } = recordingClient();
    const result = await revokeTalentNetworkOptInAction(
      { participantReference: "P-1" },
      { progress, client },
    );
    expect(result.ok).toBe(true);
    expect(calls.map((call) => call.operation)).toEqual(["revokeTalentNetworkOptIn"]);
  });

  it("23/25. removal records a safe pending cleanup state when files fail", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const result = await requestPilotRemovalAction(
      { participantReference: "P-1", reason: "removal" },
      {
        progress,
        storage: fakeStorage().storage,
        callRemoval: async () => ({
          ok: true,
          code: "REMOVAL_FILES_PENDING",
          h3Removed: true,
          filesDeleted: false,
          cleanupPending: true,
          pendingFileKeys: [COVER_OBJECT_KEY],
        }),
      },
    );
    expect(result).toMatchObject({ ok: true, cleanupPending: true, pendingFileKeys: [COVER_OBJECT_KEY] });
    const saved = await progress.get("P-1");
    expect(saved?.cleanupPendingFileKeys).toEqual([COVER_OBJECT_KEY]);
  });

  it("23/24. removal action deletes files only after H3 removal succeeds", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { storage, removed } = fakeStorage();
    const result = await requestPilotRemovalAction(
      { participantReference: "P-1", reason: "removal" },
      {
        progress,
        storage,
        callRemoval: (input) =>
          requestPilotRemoval(input, {
            storage,
            config: REMOVAL_CONFIG,
            identityTokenProvider: REMOVAL_IDENTITY,
            transport: REMOVAL_TRANSPORT,
          }),
      },
    );
    expect(result).toMatchObject({ ok: true, cleanupPending: false });
    expect(removed).toEqual([CV_OBJECT_KEY, COVER_OBJECT_KEY]);
  });

  it("H3 removal failure deletes nothing", async () => {
    const progress = createInMemoryPilotProgressStore();
    await progress.save(progressRecord());
    const { storage, removed } = fakeStorage();
    const result = await requestPilotRemovalAction(
      { participantReference: "P-1", reason: "removal" },
      {
        progress,
        storage,
        callRemoval: async () => ({
          ok: false,
          code: "PROCESSING_BLOCKED",
          h3Removed: false,
          filesDeleted: false,
          cleanupPending: false,
          pendingFileKeys: [],
        }),
      },
    );
    expect(result).toMatchObject({ ok: false, code: "PROCESSING_BLOCKED" });
    expect(removed).toHaveLength(0);
  });

  it("opens draft decisions only when a draft exists", () => {
    expect(isDraftDecisionOpen(BASE_STATUS)).toBe(false);
    expect(isDraftDecisionOpen({ ...CONFIRMED_DRAFT_STATUS, draftStatus: "GENERATED", draftDecision: null })).toBe(true);
  });
});

describe("V1_187B boundaries and preservation (PARTS A/L/N/O/P)", () => {
  it("2. invited pilot session renders pilot UX on shared routes", () => {
    expect(read("src/app/talents/evidence-review/page.tsx")).toContain("PilotLanding");
    expect(read("src/app/talents/evidence-review/page.tsx")).toContain("getPilotSession");
    expect(read("src/app/talents/evidence-review/apply/page.tsx")).toContain("PilotApplyForm");
    expect(read("src/app/talents/evidence-review/submitted/page.tsx")).toContain("PilotStatusPanel");
    expect(read("src/app/talents/evidence-review/profile/page.tsx")).toContain("PilotStatusPanel");
  });

  it("1/29. normal Production Evidence Review flow is preserved", () => {
    expect(read("src/app/talents/evidence-review/page.tsx")).toContain("EvidenceReviewLandingClient");
    expect(read("src/app/talents/evidence-review/apply/page.tsx")).toContain("EvidenceReviewForm");
    expect(read("src/app/talents/evidence-review/submitted/page.tsx")).toContain("EvidenceReviewSubmittedClient");
    expect(read("src/app/talents/evidence-review/profile/page.tsx")).toContain("PrivateProfileActions");
    expect(read("src/lib/evidence-review/server/submission-handler.ts")).toContain(
      "processEvidenceReviewSubmission",
    );
  });

  it("3. invalid pilot session is blocked at the server gate", () => {
    for (const route of [
      "src/app/api/h3-pilot/participant/submission/route.ts",
      "src/app/api/h3-pilot/participant/state/route.ts",
      "src/app/api/h3-pilot/participant/draft/route.ts",
      "src/app/api/h3-pilot/participant/opt-in/route.ts",
      "src/app/api/h3-pilot/participant/lifecycle/route.ts",
    ]) {
      const source = read(route);
      expect(source).toContain("requirePilotSession");
      expect(source).toContain("PILOT_SESSION_INVALID");
    }
  });

  it("14. participant services never fall back to the legacy Supabase flow", () => {
    for (const file of [
      "src/lib/h3-pilot/participant/submission-service.ts",
      "src/lib/h3-pilot/participant/actions-service.ts",
      "src/lib/h3-pilot/participant/state-service.ts",
      "src/app/api/h3-pilot/participant/submission/route.ts",
      "src/app/api/h3-pilot/participant/draft/route.ts",
      "src/app/api/h3-pilot/participant/opt-in/route.ts",
      "src/app/api/h3-pilot/participant/lifecycle/route.ts",
    ]) {
      expect(read(file)).not.toContain("@/lib/evidence-review");
    }
  });

  it("28. operator actions are unreachable from participant routes/UI", () => {
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
    for (const file of participantSurface) {
      const source = read(file);
      for (const forbidden of PARTICIPANT_FORBIDDEN_OPERATIONS) {
        expect(source).not.toContain(forbidden);
      }
      expect(source).not.toContain("pilot-operator-review");
    }
    for (const op of PARTICIPANT_FORBIDDEN_OPERATIONS) {
      expect(PARTICIPANT_DECISION_OPERATIONS as readonly string[]).not.toContain(op);
    }
  });

  it("27. participant client components expose no secrets and no server env", () => {
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

  it("N. Product retains only non-authoritative progress metadata", () => {
    const progress = read("src/lib/h3-pilot/participant/progress.ts");
    for (const forbidden of ["consentStatus", "draftDecision", "optInStatus", "retentionState"]) {
      expect(progress).not.toContain(forbidden);
    }
    expect(progress).toContain("NON-AUTHORITATIVE");
  });

  it("B. participant copy is professional-only and hides internals", () => {
    const copy = JSON.stringify(pilotContent);
    for (const internal of ["Neon", "Cloud Run", "neon", "cloud run", "opencode", "postgres"]) {
      expect(copy).not.toContain(internal);
    }
    expect(pilotContent.es.explanationPoints.join(" ")).toContain("Talent Network");
    expect(pilotContent.es.previewNotice).toContain("Presentación externa deshabilitada");
  });
});
