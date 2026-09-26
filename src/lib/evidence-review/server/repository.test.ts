import { describe, expect, it, vi } from "vitest";

import type { Database, Person } from "../database.types";
import { EvidenceReviewRepository } from "./repository";

describe("Evidence Review person reconciliation", () => {
  it("does not overwrite canonical person data for an existing normalized email", async () => {
    const canonicalPerson = {
      id: "00000000-0000-0000-0000-000000000001",
      full_name: "Canonical Name",
      email: "person@example.test",
      email_normalized: "person@example.test",
      country: "Argentina",
      current_role: "Canonical Role",
      created_at: "2026-09-14T12:00:00.000Z",
      updated_at: "2026-09-14T12:00:00.000Z",
    } satisfies Person;
    const maybeSingle = vi.fn().mockResolvedValue({
      data: canonicalPerson,
      error: null,
    });
    const insert = vi.fn();
    const database = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ maybeSingle }),
        }),
        insert,
      }),
    };
    const repository = new EvidenceReviewRepository(
      database as unknown as import("@supabase/supabase-js").SupabaseClient<Database>,
    );

    const result = await repository.findOrCreatePerson({
      fullName: "Anonymous Replacement",
      email: " PERSON@EXAMPLE.TEST ",
      country: "Colombia",
      currentRole: "Replacement Role",
    });

    expect(result).toEqual(canonicalPerson);
    expect(insert).not.toHaveBeenCalled();
    expect(database.from).toHaveBeenCalledWith("people");
  });
});
