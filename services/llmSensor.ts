import type { LLMSensorResponse, SemanticScores, Artifact } from '../types';
import { z } from 'zod';
import { callGeminiFlashJSON } from './geminiService';
import { Type } from "@google/genai";

const SemanticSchema = z.object({
  scores: z.object({
    ORG: z.number().min(0).max(1),
    HI: z.number().min(0).max(1),
    PD: z.number().min(0).max(1),
    REF: z.number().min(0).max(1),
    ALIGN: z.number().min(0).max(1),
    COH: z.number().min(0).max(1),
    COMP: z.number().min(0).max(1),
    INTEG: z.number().min(0).max(1),
    // FIX: Make CITE optional as the model may omit it.
    CITE: z.number().min(0).max(1).nullable().optional()
  }),
  turns: z.object({
    human: z.number().int().min(0),
    ai: z.number().int().min(0),
    confidence: z.number().min(0).max(1)
  })
});

const geminiSchema = {
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


export const SENSOR_PROMPT = `You are a strict, deterministic semantic sensor.
Your PRIMARY task is to check whether the 'ledger_text' (chat/process log) actually describes the creative process that led to the 'artifact'.

CRITICAL RULE:
If the 'ledger_text' is missing, irrelevant, off-topic, or does NOT describe the creation of the 'artifact', you MUST return 0.00 for HI and PD.

Tasks:
1. Rate each metric in [0.00, 1.00] (not percentages) based on BOTH inputs.
   For IMAGE artifacts, base scores like ORG, COMP, COH on visual properties.
   CITE should be null for non-text or non-academic artifacts.
2. Parse the provided ledger_text to count the number of turns by role.
   Treat as HUMAN (case-insensitive): ["User:","Usuario:","Humano:","Iván:","Ivan:"]
   Treat as AI (case-insensitive): ["AI:","Asistente:","Assistant:","Gemini:","ChatGPT:","Claude:"]
   If labels are missing, infer turns conservatively and provide a 'confidence' score.

Return ONLY the specified JSON object, with no commentary or markdown.`;

// --- Helper functions for mathematical verification ---

function tokenize(t: string): string[] {
  return (t || "")
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúüñ\s]/gi, " ")
    .split(/\s+/)
    .filter(w => w.length > 2);
}

function vectorize(tokens: string[]): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const t of tokens) freq[t] = (freq[t] || 0) + 1;
  return freq;
}

function cosineSim(a: Record<string, number>, b: Record<string, number>): number {
  let dot = 0, na = 0, nb = 0;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    const va = a[k] || 0;
    const vb = b[k] || 0;
    dot += va * vb;
    na += va * va;
    nb += vb * vb;
  }
  return dot === 0 ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function clamp01(x: number): number { return Math.max(0, Math.min(1, x)); }

// Defensive normalization to handle models that might return 0-100 scores
// and ensure all values are clamped within the [0, 1] range.
function normalizeScores(s: SemanticScores): SemanticScores {
  const normalizeNumericValue = (value: number) => {
    return value > 1 ? clamp01(value / 100) : clamp01(value);
  };

  return {
    ORG: normalizeNumericValue(s.ORG),
    COH: normalizeNumericValue(s.COH),
    COMP: normalizeNumericValue(s.COMP),
    HI: normalizeNumericValue(s.HI),
    PD: normalizeNumericValue(s.PD),
    REF: normalizeNumericValue(s.REF),
    ALIGN: normalizeNumericValue(s.ALIGN),
    INTEG: normalizeNumericValue(s.INTEG),
    CITE: s.CITE === null ? null : normalizeNumericValue(s.CITE),
  };
}

export async function getLLMScoresAndTurns(
  artifact: Artifact,
  ledger_text: string
): Promise<LLMSensorResponse> {
  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string; } })[] = [];

  const ledger_context = (ledger_text && ledger_text.trim().length > 0)
    ? `\n---\nLEDGER TEXT:\n${ledger_text}`
    : `\n---\nLEDGER TEXT:\n[No ledger provided]`;

  if (artifact.mimeType.startsWith('image/')) {
    const full_prompt_text = `${SENSOR_PROMPT}${ledger_context}\n---\nARTIFACT:\n[Image provided below]`;
    parts.push({ text: full_prompt_text });
    parts.push({ inlineData: { data: artifact.data, mimeType: artifact.mimeType } });
  
  } else if (artifact.mimeType.startsWith('text/') || artifact.mimeType === 'application/pdf') {
    const artifact_context = `\n---\nARTIFACT TEXT:\n${artifact.data}`;
    const full_prompt_text = `${SENSOR_PROMPT}${ledger_context}${artifact_context}`;
    parts.push({ text: full_prompt_text });
  } else {
    throw new Error(`Unsupported artifact MIME type for LLM analysis: ${artifact.mimeType}`);
  }

  const payload = {
    contents: [{ parts }],
    config: {
      responseMimeType: "application/json",
      responseSchema: geminiSchema,
    },
  };
  
  const raw = await callGeminiFlashJSON<any>(payload);
  const parsed = SemanticSchema.safeParse(raw);

  if (!parsed.success) {
    console.error("LLM SENSOR ERROR:", parsed.error.flatten());
    throw new Error("LLM sensor returned invalid JSON structure");
  }

  // FIX: Handle optional 'CITE' property from LLM response and ensure type compatibility.
  const { scores: rawScores, turns } = parsed.data;
  let scores: SemanticScores = normalizeScores({ ...rawScores, CITE: rawScores.CITE ?? null });
  
  // Mathematical Verification (Filter 2): Don't trust the LLM's relevance check alone.
  // Programmatically verify the topical relevance between the ledger and the artifact.
  // This prevents high HI/PD scores from an irrelevant chat history.
  if ((artifact.mimeType.startsWith('text/') || artifact.mimeType === 'application/pdf') && ledger_text.trim().length > 0) {
      const sim = (() => {
          const vA = vectorize(tokenize(artifact.data));
          const vL = vectorize(tokenize(ledger_text));
          return cosineSim(vA, vL);
      })();

      const SIM_THRESHOLD = 0.55;

      if (sim < SIM_THRESHOLD && (scores.HI > 0 || scores.PD > 0)) {
          console.warn(`Cosine similarity (${sim.toFixed(3)}) is below threshold. Overriding HI and PD to 0.`);
          scores.HI = 0;
          scores.PD = 0;
      }
      
      console.debug(`[sensor] sim: ${sim.toFixed(3)}, HI: ${scores.HI.toFixed(2)}, PD: ${scores.PD.toFixed(2)}`);
  }

  return { scores, turns };
}
