import Link from "next/link";
import { getDashboardData } from "@/lib/dwm/data";
import { fmtCurrency, fmtPct } from "@/lib/utils";

const SUMMARIES: Record<number, (r: ReturnType<typeof getDashboardData>["results"]) => string> = {
  1: (r) => `Plan ${r.case1.winner.id} · ${fmtCurrency(r.case1.winner.pv)}`,
  2: (r) => `TWRR ${fmtPct(r.case2.twrr)} vs MWRR ${fmtPct(r.case2.mwrr)}`,
  3: (r) => `${r.winner3.label} · NPV ${r.winner3.npv.toFixed(2)}M`,
  4: (r) => `${r.winner4.label} · CY ${fmtPct(r.winner4.currentYield)}`,
  5: (r) => `${r.winner5.label} · EAY ${fmtPct(r.winner5.eay)}`,
};

const TITLES = [
  "Inheritance annuities",
  "OceanBlue performance",
  "Orion capex",
  "Bond selection",
  "Money market yields",
];

export default function CasesHubPage() {
  const { results } = getDashboardData();

  return (
    <div className="prose-editorial mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl text-navy">Client cases</h1>
      <p className="mt-4 text-muted">Five mandates — workbook-verified recommendations.</p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <li key={n}>
            <Link
              href={`/cases/${n}`}
              className="chart-card block p-6 transition-shadow hover:shadow-md"
            >
              <span className="text-xs font-medium text-gold">Case {n}</span>
              <h2 className="mt-2 font-serif text-xl text-navy">{TITLES[n - 1]}</h2>
              <p className="metric-value mt-3 text-sm">{SUMMARIES[n](results)}</p>
              {n === 1 && (
                <p className="mt-2 text-xs text-muted">Includes Excel vs. brief sensitivity</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
