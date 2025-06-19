"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    // window.location.reload(); // Instantly resets all UI and state
  }

  return (
    <button
      onClick={logout}
      className="ml-4 px-4 py-2 bg-[var(--cake-yellow)] rounded-xl text-[var(--cake-brown)] font-bold hover:bg-[var(--cake-mint)] transition"
    >
      Logout
    </button>
  );
}
