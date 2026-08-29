"use client";

import { useEffect, useState } from "react";
import { saatDakikaSaniyeMs } from "@/lib/api";

function formatElapsedBuyuk(ms: number) {
  if (ms < 0) ms = 0;
    return Math.round(ms) + " ms";
}

export function LiveClock({ startTs, endTs }: { startTs: number | null; endTs: number | null }) {
  const [simdi, setSimdi] = useState(() => Date.now());

  useEffect(() => {
    if (endTs) return; // durduysa artik tiklamaya gerek yok, son deger sabit kalir
    const id = setInterval(() => setSimdi(Date.now()), 50);
    return () => clearInterval(id);
  }, [startTs, endTs]);

  if (!startTs) {
    // Yaris henuz baslamadi - normal, akan saat gosterilir
    return <span className="font-mono tabular-nums">{saatDakikaSaniyeMs(simdi)}</span>;
  }

  const bitisMs = endTs ?? simdi;
  return <span className="font-mono tabular-nums">{formatElapsedBuyuk(bitisMs - startTs)}</span>;
}
