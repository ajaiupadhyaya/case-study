import type { CaseAnswer } from "@/lib/dwm/submission-summary";

export function AssignmentAnswers({ block }: { block: CaseAnswer }) {
  return (
    <section className="chart-card mt-10 border-t-4 border-navy p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-gold">
        Assignment requirements — Case {block.caseId}
      </p>
      <h2 className="mt-2 font-serif text-xl text-navy">{block.title}</h2>
      <p className="mt-2 text-sm text-muted">
        <span className="font-medium text-charcoal">Method:</span> {block.method}
      </p>
      <dl className="mt-6 space-y-4">
        {block.questions.map((q, i) => (
          <div key={i} className="border-b border-line pb-4 last:border-0">
            <dt className="text-sm font-medium text-charcoal">{q.prompt}</dt>
            <dd className="metric-value mt-1 text-base text-navy">{q.answer}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 rounded bg-navy px-4 py-3 text-sm text-white">
        <span className="font-medium">Recommendation:</span> {block.recommendation}
      </div>
    </section>
  );
}
