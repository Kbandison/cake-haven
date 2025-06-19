"use client";
import AdminDashboardKPIs from "@/components/AdminDashboardKPIs";
import AdminDashboardRecentOrders from "@/components/AdminDashboardRecentOrders";
import AdminDashboardLowStock from "@/components/AdminDashboardLowStock";
import AdminDashboardTopProducts from "@/components/AdminDashboardTopProducts";

// You can rename these files/components as you like!

export default function AdminDashboardPage() {
  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-[var(--cake-brown)] mb-8">
        Admin Analytics Dashboard
      </h1>
      <AdminDashboardKPIs />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AdminDashboardRecentOrders />
        <AdminDashboardLowStock />
      </div>
      <div className="mt-10">
        <AdminDashboardTopProducts />
      </div>
    </main>
  );
}
