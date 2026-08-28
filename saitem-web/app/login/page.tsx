"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo, LogoMark } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem("saitem_auth", "1");
      sessionStorage.setItem("saitem_user", username.trim());
      router.push("/dashboard");
    }, 400);
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-void)] bg-grid overflow-hidden flex items-center justify-center px-4">
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center">
        <LogoMark className="w-[520px] h-[520px] opacity-[0.05]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-transparent to-[var(--bg-void)]" />

      <div className="relative z-10 w-full max-w-sm rise-in">
        <div className="flex flex-col items-center mb-8">
          <Logo className="h-10 w-auto mb-2" />
          <span className="text-[11px] tracking-[0.25em] text-[var(--text-dim)] uppercase">
            Elektrikli Araç Telemetri Sistemi
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-lg p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
        >
          <div className="mb-4">
            <label className="block text-[11px] tracking-[0.14em] uppercase text-[var(--text-secondary)] mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              className="w-full bg-[var(--bg-panel-raised)] border border-[var(--line)] rounded-md px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
              placeholder="team.member"
            />
          </div>

          <div className="mb-5">
            <label className="block text-[11px] tracking-[0.14em] uppercase text-[var(--text-secondary)] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--bg-panel-raised)] border border-[var(--line)] rounded-md px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="mb-4 text-xs text-[var(--danger)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] hover:brightness-110 disabled:opacity-60 text-[#0a0a0a] font-semibold text-sm rounded-md py-2.5 transition-all tracking-wide"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <p className="text-center text-[11px] text-[var(--text-dim)] mt-6 font-mono">
          SAITEM © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
