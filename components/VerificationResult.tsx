
import React from 'react';
import type { NotaryReport } from '../types';
import { SealIcon } from './icons/SealIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

const getVerLevelDetails = (ver: string) => {
    switch (ver) {
        case 'VER-3':
            return {
                title: 'Exceptional Human Agency',
                color: 'text-emerald-400',
                bgColor: 'bg-emerald-900/50',
                description: 'Represents a work with profound human direction, originality, and integrity.'
            };
        case 'VER-2':
            return {
                title: 'Significant Human Agency',
                color: 'text-cyan-400',
                bgColor: 'bg-cyan-900/50',
                description: 'Indicates a work with clear human guidance and creative influence.'
            };
        case 'VER-1':
            return {
                title: 'Verified Human Agency',
                color: 'text-blue-400',
                bgColor: 'bg-blue-900/50',
                description: 'Confirms that human involvement was a key factor in the final artifact.'
            };
        case 'VER-0':
        default:
            return {
                title: 'Agency Not Verified',
                color: 'text-amber-400',
                bgColor: 'bg-amber-900/50',
                description: 'The analysis could not conclusively verify a significant level of human agency.'
            };
    }
};

const ResultRow: React.FC<{ label: string; value: string | number; description?: string }> = ({ label, value, description }) => (
    <div className="flex justify-between items-center py-3 border-b border-brand-border/50">
        <div>
            <p className="font-semibold text-brand-light">{label}</p>
            {description && <p className="text-xs text-brand-secondary">{description}</p>}
        </div>
        <p className="font-mono text-lg text-white">{value}</p>
    </div>
);

const MeasuredScore: React.FC<{ name: string; abbreviation: string; value: number; description: string; }> = ({ name, abbreviation, value, description }) => (
    <div className="flex items-start space-x-4 py-3 border-b border-brand-border/50 last:border-b-0">
        <div className="flex-shrink-0 w-20 text-right">
            <p className="font-bold text-brand-light text-lg">{abbreviation}</p>
            <p className="font-mono text-brand-primary text-xl">{(value * 100).toFixed(0)}</p>
        </div>
        <div className="border-l border-brand-border/50 pl-4">
            <p className="font-semibold text-brand-light">{name}</p>
            <p className="text-sm text-brand-secondary">{description}</p>
        </div>
    </div>
);

export const VerificationResult: React.FC<{ result: NotaryReport, onReset: () => void }> = ({ result, onReset }) => {
    const { title, color, bgColor, description } = getVerLevelDetails(result.VER);

    return (
        <div className="bg-brand-card border border-brand-border rounded-lg p-6 lg:p-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-brand-border pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Verification Certificate</h2>
                    <p className="text-brand-secondary">Issued on: {new Date(result.issued_at).toUTCString()}</p>
                </div>
                <div className={`mt-4 md:mt-0 text-center px-4 py-2 rounded-lg ${bgColor}`}>
                    <p className={`text-2xl font-bold ${color}`}>{result.VER}</p>
                    <p className="text-sm font-medium text-brand-secondary">{title}</p>
                </div>
            </div>

            <div className="text-center bg-brand-dark p-4 rounded-md mb-8">
                <p className="text-brand-light">{description}</p>
                <p className="text-brand-primary italic mt-2 font-semibold">
                    Your work demonstrates that you have creativity, ingenuity, and direction!
                </p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="bg-brand-dark p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-white flex items-center"><SealIcon className="w-6 h-6 mr-2 text-brand-primary"/> Agency Score</h3>
                     <div className="text-center">
                        <p className="text-7xl font-bold text-brand-primary">{result.HAS}</p>
                        <p className="text-brand-secondary">Human Agency Score (HAS)</p>
                     </div>
                </div>
                 <div className="bg-brand-dark p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-white flex items-center"><DocumentTextIcon className="w-6 h-6 mr-2 text-brand-primary"/> Artifact Details</h3>
                     <div className="text-xs text-brand-secondary space-y-2 break-all">
                        <p><span className="font-bold text-brand-light">Certificate ID:</span> {result.cert_id}</p>
                        <p><span className="font-bold text-brand-light">Artifact SHA256:</span> {result.artifact_sha256}</p>
                     </div>
                </div>
            </div>
            
            <div className="bg-brand-dark p-6 rounded-lg mb-8">
                 <h3 className="text-xl font-semibold mb-4 text-white">Score Breakdown</h3>
                 <div className="space-y-2">
                     <ResultRow label="Base Score" value={result.HAS_base.toFixed(2)} description="Initial calculation before adjustments"/>
                     <ResultRow label="Penalties" value={-result.P_total.toFixed(2)} description="Adjustments for integrity, originality, etc."/>
                     <ResultRow label="Quality Factor" value={`x${result.L.toFixed(2)}`} description="Bonus for high-quality process logs"/>
                 </div>
            </div>

            <div className="bg-brand-dark p-6 rounded-lg mb-8">
                 <h3 className="text-xl font-semibold mb-4 text-white">What Your Certificate Measures</h3>
                 <div>
                    <MeasuredScore 
                        name="Originality" 
                        abbreviation="ORG" 
                        value={result.scores.ORG}
                        description="Indicates how unique and creative your final work is compared to standard AI output."
                    />
                    <MeasuredScore 
                        name="Human Influence" 
                        abbreviation="HI" 
                        value={result.scores.HI}
                        description="Detects human direction, judgment, and interventions throughout the creative process."
                    />
                     <MeasuredScore 
                        name="Process Direction" 
                        abbreviation="PD" 
                        value={result.scores.PD}
                        description="Measures how clearly the human guided the AI toward a desired goal or vision."
                    />
                     <MeasuredScore 
                        name="Integrity" 
                        abbreviation="INTEG" 
                        value={result.scores.INTEG}
                        description="Quantifies the honesty, coherence, and consistency of the final artifact."
                    />
                 </div>
            </div>

            <div className="text-center">
                <button
                    onClick={onReset}
                    className="bg-brand-primary text-white font-bold py-3 px-6 rounded-md hover:bg-blue-500 transition duration-150"
                >
                    Verify Another Work
                </button>
                <p className="text-xs text-brand-secondary mt-4">Policy Model: {result.PPM_MODEL_POLICY} | Parser: {result.parser_source}</p>
            </div>
        </div>
    );
};