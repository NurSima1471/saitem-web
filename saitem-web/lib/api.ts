// Şifreler ve doğrudan veritabanı bağlantısı (clickhouseQuery) tamamen kaldırıldı!
// Frontend artık SADECE kendi backend'imiz olan /api/telemetri adresine istek atıyor.

export type TelemetriKaydi = {
  id: string;
  battery: number;
  speed: number;
  temperature: number;
  current: number;
  voltage: number;
  remainingEnergy: number;
  timestamp: string;
  insertedAt: string;
  latitude: number;
  longitude: number;
  altitude: number;
  sequenceNo: number;
  elapsedMs: number;
  gecikti: boolean;
};

export type SurusOzeti = {
  baslangic: string;
  bitis: string;
  kayitSayisi: number;
  maxSpeed: number;
};

const GECIKME_ESIGI_SN = 8;

function parseTarih(s: string): number {
  return Date.parse(s.replace(" ", "T") + "Z");
}

function satirdanKayit(row: any): TelemetriKaydi {
  const ts = String(row.timestamp ?? "");
  const ins = String(row.inserted_at ?? "");
  const tsMs = parseTarih(ts);
  const insMs = parseTarih(ins);
  const gecikti = !isNaN(tsMs) && !isNaN(insMs) && (insMs - tsMs) / 1000 > GECIKME_ESIGI_SN;

  return {
    id: row.id ?? "",
    battery: Number(row.battery ?? 0),
    speed: Number(row.speed ?? 0),
    temperature: Number(row.temperature ?? 0),
    current: Number(row.current ?? 0),
    voltage: Number(row.voltage ?? 0),
    remainingEnergy: Number(row.remaining_energy ?? 0),
    timestamp: ts,
    insertedAt: ins,
    latitude: Number(row.latitude ?? 0),
    longitude: Number(row.longitude ?? 0),
    altitude: Number(row.altitude ?? 0),
    sequenceNo: Number(row.sequence_no ?? 0),
    elapsedMs: Number(row.elapsed_ms ?? 0),
    gecikti,
  };
}

// 1. CANLI VERİ: Artık doğrudan oluşturduğumuz güvenli api'ye (route.ts) bağlanıyor.
export async function sonTelemetriVerileri(adet = 20): Promise<TelemetriKaydi[]> {
  try {
    const res = await fetch(`/api/telemetri?adet=${adet}`, { cache: "no-store" });
    const json = await res.json();
    
    if (!json.success) {
      console.error("Backend'den veri alınamadı:", json.error);
      return [];
    }
    
    return json.data.map(satirdanKayit).reverse(); // Eskiden yeniye sıralıyoruz
  } catch (error) {
    console.error("Bağlantı hatası:", error);
    return [];
  }
}

// ----------------------------------------------------------------------
// ⚠️ ÖNEMLİ NOT:
// Güvenliği sağlamak için arayüzden veritabanı şifrelerini kaldırdığımızdan,
// aşağıdaki geçmiş sürüşleri getiren fonksiyonlar geçici olarak boş liste
// döndürecek şekilde ayarlandı (sistemin hata verip çökmemesi için). 
// Eğer canlı yarış ekranı dışında "Geçmiş Sürüşler" ekranını da aktif olarak 
// kullanıyorsan, aynı route.ts mantığıyla onlar için de API klasörleri açman gerekecek.
// ----------------------------------------------------------------------

export async function aralikVerileri(baslangic: string, bitis: string, adet = 2000): Promise<TelemetriKaydi[]> {
  return []; 
}

export async function suruslariGetir(): Promise<SurusOzeti[]> {
  return [];
}

export async function sonUcSaatiGetir(): Promise<TelemetriKaydi[]> {
  return [];
}

// YARIŞ CSV EXPORT (Aynen korundu)
export function raceCsvOlustur(kayitlar: TelemetriKaydi[]): string {
  const satirlar = ["zaman_ms;hiz_kmh;T_bat_C;V_bat_C;kalan_enerji_Wh"];
  for (const k of kayitlar) {
    satirlar.push(
      [
        Math.round(k.elapsedMs),
        k.speed.toFixed(2),
        k.temperature.toFixed(2),
        k.voltage.toFixed(2),
        k.remainingEnergy.toFixed(2),
      ].join(";")
    );
  }
  return satirlar.join("\n");
}

// DOSYA İNDİRME (Aynen korundu)
export function dosyaIndir(dosyaAdi: string, icerik: string) {
  const blob = new Blob([icerik], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = dosyaAdi;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}