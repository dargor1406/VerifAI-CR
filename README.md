# VerifAI: Proof of Human Agency in AI Collaboration

[![Cloud Run](https://img.shields.io/badge/Cloud%20Run-Deployed-4285F4?logo=google-cloud)](https://verifai-v2-838150888493.us-west1.run.app/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-34A853)](https://ai.google.dev/gemini-api)
[![Hackathon](https://img.shields.io/badge/Hackathon-Cloud%20Run%202025-orange)](https://cloudrun-hackathon.devpost.com/)

> **Generate trust, not just content.** Verifiable certificates for human-directed AI work.

🔗 **Live Demo:** www.verifai.astigarraga.art  
📄 **Devpost:** https://devpost.com/software/verifai-verifiable-legitimacy-for-human-ai-collaboration  
🎥 **Video Demo:** https://youtu.be/cs3ZDLeOpXc

---

## 🎯 The Problem

Traditional AI detectors ask: *"Did AI write this?"* — **Wrong question.**

When AI becomes a collaborator (not just a generator), binary detection breaks:
- Academic papers flagged as "100% AI" despite human direction
- Rigorous research dismissed as "plagiarism"  
- No way to prove human agency in AI-assisted work

**Real example:** A 67-page historical investigation (6 months of research) was flagged as **81% AI-generated** by GPTZero. But it was human-directed research using AI as a methodological tool.

---

## 💡 The Solution

**VerifAI measures human agency, not AI presence.**

Upload your work + collaboration history → Verifiable certificate in ~20 seconds.

### What You Get:
- **HAS (Human Agency Score):** 0-75 scale *(ethically capped at 75%)*
- **VER (Verification Level):** 0-3 rigor grade  
- **Cryptographic Hash:** SHA-256 proof  
- **Breakdown:** Originality, Influence, Direction, Complexity

---

## 🏗️ How It Works

**Multi-Agent System:**
```
┌──────────┐
│   USER   │ Uploads artifact + ledger (optional)
└────┬─────┘
     │
     ↓
┌─────────────────────────────┐
│  🤖 Agent 1: Gemini Sensor  │ Semantic analysis
│  (Gemini 2.5 Flash)         │
└─────────────┬───────────────┘
              │ 9 scores [0-1]
              ↓
┌─────────────────────────────┐
│  ⚙️  Agent 2: Calculator    │ Proprietary scoring engine
│  (PPM-HAS methodology)      │ [Details: judges only]
└─────────────┬───────────────┘
              │ HAS score
              ↓
┌─────────────────────────────┐
│  🔐 Agent 3: Notary         │ Certificate + SHA-256 seal
└─────────────┬───────────────┘
              │
              ↓
         📜 Certificate
```

**Key Principles:**
- ✅ **Deterministic:** Same input → same output
- ✅ **Privacy-first:** No database. Process in-memory only.
- ✅ **Transparent methodology:** PPM-HAS v0.3 *(scoring engine: proprietary)*
- ✅ **Ethical cap:** 75% maximum (coded, not configurable)

---

## 🚀 Try It Now

: Live Demo
Visit www.verifai.astigarraga.art  and upload any document.



---

## 🔬 Real-World Case Study

**Challenge:** 110-year-old murder case (Paraguay, 1915)

**My approach:**
- 6 months of archival research
- AI-assisted document analysis (newspapers, parish records)
- Multi-source verification
- Novel findings: Real identity discovered (Ana Basilia Caballero Santa Cruz)

**Detector Comparison:**
- **GPTZero:** 81% AI ❌  
- **VerifAI:** 75/75 HAS ✅

📄 **Full paper:** [DOI 10.5281/zenodo.17284483](https://zenodo.org/record/17284483)

**Why the difference?**  
Detectors measure *predictability*. VerifAI measures *agency*.

---

## 🎯 Use Cases

- ✅ **Academia:** Thesis certification  
- ✅ **Publishing:** Manuscript verification  
- ✅ **Creative Industries:** Music royalties (AI-assisted compositions)  
- ✅ **Legal:** Court evidence of authorship  
- ✅ **Education:** Student work integrity  

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **AI:** Gemini 2.5 Flash (via AI Studio)
- **Deployment:** Google Cloud Run (serverless)
- **Security:** Secret Manager (API key storage)
- **Hashing:** SHA-256 (certificate integrity)

---

## 🔒 Privacy & Security

- **No database:** Zero storage of artifacts/ledgers
- **Process-only:** Data exists in memory during analysis, then discarded
- **Secret Manager:** API keys never exposed to frontend
- **Cryptographic proof:** SHA-256 seal on every certificate

---

## 📊 Methodology

**PPM-HAS v0.3** (Ping-Pong Method for Human Agency Scoring)

Analyzes temporal patterns in human-AI collaboration:
- **Originality (ORG):** Uniqueness of final work
- **Human Influence (HI):** Decision-making impact
- **Process Direction (PD):** Clarity of guidance
- **Refinement (REF):** Meaningful corrections

*Note: Detailed scoring engine available to judges/partners only (proprietary IP).*

Published framework: [DOI 10.5281/zenodo.17284483](https://zenodo.org/record/17284483)

---

## 🚀 Local Development
```bash
# Clone
git clone https://github.com/dargor1406/VerifAI-CR.git
cd VerifAI-CR

# Backend
cd backend
npm install
# Add GEMINI_API_KEY to Secret Manager or .env.local
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

**Note:** Scoring engine is not included in public repo (proprietary).

---

## 🏆 Built For

**Google Cloud Run Hackathon 2025**  
**Category:** AI Agents  
**Author:** Iván Astigarraga (Paraguay 🇵🇾)  
**ORCID:** [0009-0007-5999-7289](https://orcid.org/0009-0007-5999-7289)

---

## 🤝 Contributing

Contributions welcome for:
- UI/UX improvements
- Additional language support
- Documentation
- Bug reports

*Note: Core scoring algorithm is proprietary and not open for contribution.*


---

## 📄 License

MIT License (application code)  
*Scoring engine (PPM-HAS implementation): All rights reserved*


---

## 📞 Contact

**Email:** ivan@astigarraga.art  
**GitHub:** [@dargor1406](https://github.com/dargor1406)  
**Location:** Paraguay 🇵🇾

---

**Built with ☕ in Paraguay by a photographer who needed proof.**

*"We don't compete with generation. We complete it with verification."*
```

---

## 📝 **LICENSE (Actualizado con IP protection):**
```
MIT License

Copyright (c) 2025 Iván Astigarraga

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

EXCEPTIONS:
- The PPM-HAS scoring engine implementation (core algorithm in backend/engine/)
  is proprietary and NOT covered by this MIT License.
- The methodology framework (PPM-HAS v0.3) is documented under CC BY 4.0
  (see: DOI 10.5281/zenodo.17284483)

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

