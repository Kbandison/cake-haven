"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Cakes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const ADMIN_EMAILS = ["kbandison@gmail.com"]; // update as needed

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { totalCount } = useCart();

  // Hydration-safe state for badge & admin
  const [hasMounted, setHasMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Watch for auth state changes (login/logout) and re-check admin status
  useEffect(() => {
    setHasMounted(true);

    async function checkAdmin() {
      const { data } = await supabase.auth.getUser();
      setIsAdmin(!!data.user && ADMIN_EMAILS.includes(data.user.email || ""));
    }
    checkAdmin();

    // Listen for any login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Logout handler
  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAdmin(false); // for instant UI update
    router.push("/admin/login");
  }

  // Cart icon handler - always opens drawer
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDrawerOpen(true);
    setMenuOpen(false); // Also close mobile menu if open
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--cake-pink)]/90 shadow backdrop-blur border-b border-[var(--cake-shadow)]">
        <nav className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Cake Haven Home"
          >
            <span className="text-3xl font-bold text-[var(--cake-brown)] tracking-tight select-none [font-family:var(--font-pacifico),cursive] drop-shadow">
              Cake Haven
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[var(--cake-brown)] font-medium px-2 py-1 rounded transition
                  hover:bg-[var(--cake-yellow)]/60 focus-visible:ring-2 focus-visible:ring-[var(--cake-mint)]
                  ${
                    pathname === link.href ||
                    (link.href.startsWith("/#") &&
                      typeof window !== "undefined" &&
                      window.location.hash === link.href.replace("/", ""))
                      ? "underline underline-offset-4 font-bold"
                      : ""
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Cart Icon */}
            <button
              className="relative ml-2 flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cake-mint)]"
              aria-label="View cart"
              onClick={handleCartClick}
              type="button"
            >
              <ShoppingCart className="w-7 h-7 text-[var(--cake-brown)] group-hover:scale-110 transition" />
              {hasMounted && totalCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-[var(--cake-yellow)] text-[var(--cake-brown)] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow ring-2 ring-white">
                  {totalCount}
                </span>
              )}
            </button>
            {/* Admin/Logout Button */}
            {hasMounted &&
              (isAdmin ? (
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 rounded-xl font-semibold bg-[var(--cake-brown)] text-white shadow hover:bg-[var(--cake-mint)] hover:text-[var(--cake-brown)] transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/admin/login"
                  className="ml-4 px-4 py-2 rounded-xl font-semibold bg-[var(--cake-mint)] text-[var(--cake-brown)] shadow hover:bg-[var(--cake-mint)]/80 hover:text-[var(--cake-brown)] transition"
                >
                  Admin
                </Link>
              ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--cake-mint)]"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            type="button"
          >
            {menuOpen ? (
              <X className="w-7 h-7 text-[var(--cake-brown)]" />
            ) : (
              <Menu className="w-7 h-7 text-[var(--cake-brown)]" />
            )}
          </button>
        </nav>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-[var(--cake-pink)]/95 border-t border-[var(--cake-shadow)] shadow-lg px-6 py-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-5 z-50">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--cake-brown)] font-semibold py-2 rounded transition hover:bg-[var(--cake-yellow)]/70"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              className="relative flex items-center py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cake-mint)]"
              aria-label="View cart"
              onClick={handleCartClick}
              type="button"
            >
              <ShoppingCart className="w-7 h-7 text-[var(--cake-brown)]" />
              {hasMounted && totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--cake-yellow)] text-[var(--cake-brown)] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow ring-2 ring-white">
                  {totalCount}
                </span>
              )}
            </button>
            {/* Admin/Logout button in mobile */}
            {hasMounted &&
              (isAdmin ? (
                <button
                  onClick={handleLogout}
                  className="mt-4 px-4 py-2 rounded-xl font-semibold bg-[var(--cake-brown)] text-white shadow hover:bg-[var(--cake-mint)] hover:text-[var(--cake-brown)] transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/admin/login"
                  className="mt-4 px-4 py-2 rounded-xl font-semibold bg-[var(--cake-mint)] text-[var(--cake-brown)] shadow hover:bg-[var(--cake-mint)]/80 hover:text-[var(--cake-brown)] transition"
                >
                  Admin
                </Link>
              ))}
          </div>
        )}
      </header>
      {/* Cart Drawer overlays everything and is always available */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
