export function npv(cashFlows: number[], rate: number): number {
  return cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);
}

export function irr(cashFlows: number[], guess = 0.1): number | null {
  const hasPositive = cashFlows.some((c) => c > 0);
  const hasNegative = cashFlows.some((c) => c < 0);
  if (!hasPositive || !hasNegative) return null;

  let rate = guess;
  for (let iter = 0; iter < 200; iter++) {
    let value = 0;
    let derivative = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const denom = Math.pow(1 + rate, t);
      value += cashFlows[t] / denom;
      if (t > 0) derivative -= (t * cashFlows[t]) / (denom * (1 + rate));
    }
    if (Math.abs(derivative) < 1e-12) return null;
    const next = rate - value / derivative;
    if (!Number.isFinite(next) || next <= -0.99) return null;
    if (Math.abs(next - rate) < 1e-9) return next;
    rate = next;
  }
  return rate;
}
