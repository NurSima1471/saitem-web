"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TelemetriKaydi } from "@/lib/api";

function formatElapsed(ms: number) {
  if (!Number.isFinite(ms) || ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const dk = Math.floor(totalSec / 60);
  const sn = totalSec % 60;
  return `${String(dk).padStart(2, "0")}:${String(sn).padStart(2, "0")}`;
}

function CustomTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-panel-raised)] border border-[var(--line)] rounded-md px-3 py-2 text-xs font-mono">
      <div className="text-[var(--text-dim)] mb-1">{label}</div>
      <div className="text-[var(--text-primary)]">
        {payload[0].value} {unit}
      </div>
    </div>
  );
}

function GrafikKarti({
  baslik,
  veri,
  dataKey,
  unit,
  renk = "var(--accent)",
}: {
  baslik: string;
  veri: TelemetriKaydi[];
  dataKey: keyof TelemetriKaydi;
  unit: string;
  renk?: string;
}) {
  const chartData = veri.map((k) => ({
    zaman: formatElapsed(k.elapsedMs),
    deger: k[dataKey] as number,
  }));

  return (
    <div className="border border-[var(--line)] rounded-md bg-[var(--bg-panel)] p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-4 rounded-full" style={{ background: renk }} />
        <span className="text-xs tracking-[0.16em] uppercase text-[var(--text-secondary)] font-medium">
          {baslik}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="zaman"
            tick={{ fill: "var(--text-dim)", fontSize: 10 }}
            axisLine={{ stroke: "var(--line)" }}
            tickLine={false}
            minTickGap={40}
          />
          <YAxis
            tick={{ fill: "var(--text-dim)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Line
            type="monotone"
            dataKey="deger"
            stroke={renk}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TelemetriGrafikleri({ veri }: { veri: TelemetriKaydi[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <GrafikKarti baslik="Speed" veri={veri} dataKey="speed" unit="km/h" renk="#ff7a1a" />
      <GrafikKarti baslik="Current" veri={veri} dataKey="current" unit="A" renk="#38bdf8" />
      <GrafikKarti baslik="Battery" veri={veri} dataKey="battery" unit="%" renk="#22c55e" />
      <GrafikKarti baslik="Voltage" veri={veri} dataKey="voltage" unit="V" renk="#a78bfa" />
      <GrafikKarti baslik="Temperature" veri={veri} dataKey="temperature" unit="°C" renk="#f59e0b" />
    </div>
  );
}
