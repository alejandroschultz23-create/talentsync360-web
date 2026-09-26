import { EvidenceReviewRepository } from "@/lib/evidence-review/server/repository";
import { exchangePrivateAccessToken } from "@/lib/evidence-review/server/private-access";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ token: string }> },
): Promise<Response> {
  const { token } = await context.params;
  return exchangePrivateAccessToken({
    token,
    requestUrl: request.url,
    repository: new EvidenceReviewRepository(),
  });
}
