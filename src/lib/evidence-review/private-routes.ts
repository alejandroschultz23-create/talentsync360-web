export const PRIVATE_EVIDENCE_REVIEW_PATH_PREFIXES = [
  "/talents/evidence-review/access/",
  "/talents/evidence-review/profile",
] as const;

export function isPrivateEvidenceReviewPath(pathname: string): boolean {
  const path = pathname.split(/[?#]/, 1)[0] || "/";
  return PRIVATE_EVIDENCE_REVIEW_PATH_PREFIXES.some((prefix) =>
    prefix.endsWith("/") ? path.startsWith(prefix) : path === prefix || path.startsWith(`${prefix}/`),
  );
}

export function isPrivateEvidenceReviewUrl(value: string): boolean {
  try {
    return isPrivateEvidenceReviewPath(new URL(value, "https://local.invalid").pathname);
  } catch {
    return false;
  }
}
