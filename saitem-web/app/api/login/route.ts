import { NextResponse } from "next/server";
import { beklenenToken } from "@/lib/auth";

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Gecersiz istek" }, { status: 400 });
  }

  const kullaniciAdi = String(body?.kullaniciAdi ?? "");
  const sifre = String(body?.sifre ?? "");

  const beklenenKullanici = process.env.AUTH_USERNAME || "";
  const beklenenSifre = process.env.AUTH_PASSWORD || "";

  if (!beklenenKullanici || !beklenenSifre) {
    return NextResponse.json(
      { success: false, error: "Sunucu tarafinda AUTH_USERNAME / AUTH_PASSWORD tanimli degil" },
      { status: 500 }
    );
  }

  if (kullaniciAdi !== beklenenKullanici || sifre !== beklenenSifre) {
    return NextResponse.json({ success: false, error: "Kullanici adi veya sifre hatali" }, { status: 401 });
  }

  const token = await beklenenToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set("saitem_oturum", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  return res;
}