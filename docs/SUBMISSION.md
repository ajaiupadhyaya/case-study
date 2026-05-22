# Submission Checklist — DWM Case Study

Use this page when packaging work for your instructor.

## Deliverables

| # | Artifact | Location |
|---|----------|----------|
| 1 | Interactive dashboard | https://web-one-ivory-54.vercel.app or `npm run dev` |
| 2 | Submission answer key | https://web-one-ivory-54.vercel.app/submit |
| 3 | PDF investment memo | https://web-one-ivory-54.vercel.app/memo or `memo/main.pdf` |
| 4 | Source workbook | `Dynamic Wealth Management (DWM).xlsx` |
| 5 | Reproducibility | `npm run verify` |

## Case-by-case answers (verified)

### Case 1 — Mr. Thompson (annuities @ 6%)

| Plan | Present value | Notes |
|------|---------------|-------|
| A | $383,501 | Ordinary $30k × 25 |
| B | $271,163 | Delayed $50k from Y11 |
| C (Excel) | **$500,000** | Growing perpetuity, C = $20,000 |
| C (case text) | $375,000 | Sensitivity, C = $15,000 |

**Answer:** **Plan C** per workbook; document Plan A sensitivity if graded from written brief only.

### Case 2 — Brooks / OceanBlue

| Metric | Value |
|--------|-------|
| Money-weighted return | **8.11%** |
| Time-weighted return | **9.16%** |
| Higher | **Time-weighted** |
| CF₀ / CF₁ sanity | −$75M / −$15M ✓ |

### Case 3 — Mercer / Orion (@ 12% WACC)

| Facility | NPV ($M) | IRR |
|----------|----------|-----|
| A | 1.57 | 20.01% |
| B | **1.72** | 21.66% |
| C | −1.58 | N/A |

**Answer:** Accept **Type B**.

### Case 4 — Thompson bonds (@ 7% discount)

| Bond | Price | Current yield |
|------|-------|---------------|
| A | $966.13 | 6.21% |
| B | $920.07 | 4.35% |
| C | $1,018.51 | **7.85%** |

**Answer:** **Bond C** — highest current yield.

### Case 5 — Moore money market

| Inv | HPY | EAY | MMY |
|-----|-----|-----|-----|
| A | 4.17% | 18.00% | 16.67% |
| B | 5.26% | 14.31% | 13.53% |
| C | 6.38% | **20.71%** | 19.15% |

**Answer:** **Investment C**.

## Before you submit

```bash
npm install
npm run prepare:data
npm run memo:pdf
npm run build
```

Confirm `npm run verify` prints the table above.

## What to write in your cover email

> Please find my Applied Financial Math submission for DWM: live dashboard (URL), PDF memo, and GitHub repo. All figures are computed from the provided Excel workbook and verified via `npm run verify`. Macro charts use live FRED data.
