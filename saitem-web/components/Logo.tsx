export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 70"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="150"
        y="46"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="46"
        fontStyle="italic"
        letterSpacing="1"
        fill="var(--text-primary)"
      >
        SAITEM
      </text>
      <text
        x="150"
        y="63"
        textAnchor="middle"
        fontFamily="var(--font-body)"
        fontWeight="500"
        fontSize="13"
        letterSpacing="6"
        fill="var(--accent)"
      >
        TELEMETRY
      </text>
      <rect x="0" y="14" width="4" height="34" fill="var(--accent)" opacity="0" />
    </svg>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="31" stroke="var(--accent)" strokeWidth="1.5" opacity="0.5" />
      <circle cx="32" cy="32" r="24" stroke="var(--accent)" strokeWidth="1" opacity="0.3" strokeDasharray="3 4" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontStyle="italic"
        fontSize="20"
        fill="var(--text-primary)"
      >
        S
      </text>
    </svg>
  );
}
