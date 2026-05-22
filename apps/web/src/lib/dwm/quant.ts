/* Quant engine — mirrors packages/quant for Next.js bundle */

export function pvOrdinaryAnnuity(payment: number, periods: number, rate: number) {
  if (rate === 0) return payment * periods;
  return payment * ((1 - Math.pow(1 + rate, -periods)) / rate);
}

export function pvDelayedAnnuity(
  payment: number,
  delayYears: number,
  periods: number,
  rate: number,
) {
  const pvAtDelay = pvOrdinaryAnnuity(payment, periods, rate);
  return pvAtDelay / Math.pow(1 + rate, delayYears);
}

export function pvGrowingPerpetuity(firstPayment: number, rate: number, growth: number) {
  return firstPayment / (rate - growth);
}

export function npv(cashFlows: number[], rate: number) {
  return cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);
}

export function irr(cashFlows: number[], guess = 0.1): number | null {
  const hasPos = cashFlows.some((c) => c > 0);
  const hasNeg = cashFlows.some((c) => c < 0);
  if (!hasPos || !hasNeg) return null;
  let rate = guess;
  for (let i = 0; i < 200; i++) {
    let v = 0,
      d = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const den = Math.pow(1 + rate, t);
      v += cashFlows[t] / den;
      if (t) d -= (t * cashFlows[t]) / (den * (1 + rate));
    }
    const n = rate - v / d;
    if (!Number.isFinite(n) || n <= -0.99) return null;
    if (Math.abs(n - rate) < 1e-9) return n;
    rate = n;
  }
  return rate;
}

export function bondPrice(coupon: number, periods: number, r: number, face: number) {
  let pv = 0;
  for (let i = 1; i <= periods; i++) pv += coupon / Math.pow(1 + r, i);
  return pv + face / Math.pow(1 + r, periods);
}

export function moneyWeightedReturn(
  years: { aumMn: number; netReturn: number }[],
) {
  let end = years[0].aumMn * (1 + years[0].netReturn);
  const cashFlows = [-years[0].aumMn];
  for (let i = 1; i < years.length; i++) {
    cashFlows.push(-(years[i].aumMn - end));
    end = years[i].aumMn * (1 + years[i].netReturn);
  }
  cashFlows.push(end);
  const mwrr = irr(cashFlows) ?? 0;
  const twrr =
    Math.pow(
      years.reduce((p, y) => p * (1 + y.netReturn), 1),
      1 / years.length,
    ) - 1;
  return { cashFlows, mwrr, twrr };
}
