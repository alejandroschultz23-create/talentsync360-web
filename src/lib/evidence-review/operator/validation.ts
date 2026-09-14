import { z } from "zod";

import {
  COHERENCE_DECISIONS,
  COHERENCE_DIMENSION_VALUES,
  FINDING_STATUSES,
  REVIEW_WORK_CATEGORIES,
} from "../domain";

export const submissionIdSchema = z.string().uuid();

const actorReferenceSchema = z.string().trim().min(1).max(160);
const coherenceDimensionValueSchema = z.enum(COHERENCE_DIMENSION_VALUES);

export const coherenceDimensionsSchema = z
  .object({
    RESPONSE_RELEVANCE: coherenceDimensionValueSchema,
    PROFESSIONAL_INTENT_CLARITY: coherenceDimensionValueSchema,
    INDIVIDUAL_CONTRIBUTION_CLARITY: coherenceDimensionValueSchema,
    EXPECTATION_CONSISTENCY: coherenceDimensionValueSchema,
    EVIDENCE_READINESS: coherenceDimensionValueSchema,
    FOLLOW_THROUGH: coherenceDimensionValueSchema,
  })
  .strict();

export const coherenceInputSchema = z
  .object({
    actor_reference: actorReferenceSchema,
    dimensions: coherenceDimensionsSchema,
    operator_note: z.string().trim().min(1).max(2_000),
    decision: z.enum(COHERENCE_DECISIONS),
    clarification_required: z.string().trim().min(1).max(2_000).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.decision === "CLARIFICATION_NEEDED" &&
      !value.clarification_required
    ) {
      context.addIssue({
        code: "custom",
        path: ["clarification_required"],
        message: "A specific clarification is required",
      });
    }

    if (
      value.decision !== "CLARIFICATION_NEEDED" &&
      value.clarification_required
    ) {
      context.addIssue({
        code: "custom",
        path: ["clarification_required"],
        message:
          "Clarification text is allowed only for CLARIFICATION_NEEDED",
      });
    }
  });

export const profileFindingInputSchema = z
  .object({
    finding_status: z.enum(FINDING_STATUSES),
    capability: z.string().trim().min(1).max(160),
    explanation: z.string().trim().min(1).max(5_000),
    evidence_reference: z.string().trim().min(1).max(2_000).optional(),
    sort_order: z.number().int().min(0).max(9_999),
  })
  .strict();

export const profileRecommendationInputSchema = z
  .object({
    validation_area: z.string().trim().min(1).max(160),
    rationale: z.string().trim().min(1).max(1_000),
  })
  .strict();

export const publishProfileInputSchema = z
  .object({
    actor_reference: actorReferenceSchema,
    findings: z.array(profileFindingInputSchema).min(1).max(50),
    recommendations: z.array(profileRecommendationInputSchema).max(20),
  })
  .strict()
  .superRefine((value, context) => {
    const sortOrders = new Set(value.findings.map((finding) => finding.sort_order));
    if (sortOrders.size !== value.findings.length) {
      context.addIssue({
        code: "custom",
        path: ["findings"],
        message: "Finding sort_order values must be unique",
      });
    }
  });

export const workTimeInputSchema = z
  .object({
    actor_reference: actorReferenceSchema,
    category: z.enum(REVIEW_WORK_CATEGORIES),
    minutes: z.number().int().min(1).max(480),
    occurred_at: z.string().datetime({ offset: true }).optional(),
  })
  .strict();

export type CoherenceInput = z.output<typeof coherenceInputSchema>;
export type PublishProfileInput = z.output<typeof publishProfileInputSchema>;
export type WorkTimeInput = z.output<typeof workTimeInputSchema>;
