import { describe, expect, it } from "vitest";

import {
  buildPrivateProfileView,
  safeEvidenceUrl,
} from "./private-profile";
import type {
  EvidenceFinding,
  EvidenceProfile,
  EvidenceReviewSubmission,
  Person,
} from "./database.types";

describe("Private Profile View Builder and Content Sanitization", () => {
  const mockPerson: Pick<Person, "full_name" | "current_role" | "country"> = {
    full_name: "Ana Silva",
    current_role: "Staff Data Engineer",
    country: "Argentina",
  };

  const mockSubmission: EvidenceReviewSubmission = {
    id: "00000000-0000-4000-8000-000000000001",
    person_id: "00000000-0000-4000-8000-000000000002",
    opportunity_status: "OPEN",
    professional_intents: ["FREELANCE"],
    source: "direct",
    campaign: null,
    evidence_type: "PUBLIC_REPOSITORY",
    evidence_url: "https://github.com/example/pipeline",
    individual_contribution: "Architected distributed ETL streaming pipelines.",
    professional_context: "Fintech scaleup",
    review_state: "REVIEW_DELIVERED",
    coherence_status: "READY",
    coherence_details: {},
    reviewer_reference: "operator",
    coherence_reviewed_at: "2026-09-14T00:00:00Z",
    review_consent_version: "v1",
    review_consent_text: "consent",
    review_consent_at: "2026-09-14T00:00:00Z",
    created_at: "2026-09-14T00:00:00Z",
    updated_at: "2026-09-14T00:00:00Z",
  };

  const mockProfile: EvidenceProfile = {
    id: "00000000-0000-4000-8000-000000000003",
    person_id: "00000000-0000-4000-8000-000000000002",
    submission_id: "00000000-0000-4000-8000-000000000001",
    review_version: 1,
    professional_intent_snapshot: {
      full_name: "Ana Silva",
      current_role: "Staff Data Engineer",
      country: "Argentina",
      opportunity_status: "OPEN",
      professional_intents: ["FREELANCE"],
    },
    evidence_context_snapshot: {
      evidence_type: "PUBLIC_REPOSITORY",
      evidence_url: "https://github.com/example/pipeline",
      individual_contribution: "Architected distributed ETL streaming pipelines.",
      professional_context: "Fintech scaleup",
    },
    recommendations: [
      {
        validation_area: "Streaming Governance",
        rationale: "Highlight data quality metrics and schema evolution practices.",
      },
    ],
    supersedes_profile_id: null,
    reviewed_at: "2026-09-14T10:00:00Z",
    delivered_at: "2026-09-14T11:00:00Z",
    confirmed_at: null,
    correction_requested_at: null,
    correction_message: null,
    created_at: "2026-09-14T10:00:00Z",
  };

  const mockFindings: EvidenceFinding[] = [
    {
      id: "00000000-0000-4000-8000-000000000010",
      profile_id: mockProfile.id,
      finding_status: "SUPPORTED",
      capability: "Stream processing architecture",
      explanation: "Demonstrated production-grade Apache Flink deployments.",
      evidence_reference: "commit 4a9f1b",
      sort_order: 0,
      created_at: "2026-09-14T10:00:00Z",
    },
    {
      id: "00000000-0000-4000-8000-000000000011",
      profile_id: mockProfile.id,
      finding_status: "UNKNOWN",
      capability: "Cloud infrastructure provisioning",
      explanation: "Terraform manifests were not included in the supplied repository; not evaluated as a deficiency.",
      evidence_reference: null,
      sort_order: 1,
      created_at: "2026-09-14T10:00:00Z",
    },
  ];

  it("builds a clean view model with findings and recommendations", () => {
    const view = buildPrivateProfileView({
      profile: mockProfile,
      submission: mockSubmission,
      person: mockPerson,
      findings: mockFindings,
    });

    expect(view.fullName).toBe("Ana Silva");
    expect(view.currentRole).toBe("Staff Data Engineer");
    expect(view.country).toBe("Argentina");
    expect(view.reviewVersion).toBe(1);
    expect(view.findings).toHaveLength(2);
    expect(view.recommendations).toEqual([
      {
        validationArea: "Streaming Governance",
        rationale: "Highlight data quality metrics and schema evolution practices.",
      },
    ]);
  });

  it("preserves UNKNOWN findings neutrally without artificial scoring or penalties", () => {
    const view = buildPrivateProfileView({
      profile: mockProfile,
      submission: mockSubmission,
      person: mockPerson,
      findings: mockFindings,
    });

    const unknownFinding = view.findings.find((f) => f.finding_status === "UNKNOWN");
    expect(unknownFinding).toBeDefined();
    expect(unknownFinding?.capability).toBe("Cloud infrastructure provisioning");
    expect(unknownFinding?.explanation).toContain("not evaluated as a deficiency");
  });

  describe("safeEvidenceUrl sanitization", () => {
    it("allows valid https and http URLs", () => {
      expect(safeEvidenceUrl("https://github.com/project")).toBe("https://github.com/project");
      expect(safeEvidenceUrl("http://example.com/demo")).toBe("http://example.com/demo");
    });

    it("rejects javascript:, data:, and file: URLs", () => {
      expect(safeEvidenceUrl("javascript:alert(1)")).toBeNull();
      expect(safeEvidenceUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
      expect(safeEvidenceUrl("file:///etc/passwd")).toBeNull();
    });

    it("rejects non-string or excessively long strings", () => {
      expect(safeEvidenceUrl(null)).toBeNull();
      expect(safeEvidenceUrl(undefined)).toBeNull();
      expect(safeEvidenceUrl(123)).toBeNull();
      expect(safeEvidenceUrl("https://example.com/" + "a".repeat(2_500))).toBeNull();
    });
  });
});
