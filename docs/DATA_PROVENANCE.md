# Data Provenance

## Course workbook
- **File:** `Dynamic Wealth Management (DWM).xlsx`
- **Sheets:** Case 1–5
- **Ingest:** `npm run ingest` → `data/processed/workbook.json` + `apps/web/src/data/workbook.json`

## Macro (live)
- **Source:** [FRED public graph CSV](https://fred.stlouisfed.org/graph/fredgraph.csv)
- **Series:** DGS10, DGS2, FEDFUNDS, CPIAUCSL, UNRATE, BAMLC0A4CBBBEY
- **Refresh:** `npm run fetch:macro`

## Policy timeline
- Curated events with primary URLs (Congress.gov, Federal Reserve, White House) — not generated scores.
