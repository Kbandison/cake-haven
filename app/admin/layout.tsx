"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { OrdersProvider } from "@/context/OrdersContext";
import AdminNav from "@/components/AdminNav";

const ADMIN_EMAILS = ["kbandison@gmail.com"];
const OPEN_ROUTES = ["/admin/login", "/admin/register"];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      if (OPEN_ROUTES.includes(pathname)) {
        setChecking(false);
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
        if (mounted) {
          setChecking(false);
          router.replace("/admin/login");
        }
      } else {
        if (mounted) setChecking(false);
      }
    }
    check();
    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--cake-brown)] text-xl">
          Checking admin access...
        </div>
      </div>
    );
  }

  // Only render sidebar/layout if not on login/register
  if (OPEN_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <OrdersProvider>
      <div className="min-h-screen flex flex-col md:flex-row bg-[var(--cake-bg)]">
        <div className="md:py-10 md:px-6 md:min-h-screen md:w-60">
          <AdminNav />
        </div>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </OrdersProvider>
  );
}
