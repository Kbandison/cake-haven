// /app/client-layout.tsx
"use client";
import { CartProvider } from "@/context/CartContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {/* <OrdersProvider> if you need */}
      {children}
      {/* </OrdersProvider> */}
    </CartProvider>
  );
}
