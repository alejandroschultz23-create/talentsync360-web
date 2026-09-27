import React from 'react';

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TalentSync360",
    "url": "https://www.talentsync360.com",
    "logo": "https://www.talentsync360.com/logo_oficial.png",
    "sameAs": [
      "https://www.linkedin.com/company/talentsync360"
    ],
    "description": "TalentSync360 turns candidate work evidence and role context into structured evaluation briefs for LATAM technical hiring."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
