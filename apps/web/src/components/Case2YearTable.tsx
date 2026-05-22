import { fmtPct } from "@/lib/utils";

export function Case2YearTable({
  years,
}: {
  years: { year: number; aumMn: number; netReturn: number }[];
}) {
  let end = years[0].aumMn * (1 + years[0].netReturn);
  const rows = years.map((y, idx) => {
    const endVal = y.aumMn * (1 + y.netReturn);
    const row = {
      year: y.year,
      aum: y.aumMn,
      netReturn: y.netReturn,
      endValue: endVal,
      externalFlow: idx === 0 ? null : y.aumMn - end,
    };
    end = endVal;
    return row;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase text-muted">
            <th className="py-2 pr-3">Year</th>
            <th className="py-2 pr-3">AUM ($M)</th>
            <th className="py-2 pr-3">Net return</th>
            <th className="py-2 pr-3">End value ($M)</th>
            <th className="py-2">External flow ($M)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.year} className="border-b border-line">
              <td className="py-3">{r.year}</td>
              <td className="metric-value py-3">{r.aum.toFixed(0)}</td>
              <td className="metric-value py-3">{fmtPct(r.netReturn)}</td>
              <td className="metric-value py-3">{r.endValue.toFixed(2)}</td>
              <td className="metric-value py-3 text-muted">
                {r.externalFlow == null ? "—" : r.externalFlow.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-muted">
        Year 1 HPR check: (90 − 75) / 75 = 20% matches workbook net return.
      </p>
    </div>
  );
}
