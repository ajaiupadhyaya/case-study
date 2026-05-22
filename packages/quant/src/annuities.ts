export function pvOrdinaryAnnuity(payment: number, periods: number, rate: number): number {
  if (rate === 0) return payment * periods;
  return payment * ((1 - Math.pow(1 + rate, -periods)) / rate);
}

export function pvDelayedAnnuity(
  payment: number,
  delayYears: number,
  periods: number,
  rate: number,
): number {
  const pvAtDelay = pvOrdinaryAnnuity(payment, periods, rate);
  return pvAtDelay / Math.pow(1 + rate, delayYears);
}

export function pvGrowingPerpetuity(firstPayment: number, rate: number, growth: number): number {
  if (rate <= growth) throw new Error("Discount rate must exceed growth rate for convergent perpetuity");
  return firstPayment / (rate - growth);
}

export function pvCashFlows(cashFlows: number[], rate: number, startPeriod = 1): number {
  return cashFlows.reduce((sum, cf, i) => {
    if (cf === 0) return sum;
    const t = startPeriod + i;
    return sum + cf / Math.pow(1 + rate, t);
  }, 0);
}
