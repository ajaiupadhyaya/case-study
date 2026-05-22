import type { Case5Instrument } from "./types";

export function holdingPeriodYield(par: number, price: number): number {
  return (par - price) / price;
}

export function effectiveAnnualYield(hpy: number, days: number): number {
  return Math.pow(1 + hpy, 365 / days) - 1;
}

export function moneyMarketYield(hpy: number, days: number): number {
  return hpy * (360 / days);
}

export function analyzeInstrument(inst: Case5Instrument) {
  const hpy = holdingPeriodYield(inst.par, inst.price);
  const eay = effectiveAnnualYield(hpy, inst.days);
  const mmy = moneyMarketYield(hpy, inst.days);
  return { hpy, eay, mmy };
}
