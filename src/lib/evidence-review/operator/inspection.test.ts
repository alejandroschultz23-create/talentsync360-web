import { describe, expect, it } from "vitest";

import type {
  EvidenceProfile,
  EvidenceReviewSubmission,
  Person,
} from "../database.types";
import { toSafeInspectionOutput } from "./service";

describe("operator inspection output", () => {
  it("includes only the scoped review record and never token material", () => {
    const output = toSafeInspectionOutput({
      person: {
        id: "00000000-0000-4000-8000-000000000001",
        full_name: "Synthetic Professional",
        email: "synthetic@example.test",
        country: "Argentina",
        current_role: "Software Engineer",
      } as Pick<
        Person,
        "id" | "full_name" | "email" | "country" | "current_role"
      >,
      submission: {
        id: "00000000-0000-4000-8000-000000000002",
        person_id: "00000000-0000-4000-8000-000000000001",
        opportunity_status: "REVIEW_ONLY",
        professional_intents: [],
        source: "direct",
        campaign: null,
        evidence_type: "PRIVATE_PROFESSIONAL_EXPERIENCE",
        evidence_url: null,
        individual_contribution: "Synthetic contribution used for an isolated test.",
        professional_context: null,
        review_state: "SUBMITTED",
        coherence_status: "PENDING",
        coherence_details: {},
        reviewer_reference: null,
        coherence_reviewed_at: null,
      } as unknown as EvidenceReviewSubmission,
      latestProfile: null as EvidenceProfile | null,
      findings: [],
    });

    const serialized = JSON.stringify(output);
    expect(serialized).toContain("Synthetic Professional");
    expect(serialized).not.toContain("token_hash");
    expect(serialized).not.toContain("SUPABASE_SECRET_KEY");
    expect(serialized).not.toContain("review_consent_text");
  });
});
