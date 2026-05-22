# DWM Case Study — Complete Implementation Plan

**Audience:** Instructor / grader  
**Design:** Modern private bank × editorial magazine  
**Data policy:** No fabricated or synthetic market series. Assignment-stated cash flows and parameters are authoritative; live series come from public APIs with provenance labels.  
**Scope:** Executive cockpit (A) + Quant lab (B) + Macro & policy (C) + Client journey (D) + LaTeX investment memo  

---

## 1. Case inventory (what must be solved and shown)

| Case | Client / entity | Core math | Deliverable on dashboard | Memo section |
|------|-----------------|-----------|--------------------------|--------------|
| **1** | Mr. Andrew/Mr. Thompson — inheritance annuities | PV ordinary annuity; PV delayed annuity (discount from Y10); growing perpetuity \(PV = C/(r-g)\) | Side-by-side PV bars, payment timeline, recommendation | §2.1 Annuity valuation |
| **2** | Emma & David Brooks — OceanBlue Fund | Money-weighted (IRR on cash flows); time-weighted (geometric link of HPRs) | Cash-flow waterfall, MWRR vs TWRR, period returns | §2.2 Fund performance |
| **3** | James Mercer — Orion Technologies capex | NPV @ 12% WACC; IRR per facility type | Cash-flow table, NPV/IRR comparison, accept/reject | §2.3 Capital budgeting |
| **4** | Andrew Thompson — bonds A/B/C | Bond PV @ 7%; current yield | Price vs par, yield comparison, duration intuition | §2.4 Fixed income |
| **5** | Lisa Moore — money market (in `case4.md`) | HPY, EAY, MMY | Yield ladder, best-instrument call | §2.5 Money markets |

**Inputs you must supply (blocking for Cases 2 & 3):**  
Course Excel workbook referenced in tips (`Case 1`–`Case 4` sheets). OceanBlue AUM, annual returns, and Orion facility cash flows are **not** in the repo yet. Plan assumes:

1. You add `data/source/course-workbook.xlsx` (or export each sheet to CSV under `data/source/`).
2. A one-time ingest script parses those sheets into versioned JSON (`data/processed/*.json`) with SHA and import timestamp—still “real” assignment data, not generated numbers.

**OceanBlue note:** No public ticker matches “OceanBlue Fund” from the case. MWRR/TWRR will be computed from **course cash flows** (sanity check: Y0 = −$75M, Y1 = −$15M per case2.md). Optional **benchmark** panel may show a real mutual fund (user picks ticker) clearly labeled *“illustrative peer, not OceanBlue.”*

---

## 2. Recommended architecture

```
case-study/
├── apps/
│   └── web/                    # Next.js 15 (App Router), dashboard UI
├── packages/
│   ├── quant/                  # Pure TS: annuities, IRR/NPV, bonds, MMY — unit-tested
│   └── types/                  # Shared schemas (Zod)
├── scripts/
│   ├── ingest-excel.ts         # xlsx → processed JSON
│   ├── fetch-macro.ts          # FRED + Treasury → cache
│   └── verify-cases.ts         # CLI prints all case answers vs Excel
├── data/
│   ├── source/                 # Your Excel/CSV (gitignored if large)
│   └── processed/              # Parsed case inputs + API cache metadata
├── memo/
│   ├── main.tex                # Master investment memo (pdfLaTeX or latexmk)
│   ├── sections/               # case1.tex … case5.tex, macro.tex, appendix.tex
│   └── figures/                # Exported SVG/PNG from dashboard build
└── docs/
    ├── IMPLEMENTATION_PLAN.md  # This file
    ├── DATA_PROVENANCE.md      # API endpoints, series IDs, refresh policy
    └── GRADING_MAP.md          # Rubric ↔ UI ↔ memo crosswalk for grader
```

**Why this stack**

| Layer | Choice | Rationale |
|-------|--------|-----------|
| UI | **Next.js 15** + TypeScript + Tailwind + shadcn/ui | Deployable, polished editorial layouts, SSR for memo PDF links |
| Charts | **Recharts** + light **D3** (yield curve, timelines) | Accessible, print-friendly exports for LaTeX |
| Quant | **`packages/quant`** in TypeScript | Reproducible, tested, same code powers UI + memo numbers |
| Verify | **`scripts/verify-cases.ts`** | Grader can run `pnpm verify` and see exact outputs |
| Memo | **LaTeX** (`memo/main.tex`) | Academic standard; `\input` auto-generated results from verify script |
| Macro | **FRED API** + **U.S. Treasury** XML/JSON | Real rates, inflation, policy context |
| Deploy | **Vercel** (web) + **GitHub Actions** (latexmk artifact) | Preview URL for submission |

**Environment variables** (`.env.example` only; secrets gitignored):

- `FRED_API_KEY` — https://fred.stlouisfed.org/docs/api/api_key.html  
- Optional: `ALPHA_VANTAGE_KEY` or use **Stooq/yfinance** in CI only if needed for benchmark fund  

---

## 3. Real-data policy (strict)

| Data type | Source | Never |
|-----------|--------|-------|
| Case 1–5 parameters | `case*.md` + Excel ingest | Random PVs or invented cash flows |
| Discount / WACC rates | Case text (6%, 7%, 12%) + live curve *for context only* | Replacing case rates with live rates in graded calcs |
| Macro series | FRED (`DGS10`, `FEDFUNDS`, `CPIAUCSL`, `UNRATE`, `BAA10Y`, etc.) | Interpolated fake GDP |
| Yield curve | Treasury.gov or FRED constant maturity | Hand-drawn curves |
| Politics / policy | FRED + public event calendar (Fed meetings, CPI releases) + **annotated** geopolitical risk tags (human-written, sourced to Reuters/Fed minutes links) | Fabricated “risk scores” without citation |
| DWM firm AUM ($2B) | README narrative only in copy | Fake live AUM ticker |

**Caching:** API responses stored under `data/processed/macro/` with `fetchedAt` and `seriesId`. Dashboard shows “as of” timestamps.

---

## 4. Dashboard information architecture (A + B + C + D)

### 4.1 Shell — Executive cockpit (A)

- **Hero:** DWM positioning (NYC, $2B narrative from README)—editorial typography, no fake performance.
- **Case completion matrix:** 5 cases → status, key metric, link to detail.
- **Live macro strip:** 10Y yield, Fed funds, CPI YoY, credit spread (BAA − 10Y)—all FRED, sparklines 5Y.
- **Advisor KPIs (derived only):** e.g. “highest PV annuity,” “OceanBlue TWRR,” “Orion project selected”—from `quant` outputs.

### 4.2 Quant lab (B)

- **Toolkit page:** Formula cards (LaTeX-rendered via KaTeX) matching case formulas.
- **Interactive sensitivity:** Sliders on *r*, *g*, *N* for Case 1 (shows impact on PV)—still uses case base parameters as defaults.
- **IRR/NPV explorer:** Case 3 facilities overlay.
- **Bond calculator:** Case 4 prices/yields; optional live Treasury comparison chart.
- **Return decomposition:** Case 2 MWRR vs TWRR waterfall + geometric mean linkage table.

### 4.3 Macro & policy (C)

- **Regime board:** Yield curve shape (2s10s spread), real rate proxy, inflation trend.
- **Allocation implications:** Static editorial copy tying regime to **general** FI/equity stance—not fake client trades.
- **Policy timeline:** Fed decision dates, major fiscal/regulatory markers (JSON curated list with URLs—no synthetic events).
- **Geopolitics panel:** Sector exposure *framework* (semiconductors ↔ Case 3 Orion)—sourced footnotes, not a black-box “AI risk index.”

### 4.4 Client journey (D)

One scroll narrative per case (magazine sections):

1. **Thompson** — inheritance → three annuities → PV comparison → recommendation card.  
2. **Brooks** — retirement goal → OceanBlue analysis → MWRR vs TWRR insight (“timing vs manager skill”).  
3. **Mercer / Orion** — capex story → NPV/IRR table → facility choice.  
4. **Thompson (bonds)** — income need → bond prices/yields → highest current yield.  
5. **Moore** — liquidity → HPY/EAY/MMY table → pick.

Each section: client quote (fictional dialogue OK), **computed** numbers, chart, “Advisor note” callout.

### 4.5 Navigation

```
/                 → Cockpit (A)
/cases/[1-5]      → Client journey detail (D)
/quant            → Quant lab (B)
/macro            → Macro & policy (C)
/memo             → Embedded PDF + download
/methods          → Grader appendix (tests, data sources, verify CLI)
```

---

## 5. Visual design system

**Tone:** Modern private bank × editorial magazine (Monocle / FT Weekend, not Bloomberg terminal).

| Token | Value |
|-------|--------|
| Background | Warm ivory `#F7F4EF` |
| Primary text | Charcoal `#1C1B19` |
| Accent | Deep navy `#0F2744`, muted gold `#B8956B` |
| Serif (headlines) | **Fraunces** or **Newsreader** |
| Sans (body/UI) | **Source Sans 3** |
| Mono (figures) | **IBM Plex Mono** |

**Layout patterns**

- Full-bleed hero with serif headline + subdeck.
- Case studies: asymmetric two-column, pull quotes, figure captions like magazine cutlines.
- Charts: minimal grid, direct labels, print-safe palette.
- Dark mode: optional Phase 7—not required for v1.

**Accessibility:** WCAG AA contrast, table alternatives for every chart, keyboard nav on case tabs.

---

## 6. LaTeX investment memo structure

**File:** `memo/main.tex` — class `article` or `KOMA-scrartcl`, 11pt, `geometry`, `booktabs`, `siunitx`, `hyperref`.

| Section | Content |
|---------|---------|
| Executive summary | DWM role, five cases, unified recommendations |
| Case 1–5 | Problem → method → results → recommendation (numbers from `verify-cases` via `\input{generated/results.tex}`) |
| Macro appendix | Yield curve snapshot (date-stamped figure from FRED) |
| Quant appendix | Key formulas (same as case*.md) |
| Data & ethics | Provenance, limitations (OceanBlue fictional fund, etc.) |

**Build pipeline**

1. `pnpm verify` → writes `memo/generated/results.tex` + `memo/generated/macros.tex`.  
2. `latexmk -pdf memo/main.tex` → `memo/build/DWM_Investment_Memo.pdf`.  
3. CI artifact + `/memo` route serves PDF.

---

## 7. Phased build schedule (complete finish)

### Phase 0 — Repository foundation (½ day)

- [ ] Init monorepo: `pnpm` workspaces, ESLint, Prettier, TypeScript strict.
- [ ] Add `case*.md` as source of truth constants (rates, face values).
- [ ] `.env.example`, `DATA_PROVENANCE.md`, `GRADING_MAP.md`.
- [ ] **You:** Place course Excel in `data/source/`.

### Phase 1 — Quant engine & verification (1 day)

- [ ] `packages/quant`: `pvOrdinaryAnnuity`, `pvDelayedAnnuity`, `pvGrowingPerpetuity`, `irr`, `npv`, `bondPrice`, `currentYield`, `hpy`, `eay`, `mmy`, `moneyWeightedReturn`, `timeWeightedReturn`.
- [ ] Unit tests with **closed-form expected values** from case formulas (Case 1 @ 6%: compute once, lock in snapshots).
- [ ] `scripts/ingest-excel.ts` → Case 2/3 cash flow JSON.
- [ ] `scripts/verify-cases.ts` → terminal table + `memo/generated/results.tex`.
- [ ] **Gate:** All case outputs match Excel sheets to ≥4 decimal places.

### Phase 2 — Macro data pipeline (½ day)

- [ ] `scripts/fetch-macro.ts` — FRED series → cached JSON.
- [ ] Treasury yield curve fetch (or FRED `DGS*` series).
- [ ] Dashboard “as of” metadata component.
- [ ] **Gate:** No network → dashboard shows stale cache with warning, not fake live data.

### Phase 3 — Web app shell & design system (1 day)

- [ ] Next.js app: layout, typography, nav, editorial components (`CaseHero`, `PullQuote`, `MetricCard`, `ProvenanceBadge`).
- [ ] Cockpit page (A) with case matrix + macro strip (live).
- [ ] `/methods` grader page: how to run verify, test coverage badge.

### Phase 4 — Client journey modules (1.5 days)

- [ ] `/cases/1` … `/cases/5` — full D sections with charts tied to `quant`.
- [ ] Export chart PNG/SVG hooks for LaTeX figures (Phase 6).

### Phase 5 — Quant lab + macro pages (1 day)

- [ ] `/quant` — formulas, Case 1 sensitivity, Case 3/4/5 tools, Case 2 MWRR/TWRR viz.
- [ ] `/macro` — yield curve, spreads, policy timeline, Orion/semiconductor policy note (C).

### Phase 6 — LaTeX memo (1 day)

- [ ] Write `memo/sections/*.tex` (prose + discipline integration).
- [ ] Auto-generated results injection.
- [ ] `latexmk` in CI; PDF linked from app.

### Phase 7 — Integration, polish, submission (1 day)

- [ ] Cross-link memo ↔ dashboard numbers (single source: `quant`).
- [ ] README: setup, verify, dev, deploy, grade map.
- [ ] Lighthouse + a11y pass.
- [ ] Deploy Vercel; record preview URL in README.
- [ ] Optional: Playwright smoke test (each case page renders key metric).

**Total estimate:** ~6–7 focused days (phased; can parallelize Phase 4/5 after Phase 1 gates).

---

## 8. Discipline integration (tasteful, grader-visible)

| Discipline | Where it appears |
|------------|------------------|
| **Math** | KaTeX on `/quant` + memo appendix; geometric mean, perpetuity convergence note \(r > g\) |
| **Finance** | All five cases; MWRR vs TWRR interpretation; bond yield vs YTM distinction footnote |
| **Economics** | Macro page: Taylor-rule intuition, yield curve inversion commentary, inflation and real rates |
| **Political science / policy** | Fed/fiscal timeline, CHIPS Act ↔ Orion Case 3 sidebar (cited sources) |
| **CS** | Monorepo, typed quant lib, tests, ETL scripts, API caching, CI—documented on `/methods` |

Avoid clutter: one “discipline lens” callout per case page, not lecture notes.

---

## 9. Pre-computed expected results (Case 1 @ 6% — for Phase 1 tests)

Use these as regression targets (recompute in Phase 1 to confirm):

| Plan | Model | Approx. PV @ 6% |
|------|--------|-----------------|
| 1 | $30k × 25 ordinary | ~$383,500 |
| 2 | $50k × 15 from Y11 (PV@Y10 ≈ $485.5k, ÷ 1.06¹⁰) | ~$271,200 |
| 3 | $15k growing @ 2% perpetuity | $375,000 (= 15,000 / 0.04) |

**Recommendation (Case 1):** Plan 1 (highest PV) unless Excel rounding differs—verify against your sheet in Phase 1 gate tests.

Cases 2–5: locked after Excel ingest.

---

## 10. Grader checklist (`docs/GRADING_MAP.md` preview)

- [ ] `pnpm verify` reproduces memo numbers  
- [ ] Each case page shows method + result + recommendation  
- [ ] Macro charts cite FRED series IDs and dates  
- [ ] No synthetic market data (policy documented)  
- [ ] PDF memo builds in CI  
- [ ] MWRR/TWRR match Case 2 sheet; sanity checks Y0/Y1  

---

## 11. Immediate next actions (start Phase 0)

1. **Confirm:** Add course Excel to `data/source/` (or paste Case 2/3 cash-flow tables here).  
2. **Approve:** This plan + monorepo scaffold (I can begin Phase 0–1 in repo on your go).  
3. **Optional:** Benchmark mutual fund ticker for Case 2 comparison panel only.

---

## 12. Definition of done

Project is **complete** when:

1. All five cases solved, tested, and visible on dashboard client journeys.  
2. Cockpit, Quant lab, Macro, and Methods pages live with real macro data.  
3. `DWM_Investment_Memo.pdf` builds from LaTeX with auto-synced figures and results.  
4. README enables grader to run verify + open deployed dashboard in &lt;10 minutes.  
5. Design matches modern private bank / editorial brief without fabricated portfolio data.
