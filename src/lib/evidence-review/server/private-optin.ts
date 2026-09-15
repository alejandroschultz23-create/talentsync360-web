import "server-only";

import type { EvidenceReviewLanguage } from "../consent";
import type { EvidenceReviewRepository } from "./repository";
import { isValidAccessTokenFormat } from "./tokens";
import {
  acceptTalentOptInSchema,
  isSameOriginRequest,
  parseBoundedEmptyBody,
  parseBoundedJson,
  PRIVATE_RESPONSE_HEADERS,
  privateJsonResponse,
} from "./private-http";

export const PRIVATE_OPT_IN_PATH = "/talents/evidence-review/profile/opt-in";

function privateOptInPathForRequest(request: Request): string {
  const language = new URL(request.url).searchParams.get("lang");
  return language === "en" ? `${PRIVATE_OPT_IN_PATH}?lang=en` : PRIVATE_OPT_IN_PATH;
}

export async function readPrivateOptInState(input: {
  token: unknown;
  repository: Pick<EvidenceReviewRepository, "resolvePrivateOptInAccess">;
}) {
  return input.repository.resolvePrivateOptInAccess(input.token);
}

export async function handlePrivateOptInOffer(input: {
  request: Request;
  token: unknown;
  repository: Pick<EvidenceReviewRepository, "offerTalentOptIn">;
}): Promise<Response> {
  if (!isSameOriginRequest(input.request)) {
    return privateJsonResponse({ ok: false, error: "Request rejected" }, 403);
  }
  if (!isValidAccessTokenFormat(input.token)) {
    return privateJsonResponse({ ok: false, error: "Private access is invalid" }, 401);
  }

  try {
    await parseBoundedEmptyBody(input.request);
  } catch {
    return privateJsonResponse({ ok: false, error: "Invalid request" }, 400);
  }

  try {
    await input.repository.offerTalentOptIn(input.token);
    const redirectPath = privateOptInPathForRequest(input.request);

    const acceptHeader = input.request.headers.get("accept") ?? "";
    if (acceptHeader.includes("application/json")) {
      return privateJsonResponse(
        { ok: true, redirect: redirectPath },
        200,
      );
    }

    return new Response(null, {
      status: 303,
      headers: {
        ...PRIVATE_RESPONSE_HEADERS,
        Location: redirectPath,
      },
    });
  } catch {
    return privateJsonResponse({ ok: false, error: "Unable to complete request" }, 409);
  }
}

export async function handlePrivateOptInAccept(input: {
  request: Request;
  token: unknown;
  repository: Pick<EvidenceReviewRepository, "acceptTalentOptIn">;
}): Promise<Response> {
  if (!isSameOriginRequest(input.request)) {
    return privateJsonResponse({ ok: false, error: "Request rejected" }, 403);
  }
  if (!isValidAccessTokenFormat(input.token)) {
    return privateJsonResponse({ ok: false, error: "Private access is invalid" }, 401);
  }

  let body: unknown;
  try {
    body = await parseBoundedJson(input.request);
  } catch {
    return privateJsonResponse({ ok: false, error: "Invalid request" }, 400);
  }

  const parsed = acceptTalentOptInSchema.safeParse(body);
  if (!parsed.success) {
    return privateJsonResponse({ ok: false, error: "Invalid request" }, 400);
  }

  try {
    await input.repository.acceptTalentOptIn(
      input.token,
      (parsed.data.language ?? "es") as EvidenceReviewLanguage,
    );
    return privateJsonResponse({ ok: true }, 200);
  } catch {
    return privateJsonResponse({ ok: false, error: "Unable to complete request" }, 409);
  }
}

export async function handlePrivateOptInDecline(input: {
  request: Request;
  token: unknown;
  repository: Pick<EvidenceReviewRepository, "declineTalentOptIn">;
}): Promise<Response> {
  if (!isSameOriginRequest(input.request)) {
    return privateJsonResponse({ ok: false, error: "Request rejected" }, 403);
  }
  if (!isValidAccessTokenFormat(input.token)) {
    return privateJsonResponse({ ok: false, error: "Private access is invalid" }, 401);
  }

  try {
    await parseBoundedEmptyBody(input.request);
  } catch {
    return privateJsonResponse({ ok: false, error: "Invalid request" }, 400);
  }

  try {
    await input.repository.declineTalentOptIn(input.token);
    return privateJsonResponse({ ok: true }, 200);
  } catch {
    return privateJsonResponse({ ok: false, error: "Unable to complete request" }, 409);
  }
}
