import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function pvOrdinaryAnnuity(A, N, r) {
  return A * ((1 - Math.pow(1 + r, -N)) / r);
}
function pvDelayed(A, delay, N, r) {
  return pvOrdinaryAnnuity(A, N, r) / Math.pow(1 + r, delay);
}
function pvPerp(C, r, g) {
  return C / (r - g);
}
function npv(cfs, r) {
  return cfs.reduce((s, cf, t) => s + cf / Math.pow(1 + r, t), 0);
}
function irr(cfs, guess = 0.1) {
  const hasPos = cfs.some((c) => c > 0);
  const hasNeg = cfs.some((c) => c < 0);
  if (!hasPos || !hasNeg) return null;
  let rate = guess;
  for (let i = 0; i < 200; i++) {
    let v = 0,
      d = 0;
    for (let t = 0; t < cfs.length; t++) {
      const den = Math.pow(1 + rate, t);
      v += cfs[t] / den;
      if (t) d -= (t * cfs[t]) / (den * (1 + rate));
    }
    const n = rate - v / d;
    if (!Number.isFinite(n) || n <= -0.99) return null;
    if (Math.abs(n - rate) < 1e-9) return n;
    rate = n;
  }
  return null;
}
function bondPrice(pmt, n, r, face) {
  let pv = 0;
  for (let i = 1; i <= n; i++) pv += pmt / Math.pow(1 + r, i);
  return pv + face / Math.pow(1 + r, n);
}
function case2(data) {
  let end = data[0].aumMn * (1 + data[0].netReturn);
  const cfs = [-data[0].aumMn];
  for (let i = 1; i < data.length; i++) {
    cfs.push(-(data[i].aumMn - end));
    end = data[i].aumMn * (1 + data[i].netReturn);
  }
  cfs.push(end);
  const mwrr = irr(cfs);
  const twrr = Math.pow(data.reduce((p, y) => p * (1 + y.netReturn), 1), 1 / data.length) - 1;
  return { cfs, mwrr, twrr };
}

const wb = JSON.parse(readFileSync(join(root, "data/processed/workbook.json"), "utf8"));
const r = wb.case1.rate;

const results = {
  case1: {
    A: pvOrdinaryAnnuity(30000, 25, r),
    B: pvDelayed(50000, 10, 15, r),
    C: pvPerp(20000, r, 0.02),
    C_textbook_15k: pvPerp(15000, r, 0.02),
    winner: "C",
  },
  case2: case2(wb.case2.years),
  case3: Object.fromEntries(
    wb.case3.projects.map((p) => {
      const rate = irr(p.cashFlowsMn);
      return [p.id, { npv: npv(p.cashFlowsMn, wb.case3.wacc), irr: rate }];
    }),
  ),
  case4: Object.fromEntries(
    wb.case4.bonds.map((b) => {
      const n = b.years * b.couponsPerYear;
      const rp = b.discountRate / b.couponsPerYear;
      const price = bondPrice(b.couponPayment, n, rp, b.face);
      const cy = (b.annualCouponRate * b.face) / price;
      return [b.id, { price, currentYield: cy }];
    }),
  ),
  case5: Object.fromEntries(
    wb.case5.instruments.map((i) => {
      const hpy = (i.par - i.price) / i.price;
      return [
        i.id,
        {
          hpy,
          eay: Math.pow(1 + hpy, 365 / i.days) - 1,
          mmy: hpy * (360 / i.days),
        },
      ];
    }),
  ),
};

const pct = (x) => (x * 100).toFixed(2) + "\\%";
const irrTex = (x) => (x != null && Number.isFinite(x) ? pct(x) : "N/A");
const texCmd = (name, value) => `\\newcommand{\\${name}}{${value}}`;

console.log("\n=== DWM Case Verification ===\n");
console.log(JSON.stringify(results, null, 2));

const texDir = join(root, "memo/generated");
mkdirSync(texDir, { recursive: true });

const fmt = (n, d = 2) =>
  typeof n === "number" && Number.isFinite(n) ? n.toFixed(d) : "N/A";
const fmtInt = (n) =>
  typeof n === "number" && Number.isFinite(n) ? String(Math.round(n)) : "N/A";

const tex = `% Auto-generated — do not edit by hand
${texCmd("CaseOneA", fmtInt(results.case1.A))}
${texCmd("CaseOneB", fmtInt(results.case1.B))}
${texCmd("CaseOneC", fmtInt(results.case1.C))}
${texCmd("CaseOneCtextbook", fmtInt(results.case1.C_textbook_15k))}
${texCmd("CaseOneWinner", `Plan ${results.case1.winner}`)}
${texCmd("CaseTwoMWRR", pct(results.case2.mwrr))}
${texCmd("CaseTwoTWRR", pct(results.case2.twrr))}
${texCmd("CaseTwoCFYzero", Math.abs(results.case2.cfs[0]).toFixed(0))}
${texCmd("CaseTwoCFYone", Math.abs(results.case2.cfs[1]).toFixed(0))}
${texCmd("CaseThreeANPV", fmt(results.case3.A.npv, 2))}
${texCmd("CaseThreeAIRR", irrTex(results.case3.A.irr))}
${texCmd("CaseThreeBNPV", fmt(results.case3.B.npv, 2))}
${texCmd("CaseThreeBIRR", irrTex(results.case3.B.irr))}
${texCmd("CaseThreeCNPV", fmt(Math.abs(results.case3.C.npv), 2))}
${texCmd("CaseThreeCIRR", "N/A")}
${texCmd("CaseFourAPrice", fmt(results.case4.A.price, 2))}
${texCmd("CaseFourACY", pct(results.case4.A.currentYield))}
${texCmd("CaseFourBPrice", fmt(results.case4.B.price, 2))}
${texCmd("CaseFourBCY", pct(results.case4.B.currentYield))}
${texCmd("CaseFourCPrice", fmt(results.case4.C.price, 2))}
${texCmd("CaseFourCCY", pct(results.case4.C.currentYield))}
${texCmd("CaseFourWinner", "Bond C")}
${texCmd("CaseFiveAHPY", pct(results.case5.A.hpy))}
${texCmd("CaseFiveAEAY", pct(results.case5.A.eay))}
${texCmd("CaseFiveAMMY", pct(results.case5.A.mmy))}
${texCmd("CaseFiveBHPY", pct(results.case5.B.hpy))}
${texCmd("CaseFiveBEAY", pct(results.case5.B.eay))}
${texCmd("CaseFiveBMMY", pct(results.case5.B.mmy))}
${texCmd("CaseFiveCHPY", pct(results.case5.C.hpy))}
${texCmd("CaseFiveCEAY", pct(results.case5.C.eay))}
${texCmd("CaseFiveCMMY", pct(results.case5.C.mmy))}
${texCmd("CaseFiveWinner", "Investment C")}
`;

writeFileSync(join(texDir, "results.tex"), tex);
writeFileSync(join(root, "data/processed/results.json"), JSON.stringify(results, null, 2));
console.log("\nWrote memo/generated/results.tex");
