<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
## 🎯 Inspiration

We're entering an era where AI amplifies human creativity exponentially. But as creation accelerates, a critical question emerges:

**How do we prove the human mind guided the process?**

When a student uses AI to write an essay, a researcher to analyze data, or an artist to create—where's the boundary between human direction and AI execution?

VerifAI was born to answer this question with mathematical certainty.

---

## 🚀 What it does

VerifAI is a **deterministic certification system** that measures and verifies human agency in AI-assisted work.

**Upload your work + collaboration history → Receive verifiable certificate in 20 seconds.**

The certificate contains:

🟢 **Human Agency Score (HAS)**: 0-75 scale (ethically capped at 75%)  
🔵 **Verification Level (VER)**: 0-3 rigor grade  
🔐 **Cryptographic Hash**: SHA-256 proof of authenticity  
📊 **Semantic Breakdown**: Originality, Influence, Direction, Complexity  

**Key principle:** VerifAI doesn't compete with AI generation—it completes it by generating trust.

---

## 🏗️ How we built it

**Stack:**
- **Google Cloud Run** (serverless deployment)
- **Gemini 2.5 Flash** (semantic sensor - multi-agent architecture)
- **TypeScript** (deterministic calculator engine)
- **Secret Manager** (secure API key storage)
- **React** (frontend UI)

**Architecture:**

**Multi-Agent System:**
1. **Agent 1 (Gemini)**: Semantic sensor—analyzes artifact + ledger, returns 9 scores [0-1]
2. **Agent 2 (Calculator)**: Deterministic engine—applies PPM-HAS v0.3 formula
3. **Agent 3 (Notary)**: Certificate generator—SHA-256 hash + cryptographic seal

**Philosophy:**
- **No database**: Privacy-first. Process but never store.
- **Deterministic**: Same input → same output (always).
- **Transparent**: Open-source methodology (PPM-HAS).

**Core Innovation: Ping-Pong Method (PPM)**

A novel protocol that analyzes temporal patterns in human-AI dialogue to quantify:
- **Originality (ORG)**: How unique is the final work?
- **Human Influence (HI)**: How much did human decisions shape outcomes?
- **Process Direction (PD)**: How clearly did the human guide iterations?
- **Refinement Depth (REF)**: How many meaningful human corrections occurred?

The result is a reproducible, auditable score that any LLM or verification system can understand.

---

## 💪 Challenges we ran into

**1. Ethical Ceiling:**
Should any automated system claim 100% certainty about human agency? We decided no. 

Our **75% cap** is philosophical: "No automated system can claim more than 75% certainty without external human validation." This humility is coded into our core.

**2. Determinism vs. LLMs:**
LLMs are probabilistic. How do we achieve deterministic results?

Solution: **LLM as sensor** (measures semantic signals), **code as judge** (applies fixed formula). Gemini provides 9 scores [0-1], our TypeScript engine calculates HAS deterministically.

**3. Privacy:**
How do we verify work without storing sensitive data?

Solution: Process everything in-memory. Generate certificate + hash. Discard inputs immediately. Zero persistence = zero privacy risk.

**4. Real-world validation:**
We tested VerifAI on actual use cases:
- 6-month historical research paper (Gastón Gadín case) → Wikipedia article
- Creative projects (Arkan character design)
- Academic papers (PPM methodology itself)

The tool verified itself being built. **Meta-validation achieved.**

---

## 🏆 Accomplishments

✅ **Working product in production** (not just a demo)  
✅ **Novel methodology** (PPM-HAS v0.3) understandable by any LLM  
✅ **Ethical framework** coded into architecture (75% cap)  
✅ **Real users** (ourselves—we use it daily)  
✅ **Self-validating** (VerifAI verified its own creation process)  
✅ **Multi-agent architecture** deployed on Cloud Run  
✅ **Zero infrastructure drama** (Secret Manager + AI Studio deploy = 10 minutes)  

---

## 📚 What we learned

**1. Generation + Verification = Complete Ecosystem**

AI expands what's possible. VerifAI ensures its integrity. Neither is complete without the other.

**2. Simplicity > Complexity**

We spent 8+ hours trying custom Dockerfiles and complex backends. Final solution? AI Studio's "Deploy to Cloud Run" button + Secret Manager. **Done in 10 minutes.**

Lesson: Use Google's blessed path. It exists for a reason.

**3. Ethics as Code**

"No system should claim 100% certainty" isn't a policy document. It's `const ETHICAL_CAP = 75;` in production code. Philosophy → Implementation → Reality.

**4. Privacy is Paramount**

When you verify sensitive work (research, proprietary code), users need to trust you won't store it. Architecture decision: **No database. Ever.** Process → Certificate → Discard.

---

## 🔮 What's next

**Phase 1 (Current):** Basic certification  
**Phase 2 (Q1 2026):** Enhanced insights

Integrate **Gemini 2.5 Flash** as a qualitative companion:
- Summarize collaboration dynamics
- Identify key turning points in creative process
- Distinguish between "Director Mode" (human leads) vs "Synergy Mode" (true collaboration)
- Provide actionable feedback: "Your iteration depth is strong, but consider more upfront direction"

**Phase 3 (2026+):** Ecosystem integration
- **Academic institutions**: Thesis submission verification
- **Publishers**: Manuscript authorship certification
- **Portfolio platforms**: "Verified Creator" badges
- **Music industry**: Royalty-eligible AI-assisted compositions

**Vision:** Every significant AI-assisted work should have a VerifAI certificate—not as gatekeeping, but as transparency. Like nutrition labels for food, but for creative agency.

---

## 🛠️ Tech Stack

- **Cloud Run** (serverless deployment)
- **Gemini 2.5 Flash** (semantic analysis)
- **TypeScript** (backend + calculator)
- **React** (frontend)
- **Secret Manager** (API key security)
- **SHA-256** (cryptographic hashing)
- **PPM-HAS v0.3** (our proprietary methodology)

---

## 🔗 Links

- **Live Demo**: https://verifai-v2-838150888493.us-west1.run.app/
- **GitHub**: [https://github.com/dargor1406/VerifAIv2](https://github.com/dargor1406/VerifAI-CR)

---

## 🎬 Quick Start

1. Visit https://verifai-v2-838150888493.us-west1.run.app/
2. Upload your work (text, image, or PDF)
3. (Optional) Paste your AI collaboration history
4. Click "Verify My Work"
5. Receive certificate in ~20 seconds

No signup. No storage. Just verification.

---

## 🧠 The Philosophy

**VerifAI exists because:**

The future isn't "humans vs AI" or "AI replacing humans."

It's **"humans directing AI."**

And when that direction matters—for academic integrity, creative attribution, professional credibility—**proof should exist.**

Not to punish AI use. To celebrate human agency.

**VerifAI: Where generation meets verification.**

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1chssrqIq5O24BqvvVc11V39-_n8KXvGQ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
