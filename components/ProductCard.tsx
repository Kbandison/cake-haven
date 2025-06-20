"use client";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Product } from "@/types/product";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const outOfStock = !product.stock || product.stock <= 0;

  function handleAddToCart() {
    if (outOfStock) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        image: product.image_url,
        price: product.price,
        stock: product.stock, // <--- ADD STOCK!
      },
      qty
    );

    setQty(1);
  }

  return (
    <div className="bg-white/90 rounded-3xl shadow-xl border border-[var(--cake-yellow)] flex flex-col p-5 items-center transition hover:scale-[1.03] hover:shadow-2xl group relative">
      <div className="relative w-36 h-36 mb-4">
        <Link
          href={`/products/${product.id}`}
          className="block relative aspect-square w-full bg-[var(--cake-yellow)]/20 transition-transform group-hover:scale-[1.03]"
          tabIndex={-1}
        >
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover rounded-2xl bg-[var(--cake-pink)]/20 transition group-hover:scale-105"
            sizes="144px"
          />
          {outOfStock && (
            <span className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold shadow">
              Out of Stock
            </span>
          )}
        </Link>
      </div>
      <h3 className="font-bold text-[var(--cake-brown)] text-xl mb-1 text-center">
        {product.name}
      </h3>
      <div className="text-[var(--cake-brown)] text-base opacity-80 mb-2 text-center line-clamp-2 min-h-[2.5em]">
        {product.description}
      </div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg font-bold text-[var(--cake-brown)]">
          ${product.price.toFixed(2)}
        </span>
      </div>
      {!outOfStock && (
        <div className="flex items-center gap-3 mb-4">
          <button
            className="w-8 h-8 rounded-full bg-[var(--cake-mint)]/30 text-[var(--cake-brown)] text-xl font-bold flex items-center justify-center hover:bg-[var(--cake-mint)]/70 transition"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            type="button"
            disabled={qty <= 1}
          >
            -
          </button>
          <span className="text-[var(--cake-brown)] font-semibold px-2">
            {qty}
          </span>
          <button
            className="w-8 h-8 rounded-full bg-[var(--cake-mint)]/30 text-[var(--cake-brown)] text-xl font-bold flex items-center justify-center hover:bg-[var(--cake-mint)]/70 transition"
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            aria-label="Increase quantity"
            type="button"
            disabled={qty >= product.stock}
          >
            +
          </button>
        </div>
      )}
      <button
        onClick={handleAddToCart}
        className={`w-full flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-2xl shadow transition-all duration-200 focus:ring-2 focus:ring-[var(--cake-mint)]
          ${
            outOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[var(--cake-pink)] hover:bg-[var(--cake-yellow)] text-[var(--cake-brown)]"
          }`}
        type="button"
        disabled={outOfStock}
        aria-disabled={outOfStock}
      >
        <ShoppingCart className="w-5 h-5" />
        {outOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
