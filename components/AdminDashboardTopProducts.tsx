/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// You may need to adjust table/field names for your schema.
type ProductStats = {
  product_id: string;
  name: string;
  total_quantity: number;
};

export default function AdminDashboardTopProducts() {
  const [topProducts, setTopProducts] = useState<ProductStats[]>([]);

  useEffect(() => {
    async function fetchTopProducts() {
      // Assumes you have an order_items table relating orders and products
      const { data, error } = await supabase
        .from("order_items")
        .select("product_id, products(name), quantity")
        .order("quantity", { ascending: false });
      if (!data) return setTopProducts([]);
      // Group by product_id and sum quantities
      const stats: Record<string, ProductStats> = {};
      data.forEach((item: any) => {
        const id = item.product_id;
        if (!stats[id]) {
          stats[id] = {
            product_id: id,
            name: item.products?.name || "Unknown",
            total_quantity: 0,
          };
        }
        stats[id].total_quantity += item.quantity;
      });
      setTopProducts(
        Object.values(stats)
          .sort((a, b) => b.total_quantity - a.total_quantity)
          .slice(0, 8)
      );
    }
    fetchTopProducts();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold text-[var(--cake-brown)] mb-3">
        Most Purchased Products
      </h3>
      <ul className="divide-y">
        {topProducts.map((prod) => (
          <li
            key={prod.product_id}
            className="py-2 flex justify-between items-center"
          >
            <span className="font-semibold">{prod.name}</span>
            <span className="font-bold text-[var(--cake-brown)]">
              {prod.total_quantity} sold
            </span>
          </li>
        ))}
        {topProducts.length === 0 && (
          <li className="text-sm opacity-50 py-4 text-center">
            No product sales yet.
          </li>
        )}
      </ul>
    </div>
  );
}
