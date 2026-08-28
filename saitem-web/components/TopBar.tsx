"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import { sonUcSaatiGetir, raceCsvOlustur, dosyaIndir, saatDakikaSaniyeMs } from "@/lib/api";

type TopBarProps = {
  connected: boolean;
  lastUpdateMs: number | null;
  pingMs: number | null;
};

export function TopBar({ connected, lastUpdateMs, pingMs }: TopBarProps) {
  const [exportYukleniyor, setExportYukleniyor] = useState(false);
  const lastUpdate = lastUpdateMs !== null ? saatDakikaSaniyeMs(lastUpdateMs) : "--:--:--.---";

  async function exportEt() {
    setExportYukleniyor(true);
    try {
      const kayitlar = await sonUcSaatiGetir();
      if (kayitlar.length === 0) {
        alert("Son 3 saat icinde kayit bulunamadi.");
        return;
      }
      const csv = raceCsvOlustur(kayitlar);
      const zaman = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      dosyaIndir(`RaceLog_${zaman}.csv`, csv);
    } catch (e) {
      alert("Export hatasi: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setExportYukleniyor(false);
    }
  }

  return (
    <div className="border-b border-[var(--line)] bg-[var(--bg-panel)]">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 sm:px-6 py-3">
        <div className="flex items-center gap-3 sm:gap-8 min-w-0">
          <Logo className="h-6 sm:h-8 w-auto shrink-0" />
          <div className="hidden lg:flex items-center gap-6 text-xs font-mono text-[var(--text-secondary)] whitespace-nowrap">
            <span>
              PING <span className="text-[var(--text-primary)]">{pingMs ?? "--"} ms</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  connected ? "bg-[var(--ok)] pulse-dot" : "bg-[var(--danger)]"
                }`}
              />
              {connected ? "CONNECTED" : "DISCONNECTED"}
            </span>
          </div>
        </div>

        {/* Bu blok her zaman kendi satirina sarabilir (flex-wrap) - dar ekranlarda
            Logo ile yer kavgasina girip disariya tasip gizlenmek yerine alta iner. */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={exportEt}
            disabled={exportYukleniyor}
            className="text-[10px] sm:text-[11px] tracking-wide uppercase font-semibold border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md px-2.5 sm:px-3 py-1.5 whitespace-nowrap"
          >
            {exportYukleniyor ? "Exporting..." : "Export CSV"}
          </button>

          <div className="text-right">
            <div className="text-[10px] tracking-[0.18em] text-[var(--text-dim)] uppercase">
              Last Update
            </div>
            <div className="font-mono text-xs sm:text-sm text-[var(--text-primary)] tabular-nums whitespace-nowrap">
              {lastUpdate}
            </div>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
    </div>
  );
}
