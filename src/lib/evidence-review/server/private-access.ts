import "server-only";

import { NextResponse } from "next/server";

import type { EvidenceReviewRepository } from "./repository";
import { isValidAccessTokenFormat } from "./tokens";
import {
  confirmPrivateProfileSchema,
  correctionPrivateProfileSchema,
  isSameOriginRequest,
  parseBoundedJson,
  PRIVATE_RESPONSE_HEADERS,
  privateJsonResponse,
} from "./private-http";

export const PRIVATE_ACCESS_COOKIE = "ts360_evidence_review_access";
export const PRIVATE_PROFILE_PATH = "/talents/evidence-review/profile";

export function privateAccessCookieOptions(expiresAt: string, now = new Date()) {
  const expires = new Date(expiresAt);
  const maxAge = Math.max(
    1,
    Math.floor((expires.getTime() - now.getTime()) / 1_000),
  );
  return {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    path: PRIVATE_PROFILE_PATH,
    expires,
    maxAge,
    priority: "high" as const,
  };
}

export function invalidPrivateAccessRedirect(requestUrl: string): NextResponse {
  const response = NextResponse.redirect(
    new URL(PRIVATE_PROFILE_PATH, requestUrl),
    303,
  );
  Object.entries(PRIVATE_RESPONSE_HEADERS).forEach(([name, value]) =>
    response.headers.set(name, value),
  );
  response.cookies.set(PRIVATE_ACCESS_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: PRIVATE_PROFILE_PATH,
    maxAge: 0,
  });
  return response;
}

export async function exchangePrivateAccessToken(input: {
  token: unknown;
  requestUrl: string;
  repository: Pick<EvidenceReviewRepository, "resolvePrivateProfileAccess">;
  now?: Date;
}): Promise<NextResponse> {
  const now = input.now ?? new Date();
  if (!isValidAccessTokenFormat(input.token)) {
    return invalidPrivateAccessRedirect(input.requestUrl);
  }

  try {
    const access = await input.repository.resolvePrivateProfileAccess(
      input.token,
      now,
      true,
    );
    if (!access) return invalidPrivateAccessRedirect(input.requestUrl);

    const response = NextResponse.redirect(
      new URL(PRIVATE_PROFILE_PATH, input.requestUrl),
      303,
    );
    Object.entries(PRIVATE_RESPONSE_HEADERS).forEach(([name, value]) =>
      response.headers.set(name, value),
    );
    response.cookies.set(
      PRIVATE_ACCESS_COOKIE,
      input.token,
      privateAccessCookieOptions(access.token.expires_at, now),
    );
    return response;
  } catch {
    return invalidPrivateAccessRedirect(input.requestUrl);
  }
}

type PrivateMutationRepository = Pick<
  EvidenceReviewRepository,
  "confirmPrivateProfile" | "requestPrivateProfileCorrection"
>;

export async function handlePrivateProfileMutation(input: {
  request: Request;
  token: unknown;
  action: "confirm" | "correction";
  repository: PrivateMutationRepository;
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

  try {
    if (input.action === "confirm") {
      const parsed = confirmPrivateProfileSchema.safeParse(body);
      if (!parsed.success) {
        return privateJsonResponse({ ok: false, error: "Invalid request" }, 400);
      }
      await input.repository.confirmPrivateProfile(input.token);
    } else {
      const parsed = correctionPrivateProfileSchema.safeParse(body);
      if (!parsed.success) {
        return privateJsonResponse({ ok: false, error: "Invalid request" }, 400);
      }
      await input.repository.requestPrivateProfileCorrection(
        input.token,
        parsed.data.correction_message,
      );
    }
    return privateJsonResponse({ ok: true }, 200);
  } catch {
    return privateJsonResponse({ ok: false, error: "Unable to complete request" }, 409);
  }
}
