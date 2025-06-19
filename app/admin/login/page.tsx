// /app/admin/login/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invite = searchParams.get("invite") ?? "";

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/admin");
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pw,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/admin");
    }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? window.location.origin + "/admin"
            : undefined,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cake-pink)]/20">
      <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-5 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-[var(--cake-brown)] mb-2">
          Admin Login
        </h2>
        <form className="flex flex-col gap-3" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded-xl p-3 text-lg focus:ring-2 focus:ring-[var(--cake-mint)]"
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            className="border rounded-xl p-3 text-lg focus:ring-2 focus:ring-[var(--cake-mint)]"
          />
          <button
            type="submit"
            className="bg-[var(--cake-pink)] text-[var(--cake-brown)] font-bold py-3 px-6 rounded-2xl shadow hover:bg-[var(--cake-mint)] transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>
        <div className="text-center text-[var(--cake-brown)] font-medium opacity-70 my-2">
          or
        </div>
        <button
          className="bg-red-600 text-white rounded-xl px-4 py-3 font-bold"
          onClick={signInWithGoogle}
        >
          Continue with Google
        </button>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        {/* Register link (preserves invite code if present) */}
        <button
          onClick={() =>
            router.push(
              `/admin/register${
                invite ? `?invite=${encodeURIComponent(invite)}` : ""
              }`
            )
          }
          className="mt-2 underline text-[var(--cake-brown)] text-sm"
        >
          Register as Admin
        </button>
      </div>
    </div>
  );
}
