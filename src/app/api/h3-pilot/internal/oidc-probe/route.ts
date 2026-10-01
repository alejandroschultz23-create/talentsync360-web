import { randomUUID, timingSafeEqual } from "node:crypto";

import { getVercelOidcToken } from "@vercel/oidc";
import type { NextRequest } from "next/server";

import { getH3PilotConfig } from "@/lib/h3-pilot/server/config";
import { getWorkloadIdentityConfig } from "@/lib/h3-pilot/server/identity";

/**
 * TEMPORARY production OIDC probe (V1_186B). Server-only. POST only.
 *
 * Proves the real Vercel Production runtime can complete the H3 pilot
 * infrastructure path (Vercel OIDC -> GCP STS -> BFF SA impersonation -> private
 * Cloud Run invocation with the H3 app credential). Returns ONLY booleans and
 * never tokens, credentials, headers, or claims. Removed after proof.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXPECTED_ISSUER = "https://oidc.vercel.com/aleopents360";
const EXPECTED_SUBJECT = "owner:aleopents360:project:talentsync360-web:environment:production";
const STS_TOKEN_URL = "https://sts.googleapis.com/v1/token";
const IAM_CREDENTIALS_BASE_URL = "https://iamcredentials.googleapis.com/v1";
const CLOUD_PLATFORM_SCOPE = "https://www.googleapis.com/auth/cloud-platform";

interface ProbeResult {
  OIDC_TOKEN_PRESENT: boolean;
  OIDC_ISSUER_MATCH: boolean;
  OIDC_SUBJECT_MATCH: boolean;
  STS_EXCHANGE: "PASS" | "FAIL" | "NOT_RUN";
  SA_IMPERSONATION: "PASS" | "FAIL" | "NOT_RUN";
  CLOUD_RUN_PRIVATE_IAM: "PASS" | "FAIL" | "NOT_RUN";
  H3_APP_CREDENTIAL: "PASS" | "FAIL" | "NOT_RUN";
  APP_CREDENTIAL_INDEPENDENTLY_ENFORCED: "YES" | "NO" | "UNKNOWN";
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function decodeClaims(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(segment, "base64").toString("utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function readRawOidcToken(request: NextRequest): Promise<string | null> {
  try {
    const token = await getVercelOidcToken();
    if (typeof token === "string" && token.length > 0) return token;
  } catch {
    // fall through to the request header injected by the Vercel runtime
  }
  const header = request.headers.get("x-vercel-oidc-token");
  return header && header.length > 0 ? header : null;
}

function json(result: ProbeResult, status = 200): Response {
  return Response.json(result, { status, headers: { "cache-control": "no-store" } });
}

export async function POST(request: NextRequest): Promise<Response> {
  const expected = process.env.H3_OIDC_PROBE_SECRET ?? "";
  const provided = request.headers.get("x-h3-oidc-probe-secret") ?? "";
  if (expected.length === 0 || !safeEqual(expected, provided)) {
    return new Response(null, { status: 404 });
  }

  const result: ProbeResult = {
    OIDC_TOKEN_PRESENT: false,
    OIDC_ISSUER_MATCH: false,
    OIDC_SUBJECT_MATCH: false,
    STS_EXCHANGE: "NOT_RUN",
    SA_IMPERSONATION: "NOT_RUN",
    CLOUD_RUN_PRIVATE_IAM: "NOT_RUN",
    H3_APP_CREDENTIAL: "NOT_RUN",
    APP_CREDENTIAL_INDEPENDENTLY_ENFORCED: "UNKNOWN",
  };

  const wif = getWorkloadIdentityConfig();
  const config = getH3PilotConfig();
  if (wif === null || config === null) return json(result, 500);

  const raw = await readRawOidcToken(request);
  if (raw === null) return json(result);
  result.OIDC_TOKEN_PRESENT = true;
  const claims = decodeClaims(raw);
  result.OIDC_ISSUER_MATCH = claims?.iss === EXPECTED_ISSUER;
  result.OIDC_SUBJECT_MATCH = claims?.sub === EXPECTED_SUBJECT;
  if (!result.OIDC_ISSUER_MATCH || !result.OIDC_SUBJECT_MATCH) return json(result);

  let audienceToken: string | null = null;
  try {
    audienceToken = await getVercelOidcToken({ audience: wif.gcpAudience });
  } catch {
    audienceToken = null;
  }
  if (audienceToken === null || audienceToken.length === 0) return json(result);

  let federatedAccessToken: string | null = null;
  try {
    const response = await fetch(STS_TOKEN_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grantType: "urn:ietf:params:oauth:grant-type:token-exchange",
        audience: wif.gcpAudience.replace(/^https:\/\/iam\.googleapis\.com/, "//iam.googleapis.com"),
        scope: CLOUD_PLATFORM_SCOPE,
        requestedTokenType: "urn:ietf:params:oauth:token-type:access_token",
        subjectTokenType: "urn:ietf:params:oauth:token-type:jwt",
        subjectToken: audienceToken,
      }),
      cache: "no-store",
    });
    result.STS_EXCHANGE = response.ok ? "PASS" : "FAIL";
    if (response.ok) {
      const body = (await response.json()) as Record<string, unknown>;
      federatedAccessToken = typeof body.access_token === "string" ? body.access_token : null;
    }
  } catch {
    result.STS_EXCHANGE = "FAIL";
  }
  if (federatedAccessToken === null) return json(result);

  let idToken: string | null = null;
  try {
    const response = await fetch(
      `${IAM_CREDENTIALS_BASE_URL}/projects/-/serviceAccounts/${encodeURIComponent(
        wif.serviceAccountEmail,
      )}:generateIdToken`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${federatedAccessToken}`, "content-type": "application/json" },
        body: JSON.stringify({ audience: config.baseUrl, includeEmail: true }),
        cache: "no-store",
      },
    );
    result.SA_IMPERSONATION = response.ok ? "PASS" : "FAIL";
    if (response.ok) {
      const body = (await response.json()) as Record<string, unknown>;
      idToken = typeof body.token === "string" ? body.token : null;
    }
  } catch {
    result.SA_IMPERSONATION = "FAIL";
  }
  if (idToken === null) return json(result);

  const endpoint = `${config.baseUrl.replace(/\/$/, "")}/`;
  const payload = { operation: "readPilotStatus", payload: { intakeId: randomUUID() } };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${idToken}`,
        "x-hermes-pilot-credential": config.serviceCredential,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const parsed = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    result.CLOUD_RUN_PRIVATE_IAM = response.status === 401 || response.status === 403 ? "FAIL" : "PASS";
    result.H3_APP_CREDENTIAL = parsed !== null && typeof parsed === "object" ? "PASS" : "FAIL";
  } catch {
    result.CLOUD_RUN_PRIVATE_IAM = "FAIL";
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${idToken}` },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const parsed = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    result.APP_CREDENTIAL_INDEPENDENTLY_ENFORCED =
      response.status === 401 || parsed?.code === "AUTH_REQUIRED" ? "YES" : "NO";
  } catch {
    result.APP_CREDENTIAL_INDEPENDENTLY_ENFORCED = "NO";
  }

  return json(result);
}
