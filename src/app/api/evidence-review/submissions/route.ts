import { EvidenceReviewRepository } from "@/lib/evidence-review/server/repository";
import { sendEvidenceReviewReceivedEmail } from "@/lib/evidence-review/server/notifications";
import { processEvidenceReviewSubmission } from "@/lib/evidence-review/server/submission-handler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  return processEvidenceReviewSubmission(request, {
    repository: new EvidenceReviewRepository(),
    notify: sendEvidenceReviewReceivedEmail,
  });
}
