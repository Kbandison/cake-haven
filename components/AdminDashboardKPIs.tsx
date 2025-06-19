/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboardKPIs() {
  const [todayTotal, setTodayTotal] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);

  useEffect(() => {
    async function fetchSales() {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const week = startOfWeek.toISOString().slice(0, 10);

      // Fetch all orders for today
      const { data: todayOrders, error: err1 } = await supabase
        .from("orders")
        .select("total, created_at")
        .gte("created_at", today)
        .lte("created_at", today + "T23:59:59.999Z");

      // Fetch all orders for this week
      const { data: weekOrders, error: err2 } = await supabase
        .from("orders")
        .select("total, created_at")
        .gte("created_at", week);

      setTodayTotal(
        todayOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
      );
      setWeekTotal(
        weekOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
      );
    }
    fetchSales();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6 mb-10">
      <div className="bg-[var(--cake-pink)]/60 rounded-xl p-6 shadow flex flex-col items-center">
        <div className="text-[var(--cake-brown)] font-bold text-xl mb-1">
          Today's Sales
        </div>
        <div className="text-3xl font-bold text-[var(--cake-brown)]">
          ${todayTotal.toFixed(2)}
        </div>
      </div>
      <div className="bg-[var(--cake-mint)]/40 rounded-xl p-6 shadow flex flex-col items-center">
        <div className="text-[var(--cake-brown)] font-bold text-xl mb-1">
          This Week
        </div>
        <div className="text-3xl font-bold text-[var(--cake-brown)]">
          ${weekTotal.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
