import { getDashboardData } from "@/lib/dwm/data";
import { MacroSparkline } from "@/components/CaseChart";
import { MetricCard } from "@/components/MetricCard";

const POLICY_EVENTS = [
  {
    date: "2024-08",
    title: "CHIPS and Science Act implementation",
    note: "Supports domestic semiconductor capex — relevant to Orion Case 3.",
    source: "https://www.congress.gov/bill/117th-congress/house-bill/4346",
  },
  {
    date: "2025-03",
    title: "FOMC holds rates steady",
    note: "Higher-for-longer regime affects annuity discount rates and bond prices.",
    source: "https://www.federalreserve.gov/monetarypolicy.htm",
  },
  {
    date: "2026-01",
    title: "Trade policy uncertainty",
    note: "Supply-chain risk for tablet semiconductors; diversification rationale for Mercer.",
    source: "https://www.whitehouse.gov/",
  },
];

export default function MacroPage() {
  const { macro } = getDashboardData();
  if (!macro) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p>Run <code>npm run fetch:macro</code> from repo root.</p>
      </div>
    );
  }

  const series = Object.values(macro.series);
  const dgs10 = macro.series.DGS10?.observations ?? [];
  const dgs2 = macro.series.DGS2?.observations ?? [];
  const latest10 = dgs10.at(-1);
  const latest2 = dgs2.at(-1);
  const spread =
    latest10 && latest2 ? (latest10.value - latest2.value).toFixed(2) : "—";

  return (
    <div className="prose-editorial mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl text-navy">Macro &amp; Policy</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Live FRED public CSV series — {macro.source}. Fetched{" "}
        {new Date(macro.fetchedAt).toLocaleString()}.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="10Y yield"
          value={latest10 ? `${latest10.value.toFixed(2)}%` : "—"}
          sub={latest10?.date}
        />
        <MetricCard label="2s10s spread" value={`${spread}%`} sub="Curve slope" />
        <MetricCard
          label="Unemployment"
          value={`${macro.series.UNRATE?.observations.at(-1)?.value.toFixed(1)}%`}
        />
      </div>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        {series.slice(0, 6).map((s) => (
          <div key={s.id} className="chart-card p-5">
            <p className="text-xs font-mono text-muted">{s.id}</p>
            <h2 className="mt-1 font-serif text-lg text-navy">{s.title}</h2>
            <p className="mt-1 text-sm text-muted">
              Latest: {s.observations.at(-1)?.value.toFixed(2)} ({s.observations.at(-1)?.date})
            </p>
            <div className="mt-4 h-20">
              <MacroSparkline data={s.observations} color="#b8956b" />
            </div>
          </div>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl text-navy">Policy timeline</h2>
        <p className="mt-2 text-sm text-muted">Curated events with primary sources — not algorithmic scores.</p>
        <ul className="mt-8 space-y-6">
          {POLICY_EVENTS.map((e) => (
            <li key={e.date} className="border-l-2 border-gold pl-6">
              <time className="text-xs font-medium text-gold">{e.date}</time>
              <h3 className="mt-1 font-serif text-lg text-navy">{e.title}</h3>
              <p className="mt-1 text-muted">{e.note}</p>
              <a
                href={e.source}
                className="mt-2 inline-block text-sm text-navy underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded bg-navy/5 p-6">
        <h3 className="font-serif text-lg text-navy">Economics lens</h3>
        <p className="mt-2 leading-relaxed text-muted">
          When the yield curve steepens (positive 2s10s), long-duration annuities and bonds become
          more sensitive to discount-rate shocks. Fed funds path anchors short-term money market
          yields (Case 5). Inflation (CPI) erodes real value of fixed coupons — relevant to
          Thompson’s bond sleeve (Case 4).
        </p>
      </section>
    </div>
  );
}
