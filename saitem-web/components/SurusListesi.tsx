"use client";

import type { SurusOzeti } from "@/lib/api";

function formatTarihSaat(ts: string) {
  try {
    const d = new Date(ts);
    return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }) + " | " +
      d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return ts;
  }
}

function sureMetni(baslangic: string, bitis: string) {
  const s = new Date(baslangic).getTime();
  const b = new Date(bitis).getTime();
  const dk = Math.max(0, Math.round((b - s) / 60000));
  if (dk < 1) return "< 1 dk";
  if (dk < 60) return `${dk} min`;
  return `${Math.floor(dk / 60)}h ${dk % 60}m`;
}

export function SurusListesi({
  suruslar,
  seciliIndex,
  onSec,
}: {
  suruslar: SurusOzeti[];
  seciliIndex: number | null;
  onSec: (index: number) => void;
}) {
  if (suruslar.length === 0) {
    return (
      <div className="border border-[var(--line)] rounded-md p-8 text-center text-[var(--text-dim)] text-sm">
        No recorded drives yet
      </div>
    );
  }

  return (
    <div className="border border-[var(--line)] rounded-md divide-y divide-[var(--line)] overflow-hidden">
      {suruslar.map((s, i) => (
        <button
          key={s.baslangic}
          onClick={() => onSec(i)}
          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
            seciliIndex === i ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--bg-panel-raised)]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                seciliIndex === i ? "bg-[var(--accent)]" : "bg-[var(--text-dim)]"
              }`}
            />
            <span className="font-mono text-sm text-[var(--text-primary)]">
              {formatTarihSaat(s.baslangic)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--text-dim)] font-mono">
            <span>{sureMetni(s.baslangic, s.bitis)}</span>
            <span className="text-[var(--text-secondary)]">{s.kayitSayisi} records</span>
            <span className="text-[var(--accent)]">{s.maxSpeed.toFixed(1)} km/h max</span>
          </div>
        </button>
      ))}
    </div>
  );
}
