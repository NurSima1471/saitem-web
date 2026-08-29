// Basit, veritabanisiz oturum dogrulama. Web Crypto API kullaniyoruz
// (hem middleware'in Edge ortaminda hem normal API route'larda calisir).

export async function beklenenToken(): Promise<string> {
  const sifre = process.env.AUTH_PASSWORD || "";
  const data = new TextEncoder().encode("saitem-oturum:" + sifre);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
