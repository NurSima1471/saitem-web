import { NextResponse } from 'next/server';

// 1. NEXT.JS ÖNBELLEĞİNİ KESİN OLARAK YOK EDEN SATIRLAR
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CH_HOST = process.env.CH_HOST || "95.217.216.31";
const CH_PORT = process.env.CH_PORT || "48123";
const CH_USER = process.env.CH_USER || "saitem";
const CH_PASS = process.env.CH_PASS || "";
const CH_DB = process.env.CH_DB || "saitem";
const CH_TABLE = process.env.CH_TABLE || "telemetri";

// 2. SÜTUN İSMİ DÜZELTİLDİ: 'battery' yerine 'soc' 
const KOLONLAR = "id, soc, speed, temperature, current, voltage, remaining_energy, timestamp, inserted_at, latitude, longitude, altitude, sequence_no, elapsed_ms";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adet = searchParams.get('adet') || '20';

    const sql = `SELECT ${KOLONLAR} FROM ${CH_DB}.${CH_TABLE} ORDER BY timestamp DESC LIMIT ${adet} FORMAT JSON`;
    
    // 3. CACHE-BUSTER EKLENDİ: &nocache=${Date.now()}
    const url = `http://${CH_HOST}:${CH_PORT}/?query=${encodeURIComponent(sql)}&user=${encodeURIComponent(CH_USER)}&password=${encodeURIComponent(CH_PASS)}&nocache=${Date.now()}`;
    
    const res = await fetch(url, { cache: "no-store" });
    
    if (!res.ok) {
       const errorText = await res.text().catch(() => "");
       console.error("ClickHouse Bağlantı Hatası:", errorText);
       return NextResponse.json({ success: false, error: 'Veritabanı hatası' }, { status: 500 });
    }
    
    const json = await res.json();
    return NextResponse.json({ success: true, data: json.data ?? [] });
    
  } catch (error) {
    console.error("API Sorgu Hatası:", error);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}