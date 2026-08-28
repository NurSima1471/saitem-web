import { NextResponse } from "next/server";
import { clickhouseQuery, KOLONLAR, tabloAdi } from "@/lib/clickhouse-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adet = Number(searchParams.get("adet") || "20");

    const sql = `SELECT ${KOLONLAR} FROM ${tabloAdi()} ORDER BY timestamp DESC LIMIT ${adet} FORMAT JSON`;
    const data = await clickhouseQuery(sql);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API /telemetri hatasi:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Sunucu hatasi" },
      { status: 500 }
    );
  }
}
