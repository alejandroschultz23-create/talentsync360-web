import React from "react";

const FAQSchema = () => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the TalentSync360 technical vetting process work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The TalentSync360 Engine employs a multi-gate verification system. Candidates undergo a manual technical screening by senior engineers, practical coding tests in production-like environments, and a comprehensive scorecard evaluation covering architecture, logic, and problem-solving speed."
        }
      },
      {
        "@type": "Question",
        "name": "How is English proficiency evaluated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every candidate undergoes an English communication screening, including live conversational testing and professional writing assessments to ensure team alignment."
        }
      },
      {
        "@type": "Question",
        "name": "What is the typical time to shortlist?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The TalentSync360 sourcing sprints are designed for 48-72 hour cycles to deliver curated shortlists of 3-5 candidates for validated briefs."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
};

export default FAQSchema;
