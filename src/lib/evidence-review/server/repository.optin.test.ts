import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

import type { Database } from "../database.types";
import { EvidenceReviewRepository } from "./repository";

type TestSupabaseClient = SupabaseClient<Database> & {
  from: ReturnType<typeof vi.fn>;
  rpc: ReturnType<typeof vi.fn>;
};

function createMockSupabase(overrides: {
  optIn?: unknown;
  optInSequence?: unknown[];
  insertOptIn?: unknown;
  insertOptInError?: unknown;
  rpcResult?: unknown;
  profile?: unknown;
  submission?: unknown;
  token?: unknown;
}): TestSupabaseClient {
  const optInResults = [...(overrides.optInSequence ?? [overrides.optIn ?? null])];
  const tokenRecord =
    overrides.token === undefined
      ? {
          id: "token-1",
          profile_id: "profile-1",
          expires_at: new Date(Date.now() + 86_400_000).toISOString(),
          revoked_at: null,
        }
      : overrides.token;
  return {
    from: vi.fn((table: string) => {
      if (table === "talent_opt_ins") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          is: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockImplementation(() =>
            Promise.resolve({
              data:
                optInResults.length > 1
                  ? optInResults.shift()
                  : (optInResults[0] ?? null),
              error: null,
            }),
          ),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: overrides.insertOptIn ?? {
                  id: "opt-1",
                  person_id: "person-1",
                  profile_id: "profile-1",
                  opt_in_status: "NOT_OFFERED",
                },
                error: overrides.insertOptInError ?? null,
              }),
            }),
          }),
        };
      }
      if (table === "profile_access_tokens") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: tokenRecord,
            error: null,
          }),
          update: vi.fn().mockReturnThis(),
          is: vi.fn().mockReturnThis(),
          gt: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: tokenRecord,
            error: null,
          }),
        };
      }
      if (table === "evidence_profiles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: overrides.profile ?? {
              id: "profile-1",
              person_id: "person-1",
              submission_id: "sub-1",
              delivered_at: new Date().toISOString(),
              confirmed_at: new Date().toISOString(),
            },
            error: null,
          }),
        };
      }
      if (table === "evidence_review_submissions") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: overrides.submission ?? {
              id: "sub-1",
              person_id: "person-1",
              review_state: "REVIEW_CONFIRMED",
            },
            error: null,
          }),
        };
      }
      if (table === "people") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: "person-1", full_name: "Test Person", country: "AR", current_role: "Dev" },
            error: null,
          }),
        };
      }
      if (table === "evidence_findings") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    }),
    rpc: vi.fn().mockImplementation((fn: string, args: Record<string, unknown>) => {
      if (fn === "transition_talent_opt_in") {
        return Promise.resolve({
          data: overrides.rpcResult ?? {
            id: args.p_opt_in_id,
            opt_in_status: args.p_to_state,
            offered_at: new Date().toISOString(),
            accepted_at: args.p_to_state === "ACCEPTED" ? new Date().toISOString() : null,
            declined_at: args.p_to_state === "DECLINED" ? new Date().toISOString() : null,
            network_consent_version: args.p_network_consent_version ?? null,
            network_consent_text: args.p_network_consent_text ?? null,
          },
          error: null,
        });
      }
      return Promise.resolve({ data: null, error: null });
    }),
  } as unknown as TestSupabaseClient;
}

describe("EvidenceReviewRepository - Talent Opt-In", () => {
  const validToken = "A".repeat(43);

  it("ensures opt-in offered idempotently", () => {
    return Promise.resolve().then(async () => {
      const mockDb = createMockSupabase({ optIn: null });
      const repo = new EvidenceReviewRepository(mockDb);

      const result = await repo.ensureTalentOptInOffered("person-1", "profile-1");
      expect(result.opt_in_status).toBe("OFFERED");
      expect(mockDb.rpc).toHaveBeenCalledWith("transition_talent_opt_in", {
        p_opt_in_id: "opt-1",
        p_to_state: "OFFERED",
      });
    });
  });

  it("does not re-transition if already OFFERED or terminal", async () => {
    const existingOffered = {
      id: "opt-1",
      person_id: "person-1",
      profile_id: "profile-1",
      opt_in_status: "OFFERED",
      offered_at: new Date().toISOString(),
    };
    const mockDb = createMockSupabase({ optIn: existingOffered });
    const repo = new EvidenceReviewRepository(mockDb);

    const result = await repo.ensureTalentOptInOffered("person-1", "profile-1");
    expect(result).toEqual(existingOffered);
    expect(mockDb.rpc).not.toHaveBeenCalled();

    for (const terminalState of ["ACCEPTED", "DECLINED"] as const) {
      const terminal = { ...existingOffered, opt_in_status: terminalState };
      const terminalDb = createMockSupabase({ optIn: terminal });
      const terminalRepo = new EvidenceReviewRepository(terminalDb);

      await expect(
        terminalRepo.ensureTalentOptInOffered("person-1", "profile-1"),
      ).resolves.toEqual(terminal);
      expect(terminalDb.rpc).not.toHaveBeenCalled();
    }
  });

  it("recovers idempotently when a concurrent offer wins the unique insert", async () => {
    const concurrentRecord = {
      id: "opt-concurrent",
      person_id: "person-1",
      profile_id: "profile-1",
      opt_in_status: "NOT_OFFERED",
    };
    const mockDb = createMockSupabase({
      optInSequence: [null, concurrentRecord],
      insertOptInError: {
        code: "23505",
        message: "duplicate",
        details: "",
        hint: "",
        name: "PostgrestError",
      },
    });
    const repo = new EvidenceReviewRepository(mockDb);

    const result = await repo.ensureTalentOptInOffered("person-1", "profile-1");

    expect(result.opt_in_status).toBe("OFFERED");
    expect(mockDb.rpc).toHaveBeenCalledWith("transition_talent_opt_in", {
      p_opt_in_id: "opt-concurrent",
      p_to_state: "OFFERED",
    });
  });

  it("resolvePrivateOptInAccess is strictly read-only across refreshes", async () => {
    const mockDb = createMockSupabase({ optIn: null });
    const repo = new EvidenceReviewRepository(mockDb);

    const access = await repo.resolvePrivateOptInAccess(validToken);
    const refreshedAccess = await repo.resolvePrivateOptInAccess(validToken);
    expect(access).not.toBeNull();
    expect(refreshedAccess).not.toBeNull();
    expect(access?.eligibility).toBe("ELIGIBLE");
    expect(access?.optIn).toBeNull();

    // Verify zero mutations on read
    expect(mockDb.rpc).not.toHaveBeenCalled();
    const talentOptInsCalls = mockDb.from.mock.calls.filter(
      (call: unknown[]) => call[0] === "talent_opt_ins",
    );
    expect(talentOptInsCalls.length).toBe(2); // select only, once per read
  });

  it("rejects offer, accept, and decline when profile is not confirmed", async () => {
    const mockDb = createMockSupabase({
      submission: {
        id: "sub-1",
        person_id: "person-1",
        review_state: "REVIEW_DELIVERED",
      },
      profile: {
        id: "profile-1",
        person_id: "person-1",
        submission_id: "sub-1",
        delivered_at: new Date().toISOString(),
        confirmed_at: null,
      },
    });
    const repo = new EvidenceReviewRepository(mockDb);

    await expect(repo.offerTalentOptIn(validToken)).rejects.toThrow("Profile must be confirmed");
    await expect(repo.acceptTalentOptIn(validToken)).rejects.toThrow("Profile must be confirmed");
    await expect(repo.declineTalentOptIn(validToken)).rejects.toThrow("Profile must be confirmed");
  });

  it("rejects missing, expired, and revoked private credentials", async () => {
    const invalidTokenRecords = [
      null,
      {
        id: "expired-token",
        profile_id: "profile-1",
        expires_at: "2026-09-14T00:00:00.000Z",
        revoked_at: null,
      },
      {
        id: "revoked-token",
        profile_id: "profile-1",
        expires_at: "2026-09-16T00:00:00.000Z",
        revoked_at: "2026-09-15T00:00:00.000Z",
      },
    ];

    for (const token of invalidTokenRecords) {
      const repo = new EvidenceReviewRepository(createMockSupabase({ token }));
      await expect(
        repo.offerTalentOptIn(
          validToken,
          new Date("2026-09-15T12:00:00.000Z"),
        ),
      ).rejects.toThrow("Invalid private access");
    }
  });

  it("requires OFFERED before either terminal decision", async () => {
    for (const state of ["NOT_OFFERED", "ACCEPTED", "DECLINED"] as const) {
      const repo = new EvidenceReviewRepository(
        createMockSupabase({
          optIn: {
            id: "opt-1",
            person_id: "person-1",
            profile_id: "profile-1",
            opt_in_status: state,
          },
        }),
      );

      await expect(repo.acceptTalentOptIn(validToken)).rejects.toThrow(
        "must be OFFERED",
      );
      await expect(repo.declineTalentOptIn(validToken)).rejects.toThrow(
        "must be OFFERED",
      );
    }
  });

  it("acceptTalentOptIn stores server-owned consent version and text", async () => {
    const offeredRecord = {
      id: "opt-1",
      person_id: "person-1",
      profile_id: "profile-1",
      opt_in_status: "OFFERED",
      offered_at: "2026-09-15T00:00:00.000Z",
    };
    const mockDb = createMockSupabase({ optIn: offeredRecord });
    const repo = new EvidenceReviewRepository(mockDb);

    const acceptedAt = new Date("2026-09-15T12:34:56.000Z");
    const result = await repo.acceptTalentOptIn(validToken, "es", acceptedAt);
    expect(result.opt_in_status).toBe("ACCEPTED");

    expect(mockDb.rpc).toHaveBeenCalledWith("transition_talent_opt_in", expect.objectContaining({
      p_opt_in_id: "opt-1",
      p_to_state: "ACCEPTED",
      p_network_consent_version: "talent-network-opt-in-v1-2026-09-15",
      p_network_consent_text: expect.stringContaining("red de talento de TalentSync360"),
      p_network_consent_at: acceptedAt.toISOString(),
    }));
  });

  it("declineTalentOptIn transitions to DECLINED without consent snapshot", async () => {
    const offeredRecord = {
      id: "opt-1",
      person_id: "person-1",
      profile_id: "profile-1",
      opt_in_status: "OFFERED",
      offered_at: "2026-09-15T00:00:00.000Z",
    };
    const mockDb = createMockSupabase({ optIn: offeredRecord });
    const repo = new EvidenceReviewRepository(mockDb);

    const result = await repo.declineTalentOptIn(validToken);
    expect(result.opt_in_status).toBe("DECLINED");

    expect(mockDb.rpc).toHaveBeenCalledWith("transition_talent_opt_in", {
      p_opt_in_id: "opt-1",
      p_to_state: "DECLINED",
    });
    expect(result.network_consent_version).toBeNull();
    expect(result.network_consent_text).toBeNull();
  });
});
