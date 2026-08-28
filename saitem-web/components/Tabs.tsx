"use client";

type TabsProps = {
  active: string;
  onChange: (id: string) => void;
  items: { id: string; label: string }[];
};

export function Tabs({ active, onChange, items }: TabsProps) {
  return (
    <div className="flex gap-1 border-b border-[var(--line)] px-3 sm:px-6 bg-[var(--bg-panel)] overflow-x-auto">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`relative px-3 sm:px-4 py-3 text-[11px] sm:text-xs tracking-[0.14em] uppercase font-medium transition-colors whitespace-nowrap shrink-0 ${
            active === item.id
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-dim)] hover:text-[var(--text-secondary)]"
          }`}
        >
          {item.label}
          {active === item.id && (
            <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[var(--accent)]" />
          )}
        </button>
      ))}
    </div>
  );
}
