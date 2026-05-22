import type { Case4Bond } from "./types";

export function bondPrice(
  couponPayment: number,
  periods: number,
  ratePerPeriod: number,
  face: number,
): number {
  let pv = 0;
  for (let i = 1; i <= periods; i++) {
    pv += couponPayment / Math.pow(1 + ratePerPeriod, i);
  }
  pv += face / Math.pow(1 + ratePerPeriod, periods);
  return pv;
}

export function analyzeBond(bond: Case4Bond) {
  const periods = bond.years * bond.couponsPerYear;
  const ratePerPeriod = bond.discountRate / bond.couponsPerYear;
  const price = bondPrice(bond.couponPayment, periods, ratePerPeriod, bond.face);
  const annualCoupon = bond.annualCouponRate * bond.face;
  const currentYield = annualCoupon / price;
  return { price, currentYield, annualCoupon, periods, ratePerPeriod };
}
