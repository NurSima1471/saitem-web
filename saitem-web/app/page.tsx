"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const authed = sessionStorage.getItem("saitem_auth") === "1";
    router.replace(authed ? "/dashboard" : "/login");
  }, [router]);

  return null;
}
