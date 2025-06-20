/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { X } from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image_url: string | null;
};

type Order = {
  id: string;
  customer_name: string;
  email: string;
  phone?: string;
  total: number;
  status: string;
  created_at: string;
  fulfilled_at?: string;
  notes?: string;
  admin_notes?: string;
  address?: string | Record<string, any>;
  order_items?: OrderItem[];
};

const STATUS_STYLES: Record<string, string> = {
  fulfilled:
    "bg-[var(--cake-mint)]/60 text-[var(--cake-brown)] border-[var(--cake-mint)]",
  pending:
    "bg-[var(--cake-yellow)]/70 text-[var(--cake-brown)] border-[var(--cake-yellow)]",
  canceled: "bg-red-200 text-[var(--cake-brown)] border-red-300",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>("");

  // Fetch order
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErrorMsg(null);
    supabase
      .from("orders")
      .select(
        `*,
         order_items (
           id,
           name,
           quantity,
           price,
           image_url
         )
        `
      )
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) setErrorMsg(error.message);
        else {
          setOrder(data as Order);
          setAdminNotes(data?.admin_notes || "");
        }
        setLoading(false);
      });
  }, [id]);

  function formatAddress(
    address: string | Record<string, any> | null | undefined
  ): string {
    if (!address) return "";
    let obj: Record<string, any> | undefined;
    if (typeof address === "string") {
      try {
        obj = JSON.parse(address);
        if (typeof obj !== "object" || obj === null) return address; // Not an address object
      } catch {
        return address; // Not JSON, just return as is
      }
    } else if (typeof address === "object") {
      obj = address;
    }

    if (obj) {
      const { street, city, state, zip } = obj;
      return [street, city, state, zip].filter(Boolean).join(", ");
    }

    return "";
  }

  // Update status (fulfill/cancel)
  async function handleStatusUpdate(newStatus: string) {
    setSaving(true);
    setErrorMsg(null);
    const { error, data } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        ...(newStatus === "fulfilled" && {
          fulfilled_at: new Date().toISOString(),
        }),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) setErrorMsg(error.message);
    else setOrder(data as Order);
    setSaving(false);
  }

  // Save admin notes
  async function handleAdminNotesSave() {
    setSaving(true);
    setErrorMsg(null);
    const { error, data } = await supabase
      .from("orders")
      .update({ admin_notes: adminNotes })
      .eq("id", id)
      .select()
      .single();
    if (error) setErrorMsg(error.message);
    else setOrder(data as Order);
    setSaving(false);
  }

  if (loading)
    return (
      <div className="p-8 text-center text-lg text-[var(--cake-brown)]">
        Loading order…
      </div>
    );
  if (errorMsg)
    return (
      <div className="p-8 text-red-500 text-center">
        {errorMsg}
        <div>
          <button
            className="mt-4 underline text-[var(--cake-brown)]"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </div>
    );
  if (!order)
    return (
      <div className="p-8 text-center">
        Order not found.
        <div>
          <button
            className="mt-4 underline text-[var(--cake-brown)]"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </div>
    );

  const isPending = order.status === "pending";
  const isFulfilled = order.status === "fulfilled";
  const isCanceled = order.status === "canceled";

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow mt-8 relative">
      <button
        className="absolute top-4 right-4 p-2 rounded hover:bg-[var(--cake-yellow)]/50"
        onClick={() => router.back()}
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-2xl font-bold text-[var(--cake-brown)] mb-4">
        Order #{order.id.slice(0, 8)}
      </h2>
      <div className="flex flex-col gap-2 mb-6">
        <div>
          <span className="font-semibold">Customer:</span>{" "}
          {order.customer_name || order.email}
        </div>
        <div>
          <span className="font-semibold">Total:</span> $
          {order.total.toFixed(2)}
        </div>
        <div>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${
              STATUS_STYLES[order.status] ||
              "bg-gray-200 border-gray-300 text-gray-600"
            }`}
          >
            {order.status}
          </span>
        </div>
        <div>
          <span className="font-semibold">Date:</span>{" "}
          {order.created_at ? new Date(order.created_at).toLocaleString() : ""}
        </div>
        {order.fulfilled_at && (
          <div>
            <span className="font-semibold">Fulfilled at:</span>{" "}
            {new Date(order.fulfilled_at).toLocaleString()}
          </div>
        )}
        {order.address && (
          <div>
            <span className="font-semibold">Address:</span>{" "}
            {formatAddress(order.address)}
          </div>
        )}

        {order.notes && (
          <div>
            <span className="font-semibold">Notes:</span> {order.notes}
          </div>
        )}
      </div>

      {/* Order Actions */}
      <div className="flex gap-3 mb-6">
        {isPending && (
          <>
            <button
              onClick={() => handleStatusUpdate("fulfilled")}
              disabled={saving}
              className="px-4 py-2 bg-[var(--cake-mint)] text-[var(--cake-brown)] font-semibold rounded-xl shadow hover:bg-[var(--cake-mint)]/90 transition"
            >
              Mark as Fulfilled
            </button>
            <button
              onClick={() => handleStatusUpdate("canceled")}
              disabled={saving}
              className="px-4 py-2 bg-red-200 text-[var(--cake-brown)] font-semibold rounded-xl shadow hover:bg-red-300 transition"
            >
              Cancel Order
            </button>
          </>
        )}
        {isFulfilled && (
          <button
            onClick={() => handleStatusUpdate("pending")}
            disabled={saving}
            className="px-4 py-2 bg-[var(--cake-yellow)] text-[var(--cake-brown)] font-semibold rounded-xl shadow hover:bg-[var(--cake-yellow)]/90 transition"
          >
            Mark as Unfulfilled
          </button>
        )}
      </div>

      {/* Admin Notes */}
      <div className="mb-6">
        <label className="font-semibold text-[var(--cake-brown)] block mb-1">
          Admin Notes
        </label>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          className="w-full min-h-[60px] rounded p-2 border border-gray-200 focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
          placeholder="Internal notes for this order…"
        />
        <button
          onClick={handleAdminNotesSave}
          disabled={saving}
          className="mt-2 px-4 py-2 bg-[var(--cake-pink)] text-[var(--cake-brown)] font-semibold rounded-xl shadow hover:bg-[var(--cake-mint)] transition"
        >
          {saving ? "Saving…" : "Save Notes"}
        </button>
      </div>

      <h3 className="font-bold mb-2 text-[var(--cake-brown)]">Order Items</h3>
      <ul className="space-y-4">
        {(order.order_items || []).map((item, idx) => (
          <li key={item.id} className="flex items-center gap-4">
            {item.image_url && (
              <div className="relative w-14 h-14 shrink-0">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="rounded-xl object-cover border"
                  sizes="56px"
                  priority={idx === 0}
                />
              </div>
            )}
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm opacity-70">
                Quantity: {item.quantity}
              </div>
            </div>
            <div className="font-bold text-[var(--cake-brown)]">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
