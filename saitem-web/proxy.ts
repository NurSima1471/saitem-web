import { NextResponse, type NextRequest } from "next/server";
import { beklenenToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get("saitem_oturum")?.value;
  const beklenen = await beklenenToken();

  if (beklenen && cookie === beklenen) {
    return NextResponse.next();
  }

  // /api/telemetri/* icin JSON 401 dondur (fetch cagrisi bunu bekliyor)
  if (request.nextUrl.pathname.startsWith("/api/telemetri")) {
    return NextResponse.json({ success: false, error: "Yetkisiz erisim" }, { status: 401 });
  }

  // Sayfa istegiyse login'e yonlendir
  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/telemetri/:path*"],
};
