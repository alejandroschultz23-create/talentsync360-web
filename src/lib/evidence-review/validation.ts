import { z } from "zod";

import { normalizeAttributionSource, normalizeCampaign } from "./attribution";
import {
  EVIDENCE_TYPES,
  OPPORTUNITY_STATUSES,
  PROFESSIONAL_INTENTS,
} from "./domain";

const optionalText = (maximum: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === ""
        ? undefined
        : value,
    z.string().trim().max(maximum).optional(),
  );

const evidenceUrlSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .trim()
    .url()
    .refine((value) => {
      const protocol = new URL(value).protocol;
      return protocol === "http:" || protocol === "https:";
    }, "Evidence URL must use http or https")
    .optional(),
);

export const evidenceReviewSubmissionSchema = z
  .object({
    fullName: z.string().trim().min(2).max(160),
    email: z.string().trim().toLowerCase().email().max(320),
    country: z.string().trim().min(2).max(100),
    currentRole: z.string().trim().min(2).max(160),
    evidenceType: z.enum(EVIDENCE_TYPES),
    evidenceUrl: evidenceUrlSchema,
    individualContribution: z.string().trim().min(20).max(5_000),
    professionalContext: optionalText(5_000),
    opportunityStatus: z.enum(OPPORTUNITY_STATUSES),
    professionalIntents: z.array(z.enum(PROFESSIONAL_INTENTS)).max(4),
    source: z
      .unknown()
      .optional()
      .transform((value) => normalizeAttributionSource(value)),
    campaign: z
      .unknown()
      .optional()
      .transform((value) => normalizeCampaign(value)),
    reviewConsentVersion: z.string().trim().min(1).max(64),
    reviewConsentText: z.string().trim().min(20).max(4_000),
    reviewConsentAt: z.string().datetime({ offset: true }),
  })
  .superRefine((value, context) => {
    const distinctIntents = new Set(value.professionalIntents);
    if (distinctIntents.size !== value.professionalIntents.length) {
      context.addIssue({
        code: "custom",
        path: ["professionalIntents"],
        message: "Professional intents must be unique",
      });
    }

    const shouldHaveIntents = value.opportunityStatus === "OPEN";
    const hasIntents = value.professionalIntents.length > 0;
    if (shouldHaveIntents !== hasIntents) {
      context.addIssue({
        code: "custom",
        path: ["professionalIntents"],
        message:
          "OPEN requires at least one work mode; REVIEW_ONLY and NOT_LOOKING require none",
      });
    }
  });

export type EvidenceReviewSubmissionInput = z.input<
  typeof evidenceReviewSubmissionSchema
>;

export type ValidatedEvidenceReviewSubmission = z.output<
  typeof evidenceReviewSubmissionSchema
>;

export const evidenceFindingSchema = z.object({
  findingStatus: z.enum([
    "SUPPORTED",
    "PARTIAL",
    "UNKNOWN",
    "NEEDS_CLARIFICATION",
  ]),
  capability: z.string().trim().min(1).max(160),
  explanation: z.string().trim().min(1).max(5_000),
  evidenceReference: optionalText(2_000),
  sortOrder: z.number().int().nonnegative(),
});

export const profileCorrectionSchema = z.object({
  correctionMessage: z.string().trim().min(1).max(5_000),
});
