// Bu dosya SADECE sunucu tarafinda (API route handler'lari icinde) calisir.
// "use client" YOK - tarayiciya hic gonderilmez, gercek sifre burada guvende.

const CH_HOST = process.env.CH_HOST || "95.217.216.31";
const CH_PORT = process.env.CH_PORT || "48123";
const CH_USER = process.env.CH_USER || "saitem";
const CH_PASS = process.env.CH_PASS || "";
const CH_DB = process.env.CH_DB || "saitem";
const CH_TABLE = process.env.CH_TABLE || "telemetri";

// NOT: Tablodaki kolon adi "soc" (battery degil). Burada "soc AS battery" ile
// disariya hep "battery" adiyla veriyoruz, boylece frontend tarafinda hicbir
// sey degistirmemize gerek kalmiyor.
export const KOLONLAR =
  "id, soc AS battery, speed, temperature, current, voltage, remaining_energy, " +
  "timestamp, inserted_at, latitude, longitude, altitude, sequence_no, elapsed_ms";

export function tabloAdi() {
  return `${CH_DB}.${CH_TABLE}`;
}

export async function clickhouseQuery(sql: string): Promise<any[]> {
  const url =
    `http://${CH_HOST}:${CH_PORT}/?query=${encodeURIComponent(sql)}` +
    `&user=${encodeURIComponent(CH_USER)}&password=${encodeURIComponent(CH_PASS)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ClickHouse hatasi (${res.status}): ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  return json.data ?? [];
}
