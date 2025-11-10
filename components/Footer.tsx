import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 pt-8 border-t border-brand-border text-center text-xs text-brand-secondary max-w-4xl mx-auto">
      <p className="mb-4 font-semibold text-brand-light">
        “Built entirely inside Google AI Studio using Gemini — 0 manual code, 100% compliant with the AI Studio Challenge rules. Deployed directly to Cloud Run.”
      </p>
      <p className="mb-4">
        © {currentYear} Iván Astigarraga. All rights reserved.
      </p>
      <p className="mb-2">
        The VerifAI platform and its technical components — including scoring models, formulas, parameters, scripts, and technical documentation — are the intellectual property of Iván Astigarraga. Reproduction, redistribution, reverse engineering, commercial use, or decompilation is prohibited without the express written authorization of the owner.
      </p>
      <p className="mb-4">
        To request permissions or report potential unauthorized use, contact:{' '}
        <a href="mailto:legal@astigarraga.art" className="text-brand-primary hover:underline">
          legal@astigarraga.art
        </a>
      </p>
      <p className="italic">
        (Consult legal counsel to formalize registrations and enforcement policies.)
      </p>
    </footer>
  );
};
