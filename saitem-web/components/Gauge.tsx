"use client";

type GaugeProps = {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  size?: number;
  precision?: number;
};

export function Gauge({ label, value, unit, min, max, size = 200, precision = 0 }: GaugeProps) {
  const clamped = Math.min(Math.max(value, min), max);
  const pct = (clamped - min) / (max - min);
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 0.75; // 270 degree sweep, like the reference gauges
  const startAngle = 135; // degrees, start of arc (bottom-left)
  const sweepAngle = 270;

  const trackDash = circumference * arcFraction;
  const valueDash = trackDash * pct;

  return (
    <div className="flex flex-col items-center gap-2" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: `rotate(${startAngle}deg)` }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--line)"
            strokeWidth="2"
            strokeDasharray={`${trackDash} ${circumference}`}
            strokeLinecap="round"
            opacity="0.5"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeDasharray={`${valueDash} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)" }}
          />
          {/* dashed tick overlay for the motorsport look */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            strokeDasharray={`1 7`}
            strokeDashoffset={-2}
            opacity="0.45"
            style={{
              strokeDasharray: `1 7`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="tracking-[0.2em] text-[var(--text-secondary)] font-medium uppercase"
            style={{ fontSize: Math.max(9, size * 0.055) }}
          >
            {label}
          </span>
          <span
            className="font-display font-700 leading-none mt-1 tabular-nums"
            style={{ fontSize: size * 0.24 }}
          >
            {clamped.toFixed(precision)}
          </span>
          <span
            className="text-[var(--text-dim)] mt-1 uppercase tracking-wide"
            style={{ fontSize: Math.max(9, size * 0.06) }}
          >
            {unit}
          </span>
        </div>
      </div>
      <div className="flex justify-between w-full px-3 font-mono text-[var(--text-dim)]" style={{ fontSize: Math.max(9, size * 0.055) }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
