import Link from "next/link";
import { notFound } from "next/navigation";
import { getDashboardData } from "@/lib/dwm/data";
import { PvBarChart, CashFlowChart } from "@/components/CaseChart";
import { AssignmentAnswers } from "@/components/AssignmentAnswers";
import { Case1SourceNote } from "@/components/Case1SourceNote";
import { Case2YearTable } from "@/components/Case2YearTable";
import { MetricCard } from "@/components/MetricCard";
import { getSubmissionAnswers } from "@/lib/dwm/submission-summary";
import { fmtCurrency, fmtPct, fmtNum } from "@/lib/utils";

const CASE_META: Record<
  number,
  { title: string; client: string; deck: string; discipline: string }
> = {
  1: {
    title: "Inheritance Annuities",
    client: "Mr. Thompson",
    deck: "Three annuity structures valued at 6% — ordinary, delayed, and growing perpetuity.",
    discipline: "Financial math · Time value of money",
  },
  2: {
    title: "OceanBlue Fund Performance",
    client: "Emma & David Brooks",
    deck: "Money-weighted vs time-weighted returns from workbook AUM and net return series.",
    discipline: "Finance · Performance attribution",
  },
  3: {
    title: "Orion Semiconductor Facility",
    client: "James Mercer, CIO",
    deck: "NPV and IRR for three capex profiles at 12% opportunity cost of capital.",
    discipline: "Corporate finance · Real options context",
  },
  4: {
    title: "Fixed-Income Selection",
    client: "Andrew Thompson",
    deck: "Bond pricing at 7% market discount; highest current yield identification.",
    discipline: "Fixed income · Yield measures",
  },
  5: {
    title: "Money Market Instruments",
    client: "Lisa Moore",
    deck: "HPY, EAY, and MMY for three discount securities.",
    discipline: "Short-term instruments · Annualization",
  },
};

export function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((id) => ({ id: String(id) }));
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const num = parseInt(id, 10);
  if (num < 1 || num > 5) notFound();

  const meta = CASE_META[num];
  const { results } = getDashboardData();
  const answerBlock = getSubmissionAnswers().find((a) => a.caseId === num);

  return (
    <article className="prose-editorial mx-auto max-w-6xl px-6 py-12">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-navy">
          Cockpit
        </Link>
        <span className="mx-2">/</span>
        Case {num}
      </nav>

      <header className="mt-6 border-b border-line pb-10">
        <p className="text-xs uppercase tracking-widest text-gold">{meta.client}</p>
        <h1 className="mt-3 text-4xl text-navy">{meta.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{meta.deck}</p>
        <p className="mt-4 inline-block border-l-2 border-gold pl-4 text-sm italic text-muted">
          {meta.discipline}
        </p>
      </header>

      {num === 1 && <Case1Content results={results} />}
      {num === 2 && <Case2Content results={results} />}
      {num === 3 && <Case3Content results={results} />}
      {num === 4 && <Case4Content results={results} />}
      {num === 5 && <Case5Content results={results} />}

      {answerBlock && <AssignmentAnswers block={answerBlock} />}

      <footer className="mt-14 flex gap-4 border-t border-line pt-8 text-sm">
        {num > 1 && (
          <Link href={`/cases/${num - 1}`} className="text-navy underline">
            ← Case {num - 1}
          </Link>
        )}
        {num < 5 && (
          <Link href={`/cases/${num + 1}`} className="ml-auto text-navy underline">
            Case {num + 1} →
          </Link>
        )}
      </footer>
    </article>
  );
}

function Case1Content({ results }: { results: ReturnType<typeof getDashboardData>["results"] }) {
  const planA = results.case1.plans.find((p) => p.id === "A")!;
  const planB = results.case1.plans.find((p) => p.id === "B")!;
  const planC = results.case1.plans.find((p) => p.id === "C")!;
  const planC15 = results.case1.plans.find((p) => p.id === "C15")!;

  const chartData = [
    { name: "Plan A", pv: planA.pv },
    { name: "Plan B", pv: planB.pv },
    { name: "Plan C (Excel)", pv: planC.pv },
    { name: "C @ $15k", pv: planC15.pv },
  ];

  return (
    <div className="mt-10 space-y-10">
      <blockquote className="border-l-4 border-gold pl-6 font-serif text-xl italic text-navy">
        “I need to know which annuity maximizes the value of my inheritance in today’s dollars.”
        — Mr. Thompson
      </blockquote>
      <div className="chart-card p-6">
        <h2 className="font-serif text-xl">Present value comparison @ 6%</h2>
        <p className="mt-1 text-sm text-muted">Includes textbook $15k sensitivity bar</p>
        <PvBarChart data={chartData} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[planA, planB, planC].map((p) => (
          <MetricCard
            key={p.id}
            label={p.label}
            value={fmtCurrency(p.pv)}
            sub={p.id === results.case1.winner.id ? "Recommended (workbook)" : undefined}
          />
        ))}
      </div>
      <Case1SourceNote
        planA={planA.pv}
        planB={planB.pv}
        planCExcel={planC.pv}
        planCTextbook={planC15.pv}
      />
      <section className="rounded bg-navy/5 p-6">
        <h3 className="font-serif text-lg text-navy">Recommendation</h3>
        <p className="mt-2 leading-relaxed">
          Advise <strong>Plan {results.case1.winner.id}</strong> ({fmtCurrency(results.case1.winner.pv)}
          ) based on the DWM workbook. If the instructor grades from the written case brief only,
          disclose that Plan A ({fmtCurrency(planA.pv)}) would lead under the $15,000 perpetuity
          assumption while Plan C ({fmtCurrency(planC15.pv)}) remains competitive.
        </p>
      </section>
    </div>
  );
}

function Case2Content({ results }: { results: ReturnType<typeof getDashboardData>["results"] }) {
  const cfData = results.case2.cashFlows.map((cf, i) => ({ period: i, cf }));
  return (
    <div className="mt-10 space-y-10">
      <blockquote className="border-l-4 border-gold pl-6 font-serif text-xl italic text-navy">
        “Did our timing of contributions help or hurt us relative to the fund’s pure performance?”
        — Emma &amp; David Brooks
      </blockquote>
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Money-weighted (IRR)" value={fmtPct(results.case2.mwrr)} sub="Investor experience" />
        <MetricCard label="Time-weighted" value={fmtPct(results.case2.twrr)} sub="Manager skill / market" />
      </div>
      <div className="chart-card p-6">
        <h2 className="font-serif text-xl">Workbook inputs</h2>
        <Case2YearTable years={results.case2.years} />
      </div>
      <div className="chart-card p-6">
        <h2 className="font-serif text-xl">Investor cash flows ($M)</h2>
        <p className="text-sm text-muted">Sanity: Y0 = −$75M, Y1 = −$15M per workbook</p>
        <CashFlowChart data={cfData} />
      </div>
      <section className="rounded bg-navy/5 p-6">
        <h3 className="font-serif text-lg text-navy">Finding</h3>
        <p className="mt-2 leading-relaxed">
          TWRR ({fmtPct(results.case2.twrr)}) exceeds MWRR ({fmtPct(results.case2.mwrr)}): contribution
          timing detracted from the Brooks’ realized return versus the fund’s geometrically linked
          sub-period performance.
        </p>
      </section>
    </div>
  );
}

function Case3Content({ results }: { results: ReturnType<typeof getDashboardData>["results"] }) {
  return (
    <div className="mt-10 space-y-10">
      <blockquote className="border-l-4 border-gold pl-6 font-serif text-xl italic text-navy">
        “Which fabrication technology maximizes shareholder value at our 12% hurdle?” — James Mercer
      </blockquote>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase text-muted">
              <th className="py-3 pr-4">Facility</th>
              <th className="py-3 pr-4">NPV ($M)</th>
              <th className="py-3 pr-4">IRR</th>
              <th className="py-3">Cash flows ($M)</th>
            </tr>
          </thead>
          <tbody>
            {results.case3.map((p) => (
              <tr key={p.id} className="border-b border-line">
                <td className="py-4 font-medium">{p.label}</td>
                <td className="metric-value py-4">{fmtNum(p.npv)}</td>
                <td className="metric-value py-4">
                  {p.irr != null && Number.isFinite(p.irr) ? fmtPct(p.irr) : "Non-unique / N/A"}
                </td>
                <td className="metric-value py-4 text-muted">{p.cashFlowsMn.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="rounded bg-navy/5 p-6">
        <h3 className="font-serif text-lg text-navy">Recommendation</h3>
        <p className="mt-2 leading-relaxed">
          Accept <strong>{results.winner3.label}</strong> (NPV {fmtNum(results.winner3.npv)}M @ 12% WACC).
          Type C destroys value (negative NPV) and exhibits non-conventional cash flows — IRR is not
          a reliable decision metric. Policy lens: CHIPS Act and supply-chain resilience support
          domestic semiconductor capex (see Macro page).
        </p>
      </section>
    </div>
  );
}

function Case4Content({ results }: { results: ReturnType<typeof getDashboardData>["results"] }) {
  return (
    <div className="mt-10 space-y-10">
      <blockquote className="border-l-4 border-gold pl-6 font-serif text-xl italic text-navy">
        “I want income now — which bond delivers the highest current yield at today’s prices?”
        — Andrew Thompson
      </blockquote>
      <div className="grid gap-4 md:grid-cols-3">
        {results.case4.map((b) => (
          <MetricCard
            key={b.id}
            label={b.label}
            value={fmtPct(b.currentYield)}
            sub={`Price $${fmtNum(b.price)} · Coupon ${fmtPct(b.annualCouponRate)}`}
          />
        ))}
      </div>
      <section className="rounded bg-navy/5 p-6">
        <h3 className="font-serif text-lg text-navy">Recommendation</h3>
        <p className="mt-2 leading-relaxed">
          <strong>{results.winner4.label}</strong> offers the highest current yield (
          {fmtPct(results.winner4.currentYield)}) at a price of ${fmtNum(results.winner4.price)} with
          7% annual discount rate (semi-annual/quarterly compounding per workbook).
        </p>
      </section>
    </div>
  );
}

function Case5Content({ results }: { results: ReturnType<typeof getDashboardData>["results"] }) {
  return (
    <div className="mt-10 space-y-10">
      <blockquote className="border-l-4 border-gold pl-6 font-serif text-xl italic text-navy">
        “Which money market position maximizes my annualized return?” — Lisa Moore
      </blockquote>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase text-muted">
              <th className="py-3">Instrument</th>
              <th className="py-3">HPY</th>
              <th className="py-3">EAY</th>
              <th className="py-3">MMY</th>
            </tr>
          </thead>
          <tbody>
            {results.case5.map((i) => (
              <tr key={i.id} className="border-b border-line">
                <td className="py-4">{i.label}</td>
                <td className="metric-value py-4">{fmtPct(i.hpy)}</td>
                <td className="metric-value py-4">{fmtPct(i.eay)}</td>
                <td className="metric-value py-4">{fmtPct(i.mmy)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="rounded bg-navy/5 p-6">
        <h3 className="font-serif text-lg text-navy">Recommendation</h3>
        <p className="mt-2 leading-relaxed">
          <strong>{results.winner5.label}</strong> — highest effective annual yield (
          {fmtPct(results.winner5.eay)}).
        </p>
      </section>
    </div>
  );
}
