import { saatDakikaSaniyeMs, kayitZamaniMs, type TelemetriKaydi } from "@/lib/api";

// elapsed_ms (milisaniye) -> "dk:sn.milisaniye" okunakli formatina cevirir
function formatElapsed(ms: number) {
  if (!Number.isFinite(ms) || ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const dk = Math.floor(totalSec / 60);
  const sn = totalSec % 60;
  const msKalan = Math.floor(ms % 1000);
  return `${String(dk).padStart(2, "0")}:${String(sn).padStart(2, "0")}.${String(msKalan).padStart(3, "0")}`;
}

// Gercek zamani saat:dakika:saniye.milisaniye (16:33:32.481) formatinda gosterir.
function formatTimestamp(kayit: TelemetriKaydi) {
  const ms = kayitZamaniMs(kayit);
  if (isNaN(ms)) return kayit.timestamp || "-";
  return saatDakikaSaniyeMs(ms);
}

export function LiveTable({ kayitlar, baslik = "Live Telemetry Feed" }: { kayitlar: TelemetriKaydi[]; baslik?: string }) {
  const gecikmeliVar = kayitlar.some((k) => k.gecikti);

  return (
    <div className="border border-[var(--line)] rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--line)] bg-[var(--bg-panel-raised)]">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 bg-[var(--accent)] rounded-full" />
          <span className="text-xs tracking-[0.18em] uppercase text-[var(--text-secondary)] font-medium">
            {baslik}
          </span>
        </div>
        {gecikmeliVar && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--warn)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--warn)]" />
            Records arrived in a batch after a connection gap
          </div>
        )}
      </div>
      <div className="overflow-x-auto max-h-[420px]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[var(--bg-panel)] text-[10px] uppercase tracking-wider text-[var(--text-dim)]">
            <tr>
              <th className="text-left font-medium px-4 py-2">Clock (H:M:S.ms)</th>
              <th className="text-left font-medium px-4 py-2">Elapsed</th>
              <th className="text-right font-medium px-4 py-2">Speed (km/h)</th>
              <th className="text-right font-medium px-4 py-2">Battery (%)</th>
              <th className="text-right font-medium px-4 py-2">Current (A)</th>
              <th className="text-right font-medium px-4 py-2">Voltage (V)</th>
              <th className="text-right font-medium px-4 py-2">Temp (°C)</th>
              <th className="text-right font-medium px-4 py-2 hidden sm:table-cell">Energy (Wh)</th>
              <th className="text-right font-medium px-4 py-2 hidden md:table-cell">Seq</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {kayitlar.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-[var(--text-dim)] py-8">
                  No data yet
                </td>
              </tr>
            )}
            {kayitlar.map((k, i) => (
              <tr
                key={k.id ? `${k.id}-${k.sequenceNo}-${i}` : i}
                className={`border-t border-[var(--line)]/60 transition-colors ${
                  k.gecikti
                    ? "bg-[var(--warn)]/[0.07] hover:bg-[var(--warn)]/[0.12]"
                    : "hover:bg-[var(--bg-panel-raised)]/60"
                }`}
              >
                <td className={`px-4 py-2 ${k.gecikti ? "text-[var(--warn)]" : "text-[var(--text-primary)]"}`}>
                  {formatTimestamp(k)}
                </td>
                <td
                  className={`px-4 py-2 ${
                    k.gecikti
                      ? "text-[var(--warn)] underline decoration-[var(--warn)] decoration-2 underline-offset-4"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {formatElapsed(k.elapsedMs)}
                  {k.gecikti && <span className="ml-1.5 text-[10px] align-middle">●batch</span>}
                </td>
                <td className={`px-4 py-2 text-right ${k.gecikti ? "text-[var(--warn)]" : ""}`}>
                  {k.speed.toFixed(1)}
                </td>
                <td className={`px-4 py-2 text-right ${k.gecikti ? "text-[var(--warn)]" : ""}`}>
                  {k.battery.toFixed(1)}
                </td>
                <td className={`px-4 py-2 text-right ${k.gecikti ? "text-[var(--warn)]" : ""}`}>
                  {k.current.toFixed(1)}
                </td>
                <td className={`px-4 py-2 text-right ${k.gecikti ? "text-[var(--warn)]" : ""}`}>
                  {k.voltage.toFixed(1)}
                </td>
                <td className={`px-4 py-2 text-right ${k.gecikti ? "text-[var(--warn)]" : ""}`}>
                  {k.temperature.toFixed(1)}
                </td>
                <td className={`px-4 py-2 text-right hidden sm:table-cell ${k.gecikti ? "text-[var(--warn)]" : ""}`}>
                  {k.remainingEnergy.toFixed(1)}
                </td>
                <td className={`px-4 py-2 text-right hidden md:table-cell ${k.gecikti ? "text-[var(--warn)]" : "text-[var(--text-dim)]"}`}>
                  {k.sequenceNo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
