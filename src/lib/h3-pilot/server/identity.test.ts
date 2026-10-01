import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createGcpWorkloadIdentityTokenProvider,
  getDefaultIdentityTokenProvider,
  getWorkloadIdentityConfig,
  notConfiguredIdentityTokenProvider,
  toStsAudience,
  type WorkloadIdentityConfig,
} from "./identity";

const CONFIG: WorkloadIdentityConfig = {
  gcpAudience:
    "https://iam.googleapis.com/projects/29906783013/locations/global/workloadIdentityPools/talentsync360-vercel-pool/providers/talentsync360-vercel-provider",
  serviceAccountEmail: "talentsync360-h3-pilot-bff@hermes-ia-498018.iam.gserviceaccount.com",
};

const CLOUD_RUN_AUDIENCE = "https://hermes-preview-talent-pilot-service-29906783013.us-central1.run.app";

interface RecordedCall {
  url: string;
  init: RequestInit;
}

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

function recordingFetch(responses: Response[]): { fetchImpl: typeof fetch; calls: RecordedCall[] } {
  const calls: RecordedCall[] = [];
  let index = 0;
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} });
    const response = responses[index] ?? responses[responses.length - 1];
    index += 1;
    return response;
  }) as typeof fetch;
  return { fetchImpl, calls };
}

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("h3-pilot workload identity", () => {
  it("normalizes the Vercel default audience to the STS resource name", () => {
    expect(toStsAudience(CONFIG.gcpAudience)).toBe(
      "//iam.googleapis.com/projects/29906783013/locations/global/workloadIdentityPools/talentsync360-vercel-pool/providers/talentsync360-vercel-provider",
    );
    expect(toStsAudience("//iam.googleapis.com/projects/1/locations/global/workloadIdentityPools/p/providers/x")).toBe(
      "//iam.googleapis.com/projects/1/locations/global/workloadIdentityPools/p/providers/x",
    );
  });

  it("reads a valid server-only WIF configuration", () => {
    process.env.GCP_AUDIENCE = CONFIG.gcpAudience;
    process.env.GCP_SERVICE_ACCOUNT_EMAIL = CONFIG.serviceAccountEmail;
    expect(getWorkloadIdentityConfig()).toEqual(CONFIG);
  });

  it("fails closed when the WIF configuration is missing or malformed", () => {
    delete process.env.GCP_AUDIENCE;
    delete process.env.GCP_SERVICE_ACCOUNT_EMAIL;
    expect(getWorkloadIdentityConfig()).toBeNull();

    process.env.GCP_AUDIENCE = "not-an-audience";
    process.env.GCP_SERVICE_ACCOUNT_EMAIL = CONFIG.serviceAccountEmail;
    expect(getWorkloadIdentityConfig()).toBeNull();

    process.env.GCP_AUDIENCE = CONFIG.gcpAudience;
    process.env.GCP_SERVICE_ACCOUNT_EMAIL = "not-an-email";
    expect(getWorkloadIdentityConfig()).toBeNull();
  });

  it("defaults to the fail-closed provider when unconfigured", () => {
    delete process.env.GCP_AUDIENCE;
    delete process.env.GCP_SERVICE_ACCOUNT_EMAIL;
    expect(getDefaultIdentityTokenProvider()).toBe(notConfiguredIdentityTokenProvider);
  });

  it("exchanges Vercel OIDC -> STS -> service-account ID token (both auth layers correct)", async () => {
    const { fetchImpl, calls } = recordingFetch([
      jsonResponse(200, { access_token: "federated-access-token" }),
      jsonResponse(200, { token: "cloud-run-id-token" }),
    ]);
    const getOidcToken = vi.fn(async () => "vercel-oidc-token");
    const provider = createGcpWorkloadIdentityTokenProvider({ config: CONFIG, fetchImpl, getOidcToken });

    const token = await provider.getIdentityToken(CLOUD_RUN_AUDIENCE);

    expect(token).toBe("cloud-run-id-token");
    expect(getOidcToken).toHaveBeenCalledWith({ audience: CONFIG.gcpAudience });

    const sts = calls[0];
    expect(sts.url).toBe("https://sts.googleapis.com/v1/token");
    const stsBody = JSON.parse(String(sts.init.body));
    expect(stsBody).toEqual({
      grantType: "urn:ietf:params:oauth:grant-type:token-exchange",
      audience:
        "//iam.googleapis.com/projects/29906783013/locations/global/workloadIdentityPools/talentsync360-vercel-pool/providers/talentsync360-vercel-provider",
      scope: "https://www.googleapis.com/auth/cloud-platform",
      requestedTokenType: "urn:ietf:params:oauth:token-type:access_token",
      subjectTokenType: "urn:ietf:params:oauth:token-type:jwt",
      subjectToken: "vercel-oidc-token",
    });

    const idToken = calls[1];
    expect(idToken.url).toBe(
      "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/talentsync360-h3-pilot-bff%40hermes-ia-498018.iam.gserviceaccount.com:generateIdToken",
    );
    const idHeaders = idToken.init.headers as Record<string, string>;
    expect(idHeaders.authorization).toBe("Bearer federated-access-token");
    expect(JSON.parse(String(idToken.init.body))).toEqual({ audience: CLOUD_RUN_AUDIENCE, includeEmail: true });
  });

  it("fails closed when STS rejects the exchange", async () => {
    const { fetchImpl } = recordingFetch([jsonResponse(403, { error: "PERMISSION_DENIED" })]);
    const provider = createGcpWorkloadIdentityTokenProvider({
      config: CONFIG,
      fetchImpl,
      getOidcToken: async () => "vercel-oidc-token",
    });
    expect(await provider.getIdentityToken(CLOUD_RUN_AUDIENCE)).toBeNull();
  });

  it("fails closed when ID-token minting is denied", async () => {
    const { fetchImpl } = recordingFetch([
      jsonResponse(200, { access_token: "federated" }),
      jsonResponse(403, { error: "PERMISSION_DENIED" }),
    ]);
    const provider = createGcpWorkloadIdentityTokenProvider({
      config: CONFIG,
      fetchImpl,
      getOidcToken: async () => "vercel-oidc-token",
    });
    expect(await provider.getIdentityToken(CLOUD_RUN_AUDIENCE)).toBeNull();
  });

  it("fails closed when the OIDC token cannot be obtained", async () => {
    const { fetchImpl, calls } = recordingFetch([jsonResponse(200, { token: "unused" })]);
    const provider = createGcpWorkloadIdentityTokenProvider({
      config: CONFIG,
      fetchImpl,
      getOidcToken: async () => {
        throw new Error("no request context");
      },
    });
    expect(await provider.getIdentityToken(CLOUD_RUN_AUDIENCE)).toBeNull();
    expect(calls).toHaveLength(0);
  });

  it("fails closed on an empty OIDC token without calling STS", async () => {
    const { fetchImpl, calls } = recordingFetch([jsonResponse(200, { access_token: "unused" })]);
    const provider = createGcpWorkloadIdentityTokenProvider({
      config: CONFIG,
      fetchImpl,
      getOidcToken: async () => "",
    });
    expect(await provider.getIdentityToken(CLOUD_RUN_AUDIENCE)).toBeNull();
    expect(calls).toHaveLength(0);
  });
});
