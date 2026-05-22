import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "data/processed/macro");
const outPath = join(outDir, "fred.json");

mkdirSync(outDir, { recursive: true });

const SERIES = {
  DGS10: "10-Year Treasury Constant Maturity",
  DGS2: "2-Year Treasury Constant Maturity",
  FEDFUNDS: "Effective Federal Funds Rate",
  CPIAUCSL: "Consumer Price Index for All Urban Consumers",
  UNRATE: "Unemployment Rate",
  BAMLC0A4CBBBEY: "ICE BofA BBB US Corporate Index Effective Yield",
};

async function fetchFredCsv(seriesId) {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${seriesId}`;
  const res = await fetch(url, { headers: { Accept: "text/csv" } });
  if (!res.ok) throw new Error(`${seriesId}: HTTP ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split("\n").slice(1);
  const observations = lines
    .map((line) => {
      const [date, val] = line.split(",");
      const value = parseFloat(val);
      if (!date || Number.isNaN(value)) return null;
      return { date, value };
    })
    .filter(Boolean)
    .slice(-60);
  return { id: seriesId, title: SERIES[seriesId] || seriesId, observations, sourceUrl: url };
}

const series = {};
for (const id of Object.keys(SERIES)) {
  try {
    series[id] = await fetchFredCsv(id);
    console.log(`Fetched ${id}: ${series[id].observations.length} points`);
    await new Promise((r) => setTimeout(r, 300));
  } catch (e) {
    console.warn(`Skip ${id}:`, e.message);
  }
}

const payload = {
  source: "FRED public CSV (fred.stlouisfed.org/graph/fredgraph.csv)",
  fetchedAt: new Date().toISOString(),
  series,
};

const json = JSON.stringify(payload, null, 2);
writeFileSync(outPath, json);
const webMacro = join(root, "apps/web/src/data/macro.json");
mkdirSync(dirname(webMacro), { recursive: true });
writeFileSync(webMacro, json);
console.log("Wrote", outPath, "and", webMacro);
