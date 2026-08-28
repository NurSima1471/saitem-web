import { NextResponse } from "next/server";
import { clickhouseQuery, tabloAdi } from "@/lib/clickhouse-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BOSLUK_ESIGI_DK = 5;

export async function GET() {
  try {
    const sql = `SELECT timestamp, speed FROM ${tabloAdi()} ORDER BY timestamp ASC LIMIT 500000 FORMAT JSON`;
    const rows = await clickhouseQuery(sql);
    if (rows.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const parseTarih = (s: string) => Date.parse(s.replace(" ", "T") + "Z");

    const suruslar: { baslangic: string; bitis: string; kayitSayisi: number; maxSpeed: number }[] = [];
    let mevcut = {
      baslangic: String(rows[0].timestamp),
      bitis: String(rows[0].timestamp),
      kayitSayisi: 1,
      maxSpeed: Number(rows[0].speed ?? 0),
    };

    for (let i = 1; i < rows.length; i++) {
      const onceki = parseTarih(String(rows[i - 1].timestamp));
      const simdi = parseTarih(String(rows[i].timestamp));
      const farkDk = (simdi - onceki) / 60000;

      if (farkDk > BOSLUK_ESIGI_DK) {
        suruslar.push(mevcut);
        mevcut = {
          baslangic: String(rows[i].timestamp),
          bitis: String(rows[i].timestamp),
          kayitSayisi: 0,
          maxSpeed: 0,
        };
      }

      mevcut.bitis = String(rows[i].timestamp);
      mevcut.kayitSayisi += 1;
      mevcut.maxSpeed = Math.max(mevcut.maxSpeed, Number(rows[i].speed ?? 0));
    }

    suruslar.push(mevcut);
    suruslar.reverse();

    return NextResponse.json({ success: true, data: suruslar });
  } catch (error) {
    console.error("API /telemetri/drives hatasi:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Sunucu hatasi" },
      { status: 500 }
    );
  }
}
