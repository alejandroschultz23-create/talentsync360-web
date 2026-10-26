import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const translations = readFileSync("src/context/translations.ts", "utf8");
const nearshore = readFileSync(
  "src/app/en/nearshore-developers-latam/NearshoreDevelopersLatamClient.tsx",
  "utf8",
);
const footer = readFileSync("src/components/Footer.tsx", "utf8");
const contact = readFileSync("src/app/contact/ContactClient.tsx", "utf8");
const companiesPage = readFileSync("src/app/companies/page.tsx", "utf8");
const serviceSchema = readFileSync("src/components/ServiceSchema.tsx", "utf8");

describe("approved copy hygiene", () => {
  it("uses the approved bilingual WhatsApp copy", () => {
    expect(translations).toContain("I'd like to learn more about TalentSync360.");
    expect(translations).toContain("Me gustaría saber más sobre TalentSync360.");
    expect(translations).not.toContain("your LATAM tech talent network");
    expect(translations).not.toContain("red de talento tech LATAM");
  });

  it("uses Contact for the footer link that still targets /contact", () => {
    expect(translations).toContain("talentsLink2: 'Contact'");
    expect(translations).toContain("talentsLink2: 'Contacto'");
    expect(footer).toContain('href="/contact"');
  });

  it("keeps the approved candidate-review label in both languages", () => {
    expect(translations).toContain("Review an Existing Candidate");
    expect(translations).toContain("Revisar un candidato existente");
    expect(translations).not.toContain("Direct Sourced Candidate");
    expect(translations).not.toContain("Candidato Preseleccionado Directo");
    expect(translations).not.toContain("Bring Your Own Candidate");
  });

  it("keeps the companies hero clarification scoped to the requested copy", () => {
    expect(translations).toContain(
      "Bring candidates you already have. For other hiring needs, start with an exploratory conversation.",
    );
    expect(translations).toContain(
      "Traé candidatos que ya tengas. Para otras necesidades de contratación, empezá con una conversación exploratoria.",
    );
  });

  it("adds the exact nearshore sourcing boundary without changing its URL", () => {
    expect(nearshore).toContain("No sourcing.");
    expect(nearshore).toContain('href="/contact?intent=validate-role"');
  });

  it("uses the approved footer descriptive second idea", () => {
    expect(translations).toContain(
      "Candidate reviews by agreed scope. Contact and partnerships through consultation.",
    );
    expect(translations).toContain(
      "Revisión de candidatos según el alcance acordado. Contacto y partnerships mediante consulta.",
    );
  });

  it("does not publish the retired shortlist/staffing offer in public surfaces", () => {
    expect(companiesPage).not.toContain("B2B Technical Staffing");
    expect(contact).not.toContain("USD 4.500");
    expect(contact).not.toContain("USD 4,500");
    expect(serviceSchema).not.toContain("Shortlist Sprint");
    expect(serviceSchema).not.toContain("Technical Staffing");
  });

  it("keeps the canonical evidence states and neutral contact choices", () => {
    expect(translations).toContain("SUPPORTED");
    expect(translations).toContain("PARTIAL");
    expect(translations).toContain("UNKNOWN");
    expect(translations).toContain("CONFLICT");
    expect(translations).toContain("NEEDS_VALIDATION");
    expect(contact).toContain("Hiring process consultation");
    expect(contact).toContain("Partnership");
  });
});
