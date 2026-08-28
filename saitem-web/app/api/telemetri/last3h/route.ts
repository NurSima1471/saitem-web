import { NextResponse } from "next/server";
import { clickhouseQuery, KOLONLAR, tabloAdi } from "@/lib/clickhouse-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ClickHouse'un kendi now() fonksiyonuna guvenmek yerine (sunucu saat dilimi
// farkli olabilir, sessizce 0 satir donebilir), tablodaki en son kaydin zaman
// damgasini referans alip oradan 3 saat geriye gidiyoruz.
export async function GET() {
  try {
    const sonSql = `SELECT timestamp FROM ${tabloAdi()} ORDER BY timestamp DESC LIMIT 1 FORMAT JSON`;
    const sonRows = await clickhouseQuery(sonSql);
    if (sonRows.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const referansMs = Date.parse(String(sonRows[0].timestamp).replace(" ", "T"));
    if (isNaN(referansMs)) {
      return NextResponse.json({ success: true, data: [] });
    }

    const sinirTarih = new Date(referansMs - 3 * 60 * 60 * 1000);
    const sinirStr = sinirTarih.toISOString().slice(0, 19).replace("T", " ");

    const sql =
      `SELECT ${KOLONLAR} FROM ${tabloAdi()} ` +
      `WHERE timestamp >= '${sinirStr}' ` +
      `ORDER BY timestamp ASC LIMIT 100000 FORMAT JSON`;

    const data = await clickhouseQuery(sql);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API /telemetri/last3h hatasi:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Sunucu hatasi" },
      { status: 500 }
    );
  }
}
