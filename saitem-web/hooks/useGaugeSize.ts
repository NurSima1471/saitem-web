"use client";

import { useEffect, useState } from "react";

// Ekran genisligine gore gostergelerin (Gauge) boyutunu kucultur -
// boylece dar (mobil) ekranlarda gostergeler tasmaz / cok buyuk gorunmez.
export function useGaugeSize() {
  const [size, setSize] = useState(200);

  useEffect(() => {
    function hesapla() {
      const w = window.innerWidth;
      if (w < 420) setSize(120);
      else if (w < 640) setSize(150);
      else if (w < 900) setSize(180);
      else setSize(200);
    }
    hesapla();
    window.addEventListener("resize", hesapla);
    return () => window.removeEventListener("resize", hesapla);
  }, []);

  return size;
}
