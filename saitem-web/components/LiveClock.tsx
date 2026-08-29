"use client";

import { useEffect, useState } from "react";
import { saatDakikaSaniyeMs } from "@/lib/api";

function formatElapsedBuyuk(ms: number) {
  if (ms < 0) ms = 0;
  const saat = Math.floor(ms / 3600000);
  const dk = Math.floor((ms % 3600000) / 60000);
  const sn = Math.floor((ms % 60000) / 1000);
  const msKalan = Math.floor(ms % 1000);
  const parcalar = saat > 0 ? [saat, dk, sn] : [dk, sn];
  return parcalar.map((p) => String(p).padStart(2, "0")).join(":") + "." + String(msKalan).padStart(3, "0");
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
