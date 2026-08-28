import { NextResponse } from "next/server";
import { clickhouseQuery, KOLONLAR, tabloAdi } from "@/lib/clickhouse-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const baslangic = searchParams.get("baslangic");
    const bitis = searchParams.get("bitis");
    const adet = Number(searchParams.get("adet") || "2000");

    if (!baslangic || !bitis) {
      return NextResponse.json({ success: false, error: "baslangic ve bitis zorunlu" }, { status: 400 });
    }

    const sql =
      `SELECT ${KOLONLAR} FROM ${tabloAdi()} ` +
      `WHERE timestamp >= '${baslangic}' AND timestamp <= '${bitis}' ` +
      `ORDER BY timestamp ASC LIMIT ${adet} FORMAT JSON`;

    const data = await clickhouseQuery(sql);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API /telemetri/range hatasi:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Sunucu hatasi" },
      { status: 500 }
    );
  }
}
