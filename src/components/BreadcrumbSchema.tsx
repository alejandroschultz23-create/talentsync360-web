import React from 'react';

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const itemListElement = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.talentsync360.com"
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 2,
      "name": item.name,
      "item": `https://www.talentsync360.com${item.item}`
    }))
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
