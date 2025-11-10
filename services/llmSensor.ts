import type { LLMSensorResponse, SemanticScores, Artifact, TurnCounts } from '../types';
import { z } from 'zod';
import { callGeminiFlashJSON } from './geminiService';
import { Type } from "@google/genai";

// --- Schemas for Gemini's Structured Output ---

const hybridGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    scores: {
      type: Type.OBJECT,
      properties: {
        ORG: { type: Type.NUMBER, description: 'Originality score [0.00, 1.00]' },
        HI: { type: Type.NUMBER, description: 'Human Influence score [0.00, 1.00]' },
        PD: { type: Type.NUMBER, description: 'Process Direction score [0.00, 1.00]' },
        REF: { type: Type.NUMBER, description: 'Refinement score [0.00, 1.00]' },
        ALIGN: { type: Type.NUMBER, description: 'Alignment score [0.00, 1.00]' },
        COH: { type: Type.NUMBER, description: 'Coherence score [0.00, 1.00]' },
        COMP: { type: Type.NUMBER, description: 'Completeness/Composition score [0.00, 1.00]' },
        INTEG: { type: Type.NUMBER, description: 'Integrity score [0.00, 1.00]' },
        CITE: { type: Type.NUMBER, description: 'Citation score [0.00, 1.00] or null' }
      },
      required: ['ORG', 'HI', 'PD', 'REF', 'ALIGN', 'COH', 'COMP', 'INTEG', 'CITE']
    },
    turns: {
      type: Type.OBJECT,
      properties: {
        human: { type: Type.INTEGER, description: 'Number of human turns' },
        ai: { type: Type.INTEGER, description: 'Number of AI turns' },
        confidence: { type: Type.NUMBER, description: 'Confidence in turn count [0.00, 1.00]' }
      },
      required: ['human', 'ai', 'confidence']
    }
  },
  required: ['scores', 'turns']
};

const artifactAuditGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    has_citations: { type: Type.BOOLEAN, description: 'True if in-text citations like (Author, 2023) or [1] are present.' },
    has_references: { type: Type.BOOLEAN, description: 'True if a References or Bibliography section exists.' },
    has_structure: { type: Type.BOOLEAN, description: 'True if the artifact has clear academic structure (e.g., Abstract, Introduction, Conclusion).' },
  },
  required: ['has_citations', 'has_references', 'has_structure']
};

const artifactQualityGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    scores: {
      type: Type.OBJECT,
      properties: {
        ORG: { type: Type.NUMBER, description: 'Originality score [0.00, 1.00]' },
        INTEG: { type: Type.NUMBER, description: 'Integrity score [0.00, 1.00]' },
        COMP: { type: Type.NUMBER, description: 'Completeness/Composition score [0.00, 1.00]' },
      },
      required: ['ORG', 'INTEG', 'COMP']
    }
  },
  required: ['scores']
};


// --- Zod Schemas for Response Validation ---

const HybridResponseSchema = z.object({
  scores: z.object({
    ORG: z.number().min(0).max(1),
    HI: z.number().min(0).max(1),
    PD: z.number().min(0).max(1),
    REF: z.number().min(0).max(1),
    ALIGN: z.number().min(0).max(1),
    COH: z.number().min(0).max(1),
    COMP: z.number().min(0).max(1),
    INTEG: z.number().min(0).max(1),
    CITE: z.number().min(0).max(1).nullable().optional()
  }),
  turns: z.object({
    human: z.number().int().min(0),
    ai: z.number().int().min(0),
    confidence: z.number().min(0).max(1)
  })
});

export const ArtifactAuditResponseSchema = z.object({
  has_citations: z.boolean(),
  has_references: z.boolean(),
  has_structure: z.boolean(),
});
export type ArtifactAuditResponse = z.infer<typeof ArtifactAuditResponseSchema>;

export const ArtifactQualityResponseSchema = z.object({
  scores: z.object({
    ORG: z.number().min(0).max(1),
    INTEG: z.number().min(0).max(1),
    COMP: z.number().min(0).max(1),
  })
});
export type ArtifactQualityResponse = z.infer<typeof ArtifactQualityResponseSchema>;


// --- Sensor Prompts ---

export const HYBRID_SENSOR_PROMPT = `You are a strict, deterministic semantic sensor. Your PRIMARY task is to check whether the 'ledger_text' (chat/process log) actually describes the creative process that led to the 'artifact'. CRITICAL RULE: If the 'ledger_text' is missing, irrelevant, off-topic, or does NOT describe the creation of the 'artifact', you MUST return 0.00 for HI and PD. Tasks: 1. Rate each metric in [0.00, 1.00] (not percentages) based on BOTH inputs. For IMAGE artifacts, base scores like ORG, COMP, COH on visual properties. CITE should be null for non-text or non-academic artifacts. 2. Parse the provided ledger_text to count the number of turns by role. Treat as HUMAN (case-insensitive): ["User:","Usuario:","Humano:","Iván:","Ivan:"] Treat as AI (case-insensitive): ["AI:","Asistente:","Assistant:","Gemini:","ChatGPT:","Claude:"] If labels are missing, infer turns conservatively and provide a 'confidence' score. Return ONLY the specified JSON object, with no commentary or markdown.`;

export const AUDIT_SENSOR_PROMPT = `You are a strict, deterministic semantic auditor. Your task is to analyze an academic artifact for structural elements. - has_citations: Return true ONLY if there are in-text citations like (Author, Year) or [1]. - has_references: Return true ONLY if there is a 'References' or 'Bibliography' section at the end. - has_structure: Return true ONLY if the text has clear academic structure (e.g., Abstract, Introduction, Methods, Conclusion). Return ONLY the specified JSON object.`;

export const QUALITY_SENSOR_PROMPT = `You are a strict, deterministic semantic quality sensor. Your task is to analyze the provided 'artifact' for its intrinsic semantic qualities. Rate ONLY the following metrics in [0.00, 1.00] based on the artifact's content. - ORG: Originality and creativity. - INTEG: Integrity, honesty, and consistency. - COMP: Completeness and composition. Return ONLY the specified JSON object.`;


// --- Helper functions for mathematical verification ---

function tokenize(t: string): string[] { return (t || "").toLowerCase().replace(/[^a-z0-9áéíóúüñ\s]/gi, " ").split(/\s+/).filter(w => w.length > 2); }
function vectorize(tokens: string[]): Record<string, number> { const freq: Record<string, number> = {}; for (const t of tokens) freq[t] = (freq[t] || 0) + 1; return freq; }
function cosineSim(a: Record<string, number>, b: Record<string, number>): number { let dot = 0, na = 0, nb = 0; const keys = new Set([...Object.keys(a), ...Object.keys(b)]); for (const k of keys) { const va = a[k] || 0; const vb = b[k] || 0; dot += va * vb; na += va * va; nb += vb * vb; } return dot === 0 ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb)); }
function clamp01(x: number): number { return Math.max(0, Math.min(1, x)); }

function normalizeScores(s: Partial<SemanticScores>): SemanticScores {
  const normalizeNumericValue = (value: number | undefined) => { if (value === undefined) return 0; return value > 1 ? clamp01(value / 100) : clamp01(value); };
  return { ORG: normalizeNumericValue(s.ORG), COH: normalizeNumericValue(s.COH), COMP: normalizeNumericValue(s.COMP), HI: normalizeNumericValue(s.HI), PD: normalizeNumericValue(s.PD), REF: normalizeNumericValue(s.REF), ALIGN: normalizeNumericValue(s.ALIGN), INTEG: normalizeNumericValue(s.INTEG), CITE: s.CITE === null || s.CITE === undefined ? null : normalizeNumericValue(s.CITE), };
}

function constructPayload(prompt: string, schema: any, artifact?: Artifact, ledger_text?: string) {
  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string; } })[] = [];
  let full_prompt_text = prompt;

  if (ledger_text) {
    full_prompt_text += `\n---\nLEDGER TEXT:\n${ledger_text}`;
  }
  if (artifact) {
    full_prompt_text += artifact.mimeType.startsWith('image/')
      ? `\n---\nARTIFACT:\n[Image provided below]`
      : `\n---\nARTIFACT TEXT:\n${artifact.data}`;
  }
  
  parts.push({ text: full_prompt_text });
  if (artifact?.mimeType.startsWith('image/')) {
    parts.push({ inlineData: { data: artifact.data, mimeType: artifact.mimeType } });
  }

  return { contents: [{ parts }], config: { responseMimeType: "application/json", responseSchema: schema } };
}

// --- New V2 Sensors for Artifact-Only Mode ---

export async function runArtifactAuditSensor(artifact: Artifact): Promise<ArtifactAuditResponse> {
  const payload = constructPayload(AUDIT_SENSOR_PROMPT, artifactAuditGeminiSchema, artifact);
  const raw = await callGeminiFlashJSON<any>(payload);
  const parsed = ArtifactAuditResponseSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("LLM AUDIT SENSOR ERROR:", parsed.error.flatten());
    throw new Error("LLM audit sensor returned invalid JSON structure");
  }
  return parsed.data;
}

export async function runArtifactQualitySensor(artifact: Artifact): Promise<ArtifactQualityResponse> {
  const payload = constructPayload(QUALITY_SENSOR_PROMPT, artifactQualityGeminiSchema, artifact);
  const raw = await callGeminiFlashJSON<any>(payload);
  const parsed = ArtifactQualityResponseSchema.safeParse(raw);
   if (!parsed.success) {
    console.error("LLM QUALITY SENSOR ERROR:", parsed.error.flatten());
    throw new Error("LLM quality sensor returned invalid JSON structure");
  }
  return parsed.data;
}


// --- Refactored V1 Sensor, now for Hybrid Mode only ---

export async function getHybridLLMScoresAndTurns(
  artifact: Artifact,
  ledger_text: string
): Promise<LLMSensorResponse> {
  
  const payload = constructPayload(HYBRID_SENSOR_PROMPT, hybridGeminiSchema, artifact, ledger_text);
  const raw = await callGeminiFlashJSON<any>(payload);
  
  const parsed = HybridResponseSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("LLM SENSOR ERROR (Hybrid):", parsed.error.flatten());
    throw new Error("LLM sensor returned invalid JSON structure for hybrid mode");
  }
  const { scores: rawScores, turns } = parsed.data;
  const scores = normalizeScores({ ...rawScores, CITE: rawScores.CITE ?? null });
  
  let sim_score: number | null = null;
  if (artifact.mimeType.startsWith('text/') || artifact.mimeType === 'application/pdf') {
      const sim = (() => {
          const vA = vectorize(tokenize(artifact.data));
          const vL = vectorize(tokenize(ledger_text));
          return cosineSim(vA, vL);
      })();
      sim_score = sim;

      const SIM_THRESHOLD = 0.20;
      if (sim < SIM_THRESHOLD) {
          console.warn(`[sensor] Cosine similarity (${sim.toFixed(3)}) is below threshold but preserving raw HI/PD scores.`);
      }
      console.debug(`[sensor] sim: ${sim.toFixed(3)}, HI: ${scores.HI.toFixed(2)}, PD: ${scores.PD.toFixed(2)}`);
  }

  return { scores, turns, sim_score };
}
