/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/FeaturedProducts.tsx
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Product } from "@/types/product";

export default async function FeaturedProducts() {
  // Fetch the 3 newest active products (featured cakes)
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">Unable to load cakes!</div>
    );
  }

  const productsTyped: Product[] =
    products?.map((p: any) => ({
      ...p,
      ingredients:
        typeof p.ingredients === "string"
          ? JSON.parse(p.ingredients)
          : p.ingredients,
      tags: typeof p.tags === "string" ? JSON.parse(p.tags) : p.tags,
    })) ?? [];

  return (
    <section
      className="max-w-5xl mx-auto px-4 py-12"
      aria-labelledby="featured-cakes-heading"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2
          id="featured-cakes-heading"
          className="text-2xl font-bold text-[var(--cake-brown)]"
        >
          Featured Cakes
        </h2>
        <Link
          href="/products"
          className="inline-block rounded-xl px-6 py-2 bg-[var(--cake-pink)] text-[var(--cake-brown)] font-semibold shadow hover:bg-[var(--cake-mint)] transition focus:ring-2 focus:ring-[var(--cake-mint)]"
        >
          See all cakes
        </Link>
      </div>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {productsTyped.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
