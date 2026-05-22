import Link from "next/link";
import { AssignmentAnswers } from "@/components/AssignmentAnswers";
import { getSubmissionAnswers } from "@/lib/dwm/submission-summary";
import { getDashboardData } from "@/lib/dwm/data";

export default function SubmitPage() {
  const answers = getSubmissionAnswers();
  const { workbook, macro } = getDashboardData();

  return (
    <div className="prose-editorial mx-auto max-w-6xl px-6 py-12">
      <header className="border-b border-line pb-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
          For instructor review
        </p>
        <h1 className="mt-4 text-4xl text-navy">Submission package</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Applied Financial Math for Decision-Making — Dynamic Wealth Management. This page
          consolidates every required calculation, explicit Q&amp;A, and artifact links.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Interactive dashboard", href: "/", desc: "Cockpit + case studies" },
          { label: "Investment memo (PDF)", href: "/memo", desc: "LaTeX memorandum" },
          { label: "Quant & methods", href: "/methods", desc: "Formulas + verify CLI" },
          { label: "Macro context", href: "/macro", desc: "Live FRED series" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="chart-card block p-4 hover:shadow-md"
          >
            <p className="font-medium text-navy">{item.label}</p>
            <p className="mt-1 text-xs text-muted">{item.desc}</p>
          </Link>
        ))}
      </section>

      <section className="mt-10 chart-card p-6 text-sm">
        <h2 className="font-serif text-lg text-navy">Artifacts &amp; reproducibility</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
          <li>
            <strong>Source data:</strong> {workbook.source} (ingested{" "}
            {new Date(workbook.ingestedAt).toLocaleString()})
          </li>
          <li>
            <strong>Macro:</strong> {macro?.source ?? "—"} (
            {macro ? new Date(macro.fetchedAt).toLocaleDateString() : "run fetch:macro"})
          </li>
          <li>
            <strong>Verify:</strong>{" "}
            <code className="rounded bg-ivory px-1 font-mono text-charcoal">npm run verify</code>
          </li>
          <li>
            <strong>Build memo:</strong>{" "}
            <code className="rounded bg-ivory px-1 font-mono text-charcoal">npm run memo:pdf</code>
          </li>
        </ul>
      </section>

      <div className="mt-14 space-y-2">
        {answers.map((block) => (
          <AssignmentAnswers key={block.caseId} block={block} />
        ))}
      </div>

      <section className="mt-14 rounded bg-navy/5 p-6">
        <h2 className="font-serif text-xl text-navy">Disciplines integrated</h2>
        <ul className="mt-4 grid gap-3 text-sm text-muted md:grid-cols-2">
          <li>
            <strong className="text-charcoal">Mathematics:</strong> Time value, perpetuities,
            IRR/NPV, geometric returns
          </li>
          <li>
            <strong className="text-charcoal">Finance:</strong> Performance measurement, bond
            yields, capital budgeting
          </li>
          <li>
            <strong className="text-charcoal">Economics:</strong> Yield curve, inflation, Fed
            policy (FRED)
          </li>
          <li>
            <strong className="text-charcoal">Political science:</strong> CHIPS Act, trade policy
            (Macro page)
          </li>
          <li>
            <strong className="text-charcoal">Computer science:</strong> Typed quant engine, ETL,
            CI, verified static site
          </li>
        </ul>
      </section>
    </div>
  );
}
