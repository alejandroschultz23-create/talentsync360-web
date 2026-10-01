import "server-only";

import { getVercelOidcToken } from "@vercel/oidc";

/**
 * Google Cloud Run IAM identity-token provider for the private pilot service.
 *
 * The pilot Cloud Run service is private (`--no-allow-unauthenticated`), so the
 * Product BFF must present a Google-issued identity token whose audience is the
 * service URL, in addition to the H3 application credential.
 *
 * Production mechanism: Workload Identity Federation (Vercel OIDC -> GCP
 * Security Token Service -> service-account impersonation) producing
 * SHORT-LIVED identity tokens. A long-lived downloadable service-account JSON
 * key is NOT used.
 *
 * Trust chain:
 *   1. Vercel OIDC token (audience = GCP_AUDIENCE) proves the expected
 *      `owner:...:project:...:environment:production` identity.
 *   2. STS exchanges it for a federated access token scoped to cloud-platform.
 *   3. The federated token impersonates GCP_SERVICE_ACCOUNT_EMAIL and mints an
 *      ID token whose audience is the private Cloud Run service URL.
 *
 * Fail closed: every failure returns null, so the BFF rejects the pilot call
 * instead of silently degrading. Credentials are never logged.
 */
export interface IdentityTokenProvider {
  getIdentityToken(audience: string): Promise<string | null>;
}

/** Fail-closed default: no IAM token until Workload Identity is configured. */
export const notConfiguredIdentityTokenProvider: IdentityTokenProvider = {
  async getIdentityToken(): Promise<string | null> {
    return null;
  },
};

export interface WorkloadIdentityConfig {
  /** WIF provider default audience: https://iam.googleapis.com/projects/<n>/locations/global/workloadIdentityPools/<pool>/providers/<provider> */
  readonly gcpAudience: string;
  /** Least-privilege BFF service account that holds Cloud Run `run.invoker`. */
  readonly serviceAccountEmail: string;
}

const STS_TOKEN_URL = "https://sts.googleapis.com/v1/token";
const IAM_CREDENTIALS_BASE_URL = "https://iamcredentials.googleapis.com/v1";
const CLOUD_PLATFORM_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const TOKEN_EXCHANGE_GRANT = "urn:ietf:params:oauth:grant-type:token-exchange";
const ACCESS_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:access_token";
const JWT_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:jwt";

const WIF_AUDIENCE_PATTERN =
  /^(?:https:\/\/iam\.googleapis\.com|\/\/iam\.googleapis\.com)\/projects\/[^/]+\/locations\/global\/workloadIdentityPools\/[^/]+\/providers\/[^/]+$/;
const SERVICE_ACCOUNT_PATTERN = /^[a-z0-9-]+@[a-z0-9-]+\.iam\.gserviceaccount\.com$/;

/**
 * STS expects the provider resource name (`//iam.googleapis.com/...`), while
 * the Vercel-issued token audience uses the `https://iam.googleapis.com/...`
 * form. Normalize to the STS form.
 */
export function toStsAudience(gcpAudience: string): string {
  return gcpAudience.trim().replace(/^https:\/\/iam\.googleapis\.com/, "//iam.googleapis.com");
}

/** Reads the server-only WIF configuration; returns null (fail closed) if absent or malformed. */
export function getWorkloadIdentityConfig(): WorkloadIdentityConfig | null {
  const gcpAudience = process.env.GCP_AUDIENCE?.trim();
  const serviceAccountEmail = process.env.GCP_SERVICE_ACCOUNT_EMAIL?.trim();

  if (
    typeof gcpAudience !== "string" ||
    !WIF_AUDIENCE_PATTERN.test(gcpAudience) ||
    typeof serviceAccountEmail !== "string" ||
    !SERVICE_ACCOUNT_PATTERN.test(serviceAccountEmail)
  ) {
    return null;
  }

  return { gcpAudience, serviceAccountEmail };
}

export interface WorkloadIdentityDependencies {
  readonly config: WorkloadIdentityConfig;
  /** Injectable seam for tests; defaults to the Vercel OIDC helper. */
  readonly getOidcToken?: (options: { audience: string }) => Promise<string>;
  /** Injectable seam for tests; defaults to global fetch. */
  readonly fetchImpl?: typeof fetch;
}

async function exchangeOidcForFederatedToken(
  oidcToken: string,
  config: WorkloadIdentityConfig,
  fetchImpl: typeof fetch,
): Promise<string | null> {
  const response = await fetchImpl(STS_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grantType: TOKEN_EXCHANGE_GRANT,
      audience: toStsAudience(config.gcpAudience),
      scope: CLOUD_PLATFORM_SCOPE,
      requestedTokenType: ACCESS_TOKEN_TYPE,
      subjectTokenType: JWT_TOKEN_TYPE,
      subjectToken: oidcToken,
    }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const body = (await response.json()) as Record<string, unknown>;
  return typeof body.access_token === "string" && body.access_token.length > 0 ? body.access_token : null;
}

async function mintCloudRunIdentityToken(
  federatedAccessToken: string,
  serviceAccountEmail: string,
  audience: string,
  fetchImpl: typeof fetch,
): Promise<string | null> {
  const url = `${IAM_CREDENTIALS_BASE_URL}/projects/-/serviceAccounts/${encodeURIComponent(
    serviceAccountEmail,
  )}:generateIdToken`;
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${federatedAccessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ audience, includeEmail: true }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const body = (await response.json()) as Record<string, unknown>;
  return typeof body.token === "string" && body.token.length > 0 ? body.token : null;
}

/** Vercel OIDC -> GCP WIF -> service-account ID token for the private service. */
export function createGcpWorkloadIdentityTokenProvider(
  dependencies: WorkloadIdentityDependencies,
): IdentityTokenProvider {
  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const getOidcToken =
    dependencies.getOidcToken ?? ((options: { audience: string }) => getVercelOidcToken(options));

  return {
    async getIdentityToken(audience: string): Promise<string | null> {
      try {
        if (typeof audience !== "string" || audience.length === 0) return null;
        const oidcToken = await getOidcToken({ audience: dependencies.config.gcpAudience });
        if (typeof oidcToken !== "string" || oidcToken.length === 0) return null;

        const federatedAccessToken = await exchangeOidcForFederatedToken(
          oidcToken,
          dependencies.config,
          fetchImpl,
        );
        if (federatedAccessToken === null) return null;

        return await mintCloudRunIdentityToken(
          federatedAccessToken,
          dependencies.config.serviceAccountEmail,
          audience,
          fetchImpl,
        );
      } catch {
        return null;
      }
    },
  };
}

/** Default provider: real WIF when configured, otherwise fail closed. */
export function getDefaultIdentityTokenProvider(): IdentityTokenProvider {
  const config = getWorkloadIdentityConfig();
  if (config === null) return notConfiguredIdentityTokenProvider;
  return createGcpWorkloadIdentityTokenProvider({ config });
}
