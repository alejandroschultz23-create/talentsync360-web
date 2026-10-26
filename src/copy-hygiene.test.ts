import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { translations } from "./context/translations";

const translationSource = readFileSync("src/context/translations.ts", "utf8");
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
    expect(translationSource).toContain("I'd like to learn more about TalentSync360.");
    expect(translationSource).toContain("Me gustaría saber más sobre TalentSync360.");
    expect(translationSource).not.toContain("your LATAM tech talent network");
    expect(translationSource).not.toContain("red de talento tech LATAM");
  });

  it("uses Contact for the footer link that still targets /contact", () => {
    expect(translationSource).toContain("talentsLink2: 'Contact'");
    expect(translationSource).toContain("talentsLink2: 'Contacto'");
    expect(footer).toContain('href="/contact"');
  });

  it("keeps the approved candidate-review label in both languages", () => {
    expect(translationSource).toContain("Review an Existing Candidate");
    expect(translationSource).toContain("Revisar un candidato existente");
    expect(translationSource).not.toContain("Direct Sourced Candidate");
    expect(translationSource).not.toContain("Candidato Preseleccionado Directo");
    expect(translationSource).not.toContain("Bring Your Own Candidate");
  });

  it("keeps the companies hero clarification scoped to the requested copy", () => {
    expect(translationSource).toContain(
      "Bring candidates you already have. For other hiring needs, start with an exploratory conversation.",
    );
    expect(translationSource).toContain(
      "Traé candidatos que ya tengas. Para otras necesidades de contratación, empezá con una conversación exploratoria.",
    );
  });

  it("adds the exact nearshore sourcing boundary without changing its URL", () => {
    expect(nearshore).toContain("No sourcing.");
    expect(nearshore).toContain('href="/contact?intent=validate-role"');
  });

  it("uses the approved footer descriptive second idea", () => {
    expect(translationSource).toContain(
      "Candidate reviews by agreed scope. Contact and partnerships through consultation.",
    );
    expect(translationSource).toContain(
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
    expect(translationSource).toContain("SUPPORTED");
    expect(translationSource).toContain("PARTIAL");
    expect(translationSource).toContain("UNKNOWN");
    expect(translationSource).toContain("CONFLICT");
    expect(translationSource).toContain("NEEDS_VALIDATION");
    expect(contact).toContain("Hiring process consultation");
    expect(contact).toContain("Partnership");
  });

  it("keeps the final founder copy micro-fixes scoped to public translations", () => {
    const homepage = translations.en.homepage;
    const homepageEs = translations.es.homepage;
    const companies = translations.en.companies;
    const companiesEs = translations.es.companies;

    expect(homepage.problem.bannerSubtext).toContain("what the available evidence supports");
    expect(homepage.problem.bannerSubtext).not.toContain("only candidates");
    expect(homepage.framework.subtitle).not.toContain("complete confidence");
    expect(homepage.techPros.point4Desc).toContain("optional");
    expect(homepage.techPros.point4Desc).toContain("does not guarantee");
    expect(homepage.transformation.phase5Desc).not.toContain("48-72h");
    expect(homepageEs.transformation.phase5Desc).not.toContain("48-72h");
    expect(companies.payment.pillars[3].desc).toContain("scope");
    expect(companies.demo.body).not.toContain("need sourcing");
    expect(companies.faq.items.some((item) => item.question.includes("fewer than three qualifying"))).toBe(false);
    expect(companiesEs.faq.items.some((item) => item.question.includes("menos de tres candidatos calificados"))).toBe(false);
    expect(translations.en.methodology.signalBadge).not.toBe(translations.en.methodology.signalTitle);
  });
});
