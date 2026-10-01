import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  PILOT_AUTHORIZATION_ALREADY_INVITED,
  PILOT_INVITATION_CAP_REACHED,
  issuePilotInvitation,
  type PilotInvitationInsert,
  type PilotInvitationWriter,
} from "./invitation-issuer";
import { createInMemoryInvitationUseStore, validateInvitationToken } from "./invitation";

const read = (relative: string) => readFileSync(join(process.cwd(), relative), "utf8");

const AUTH_1 = "a1900000-0001-4000-8000-000000000001";
const AUTH_2 = "a1900000-0002-4000-8000-000000000002";
const AUTH_3 = "a1900000-0003-4000-8000-000000000003";
const CONFIG = { baseUrl: "https://x", serviceCredential: "cred", invitationSecret: "signing-secret" };

function recordingWriter(): { writer: PilotInvitationWriter; rows: PilotInvitationInsert[] } {
  const rows: PilotInvitationInsert[] = [];
  return {
    rows,
    writer: {
      async insert(row) {
        rows.push(row);
        return { ok: true };
      },
    },
  };
}

let uuidCounter = 0;
function nextUuid(): string {
  uuidCounter += 1;
  return `00000000-0000-4000-8000-${String(uuidCounter).padStart(12, "0")}`;
}

describe("V1_191 authorization-bound real pilot invitations", () => {
  it("1/2/5/6. binds each invitation to exactly its own authorization", async () => {
    const first = recordingWriter();
    const r1 = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_A", pilotAuthorizationId: AUTH_1, ownerReference: "PROFESIONAL_A" },
      { config: CONFIG, writer: first.writer, uuid: () => "11111111-1111-4111-8111-111111111111" },
    );
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;
    expect(r1.invitation.pilotAuthorizationId).toBe(AUTH_1);
    expect(r1.invitation.ownerReference).toBe("PROFESIONAL_A");
    expect(first.rows[0]?.pilot_authorization_id).toBe(AUTH_1);
    expect(first.rows[0]?.owner_reference).toBe("PROFESIONAL_A");
    expect(first.rows[0]?.pilot_authorization_id).not.toBe(AUTH_2);

    const second = recordingWriter();
    const r2 = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_B", pilotAuthorizationId: AUTH_2, ownerReference: "PROFESIONAL_B" },
      { config: CONFIG, writer: second.writer, uuid: () => "22222222-2222-4222-8222-222222222222" },
    );
    expect(r2.ok).toBe(true);
    if (!r2.ok) return;
    expect(r2.invitation.pilotAuthorizationId).toBe(AUTH_2);
    expect(r2.invitation.ownerReference).toBe("PROFESIONAL_B");
    expect(second.rows[0]?.pilot_authorization_id).not.toBe(AUTH_1);
  });

  it("3/4. surfaces same-authorization and capacity rejections from the durable store", async () => {
    const duplicate = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_A", pilotAuthorizationId: AUTH_1, ownerReference: "PROFESIONAL_A" },
      { config: CONFIG, writer: { async insert() { return { ok: false, code: PILOT_AUTHORIZATION_ALREADY_INVITED }; } } },
    );
    expect(duplicate).toEqual({ ok: false, code: "AUTHORIZATION_ALREADY_INVITED" });

    const capped = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_C", pilotAuthorizationId: AUTH_3, ownerReference: "PROFESIONAL_C" },
      { config: CONFIG, writer: { async insert() { return { ok: false, code: PILOT_INVITATION_CAP_REACHED }; } } },
    );
    expect(capped).toEqual({ ok: false, code: "INVITATION_CAP_REACHED" });
  });

  it("rejects a partial/one-sided authorization binding", async () => {
    const onlyAuth = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_A", pilotAuthorizationId: AUTH_1 },
      { config: CONFIG, writer: { async insert() { return { ok: true }; } } },
    );
    expect(onlyAuth).toEqual({ ok: false, code: "INVALID_AUTHORIZATION_BINDING" });
    const onlyOwner = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_A", ownerReference: "PROFESIONAL_A" },
      { config: CONFIG, writer: { async insert() { return { ok: true }; } } },
    );
    expect(onlyOwner).toEqual({ ok: false, code: "INVALID_AUTHORIZATION_BINDING" });
  });

  it("7. generates unique invitation tokens per invitation", async () => {
    const writer = recordingWriter();
    const a = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_A", pilotAuthorizationId: AUTH_1, ownerReference: "PROFESIONAL_A" },
      { config: CONFIG, writer: writer.writer, uuid: nextUuid },
    );
    const b = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_B", pilotAuthorizationId: AUTH_2, ownerReference: "PROFESIONAL_B" },
      { config: CONFIG, writer: writer.writer, uuid: nextUuid },
    );
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    expect(a.invitation.invitationId).not.toBe(b.invitation.invitationId);
    expect(a.invitation.token).not.toBe(b.invitation.token);
    expect(writer.rows).toHaveLength(2);
  });

  it("8/9. invitation is single-use and replay is blocked", async () => {
    const writer = recordingWriter();
    const issued = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_A", pilotAuthorizationId: AUTH_1, ownerReference: "PROFESIONAL_A" },
      { config: CONFIG, writer: writer.writer, uuid: nextUuid },
    );
    expect(issued.ok).toBe(true);
    if (!issued.ok) return;
    const store = createInMemoryInvitationUseStore();
    const first = await validateInvitationToken(issued.invitation.token, "signing-secret", store, Date.now());
    const replay = await validateInvitationToken(issued.invitation.token, "signing-secret", store, Date.now());
    expect(first.ok).toBe(true);
    expect(replay.ok).toBe(false);
  });

  it("10. expirations are independent across invitations", async () => {
    const writer = recordingWriter();
    const short = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_A", pilotAuthorizationId: AUTH_1, ownerReference: "PROFESIONAL_A", ttlSeconds: 60 },
      { config: CONFIG, writer: writer.writer, uuid: nextUuid, now: 1_000_000 },
    );
    const long = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_B", pilotAuthorizationId: AUTH_2, ownerReference: "PROFESIONAL_B", ttlSeconds: 3600 },
      { config: CONFIG, writer: writer.writer, uuid: nextUuid, now: 1_000_000 },
    );
    expect(short.ok && long.ok).toBe(true);
    if (!short.ok || !long.ok) return;
    expect(short.invitation.expiresAt).not.toBe(long.invitation.expiresAt);
    const at = 1_000_000 + 120 * 1000;
    const s = await validateInvitationToken(short.invitation.token, "signing-secret", createInMemoryInvitationUseStore(), at);
    const l = await validateInvitationToken(long.invitation.token, "signing-secret", createInMemoryInvitationUseStore(), at);
    expect(s.ok).toBe(false);
    expect(l.ok).toBe(true);
  });

  it("11. revocation is independent per invitation", async () => {
    const writer = recordingWriter();
    const a = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_A", pilotAuthorizationId: AUTH_1, ownerReference: "PROFESIONAL_A" },
      { config: CONFIG, writer: writer.writer, uuid: nextUuid },
    );
    const b = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_B", pilotAuthorizationId: AUTH_2, ownerReference: "PROFESIONAL_B" },
      { config: CONFIG, writer: writer.writer, uuid: nextUuid },
    );
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    const revokedId = a.invitation.invitationId;
    const store = {
      async consume(invitationId: string): Promise<boolean> {
        return invitationId !== revokedId;
      },
    };
    const aResult = await validateInvitationToken(a.invitation.token, "signing-secret", store, Date.now());
    const bResult = await validateInvitationToken(b.invitation.token, "signing-secret", store, Date.now());
    expect(aResult.ok).toBe(false);
    expect(bResult.ok).toBe(true);
  });

  it("12-17. invitation issuance implies no intake/Person/EvidenceReview/opt-in/presentation", async () => {
    const writer = recordingWriter();
    const issued = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_A", pilotAuthorizationId: AUTH_1, ownerReference: "PROFESIONAL_A" },
      { config: CONFIG, writer: writer.writer, uuid: nextUuid },
    );
    expect(issued.ok).toBe(true);
    if (!issued.ok) return;
    const serialized = JSON.stringify(issued.invitation);
    for (const forbidden of [
      "intakeId",
      "personId",
      "evidenceReviewId",
      "talentNetworkOptInPermissionGrantId",
      "talentProfileId",
      "professionalProfileDraftId",
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
    for (const forbiddenOp of [
      "createPilotIntake",
      "createAndBindPerson",
      "initiateEvidenceReview",
      "ingestEvidenceArtifact",
      "grantTalentNetworkOptIn",
      "promoteTalentProfile",
    ]) {
      expect(read("src/lib/h3-pilot/server/invitation-issuer.ts")).not.toContain(forbiddenOp);
      expect(read("src/app/api/h3-pilot/operator/invitations/route.ts")).not.toContain(forbiddenOp);
    }
  });

  it("18. operator authorization is required for issuance", async () => {
    const { isOperatorAuthorized } = await import("./operator-auth");
    const original = process.env.H3_PILOT_OPERATOR_SECRET;
    process.env.H3_PILOT_OPERATOR_SECRET = "operator-secret";
    expect(isOperatorAuthorized(null)).toBe(false);
    expect(isOperatorAuthorized("wrong")).toBe(false);
    expect(isOperatorAuthorized("operator-secret")).toBe(true);
    if (original === undefined) delete process.env.H3_PILOT_OPERATOR_SECRET;
    else process.env.H3_PILOT_OPERATOR_SECRET = original;
  });

  it("19. never logs a bearer token or secret in the issuance path", () => {
    for (const file of [
      "src/lib/h3-pilot/server/invitation-issuer.ts",
      "src/app/api/h3-pilot/operator/invitations/route.ts",
    ]) {
      expect(read(file)).not.toMatch(/console\.(log|info|warn|error|debug)/);
    }
  });

  it("20. normal Production Evidence Review flow is preserved", () => {
    const page = read("src/app/talents/evidence-review/page.tsx");
    expect(page).toContain("EvidenceReviewLandingClient");
    expect(page).toContain("PilotLanding");
  });

  it("never returns the signing secret", async () => {
    const writer = recordingWriter();
    const issued = await issuePilotInvitation(
      { participantReference: "PROFESIONAL_A", pilotAuthorizationId: AUTH_1, ownerReference: "PROFESIONAL_A" },
      { config: { ...CONFIG, invitationSecret: "super-secret-xyz" }, writer: writer.writer, uuid: nextUuid },
    );
    expect(issued.ok).toBe(true);
    expect(JSON.stringify(issued)).not.toContain("super-secret-xyz");
  });
});
