# Dynamic Wealth Management — Case Study

**Applied Financial Math for Decision-Making** — Senior Investment Advisor submission with verified workbook solutions, interactive dashboard, and LaTeX investment memo.

## Submit to your instructor

| Deliverable | Link |
|-------------|------|
| **Live dashboard** | https://web-one-ivory-54.vercel.app |
| **Submission package (all answers)** | https://web-one-ivory-54.vercel.app/submit |
| **PDF memorandum** | https://web-one-ivory-54.vercel.app/memo |
| **Checklist for packaging** | [docs/SUBMISSION.md](docs/SUBMISSION.md) |

## Verified results (workbook)

| Case | Answer |
|------|--------|
| 1 — Thompson | **Plan C** — PV **$500,000** (Excel); see $15k sensitivity on Case 1 |
| 2 — Brooks / OceanBlue | **TWRR 9.16%** > **MWRR 8.11%** |
| 3 — Mercer / Orion | **Type B** — NPV **$1.72M** @ 12% |
| 4 — Thompson bonds | **Bond C** — CY **7.85%**, price **$1,018.51** |
| 5 — Moore | **Investment C** — EAY **20.71%** |

## Quick start

```bash
npm install
npm run prepare:data   # ingest Excel + FRED + verify
npm run memo:pdf       # build LaTeX PDF
npm run dev            # http://localhost:3000
```

Reproduce numbers: `npm run verify`

## Project structure

- `apps/web` — Next.js dashboard (cockpit, cases, quant, macro, submit, memo)
- `packages/quant` — Financial math library
- `scripts/` — Excel ingest, FRED fetch, verification
- `memo/` — LaTeX investment memorandum
- `docs/` — [SUBMISSION.md](docs/SUBMISSION.md), [GRADING_MAP.md](docs/GRADING_MAP.md), [DATA_PROVENANCE.md](docs/DATA_PROVENANCE.md)

## Data policy

- **Workbook** = authoritative case inputs (`Dynamic Wealth Management (DWM).xlsx`)
- **Macro** = live FRED public CSV (no synthetic rates)
- **No fabricated** client portfolio performance

## Deploy (Vercel)

Set **Root Directory** to `apps/web`. Production: https://web-one-ivory-54.vercel.app

Before pushing, refresh data: `npm run prepare:data`
