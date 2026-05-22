import Link from "next/link";
import { getSubmissionAnswers } from "@/lib/dwm/submission-summary";

export function SubmissionBrief() {
  const answers = getSubmissionAnswers();

  return (
    <section className="chart-card border-2 border-navy/20 bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
            Submission package
          </p>
          <h2 className="mt-2 font-serif text-2xl text-navy">Answer key at a glance</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            All five cases solved from{" "}
            <em>Dynamic Wealth Management (DWM).xlsx</em> with reproducible verification.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/submit"
            className="rounded bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90"
          >
            Full submission
          </Link>
          <Link
            href="/memo"
            className="rounded border border-navy px-4 py-2 text-sm font-medium text-navy"
          >
            PDF memo
          </Link>
        </div>
      </div>
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
            <th className="pb-3 pr-4">Case</th>
            <th className="pb-3 pr-4">Primary result</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((a) => (
            <tr key={a.caseId} className="border-b border-line">
              <td className="py-3 font-medium">
                <Link href={`/cases/${a.caseId}`} className="text-navy hover:underline">
                  {a.caseId}
                </Link>
              </td>
              <td className="metric-value py-3 pr-4 text-charcoal">
                {a.questions[a.questions.length - 1]?.answer.slice(0, 80)}
                {(a.questions[a.questions.length - 1]?.answer.length ?? 0) > 80 ? "…" : ""}
              </td>
              <td className="py-3 text-gold">Complete ✓</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
