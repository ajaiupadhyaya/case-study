import { getDashboardData } from "@/lib/dwm/data";
import { fmtCurrency, fmtPct } from "@/lib/utils";

const FORMULAS = [
  {
    name: "Ordinary annuity PV",
    tex: "PV = A · [1 − (1+r)⁻ⁿ] / r",
    case: "Case 1 — Plan A",
  },
  {
    name: "Delayed annuity",
    tex: "PV₀ = PV₁₀ / (1+r)¹⁰, where PV₁₀ is ordinary annuity of 15 payments",
    case: "Case 1 — Plan B",
  },
  {
    name: "Growing perpetuity",
    tex: "PV = C / (r − g),  require r > g",
    case: "Case 1 — Plan C",
  },
  {
    name: "Money-weighted return",
    tex: "IRR({CFₜ}) = 0 — investor cash flows incl. terminal value",
    case: "Case 2",
  },
  {
    name: "Time-weighted return",
    tex: "TWRR = (∏(1+Rₜ))^(1/T) − 1",
    case: "Case 2",
  },
  { name: "NPV", tex: "NPV = Σ CFₜ / (1+WACC)ᵗ", case: "Case 3" },
  { name: "Bond price", tex: "PV = Σ PMT/(1+r)ᵗ + FV/(1+r)ⁿ", case: "Case 4" },
  {
    name: "Effective annual yield",
    tex: "EAY = (1+HPY)^(365/t) − 1",
    case: "Case 5",
  },
];

export default function QuantPage() {
  const { results } = getDashboardData();

  return (
    <div className="prose-editorial mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl text-navy">Quant Lab</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Closed-form and numerical methods implemented in TypeScript — identical logic to{" "}
        <code className="rounded bg-line px-1 font-mono text-sm">pnpm verify</code>.
      </p>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        {FORMULAS.map((f) => (
          <div key={f.name} className="chart-card p-5">
            <p className="text-xs uppercase tracking-wider text-gold">{f.case}</p>
            <h2 className="mt-2 font-serif text-lg text-navy">{f.name}</h2>
            <p className="metric-value mt-3 text-sm text-charcoal">{f.tex}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 chart-card p-6">
        <h2 className="font-serif text-xl text-navy">Verified outputs (workbook)</h2>
        <ul className="mt-4 space-y-2 font-mono text-sm">
          <li>Case 1 winner: Plan {results.case1.winner.id} — {fmtCurrency(results.case1.winner.pv)}</li>
          <li>
            Case 2: MWRR {fmtPct(results.case2.mwrr)} · TWRR {fmtPct(results.case2.twrr)}
          </li>
          <li>
            Case 3: Best NPV — {results.winner3.label} ({results.winner3.npv.toFixed(2)}M)
          </li>
          <li>
            Case 4: Best CY — {results.winner4.label} ({fmtPct(results.winner4.currentYield)})
          </li>
          <li>
            Case 5: Best EAY — {results.winner5.label} ({fmtPct(results.winner5.eay)})
          </li>
        </ul>
      </section>

      <section className="mt-10 border-l-4 border-gold pl-6">
        <h3 className="font-serif text-lg text-navy">CS note</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          IRR via Newton–Raphson on NPV derivative; geometric TWRR from linked sub-period returns.
          Excel ingest SHA-256 hashes the source workbook for reproducibility.
        </p>
      </section>
    </div>
  );
}
