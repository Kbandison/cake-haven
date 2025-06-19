/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

export default async function ProductGrid() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

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
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {productsTyped.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
