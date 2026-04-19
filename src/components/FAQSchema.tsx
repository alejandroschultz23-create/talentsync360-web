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
        "name": "What English proficiency levels are guaranteed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every talent profile in the TalentSync360 Engine is verified for C1 or C2 English proficiency. Verification includes live conversational testing and technical communication assessments to ensure seamless integration with US and EU teams."
        }
      },
      {
        "@type": "Question",
        "name": "What is the typical time to shortlist?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The TalentSync360 Engine delivers curated shortlists of 3-5 candidates within 72 hours of request validation."
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
