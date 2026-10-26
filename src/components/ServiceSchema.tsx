import React from 'react';

export default function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Evidence Review",
    "serviceType": "Technical Candidate Evidence Review",
    "provider": {
      "@type": "Organization",
      "name": "TalentSync360"
    },
    "description": "Human-reviewed candidate evidence organized around role context, strengths, partial evidence, unknowns, conflicts, and questions to validate before a technical interview."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
