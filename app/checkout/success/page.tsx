/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retries, setRetries] = useState(0);
  const MAX_RETRIES = 10;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!orderId) return;

    setLoading(true);

    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .single();

      if (data) {
        setOrder(data);
        setLoading(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else if (retries < MAX_RETRIES) {
        setRetries((r) => r + 1);
      } else {
        setLoading(false);
      }
    };

    fetchOrder();
    intervalRef.current = setInterval(fetchOrder, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, retries]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[40vh] gap-4">
        <Loader className="w-10 h-10 animate-spin text-[var(--cake-pink)]" />
        <span className="text-[var(--cake-brown)]">Looking up your order…</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-[var(--cake-brown)] mb-4">
          Order Not Found
        </h1>
        <Link href="/" className="text-[var(--cake-pink)] underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-[93vh] flex flex-col justify-center items-center py-10 px-2 bg-gradient-to-br from-[var(--cake-mint)]/30 via-white to-[var(--cake-pink)]/10">
      {/* Animated checkmark */}
      <div className="mb-12">
        <svg
          className="w-20 h-20 text-[var(--cake-mint)] drop-shadow-lg animate-bounce-in"
          viewBox="0 0 52 52"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="26"
            cy="26"
            r="25"
            fill="white"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M16 27l7 7 13-13"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <h1
        className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[var(--cake-pink)] via-[var(--cake-yellow)] to-[var(--cake-mint)] bg-clip-text text-transparent drop-shadow mb-12 animate-fade-in"
        style={{ letterSpacing: ".03em" }}
      >
        Thank you for your order!
      </h1>
      <div className="mb-6 text-lg text-[var(--cake-brown)] animate-fade-in">
        Order{" "}
        <span className="font-mono text-[var(--cake-pink)]">
          {order.id.slice(0, 8)}
        </span>{" "}
        is{" "}
        <span className="inline-block px-2 py-1 bg-[var(--cake-mint)]/70 text-[var(--cake-brown)] font-bold rounded shadow-sm ml-1 mr-1">
          {order.status}
        </span>
        <br />
        <span className="text-base">
          Confirmation sent to <b>{order.email}</b>
        </span>
      </div>

      {/* Receipt Card */}
      <div className="bg-white/90 rounded-2xl shadow-lg px-4 py-6 max-w-sm w-full my-12 border border-[var(--cake-mint)]/40 animate-fade-in">
        <div className="font-semibold text-[var(--cake-brown)] text-left mb-3">
          Your Order:
        </div>
        <ul className="mb-4 text-left">
          {order.order_items?.map((item: any) => (
            <li
              key={item.id}
              className="flex items-center justify-between border-b py-2"
            >
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--cake-pink)]" />
                {item.name}{" "}
                <span className="text-xs text-gray-400 ml-1">
                  × {item.quantity}
                </span>
              </span>
              <span className="text-[var(--cake-brown)] font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-semibold text-lg text-[var(--cake-brown)] border-t pt-2">
          <span>Total Paid:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <Link
        href="/products"
        className="inline-block bg-[var(--cake-pink)] hover:bg-[var(--cake-mint)] text-[var(--cake-brown)] font-bold py-3 px-8 rounded-2xl shadow-xl focus:ring-2 focus:ring-[var(--cake-mint)] transition animate-fade-in mt-4"
      >
        Shop More Cakes
      </Link>

      {/* Optional: confetti animation */}
      <style jsx global>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.2);
            opacity: 0;
          }
          80% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.27, 1.49, 0.42, 0.98) 0s 1;
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.18, 0.86, 0.51, 1.11) both;
        }
      `}</style>
    </main>
  );
}
