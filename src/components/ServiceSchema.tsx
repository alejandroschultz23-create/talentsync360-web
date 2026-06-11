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
    "description": "Curated technical shortlists of nearshore LATAM talent with verified English and structured candidate scorecards."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
