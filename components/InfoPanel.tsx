
import React from 'react';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { SearchCircleIcon } from './icons/SearchCircleIcon';

const InfoSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="mb-8">
    <div className="flex items-center mb-3">
      {icon}
      <h3 className="text-xl font-semibold text-white ml-3">{title}</h3>
    </div>
    <div className="text-brand-secondary leading-relaxed pl-10">{children}</div>
  </div>
);

const Step: React.FC<{ num: number; title: string; children: React.ReactNode }> = ({ num, title, children }) => (
  <div className="flex items-start mb-6">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center font-bold text-white mr-4">
      {num}
    </div>
    <div>
      <h4 className="font-semibold text-brand-light">{title}</h4>
      <p className="text-sm text-brand-secondary">{children}</p>
    </div>
  </div>
);

export const InfoPanel: React.FC = () => {
  return (
    <div className="bg-brand-card border border-brand-border rounded-lg p-6 lg:p-8 h-full">
      <InfoSection icon={<DocumentTextIcon className="w-7 h-7 text-brand-primary" />} title="How It Works">
        <Step num={1} title="Provide Chat History (Optional)">
          For the most accurate analysis, paste the full conversation with the AI. This helps verify process direction and human guidance.
        </Step>
        <Step num={2} title="Upload Final Artifact">
          Upload your final creation (.txt, .pdf, .png, etc.). The system compares it to the process log to measure originality and refinement depth.
        </Step>
        <Step num={3} title="Verification and Certificate">
          Our AI auditor analyzes all semantic signals and issues a verifiable Proof of Human Agency Certificate.
        </Step>
      </InfoSection>

      <InfoSection icon={<SearchCircleIcon className="w-7 h-7 text-brand-primary" />} title="What Your Certificate Measures">
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <span className="font-bold text-brand-light">Originality (ORG):</span> Indicates how unique and creative your final work is compared to standard AI output.
          </li>
          <li>
            <span className="font-bold text-brand-light">Human Influence (HI):</span> Detects human direction, judgment, and interventions throughout the creative process.
          </li>
          <li>
            <span className="font-bold text-brand-light">Process Direction (PD):</span> Measures how clearly the human guided the AI toward a desired goal or vision.
          </li>
          <li>
            <span className="font-bold text-brand-light">Integrity (INTEG):</span> Quantifies the honesty, coherence, and consistency of the final artifact.
          </li>
        </ul>
      </InfoSection>

      <InfoSection icon={<ShieldCheckIcon className="w-7 h-7 text-brand-primary" />} title="Your Privacy is Paramount">
        <p className="text-sm">
          No data is stored. All inputs are processed in-memory for the duration of the analysis and permanently discarded afterward.
        </p>
      </InfoSection>
    </div>
  );
};
