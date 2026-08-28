type StatCardProps = {
  label: string;
  value: string;
  unit?: string;
  tone?: "default" | "accent";
};

export function StatCard({ label, value, unit, tone = "default" }: StatCardProps) {
  return (
    <div className="bg-[var(--bg-panel-raised)] border border-[var(--line)] rounded-md px-4 py-3 min-w-[130px]">
      <div className="text-[10px] tracking-[0.18em] text-[var(--text-secondary)] uppercase font-medium">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span
          className={`font-display font-700 text-3xl tabular-nums ${
            tone === "accent" ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
          }`}
        >
          {value}
        </span>
        {unit && <span className="text-sm text-[var(--text-dim)]">{unit}</span>}
      </div>
    </div>
  );
}
