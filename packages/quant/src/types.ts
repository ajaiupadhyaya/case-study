export interface Case1Input {
  rate: number;
  planA: { payment: number; periods: number };
  planB: { payment: number; delayYears: number; periods: number };
  planC: { firstPayment: number; growth: number; usePerpetuityFormula: boolean };
}

export interface Case2Year {
  year: number;
  aumMn: number;
  netReturn: number;
}

export interface Case3Project {
  id: string;
  label: string;
  cashFlowsMn: number[];
  wacc: number;
}

export interface Case4Bond {
  id: string;
  label: string;
  face: number;
  annualCouponRate: number;
  couponPayment: number;
  years: number;
  couponsPerYear: number;
  discountRate: number;
}

export interface Case5Instrument {
  id: string;
  label: string;
  price: number;
  par: number;
  days: number;
}

export interface DwmWorkbookData {
  source: string;
  ingestedAt: string;
  case1: Case1Input;
  case2: { years: Case2Year[] };
  case3: { wacc: number; projects: Case3Project[] };
  case4: { bonds: Case4Bond[] };
  case5: { instruments: Case5Instrument[] };
}
