import "server-only";

import { z } from "zod";

export const PRIVATE_RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
} as const;

export const PRIVATE_MUTATION_BODY_BYTES = 4_096;

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function parseBoundedJson(
  request: Request,
  maximumBytes = PRIVATE_MUTATION_BODY_BYTES,
): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0];
  if (contentType !== "application/json") {
    throw new Error("Unsupported content type");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    throw new Error("Request body is too large");
  }

  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > maximumBytes) {
    throw new Error("Request body is too large");
  }

  try {
    return JSON.parse(body || "{}");
  } catch {
    throw new Error("Request body must be valid JSON");
  }
}

export const confirmPrivateProfileSchema = z.object({}).strict();

export const correctionPrivateProfileSchema = z
  .object({
    correction_message: z.string().trim().min(1).max(2_000),
  })
  .strict();

export function privateJsonResponse(
  body: Record<string, boolean | string>,
  status: number,
): Response {
  return Response.json(body, {
    status,
    headers: PRIVATE_RESPONSE_HEADERS,
  });
}
