import { cookies } from "next/headers";

import {
  handlePrivateProfileMutation,
  PRIVATE_ACCESS_COOKIE,
} from "@/lib/evidence-review/server/private-access";
import { EvidenceReviewRepository } from "@/lib/evidence-review/server/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const token = (await cookies()).get(PRIVATE_ACCESS_COOKIE)?.value;
  return handlePrivateProfileMutation({
    request,
    token,
    action: "confirm",
    repository: new EvidenceReviewRepository(),
  });
}
