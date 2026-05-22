import { getDashboardData } from "./data";
import { fmtCurrency, fmtPct, fmtNum } from "@/lib/utils";

export type CaseAnswer = {
  caseId: number;
  title: string;
  questions: { prompt: string; answer: string }[];
  recommendation: string;
  method: string;
};

export function getSubmissionAnswers(): CaseAnswer[] {
  const { results, workbook } = getDashboardData();
  const planA = results.case1.plans.find((p) => p.id === "A")!;
  const planB = results.case1.plans.find((p) => p.id === "B")!;
  const planC = results.case1.plans.find((p) => p.id === "C")!;
  const planC15 = results.case1.plans.find((p) => p.id === "C15")!;

  const cfs = results.case2.cashFlows
    .map((cf, i) => `Y${i}: ${cf >= 0 ? "+" : ""}$${cf.toFixed(2)}M`)
    .join("; ");

  return [
    {
      caseId: 1,
      title: "Mr. Thompson — Annuity Valuation",
      method: "PV ordinary annuity; delayed annuity (discount 10 yrs); growing perpetuity C/(r−g) at r = 6%.",
      questions: [
        {
          prompt: "Present value of Plan A ($30,000 × 25 years)?",
          answer: fmtCurrency(planA.pv),
        },
        {
          prompt: "Present value of Plan B ($50,000 from year 11 for 15 years)?",
          answer: fmtCurrency(planB.pv),
        },
        {
          prompt: "Present value of Plan C (workbook: $20,000 growing 2% perpetuity)?",
          answer: fmtCurrency(planC.pv),
        },
        {
          prompt: "Present value of Plan C (case brief: $15,000 base)?",
          answer: `${fmtCurrency(planC15.pv)} — sensitivity only`,
        },
        {
          prompt: "Which plan should Mr. Thompson choose?",
          answer: `Plan ${results.case1.winner.id} (${fmtCurrency(results.case1.winner.pv)}) per DWM workbook. If graded from written case only, Plan A (${fmtCurrency(planA.pv)}) leads at $15k.`,
        },
      ],
      recommendation: `Advise Plan ${results.case1.winner.id} based on Excel Case 1 sheet.`,
    },
    {
      caseId: 2,
      title: "Emma & David Brooks — OceanBlue Fund",
      method: "MWRR = IRR on investor cash flows; TWRR = geometric mean of annual net returns (workbook).",
      questions: [
        {
          prompt: "Money-weighted rate of return?",
          answer: fmtPct(results.case2.mwrr),
        },
        {
          prompt: "Time-weighted rate of return?",
          answer: fmtPct(results.case2.twrr),
        },
        {
          prompt: "Which return is higher?",
          answer: results.case2.twrrHigher
            ? `Time-weighted (${fmtPct(results.case2.twrr)}) exceeds money-weighted (${fmtPct(results.case2.mwrr)}).`
            : "Money-weighted is higher.",
        },
        {
          prompt: "Sanity check — cash flows Years 0 and 1?",
          answer: `Y0 = $${results.case2.cashFlows[0].toFixed(0)}M; Y1 = $${results.case2.cashFlows[1].toFixed(0)}M (matches −$75M / −$15M). Full series: ${cfs}`,
        },
      ],
      recommendation:
        "Explain to clients that manager performance (TWRR) exceeded their dollar-weighted experience (MWRR) due to contribution timing.",
    },
    {
      caseId: 3,
      title: "James Mercer — Orion Technologies Capex",
      method: `NPV and IRR at WACC = ${(workbook.case3.wacc * 100).toFixed(0)}% from Orion financial reports.`,
      questions: results.case3.map((p) => ({
        prompt: `${p.label} — NPV ($M) and IRR?`,
        answer: `NPV = ${fmtNum(p.npv)}M; IRR = ${
          p.irr != null && Number.isFinite(p.irr) ? fmtPct(p.irr) : "N/A (non-conventional flows)"
        }`,
      })),
      recommendation: `Accept ${results.winner3.label} — highest NPV (${fmtNum(results.winner3.npv)}M). Reject Type C (negative NPV).`,
    },
    {
      caseId: 4,
      title: "Andrew Thompson — Bond Analysis",
      method: "Bond price via discounted coupons + par @ 7%; current yield = annual coupon / price.",
      questions: results.case4.flatMap((b) => [
        {
          prompt: `${b.label} — price at 7% discount?`,
          answer: `$${fmtNum(b.price)}`,
        },
        {
          prompt: `${b.label} — current yield?`,
          answer: fmtPct(b.currentYield),
        },
      ]).concat([
        {
          prompt: "Which bond has the highest current yield?",
          answer: `${results.winner4.label} at ${fmtPct(results.winner4.currentYield)}`,
        },
      ]),
      recommendation: `Purchase ${results.winner4.label} for maximum current income at stated market discount.`,
    },
    {
      caseId: 5,
      title: "Lisa Moore — Money Market Instruments",
      method: "HPY = (Par − Price)/Price; EAY = (1+HPY)^(365/t)−1; MMY = HPY × (360/t).",
      questions: results.case5.flatMap((i) => [
        {
          prompt: `${i.label} — HPY / EAY / MMY?`,
          answer: `${fmtPct(i.hpy)} / ${fmtPct(i.eay)} / ${fmtPct(i.mmy)}`,
        },
      ]).concat([
        {
          prompt: "Which investment should Lisa choose?",
          answer: `${results.winner5.label} — highest EAY (${fmtPct(results.winner5.eay)})`,
        },
      ]),
      recommendation: `Recommend ${results.winner5.label} for liquidity deployment over ${results.case5.length - 1} alternatives.`,
    },
  ];
}
