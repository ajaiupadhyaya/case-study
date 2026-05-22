import Link from "next/link";
import { getDashboardData } from "@/lib/dwm/data";
import { getSubmissionAnswers } from "@/lib/dwm/submission-summary";
import { fmtCurrency, fmtPct } from "@/lib/utils";

export default function MethodsPage() {
  const { workbook, results } = getDashboardData();
  const answers = getSubmissionAnswers();

  return (
    <div className="prose-editorial mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl text-navy">Methods &amp; Verification</h1>
      <p className="mt-4 text-muted">
        For instructors and graders. See also the{" "}
        <Link href="/submit" className="text-navy underline">
          submission package
        </Link>{" "}
        and{" "}
        <Link href="/submit" className="text-navy underline">
          submission checklist (docs/SUBMISSION.md)
        </Link>
        .
      </p>

      <section className="mt-10 chart-card p-6 font-mono text-sm">
        <h2 className="font-serif text-xl font-sans text-navy">Reproduce all results</h2>
        <pre className="mt-4 overflow-x-auto leading-relaxed text-charcoal">
{`git clone <repo>
cd case-study
npm install
npm run prepare:data   # ingest + FRED + verify
npm run memo:pdf       # LaTeX PDF
npm run dev            # http://localhost:3000`}
        </pre>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-navy">Complete answer key</h2>
        <div className="mt-6 space-y-8">
          {answers.map((a) => (
            <div key={a.caseId} className="border-b border-line pb-6">
              <h3 className="font-serif text-lg text-navy">
                Case {a.caseId}: {a.title}
              </h3>
              <p className="mt-1 text-xs text-muted">{a.method}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {a.questions.map((q, i) => (
                  <li key={i}>
                    <span className="text-muted">{q.prompt}</span>
                    <br />
                    <span className="metric-value font-medium text-navy">{q.answer}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-navy">Grading rubric alignment</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase text-muted">
              <th className="py-2">Requirement</th>
              <th className="py-2">Dashboard</th>
              <th className="py-2">Memo PDF</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Case 1 PV + recommendation", "/cases/1", "§3"],
              ["Case 2 MWRR/TWRR + which higher", "/cases/2", "§4"],
              ["Case 3 NPV/IRR + decision", "/cases/3", "§5"],
              ["Case 4 prices + highest CY", "/cases/4", "§6"],
              ["Case 5 HPY/EAY/MMY + pick", "/cases/5", "§7"],
              ["Macro / interdisciplinary", "/macro", "§8"],
            ].map(([req, dash, memo]) => (
              <tr key={req} className="border-b border-line">
                <td className="py-3">{req}</td>
                <td className="py-3">
                  <Link href={dash} className="text-navy underline">
                    {dash}
                  </Link>
                </td>
                <td className="py-3 text-muted">{memo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-navy">Data provenance</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
          <li>
            <strong>Workbook:</strong> {workbook.source} (ingested {workbook.ingestedAt})
          </li>
          <li>
            <strong>Macro:</strong> FRED public graph CSV — DGS10, DGS2, FEDFUNDS, CPIAUCSL,
            UNRATE, BAMLC0A4CBBBEY
          </li>
          <li>
            <strong>Case 1:</strong> Excel $20k vs. case brief $15k documented on Case 1 and
            /submit
          </li>
          <li>
            <strong>Verification snapshot:</strong> Plan {results.case1.winner.id}{" "}
            {fmtCurrency(results.case1.winner.pv)}; MWRR {fmtPct(results.case2.mwrr)}; TWRR{" "}
            {fmtPct(results.case2.twrr)}
          </li>
        </ul>
      </section>
    </div>
  );
}
