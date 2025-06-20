/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
// import { Router } from "next/router";

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
};

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cartItems, updateQty, totalPrice, removeFromCart, clearCart } =
    useCart();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const router = useRouter();

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex"
          aria-modal="true"
          role="dialog"
        >
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-label="Close cart"
          />
          {/* Animated Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 330, damping: 40 }}
            className={`
  z-10 ml-auto h-full bg-white/90 backdrop-blur-lg shadow-2xl flex flex-col relative overflow-hidden
  p-4 rounded-l-xl
  w-[90vw] max-w-[430px] md:w-[430px]
  fixed right-0 top-0 bottom-0
`}
            tabIndex={0}
            style={{ outline: "none" }}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--cake-pink)]/60 via-[var(--cake-mint)]/50 to-[var(--cake-yellow)]/60 blur-[2px] pointer-events-none" />

            <div className="flex items-center justify-between mb-6 pt-3 px-1">
              <h2 className="text-xl font-bold text-[var(--cake-brown)] drop-shadow tracking-tight">
                Your Cart
              </h2>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="p-2 rounded-xl hover:bg-[var(--cake-yellow)] focus:outline-none focus:ring-2 focus:ring-[var(--cake-mint)]"
              >
                <X className="w-6 h-6 text-[var(--cake-brown)]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 px-1 pt-3 min-h-[140px]">
              {cartItems.length === 0 ? (
                <div className="text-[var(--cake-brown)] text-center opacity-60 py-10">
                  Your cart is empty!
                </div>
              ) : (
                cartItems.map((item: CartItem, idx: number) => {
                  const atLimit = item.quantity >= item.stock;
                  return (
                    <div key={item.id}>
                      <div className="flex items-center gap-4 py-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-2xl bg-[var(--cake-pink)]/20"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-[var(--cake-brown)] mb-1">
                            {item.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="w-7 h-7 rounded-full bg-[var(--cake-mint)]/30 text-[var(--cake-brown)] text-lg font-bold flex items-center justify-center hover:bg-[var(--cake-mint)]/60 transition"
                              onClick={() =>
                                updateQty(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              aria-label={`Decrease quantity of ${item.name}`}
                              disabled={item.quantity <= 1}
                              type="button"
                            >
                              –
                            </button>
                            <span className="px-2 text-[var(--cake-brown)] font-medium">
                              {item.quantity}
                            </span>
                            <button
                              className="w-7 h-7 rounded-full bg-[var(--cake-mint)]/30 text-[var(--cake-brown)] text-lg font-bold flex items-center justify-center hover:bg-[var(--cake-mint)]/60 transition"
                              onClick={() =>
                                updateQty(
                                  item.id,
                                  Math.min(item.quantity + 1, item.stock)
                                )
                              }
                              aria-label={`Increase quantity of ${item.name}`}
                              disabled={atLimit}
                              type="button"
                            >
                              +
                            </button>
                            <button
                              className="ml-2 text-xs text-red-500 underline"
                              onClick={() => removeFromCart(item.id)}
                              type="button"
                            >
                              Remove
                            </button>
                          </div>
                          {atLimit && (
                            <div className="text-xs text-red-500 mt-1">
                              Only {item.stock} in stock
                            </div>
                          )}
                        </div>
                        <div className="text-[var(--cake-brown)] font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      {idx < cartItems.length - 1 && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "90%" }}
                          exit={{ width: 0 }}
                          transition={{
                            duration: 0.45,
                            delay: 0.12 * idx,
                            type: "spring",
                            stiffness: 120,
                            damping: 18,
                          }}
                          className="mx-auto mt-4 border-t border-[var(--cake-brown)] opacity-40"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Animated, prominent divider above checkout */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "90%" }}
              exit={{ width: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.1 * cartItems.length,
                type: "spring",
                stiffness: 120,
                damping: 20,
              }}
              className="mx-auto mt-8 border-t-4 border-[var(--cake-brown)]/30"
            />

            <div className="pt-6 pb-6">
              <div className="flex justify-between font-semibold text-lg text-[var(--cake-brown)] mb-4">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button
                className="w-full bg-[var(--cake-pink)]/80 hover:bg-[var(--cake-pink)] text-[var(--cake-brown)] font-bold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200 focus:ring-2 focus:ring-[var(--cake-mint)] text-lg"
                // TODO: Connect to checkout flow

                disabled={cartItems.length === 0}
                onClick={() => {
                  onClose(); // Optionally close the drawer first
                  router.push("/checkout");
                }}
              >
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full mt-3 bg-[var(--cake-mint)]/70 hover:bg-[var(--cake-mint)] text-[var(--cake-brown)] font-bold py-3 px-6 rounded-2xl shadow-md transition-all duration-200 focus:ring-2 focus:ring-[var(--cake-pink)] text-lg"
                type="button"
                disabled={cartItems.length === 0}
              >
                Clear Cart
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
