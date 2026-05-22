import type { Case2Year } from "./types";

export function holdingPeriodReturn(endValue: number, beginValue: number): number {
  return (endValue - beginValue) / beginValue;
}

export function timeWeightedReturn(netReturns: number[]): number {
  const product = netReturns.reduce((p, r) => p * (1 + r), 1);
  return Math.pow(product, 1 / netReturns.length) - 1;
}

/** Money-weighted return (IRR) from OceanBlue-style AUM & return series; investments at beginning of year. */
export function moneyWeightedReturn(years: Case2Year[]): {
  cashFlows: number[];
  mwrr: number;
  periodReturns: number[];
} {
  if (years.length === 0) throw new Error("No years provided");

  const periodReturns: number[] = [];
  let endValue = years[0].aumMn * (1 + years[0].netReturn);
  periodReturns.push(years[0].netReturn);

  const cashFlows: number[] = [-years[0].aumMn];

  for (let i = 1; i < years.length; i++) {
    const contribution = years[i].aumMn - endValue;
    cashFlows.push(-contribution);
    endValue = years[i].aumMn * (1 + years[i].netReturn);
    periodReturns.push(years[i].netReturn);
  }

  cashFlows.push(endValue);

  const mwrr = irrNewton(cashFlows);
  return { cashFlows, mwrr, periodReturns };
}

function irrNewton(cashFlows: number[]): number {
  let rate = 0.08;
  for (let iter = 0; iter < 200; iter++) {
    let value = 0;
    let derivative = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const denom = Math.pow(1 + rate, t);
      value += cashFlows[t] / denom;
      if (t > 0) derivative -= (t * cashFlows[t]) / (denom * (1 + rate));
    }
    const next = rate - value / derivative;
    if (Math.abs(next - rate) < 1e-9) return next;
    rate = next;
  }
  return rate;
}
