/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/lib/checkout";

type OrderForm = {
  customer_name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  notes: string;
};

const defaultForm: OrderForm = {
  customer_name: "",
  email: "",
  phone: "",
  address: { street: "", city: "", state: "", zip: "" },
  notes: "",
};

export default function CheckoutPage() {
  // All hooks at the top!
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { cartItems, totalPrice, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (cartItems.length === 0) {
    return (
      <main className="max-w-xl mx-auto py-20 px-6 text-center">
        <h1 className="text-2xl font-bold text-[var(--cake-brown)] mb-3">
          Cart is empty
        </h1>
        <p className="mb-8">Please add some cakes to your cart first.</p>
        <button
          className="px-6 py-3 bg-[var(--cake-pink)] text-[var(--cake-brown)] rounded-xl font-bold shadow hover:bg-[var(--cake-mint)] transition"
          onClick={() => router.push("/products")}
        >
          Shop Cakes
        </button>
      </main>
    );
  }

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1] as keyof OrderForm["address"];
      setForm((f) => ({
        ...f,
        address: { ...f.address, [key]: value },
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!form.customer_name || !form.email || !form.address.street) {
      setErrorMsg("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const order = await placeOrder({
        customer: {
          name: form.customer_name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
        notes: form.notes,
        items: cartItems,
        total: totalPrice,
      });

      const res = await fetch("/api/create-stripe-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          items: cartItems,
          customer: {
            name: form.customer_name,
            email: form.email,
            // Optional: phone (if you want in Stripe metadata)
          },
        }),
      });
      const { url } = await res.json();
      if (!url) throw new Error("Could not create Stripe session.");

      clearCart();
      window.location.href = url;
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
      <section>
        <h1 className="text-3xl font-bold text-[var(--cake-brown)] mb-4">
          Checkout
        </h1>
        <form className="space-y-5" onSubmit={handleStripeCheckout}>
          {/* ...form fields as before... */}
          <div>
            <label className="font-semibold text-[var(--cake-brown)] block mb-1">
              Name<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              name="customer_name"
              value={form.customer_name}
              onChange={handleInput}
              required
              className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="font-semibold text-[var(--cake-brown)] block mb-1">
              Email<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleInput}
              required
              className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
              autoComplete="email"
              type="email"
            />
          </div>
          <div>
            <label className="font-semibold text-[var(--cake-brown)] block mb-1">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleInput}
              className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
              autoComplete="tel"
              type="tel"
            />
          </div>
          <div>
            <label className="font-semibold text-[var(--cake-brown)] block mb-1">
              Delivery Address<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              name="address.street"
              value={form.address.street}
              onChange={handleInput}
              required
              placeholder="Street Address"
              className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)] mb-2"
            />
            <div className="flex gap-3">
              <input
                name="address.city"
                value={form.address.city}
                onChange={handleInput}
                required
                placeholder="City"
                className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
              />
              <input
                name="address.state"
                value={form.address.state}
                onChange={handleInput}
                required
                placeholder="State"
                className="w-24 px-3 py-2 rounded border focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
              />
              <input
                name="address.zip"
                value={form.address.zip}
                onChange={handleInput}
                required
                placeholder="ZIP"
                className="w-24 px-3 py-2 rounded border focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
              />
            </div>
          </div>
          <div>
            <label className="font-semibold text-[var(--cake-brown)] block mb-1">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleInput}
              className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
              placeholder="Order notes, allergies, or delivery instructions"
            />
          </div>
          {errorMsg && (
            <div className="text-red-500 text-sm mt-2">{errorMsg}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--cake-pink)] hover:bg-[var(--cake-mint)] text-[var(--cake-brown)] font-bold py-2 px-6 rounded-xl shadow focus:ring-2 focus:ring-[var(--cake-mint)] transition w-full mt-4"
          >
            {loading ? "Processing…" : "Proceed to Payment"}
          </button>
        </form>
      </section>
      {/* Cart summary */}
      <aside className="bg-white/90 rounded-2xl shadow p-6 h-fit sticky top-6 mt-8 md:mt-0">
        <h2 className="text-xl font-bold mb-4 text-[var(--cake-brown)]">
          Order Summary
        </h2>
        <ul className="divide-y divide-gray-200 mb-4">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between py-2"
            >
              <div>
                <div className="font-semibold text-[var(--cake-brown)]">
                  {item.name}
                </div>
                <div className="text-xs text-gray-400">x {item.quantity}</div>
              </div>
              <div className="text-[var(--cake-brown)] font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-semibold text-lg text-[var(--cake-brown)]">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </aside>
    </main>
  );
}
