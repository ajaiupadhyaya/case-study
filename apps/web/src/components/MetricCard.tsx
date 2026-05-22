import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={cn("chart-card p-5", className)}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="metric-value mt-2 text-2xl text-navy">{value}</p>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </div>
  );
}
