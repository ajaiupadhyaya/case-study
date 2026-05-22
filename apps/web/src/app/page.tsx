import Link from "next/link";
import { getDashboardData } from "@/lib/dwm/data";
import { MetricCard } from "@/components/MetricCard";
import { MacroSparkline } from "@/components/CaseChart";
import { SubmissionBrief } from "@/components/SubmissionBrief";
import { fmtCurrency, fmtPct } from "@/lib/utils";

export default function CockpitPage() {
  const { workbook, macro, results } = getDashboardData();

  const cases = [
    {
      n: 1,
      client: "Mr. Thompson",
      topic: "Annuity valuation",
      metric: fmtCurrency(results.case1.winner.pv),
      rec: `Plan ${results.case1.winner.id}`,
    },
    {
      n: 2,
      client: "Emma & David Brooks",
      topic: "OceanBlue returns",
      metric: `TWRR ${fmtPct(results.case2.twrr)}`,
      rec: results.case2.twrrHigher ? "TWRR > MWRR" : "MWRR ≥ TWRR",
    },
    {
      n: 3,
      client: "James Mercer / Orion",
      topic: "Capital budgeting",
      metric: `NPV ${fmtNum(results.winner3.npv)}M`,
      rec: `Facility ${results.winner3.id}`,
    },
    {
      n: 4,
      client: "Andrew Thompson",
      topic: "Bond current yield",
      metric: fmtPct(results.winner4.currentYield),
      rec: `Bond ${results.winner4.id}`,
    },
    {
      n: 5,
      client: "Lisa Moore",
      topic: "Money market yields",
      metric: `EAY ${fmtPct(results.winner5.eay)}`,
      rec: `Investment ${results.winner5.id}`,
    },
  ];

  const dgs10 = macro?.series.DGS10?.observations ?? [];
  const dgs2 = macro?.series.DGS2?.observations ?? [];
  const spread =
    dgs10.length && dgs2.length
      ? dgs10[dgs10.length - 1].value - dgs2[dgs2.length - 1].value
      : null;

  return (
    <div className="prose-editorial mx-auto max-w-6xl px-6 py-12">
      <section className="border-b border-line pb-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
          Dynamic Wealth Management · New York
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl leading-[1.1] text-navy">
          Applied Financial Math for Decision-Making
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Senior Investment Advisor cockpit — five client mandates solved from the DWM
          workbook, contextualized with live FRED macro series. Over{" "}
          <strong className="text-charcoal">$2 billion</strong> in client assets; every
          figure below is computed, not simulated.
        </p>
      </section>

      <section className="mt-10">
        <SubmissionBrief />
      </section>

      {macro && (
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="10Y Treasury (FRED DGS10)"
            value={`${dgs10[dgs10.length - 1]?.value.toFixed(2)}%`}
            sub={`As of ${dgs10[dgs10.length - 1]?.date}`}
          />
          <MetricCard
            label="2s10s spread"
            value={spread != null ? `${spread.toFixed(2)} bps` : "—"}
            sub="Curve shape indicator"
          />
          <MetricCard
            label="Fed Funds (FEDFUNDS)"
            value={`${macro.series.FEDFUNDS?.observations.at(-1)?.value.toFixed(2)}%`}
          />
          <MetricCard
            label="Data refreshed"
            value={new Date(macro.fetchedAt).toLocaleDateString()}
            sub={macro.source.slice(0, 40) + "…"}
          />
        </section>
      )}

      <section className="mt-14">
        <h2 className="text-2xl text-navy">Case completion matrix</h2>
        <p className="mt-2 text-muted">
          Workbook: {workbook.source} · ingested {new Date(workbook.ingestedAt).toLocaleString()}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <Link
              key={c.n}
              href={`/cases/${c.n}`}
              className="chart-card group block p-6 transition-shadow hover:shadow-md"
            >
              <span className="text-xs font-medium text-gold">Case {c.n}</span>
              <h3 className="mt-2 font-serif text-xl text-navy group-hover:underline">
                {c.client}
              </h3>
              <p className="mt-1 text-sm text-muted">{c.topic}</p>
              <p className="metric-value mt-4 text-lg">{c.metric}</p>
              <p className="mt-2 text-sm font-medium text-navy">→ {c.rec}</p>
            </Link>
          ))}
        </div>
      </section>

      {macro && dgs10.length > 0 && (
        <section className="mt-14 chart-card p-6">
          <h2 className="font-serif text-xl text-navy">Live rate context</h2>
          <p className="mt-1 text-sm text-muted">10-Year Treasury — last 60 observations (FRED)</p>
          <div className="mt-4 h-16">
            <MacroSparkline data={dgs10} />
          </div>
        </section>
      )}

      <section className="mt-14 flex flex-wrap gap-4">
        <Link
          href="/quant"
          className="rounded bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy/90"
        >
          Open Quant Lab
        </Link>
        <Link
          href="/macro"
          className="rounded border border-navy px-6 py-3 text-sm font-medium text-navy"
        >
          Macro &amp; Policy
        </Link>
        <Link
          href="/submit"
          className="rounded border border-gold bg-gold/10 px-6 py-3 text-sm font-medium text-navy"
        >
          Submission package
        </Link>
        <Link href="/methods" className="text-sm text-muted underline underline-offset-4">
          Methods &amp; verification
        </Link>
      </section>
    </div>
  );
}

function fmtNum(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
