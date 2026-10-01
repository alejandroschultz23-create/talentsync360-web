import "server-only";

import { timingSafeEqual } from "node:crypto";

/**
 * Operator/admin authentication for H3 pilot operator actions (e.g. invitation
 * issuance). This is a dedicated server-only secret, deliberately DISTINCT from
 * the participant invitation signing secret and from the H3 service credential.
 *
 * Fail closed: if the operator secret is absent, no operator action is allowed.
 */
export const PILOT_OPERATOR_SECRET_ENV = "H3_PILOT_OPERATOR_SECRET";
export const PILOT_OPERATOR_HEADER = "x-h3-pilot-operator-secret";

export function readOperatorSecret(): string {
  return process.env[PILOT_OPERATOR_SECRET_ENV] ?? "";
}

export function isOperatorAuthorized(provided: string | null, expected: string = readOperatorSecret()): boolean {
  if (expected.length === 0) return false;
  const left = Buffer.from(expected);
  const right = Buffer.from(provided ?? "");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
