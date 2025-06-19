"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, CakeSlice, BarChart3 } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/products", label: "Products", icon: CakeSlice },
  // Add more sections here if needed
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow rounded-xl p-4 flex md:flex-col gap-2 md:w-52">
      {LINKS.map(({ href, label, icon: Icon }) => {
        // Handle root `/admin` (dashboard) as "active" for `/admin`
        const isActive =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
              ${
                isActive
                  ? "bg-[var(--cake-pink)]/20 font-bold text-[var(--cake-brown)]"
                  : "text-[var(--cake-brown)] hover:bg-[var(--cake-yellow)]/20"
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
