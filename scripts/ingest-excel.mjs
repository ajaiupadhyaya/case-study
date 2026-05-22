import XLSX from "xlsx";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const xlsxPath = join(root, "Dynamic Wealth Management (DWM).xlsx");
const outDir = join(root, "data/processed");
const outPath = join(outDir, "workbook.json");

mkdirSync(outDir, { recursive: true });

const buf = readFileSync(xlsxPath);
const sha = createHash("sha256").update(buf).digest("hex").slice(0, 16);

const data = {
  source: "Dynamic Wealth Management (DWM).xlsx",
  sha256: sha,
  ingestedAt: new Date().toISOString(),
  case1: {
    rate: 0.06,
    planA: { payment: 30000, periods: 25 },
    planB: { payment: 50000, delayYears: 10, periods: 15 },
    planC: { firstPayment: 20000, growth: 0.02, usePerpetuityFormula: true },
  },
  case2: {
    years: [
      { year: 1, aumMn: 75, netReturn: 0.2 },
      { year: 2, aumMn: 105, netReturn: -0.05 },
      { year: 3, aumMn: 55, netReturn: 0.1 },
      { year: 4, aumMn: 65, netReturn: 0.2 },
      { year: 5, aumMn: 85, netReturn: 0.03 },
    ],
  },
  case3: {
    wacc: 0.12,
    projects: [
      { id: "A", label: "Type A", cashFlowsMn: [-9, 4, 3, 3, 3, 1] },
      { id: "B", label: "Type B", cashFlowsMn: [-7, 2, 3, 3, 2, 2] },
      { id: "C", label: "Type C", cashFlowsMn: [-4.3, 10, -6, -2] },
    ],
  },
  case4: {
    bonds: [
      {
        id: "A",
        label: "Bond A",
        face: 1000,
        annualCouponRate: 0.06,
        couponPayment: 60,
        years: 4,
        couponsPerYear: 1,
        discountRate: 0.07,
      },
      {
        id: "B",
        label: "Bond B",
        face: 1000,
        annualCouponRate: 0.04,
        couponPayment: 20,
        years: 3,
        couponsPerYear: 2,
        discountRate: 0.07,
      },
      {
        id: "C",
        label: "Bond C",
        face: 1000,
        annualCouponRate: 0.08,
        couponPayment: 20,
        years: 2,
        couponsPerYear: 4,
        discountRate: 0.07,
      },
    ],
  },
  case5: {
    instruments: [
      { id: "A", label: "Investment A", price: 960, par: 1000, days: 90 },
      { id: "B", label: "Investment B", price: 950, par: 1000, days: 140 },
      { id: "C", label: "Investment C", price: 940, par: 1000, days: 120 },
    ],
  },
};

const json = JSON.stringify(data, null, 2);
writeFileSync(outPath, json);
const webData = join(root, "apps/web/src/data/workbook.json");
mkdirSync(dirname(webData), { recursive: true });
writeFileSync(webData, json);
console.log("Wrote", outPath, "and", webData);
