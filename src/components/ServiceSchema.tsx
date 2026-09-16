import React from 'react';

export default function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Shortlist Sprint",
    "serviceType": "Technical Staffing",
    "provider": {
      "@type": "Organization",
      "name": "TalentSync360"
    },
    "description": "Human-reviewed technical shortlists of nearshore LATAM talent with role-specific evidence and opportunity-specific communication requirements."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
