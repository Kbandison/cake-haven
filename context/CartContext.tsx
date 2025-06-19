"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number; // <-- ADD STOCK!
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, newQty: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
};

const CART_STORAGE_KEY = "cake-haven-cart";
const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Add to cart, merge if already present, never above stock!
  function addToCart(item: Omit<CartItem, "quantity">, qty = 1) {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.id === item.id);
      const allowedQty = Math.min(qty, item.stock);
      if (existing) {
        // Don't exceed available stock
        const newQty = Math.min(existing.quantity + qty, item.stock);
        return prev.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: newQty } : ci
        );
      }
      return [...prev, { ...item, quantity: allowedQty }];
    });
  }

  function removeFromCart(id: string) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateQty(id: string, newQty: number) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(newQty, item.stock)) }
          : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
