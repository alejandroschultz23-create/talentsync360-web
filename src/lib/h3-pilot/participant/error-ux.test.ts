import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  PILOT_SUBMIT_ERROR_CODES,
  pilotContent,
  pilotSubmitErrorMessage,
} from "./content";
import { PILOT_IDENTITY_CONFIRMATION_TEXT } from "./policy";

const read = (relative: string) => readFileSync(join(process.cwd(), relative), "utf8");
const FORM = "src/app/talents/evidence-review/apply/PilotApplyForm.tsx";

describe("V1_188A participant error UX remediation", () => {
  for (const language of ["es", "en"] as const) {
    const content = pilotContent[language];

    it(`${language}: identity missing -> specific, non-misleading message`, () => {
      expect(content.identityRequired.length).toBeGreaterThan(0);
      expect(content.identityRequired).not.toBe(content.genericError);
      expect(content.identityRequired.toLowerCase()).not.toMatch(
        /acceso|access|kyc|verificaci[oó]n de identidad|identity verification/,
      );
    });

    it(`${language}: FILE_TOO_LARGE -> fileTooLarge`, () => {
      expect(pilotSubmitErrorMessage(language, "FILE_TOO_LARGE")).toBe(content.fileTooLarge);
    });

    it(`${language}: UNSUPPORTED_FILE_TYPE -> fileTypeInvalid`, () => {
      expect(pilotSubmitErrorMessage(language, "UNSUPPORTED_FILE_TYPE")).toBe(content.fileTypeInvalid);
    });

    it(`${language}: CV_REQUIRED -> cvRequired`, () => {
      expect(pilotSubmitErrorMessage(language, "CV_REQUIRED")).toBe(content.cvRequired);
    });

    it(`${language}: EMPTY_FILE -> specific empty-file message`, () => {
      const message = pilotSubmitErrorMessage(language, "EMPTY_FILE");
      expect(message).toBe(content.emptyFile);
      expect(message).not.toBe(content.genericError);
    });

    it(`${language}: unknown/absent error -> generic safe message`, () => {
      for (const code of [undefined, null, "", "INTERNAL_ERROR", "SOMETHING_ELSE"]) {
        expect(pilotSubmitErrorMessage(language, code)).toBe(content.genericError);
      }
    });

    it(`${language}: mapped messages leak no raw codes or internals`, () => {
      for (const code of PILOT_SUBMIT_ERROR_CODES) {
        const message = pilotSubmitErrorMessage(language, code);
        expect(message).not.toContain(code);
        for (const internal of ["H3", "Cloud Run", "Supabase", "bucket", "postgres", "Neon"]) {
          expect(message).not.toContain(internal);
        }
      }
    });
  }

  it("form uses a specific identity message and keeps cvRequired specific", () => {
    const source = read(FORM);
    expect(source).toContain("content.identityRequired");
    expect(source).toContain("content.cvRequired");
    expect(source).not.toMatch(/identity !== true[\s\S]{0,80}content\.genericError/);
  });

  it("form maps server Product error codes through the safe mapper only", () => {
    const source = read(FORM);
    expect(source).toContain("pilotSubmitErrorMessage");
    expect(source).toContain("response.json()");
    expect(source).not.toMatch(/setError\([^)]*FILE_TOO_LARGE/);
    expect(source).not.toMatch(/setError\([^)]*UNSUPPORTED_FILE_TYPE/);
    expect(source).not.toMatch(/setError\([^)]*EMPTY_FILE/);
  });

  it("canonical participant identity statement is unchanged and shared", () => {
    expect(pilotContent.es.identityCheckbox).toBe(PILOT_IDENTITY_CONFIRMATION_TEXT);
  });

  it("server-side file validation remains authoritative (not weakened)", () => {
    const service = read("src/lib/h3-pilot/participant/submission-service.ts");
    expect(service).toContain("validatePilotFile");
    const storage = read("src/lib/h3-pilot/server/storage.ts");
    expect(storage).toContain("MAX_PILOT_FILE_BYTES");
    expect(storage).toContain("ALLOWED_PILOT_CONTENT_TYPES");
  });

  it("normal Production Evidence Review flow is unchanged", () => {
    const page = read("src/app/talents/evidence-review/page.tsx");
    expect(page).toContain("EvidenceReviewLandingClient");
    expect(page).toContain("PilotLanding");
    expect(read("src/app/talents/evidence-review/apply/page.tsx")).toContain("EvidenceReviewForm");
  });
});
