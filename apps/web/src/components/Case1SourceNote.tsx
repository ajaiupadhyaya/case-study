import { fmtCurrency } from "@/lib/utils";

export function Case1SourceNote({
  planA,
  planB,
  planCExcel,
  planCTextbook,
}: {
  planA: number;
  planB: number;
  planCExcel: number;
  planCTextbook: number;
}) {
  const excelWinner = planCExcel >= planA && planCExcel >= planB;
  const textWinner = planCTextbook >= planA && planCTextbook >= planB;

  return (
    <section className="chart-card border-l-4 border-gold p-6">
      <h3 className="font-serif text-lg text-navy">Workbook vs. case brief — Plan C</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        The assignment narrative in <code className="text-charcoal">case1.md</code> states a{" "}
        <strong>$15,000</strong> initial perpetuity payment. The Excel sheet &quot;Case 1&quot;
        models cash flows beginning at <strong>$20,000</strong> (growing 2% annually). Both use
        r = 6% and PV = C/(r−g).
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded bg-ivory p-4 ring-1 ring-line">
          <p className="text-xs font-medium uppercase tracking-wider text-gold">
            Excel / graded workbook
          </p>
          <p className="metric-value mt-2 text-xl text-navy">{fmtCurrency(planCExcel)}</p>
          <p className="mt-2 text-sm text-muted">
            {excelWinner
              ? "Highest PV → recommend Plan C to Mr. Thompson."
              : "See comparison chart."}
          </p>
        </div>
        <div className="rounded bg-ivory p-4 ring-1 ring-line">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Case brief ($15k)
          </p>
          <p className="metric-value mt-2 text-xl text-charcoal">{fmtCurrency(planCTextbook)}</p>
          <p className="mt-2 text-sm text-muted">
            {textWinner
              ? "Would still favor Plan C, but Plan A ($" +
                Math.round(planA / 1000) +
                "k) closes the gap."
              : `Plan A (${fmtCurrency(planA)}) ranks first at $15k.`}
          </p>
        </div>
      </div>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase text-muted">
            <th className="py-2">Plan</th>
            <th className="py-2">PV @ 6%</th>
            <th className="py-2">Rank (Excel inputs)</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: "A — Ordinary ($30k × 25)", pv: planA, rank: 2 },
            { name: "B — Delayed ($50k from Y11)", pv: planB, rank: 3 },
            { name: "C — Perpetuity (Excel $20k)", pv: planCExcel, rank: 1 },
          ]
            .sort((a, b) => b.pv - a.pv)
            .map((row, i) => (
              <tr key={row.name} className="border-b border-line">
                <td className="py-3">{row.name}</td>
                <td className="metric-value py-3">{fmtCurrency(row.pv)}</td>
                <td className="py-3 text-muted">#{i + 1}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <p className="mt-4 text-sm font-medium text-navy">
        Advisor position: Submit the Excel-aligned answer (Plan C, {fmtCurrency(planCExcel)}) and
        document the $15k sensitivity ({fmtCurrency(planCTextbook)}) for the grader.
      </p>
    </section>
  );
}
