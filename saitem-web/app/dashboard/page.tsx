"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { Tabs } from "@/components/Tabs";
import { Gauge } from "@/components/Gauge";
import { StatCard } from "@/components/StatCard";
import { LiveTable } from "@/components/LiveTable";
import { TelemetriGrafikleri } from "@/components/TelemetriGrafik";
import { SurusListesi } from "@/components/SurusListesi";
import { useGaugeSize } from "@/hooks/useGaugeSize";
import {
  sonTelemetriVerileri,
  suruslariGetir,
  aralikVerileri,
  sonUcSaatiGetir,
  raceCsvOlustur,
  dosyaIndir,
  type TelemetriKaydi,
  type SurusOzeti,
} from "@/lib/api";

const POLL_MS = 2000;

const SEKMELER = [
  { id: "canli", label: "Live" },
  { id: "grafikler", label: "Charts" },
  { id: "suruşler", label: "Previous Drives" },
  { id: "gecmis", label: "History (3h)" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("canli");
  const gaugeSize = useGaugeSize();

  // canlı veri
  const [kayitlar, setKayitlar] = useState<TelemetriKaydi[]>([]);
  const [connected, setConnected] = useState(false);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [lastUpdateMs, setLastUpdateMs] = useState<number | null>(null);

  // sürüşler
  const [suruslar, setSuruslar] = useState<SurusOzeti[]>([]);
  const [seciliSurus, setSeciliSurus] = useState<number | null>(null);
  const [surusKayitlari, setSurusKayitlari] = useState<TelemetriKaydi[]>([]);
  const [surusYukleniyor, setSurusYukleniyor] = useState(false);

  // gecmis (son 3 saat)
  const [gecmisKayitlar, setGecmisKayitlar] = useState<TelemetriKaydi[]>([]);
  const [gecmisYukleniyor, setGecmisYukleniyor] = useState(false);
  const [gecmisHata, setGecmisHata] = useState<string | null>(null);
  const [gecmisExportYukleniyor, setGecmisExportYukleniyor] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("saitem_auth") !== "1") {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  const cek = useCallback(async () => {
    const basla = performance.now();
    try {
      const veri = await sonTelemetriVerileri(30);
      setKayitlar(veri);
      setConnected(true);
      setPingMs(Math.round(performance.now() - basla));
      setLastUpdateMs(Date.now());
    } catch {
      setConnected(false);
      setPingMs(null);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    cek();
    const id = setInterval(cek, POLL_MS);
    return () => clearInterval(id);
  }, [ready, cek]);

  useEffect(() => {
    if (!ready || tab !== "suruşler") return;
    suruslariGetir().then(setSuruslar).catch(() => setSuruslar([]));
  }, [ready, tab]);

  useEffect(() => {
    if (seciliSurus === null || !suruslar[seciliSurus]) return;
    const s = suruslar[seciliSurus];
    setSurusYukleniyor(true);
    aralikVerileri(s.baslangic, s.bitis)
      .then(setSurusKayitlari)
      .catch(() => setSurusKayitlari([]))
      .finally(() => setSurusYukleniyor(false));
  }, [seciliSurus, suruslar]);

  const gecmisYukle = useCallback(async () => {
    setGecmisYukleniyor(true);
    setGecmisHata(null);
    try {
      const veri = await sonUcSaatiGetir();
      setGecmisKayitlar(veri);
    } catch (e) {
      setGecmisHata(e instanceof Error ? e.message : String(e));
    } finally {
      setGecmisYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    if (!ready || tab !== "gecmis") return;
    gecmisYukle();
  }, [ready, tab, gecmisYukle]);

  async function gecmisExportEt() {
    setGecmisExportYukleniyor(true);
    try {
      const kayitlar = gecmisKayitlar.length > 0 ? gecmisKayitlar : await sonUcSaatiGetir();
      if (kayitlar.length === 0) {
        alert("Son 3 saat icinde kayit bulunamadi.");
        return;
      }
      const csv = raceCsvOlustur(kayitlar);
      const zaman = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      dosyaIndir(`RaceLog_History_${zaman}.csv`, csv);
    } catch (e) {
      alert("Export hatasi: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setGecmisExportYukleniyor(false);
    }
  }

  if (!ready) return null;

  const son = kayitlar[0];
  const ortalamaHiz =
    kayitlar.length > 0 ? kayitlar.reduce((s, k) => s + k.speed, 0) / kayitlar.length : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-void)] bg-grid">
      <TopBar connected={connected} lastUpdateMs={lastUpdateMs} pingMs={pingMs} />
      <Tabs active={tab} onChange={setTab} items={SEKMELER} />

      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-8 rise-in">
        {tab === "canli" && (
          <>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex flex-col gap-3">
                <StatCard label="Battery Temp" value={son ? son.temperature.toFixed(1) : "--"} unit="°C" />
                <StatCard label="Voltage" value={son ? son.voltage.toFixed(1) : "--"} unit="V" />
                <StatCard label="Remaining Energy" value={son ? son.remainingEnergy.toFixed(1) : "--"} unit="Wh" />
              </div>

              <Gauge label="Speed" value={son?.speed ?? 0} unit="km/h" min={0} max={120} precision={0} size={gaugeSize} />
              <Gauge label="Current" value={son?.current ?? 0} unit="A" min={-50} max={50} precision={1} size={gaugeSize} />
              <Gauge label="Battery" value={son?.battery ?? 0} unit="%" min={0} max={100} precision={0} size={gaugeSize} />
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-3 border border-[var(--line)] bg-[var(--bg-panel)] rounded-full px-4 sm:px-6 py-2.5 sm:py-3 mb-6 sm:mb-8 w-fit max-w-full mx-auto">
              <span className="text-[10px] sm:text-xs tracking-[0.18em] uppercase text-[var(--text-secondary)] whitespace-nowrap">
                Average Speed
              </span>
              <span className="font-display font-700 text-lg sm:text-xl text-[var(--accent)] tabular-nums whitespace-nowrap">
                {ortalamaHiz.toFixed(1)} km/h
              </span>
            </div>

            <LiveTable kayitlar={kayitlar} />
          </>
        )}

        {tab === "grafikler" && (
          <>
            <div className="mb-4 text-xs text-[var(--text-dim)]">
              Live charts based on the last {kayitlar.length} records
            </div>
            <TelemetriGrafikleri veri={[...kayitlar].reverse()} />
          </>
        )}

        {tab === "suruşler" && (
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
            <div>
              <div className="text-xs tracking-[0.16em] uppercase text-[var(--text-secondary)] mb-3">
                Recorded Drives ({suruslar.length})
              </div>
              <SurusListesi suruslar={suruslar} seciliIndex={seciliSurus} onSec={setSeciliSurus} />
            </div>
            <div>
              {seciliSurus === null ? (
                <div className="border border-[var(--line)] rounded-md p-8 text-center text-[var(--text-dim)] text-sm h-full flex items-center justify-center">
                  Select a drive on the left to see details
                </div>
              ) : surusYukleniyor ? (
                <div className="border border-[var(--line)] rounded-md p-8 text-center text-[var(--text-dim)] text-sm">
                  Loading...
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <LiveTable kayitlar={surusKayitlari} baslik="Drive Records" />
                  <TelemetriGrafikleri veri={surusKayitlari} />
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "gecmis" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs tracking-[0.16em] uppercase text-[var(--text-secondary)]">
                Last 3 hours ({gecmisKayitlar.length} records)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={gecmisYukle}
                  disabled={gecmisYukleniyor}
                  className="text-[11px] uppercase font-semibold border border-[var(--line)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50 transition-colors rounded-md px-3 py-1.5"
                >
                  {gecmisYukleniyor ? "Loading..." : "Refresh"}
                </button>
                <button
                  onClick={gecmisExportEt}
                  disabled={gecmisExportYukleniyor}
                  className="text-[11px] uppercase font-semibold border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0a0a0a] disabled:opacity-50 transition-colors rounded-md px-3 py-1.5"
                >
                  {gecmisExportYukleniyor ? "Exporting..." : "Export CSV"}
                </button>
              </div>
            </div>

            {gecmisHata && (
              <div className="text-xs text-[var(--danger)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 rounded-md px-3 py-2">
                {gecmisHata}
              </div>
            )}

            <LiveTable kayitlar={gecmisKayitlar} baslik="History (Last 3 Hours)" />
          </div>
        )}
      </main>
    </div>
  );
}
