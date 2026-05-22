import Link from "next/link";
import { getDashboardData } from "@/lib/dwm/data";
import { getSubmissionAnswers } from "@/lib/dwm/submission-summary";

export default function MemoPage() {
  const { workbook } = getDashboardData();
  const answers = getSubmissionAnswers();

  return (
    <div className="prose-editorial mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl text-navy">Investment Memorandum</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Formal LaTeX report aligned with the interactive dashboard and{" "}
        <code className="rounded bg-line px-1 font-mono text-sm">npm run verify</code>. Source
        workbook: {workbook.source}.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="/DWM_Investment_Memo.pdf"
          className="rounded bg-navy px-6 py-3 text-sm font-medium text-white"
          download="DWM_Investment_Memo.pdf"
        >
          Download PDF
        </a>
        <Link
          href="/submit"
          className="rounded border border-navy px-6 py-3 text-sm font-medium text-navy"
        >
          View submission package
        </Link>
      </div>

      <section className="mt-12 chart-card p-6">
        <h2 className="font-serif text-xl text-navy">Memo contents (summary)</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>Executive summary table — all five recommendations</li>
          <li>Case 1 — annuity PVs, Excel vs. brief sensitivity</li>
          <li>Case 2 — MWRR/TWRR with sanity-check cash flows</li>
          <li>Case 3 — NPV/IRR table and Type B acceptance</li>
          <li>Case 4 — bond prices and current yields</li>
          <li>Case 5 — HPY, EAY, MMY for all investments</li>
          <li>Macro appendix and data integrity statement</li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-lg text-navy">Rebuild locally</h2>
        <pre className="mt-3 overflow-x-auto rounded bg-ivory p-4 font-mono text-sm text-charcoal">
{`npm run verify
npm run memo:pdf`}
        </pre>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-lg text-navy">Synced recommendations</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {answers.map((a) => (
            <li key={a.caseId} className="text-muted">
              <strong className="text-charcoal">Case {a.caseId}:</strong> {a.recommendation}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
