import { FLAGS, ETHICAL_CAP_PERCENT, PPM_MODEL_POLICY } from '../constants';
import type { NotaryReport, TurnCounts, SemanticScores, Artifact } from '../types';
import { getLLMScoresAndTurns } from './llmSensor';
import { decideMode, calculateHASv04Bands } from '../core/has';
import { sealCertificate } from './notary';

export async function analyzeWork(notaryArtifact: Artifact, llmArtifact: Artifact, ledger_text: string): Promise<NotaryReport> {
  let turns: TurnCounts | undefined;
  let scores: SemanticScores;
  let fallback_used = false;
  
  try {
    const sensorResponse = await getLLMScoresAndTurns(llmArtifact, ledger_text);
    scores = sensorResponse.scores;
    turns = sensorResponse.turns;
  } catch (e) {
    console.warn("Sensor failed with ledger, attempting fallback:", e);
    fallback_used = true;
    // Fallback: if the parser fails, compute only with scores from artifact
    const resp = await getLLMScoresAndTurns(llmArtifact, ""); // Try with artifact only
    scores = resp.scores;
    turns = undefined;
  }
  
  const md = (FLAGS.forceHybridWhenLedgerPresent && ledger_text.trim().length > 100 && fallback_used)
    ? { mode: 'hybrid' as const, htr: 0.2 }
    : decideMode(ledger_text, turns);
    
  const { HAS, VER, HAS_base, P_total, L } = calculateHASv04Bands(scores, md, notaryArtifact.mimeType, ETHICAL_CAP_PERCENT);

  const { cert_id, artifact_sha256, issued_at } = await sealCertificate(notaryArtifact);

  return {
    HAS, VER, HAS_base, P_total, L,
    cert_id, artifact_sha256, issued_at,
    PPM_MODEL_POLICY,
    parser_source: 'gemini-2.5-flash',
    turns_confidence: turns?.confidence ?? 0,
    fallback_used,
    scores,
  };
}