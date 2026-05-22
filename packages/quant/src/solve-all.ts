import {
  pvOrdinaryAnnuity,
  pvDelayedAnnuity,
  pvGrowingPerpetuity,
  pvCashFlows,
} from "./annuities";
import { npv, irr } from "./capital-budgeting";
import { moneyWeightedReturn, timeWeightedReturn } from "./returns";
import { analyzeBond } from "./bonds";
import { analyzeInstrument } from "./money-market";
import type { DwmWorkbookData } from "./types";

export function solveAll(data: DwmWorkbookData) {
  const r = data.case1.rate;

  const planAPv = pvOrdinaryAnnuity(data.case1.planA.payment, data.case1.planA.periods, r);
  const planBPv = pvDelayedAnnuity(
    data.case1.planB.payment,
    data.case1.planB.delayYears,
    data.case1.planB.periods,
    r,
  );
  const planCPvFormula = pvGrowingPerpetuity(
    data.case1.planC.firstPayment,
    r,
    data.case1.planC.growth,
  );

  const case1Plans = [
    { id: "A", label: "Ordinary annuity", pv: planAPv },
    { id: "B", label: "Delayed annuity", pv: planBPv },
    { id: "C", label: "Growing perpetuity", pv: planCPvFormula },
  ];
  const case1Winner = case1Plans.reduce((a, b) => (b.pv > a.pv ? b : a));

  const case2 = moneyWeightedReturn(data.case2.years);
  const twrr = timeWeightedReturn(data.case2.years.map((y) => y.netReturn));

  const case3 = data.case3.projects.map((p) => ({
    ...p,
    npv: npv(p.cashFlowsMn, data.case3.wacc),
    irr: irr(p.cashFlowsMn),
  }));
  const case3Winner = case3.reduce((a, b) => (b.npv > a.npv ? b : a));

  const case4 = data.case4.bonds.map((b) => ({ bond: b, ...analyzeBond(b) }));
  const case4Winner = case4.reduce((a, b) => (b.currentYield > a.currentYield ? b : a));

  const case5 = data.case5.instruments.map((i) => ({
    instrument: i,
    ...analyzeInstrument(i),
  }));
  const case5Winner = case5.reduce((a, b) => (b.eay > a.eay ? b : a));

  return {
    case1: { rate: r, plans: case1Plans, winner: case1Winner },
    case2: { ...case2, twrr, twrrHigher: twrr > case2.mwrr },
    case3: { wacc: data.case3.wacc, projects: case3, winner: case3Winner },
    case4: { bonds: case4, winner: case4Winner },
    case5: { instruments: case5, winner: case5Winner },
  };
}

export type SolveAllResults = ReturnType<typeof solveAll>;
