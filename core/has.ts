import type { SemanticScores, ModeDecision } from '../types';

export function clamp(x: number, min: number, max: number) { return Math.max(min, Math.min(max, x)); }

export function decideMode(ledger_text: string, turns?: { human: number, ai: number, confidence: number }): ModeDecision {
    const hasLedger = !!(ledger_text && ledger_text.trim().length > 100);
    if (!hasLedger) return { mode: 'artifact_only', htr: 0 };

    if (turns && (turns.human + turns.ai) > 0 && turns.confidence >= 0.6) {
        const htr = turns.human / (turns.human + turns.ai);
        return { mode: htr > 0.1 ? 'hybrid' : 'artifact_only', htr };
    }

    return { mode: 'hybrid', htr: 0.2 };
}

export function calculateHASv04Bands(
    scores: SemanticScores, 
    md: ModeDecision, 
    artifactMimeType: string, 
    ethicalCap = 0.75
) {
    const { mode, htr } = md;
    
    const isImage = artifactMimeType.startsWith('image/');
    const isAcademic = artifactMimeType === 'application/pdf' && scores.CITE !== null;

    let HAS_base: number;
    let P_total: number;
    let L: number;

    if (mode === 'hybrid') {
        const cappedHTR = Math.min(htr, 0.7);
        HAS_base = 100 * (0.25 * scores.HI + 0.18 * scores.PD + 0.15 * scores.REF + 0.12 * scores.ALIGN +
            0.10 * scores.ORG + 0.08 * scores.COH + 0.07 * scores.COMP + 0.05 * cappedHTR);
        
        const P_fab = 30 * (1 - scores.INTEG);
        const P_cite = scores.CITE !== null ? 15 * (1 - scores.CITE) : 0;
        const P_der = 12 * Math.max(0, 0.6 - scores.ORG);
        const P_inc = 8 * Math.max(0, 0.5 - scores.ALIGN) * scores.PD;
        P_total = Math.min(P_fab + P_cite + P_der + P_inc, 45);

        L = clamp(0.9 + 0.2 * Math.min(scores.HI, scores.PD, scores.REF), 0.9, 1.15);
    } else { // 'artifact_only' mode
        L = 1.0;
        let P_art = 0; // The "Rule of Iron" penalty

        if (isImage && !isAcademic) {
            const HI_proxy = 0.6 * scores.HI + 0.4 * scores.COMP;
            HAS_base = 100 * (0.35 * scores.ORG + 0.25 * scores.COMP + 0.20 * scores.COH + 0.20 * HI_proxy);
            P_art = 45; // Massive penalty for standalone images to ensure VER-0
        } else if (isAcademic) { // Academic PDF logic (calcAcademicBanded)
            const nonNullCite = scores.CITE as number;
            HAS_base = 100 * (0.40 * scores.INTEG + 0.30 * scores.COH + 0.20 * scores.COMP + 0.10 * nonNullCite);
        } else { // Default artifact_only (e.g., plain text)
            const HI_proxy = 0.6 * scores.HI + 0.4 * scores.COMP;
            HAS_base = 100 * (0.35 * scores.ORG + 0.25 * scores.COMP + 0.20 * scores.COH + 0.20 * HI_proxy);
        }
        
        const P_fab = 30 * (1 - scores.INTEG);
        const P_cite = scores.CITE !== null ? 20 * (1 - scores.CITE) : 0;
        const P_der = 12 * Math.max(0, 0.6 - scores.ORG);
        P_total = Math.min(P_fab + P_cite + P_der + P_art, 60);
    }

    const HAS_raw = (HAS_base - P_total) * L;
    const HAS_capped = clamp(HAS_raw, 0, 100 * ethicalCap);
    const HAS = Math.round(HAS_capped);

    const VER_val = (HAS < 40 || scores.INTEG < 0.4) ? 'VER-0'
        : (HAS < 60 || mode === 'artifact_only') ? 'VER-1'
            : (HAS < 75 || scores.INTEG < 0.85) ? 'VER-2'
                : 'VER-3';

    const VER = VER_val as 'VER-0' | 'VER-1' | 'VER-2' | 'VER-3';

    return { HAS, VER, HAS_base, P_total, L };
}