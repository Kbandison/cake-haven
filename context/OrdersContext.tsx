/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  stripe_session_id: string | null;
  customer_name: string | null;
  email: string | null;
  address: any;
  notes: string | null;
  phone: string | null;
  total: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
};

type OrdersContextType = {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  refreshOrders: () => Promise<void>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all orders (for admin), or filter for a specific user if needed
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    // Example: fetch all orders + items (expand as needed)
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setOrders(data as Order[]);
    setLoading(false);
  };

  // Alias for clarity
  const refreshOrders = fetchOrders;

  // Optionally: auto-fetch on mount (for admin dashboard or order history pages)
  useEffect(() => {
    // Only auto-fetch in certain contexts/pages if you want
    // fetchOrders();
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        error,
        fetchOrders,
        refreshOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}
