/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Order = {
  id: string;
  customer_name: string;
  total: number;
  created_at: string;
};

export default function AdminDashboardRecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer_name, total, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      setOrders(data || []);
    }
    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold text-[var(--cake-brown)] mb-3">
        Recent Orders
      </h3>
      <ul className="divide-y">
        {orders.map((order) => (
          <li key={order.id} className="py-2 flex justify-between items-center">
            <span>
              <span className="font-semibold">
                {order.customer_name || "Guest"}
              </span>
              <span className="ml-2 text-xs opacity-60">
                {new Date(order.created_at).toLocaleString()}
              </span>
            </span>
            <span className="font-bold text-[var(--cake-brown)]">
              ${order.total.toFixed(2)}
            </span>
          </li>
        ))}
        {orders.length === 0 && (
          <li className="text-sm opacity-50 py-4 text-center">
            No orders found.
          </li>
        )}
      </ul>
    </div>
  );
}
