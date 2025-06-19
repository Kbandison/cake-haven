// /app/admin/register/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const INVITES = process.env.NEXT_PUBLIC_ADMIN_INVITE_CODES
  ? process.env.NEXT_PUBLIC_ADMIN_INVITE_CODES.split(",")
  : [];

export default function AdminRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invite = searchParams.get("invite") ?? "";

  const [valid, setValid] = useState(false);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (invite && INVITES.includes(invite)) setValid(true);
  }, [invite]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password: pw });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 2000);
    }
  }

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--cake-brown)] text-xl">
          This page requires an invite code.
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">Invalid invite code.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cake-pink)]/20">
      <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-5 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-[var(--cake-brown)] mb-2">
          Admin Registration
        </h2>
        <form className="flex flex-col gap-3" onSubmit={handleRegister}>
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
            autoComplete="new-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            minLength={6}
            className="border rounded-xl p-3 text-lg focus:ring-2 focus:ring-[var(--cake-mint)]"
          />
          <button
            type="submit"
            className="bg-[var(--cake-pink)] text-[var(--cake-brown)] font-bold py-3 px-6 rounded-2xl shadow hover:bg-[var(--cake-mint)] transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-sm text-center">
            Check your email to confirm and then log in.
          </div>
        )}
        {/* Login link (preserves invite code) */}
        <button
          onClick={() =>
            router.push(
              `/admin/login${
                invite ? `?invite=${encodeURIComponent(invite)}` : ""
              }`
            )
          }
          className="mt-2 underline text-[var(--cake-brown)] text-sm"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
