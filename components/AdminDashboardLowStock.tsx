/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: string;
  name: string;
  stock: number;
};

export default function AdminDashboardLowStock() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, stock")
        .lt("stock", 5) // You can change 5 to whatever threshold you want
        .order("stock", { ascending: true })
        .limit(8);
      setProducts(data || []);
    }
    fetchProducts();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold text-[var(--cake-brown)] mb-3">
        Low Stock Products
      </h3>
      <ul className="divide-y">
        {products.map((prod) => (
          <li key={prod.id} className="py-2 flex justify-between items-center">
            <span className="font-semibold">{prod.name}</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                prod.stock === 0
                  ? "bg-red-100 text-red-700"
                  : "bg-[var(--cake-yellow)]/60 text-[var(--cake-brown)]"
              }`}
            >
              {prod.stock === 0 ? "Out of stock" : `Stock: ${prod.stock}`}
            </span>
          </li>
        ))}
        {products.length === 0 && (
          <li className="text-sm opacity-50 py-4 text-center">
            No low-stock products!
          </li>
        )}
      </ul>
    </div>
  );
}
