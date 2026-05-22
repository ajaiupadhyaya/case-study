import {
  pvOrdinaryAnnuity,
  pvDelayedAnnuity,
  pvGrowingPerpetuity,
  npv,
  irr,
  bondPrice,
  moneyWeightedReturn,
} from "./quant";
import workbookJson from "@/data/workbook.json";
import macroJson from "@/data/macro.json";

export interface Workbook {
  source: string;
  ingestedAt: string;
  case1: {
    rate: number;
    planA: { payment: number; periods: number };
    planB: { payment: number; delayYears: number; periods: number };
    planC: { firstPayment: number; growth: number };
  };
  case2: { years: { year: number; aumMn: number; netReturn: number }[] };
  case3: {
    wacc: number;
    projects: { id: string; label: string; cashFlowsMn: number[] }[];
  };
  case4: {
    bonds: {
      id: string;
      label: string;
      face: number;
      annualCouponRate: number;
      couponPayment: number;
      years: number;
      couponsPerYear: number;
      discountRate: number;
    }[];
  };
  case5: {
    instruments: { id: string; label: string; price: number; par: number; days: number }[];
  };
}

export interface MacroFile {
  source: string;
  fetchedAt: string;
  series: Record<
    string,
    {
      id: string;
      title: string;
      observations: { date: string; value: number }[];
      sourceUrl?: string;
    }
  >;
}

export function getWorkbook(): Workbook {
  return workbookJson as Workbook;
}

export function getMacro(): MacroFile | null {
  if (!macroJson || !(macroJson as MacroFile).series) return null;
  return macroJson as MacroFile;
}

export function solveCases(wb: Workbook) {
  const r = wb.case1.rate;
  const case1 = {
    rate: r,
    plans: [
      { id: "A", label: "Ordinary annuity ($30k × 25)", pv: pvOrdinaryAnnuity(30000, 25, r) },
      {
        id: "B",
        label: "Delayed annuity ($50k from Y11)",
        pv: pvDelayedAnnuity(50000, 10, 15, r),
      },
      {
        id: "C",
        label: "Growing perpetuity (Excel: $20k, g=2%)",
        pv: pvGrowingPerpetuity(wb.case1.planC.firstPayment, r, wb.case1.planC.growth),
      },
      {
        id: "C15",
        label: "Textbook perpetuity ($15k, g=2%)",
        pv: pvGrowingPerpetuity(15000, r, wb.case1.planC.growth),
      },
    ],
  };
  const winner1 = case1.plans.slice(0, 3).reduce((a, b) => (b.pv > a.pv ? b : a));

  const case2raw = moneyWeightedReturn(wb.case2.years);
  const case2 = {
    ...case2raw,
    years: wb.case2.years,
    twrrHigher: case2raw.twrr > case2raw.mwrr,
  };

  const case3 = wb.case3.projects.map((p) => ({
    ...p,
    npv: npv(p.cashFlowsMn, wb.case3.wacc),
    irr: irr(p.cashFlowsMn),
  }));
  const winner3 = case3.reduce((a, b) => (b.npv > a.npv ? b : a));

  const case4 = wb.case4.bonds.map((b) => {
    const periods = b.years * b.couponsPerYear;
    const rp = b.discountRate / b.couponsPerYear;
    const price = bondPrice(b.couponPayment, periods, rp, b.face);
    const annualCoupon = b.annualCouponRate * b.face;
    return { ...b, price, currentYield: annualCoupon / price, annualCoupon };
  });
  const winner4 = case4.reduce((a, b) => (b.currentYield > a.currentYield ? b : a));

  const case5 = wb.case5.instruments.map((i) => {
    const hpy = (i.par - i.price) / i.price;
    const eay = Math.pow(1 + hpy, 365 / i.days) - 1;
    const mmy = hpy * (360 / i.days);
    return { ...i, hpy, eay, mmy };
  });
  const winner5 = case5.reduce((a, b) => (b.eay > a.eay ? b : a));

  return {
    case1: { ...case1, winner: winner1 },
    case2,
    case3,
    case4,
    case5,
    winner3,
    winner4,
    winner5,
  };
}

export function getDashboardData() {
  const workbook = getWorkbook();
  const macro = getMacro();
  const results = solveCases(workbook);
  return { workbook, macro, results };
}
