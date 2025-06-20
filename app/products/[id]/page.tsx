"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Loader, ArrowLeft, Plus, Minus, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // shadcn/ui

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
  stock: number;
  category?: string;
  is_active: boolean;
};

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState<Product[]>([]);
  const [upsells, setUpsells] = useState<Product[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    async function fetchProduct() {
      // Main product
      const { data: prod, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!prod || error) {
        setProduct(null);
        setImages([]);
        setLoading(false);
        return;
      }
      setProduct(prod);

      // Gallery
      const { data: imgs } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id);
      setImages([
        prod.image_url,
        ...(imgs?.map((i: ProductImage) => i.image_url) || []),
      ]);

      // Related (same category, not current product)
      if (prod.category) {
        const { data: rel } = await supabase
          .from("products")
          .select("*")
          .eq("category", prod.category)
          .neq("id", prod.id)
          .eq("is_active", true)
          .gt("stock", 0);

        setRelated((rel ?? []).sort(() => 0.5 - Math.random()).slice(0, 4));
      }

      // Upsells: Different category, most popular/stocked, not current
      const { data: up } = await supabase
        .from("products")
        .select("*")
        .neq("id", prod.id)
        .neq("category", prod.category)
        .eq("is_active", true)
        .gt("stock", 0)
        .order("stock", { ascending: false })
        .limit(4);

      setUpsells((up ?? []).sort(() => 0.5 - Math.random()).slice(0, 4));
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  // Accessibility/validation: limit qty
  const maxQty = product?.stock ?? 1;

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader className="w-8 h-8 text-[var(--cake-pink)] animate-spin" />
      </div>
    );
  if (!product)
    return (
      <div className="p-8 text-center">
        Product not found.
        <div>
          <button
            className="mt-4 flex items-center gap-2 underline text-[var(--cake-brown)]"
            onClick={() => router.back()}
          >
            <ArrowLeft /> Back
          </button>
        </div>
      </div>
    );

  return (
    <main className="max-w-5xl mx-auto py-10 px-3 my-12">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* --- Image Gallery --- */}
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border shadow-lg bg-[var(--cake-yellow)]/20 max-w-[420px] mx-auto">
            <Image
              src={images[imgIdx]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="420px"
            />
            {product.stock <= 0 && (
              <Badge className="absolute top-4 left-4 bg-red-600 text-white text-base">
                Out of Stock
              </Badge>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-5">
              {images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setImgIdx(idx)}
                  className={`border-2 rounded-lg overflow-hidden w-14 h-14 relative transition-all outline-none ${
                    idx === imgIdx
                      ? "border-[var(--cake-pink)] ring-2 ring-[var(--cake-pink)]"
                      : "border-transparent hover:border-[var(--cake-yellow)]"
                  }`}
                  aria-label={`Show image ${idx + 1}`}
                  tabIndex={0}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- Product Details & Add to Cart --- */}
        <div className="flex flex-col gap-5 justify-center">
          <div>
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm text-[var(--cake-pink)] hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
            <h1 className="text-3xl font-bold text-[var(--cake-brown)] mb-2">
              {product.name}
            </h1>
            <div className="text-lg text-[var(--cake-pink)] font-bold mb-1">
              ${product.price.toFixed(2)}
            </div>
            {product.category && (
              <div className="text-xs text-[var(--cake-brown)] opacity-70 mb-1">
                {product.category}
              </div>
            )}
            <div className="mb-1">
              {product.stock > 0 ? (
                <span className="text-green-700 text-sm">In stock</span>
              ) : (
                <span className="text-red-500 text-sm">Out of stock</span>
              )}
            </div>
          </div>
          {product.description && (
            <div className="mb-3">
              <h2 className="font-semibold text-[var(--cake-brown)] mb-1">
                Description
              </h2>
              <p className="text-[var(--cake-brown)] opacity-90 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
          {/* Quantity and Add to Cart */}
          {product.stock > 0 && (
            <form
              className="flex flex-col sm:flex-row items-center gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                addToCart({ ...product, image: product.image_url }, qty);
              }}
            >
              <span className="text-sm text-[var(--cake-brown)]">
                Quantity:
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="rounded-full border shadow"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <input
                  id="qty"
                  name="qty"
                  type="number"
                  min={1}
                  max={maxQty}
                  value={qty}
                  onChange={(e) =>
                    setQty(
                      Math.max(
                        1,
                        Math.min(maxQty, parseInt(e.target.value) || 1)
                      )
                    )
                  }
                  className="w-16 rounded border text-center p-2 focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)] appearance-none"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  aria-label="Quantity"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  className="rounded-full border shadow"
                  aria-label="Increase quantity"
                  disabled={qty >= maxQty}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button
                type="submit"
                className="bg-[var(--cake-pink)] hover:bg-[var(--cake-mint)] text-[var(--cake-brown)] font-bold py-2 px-6 rounded-xl shadow focus:ring-2 focus:ring-[var(--cake-mint)] transition"
                disabled={product.stock <= 0}
              >
                Add to Cart
              </Button>
            </form>
          )}
        </div>
      </section>
      {/* --- Upsells --- */}
      {upsells.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--cake-brown)]">
            <Sparkles className="w-5 h-5 text-[var(--cake-mint)]" />
            You Might Also Like
          </h2>
          <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {upsells.map((rel) => (
              <Link
                href={`/products/${rel.id}`}
                key={rel.id}
                className="group relative rounded-2xl border border-gray-100 bg-white shadow hover:shadow-xl transition overflow-hidden flex flex-col min-h-[340px]"
                tabIndex={0}
                aria-label={rel.name}
              >
                <div className="relative aspect-square w-full bg-[var(--cake-yellow)]/20">
                  <Image
                    src={rel.image_url}
                    alt={rel.name}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  {rel.stock <= 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow">
                      Out of stock
                    </span>
                  )}
                </div>
                <div className="flex-1 p-4 flex flex-col gap-2">
                  <div className="font-semibold text-lg text-[var(--cake-brown)] truncate">
                    {rel.name}
                  </div>
                  <div className="text-[var(--cake-pink)] font-bold text-xl">
                    ${rel.price.toFixed(2)}
                  </div>
                  {rel.category && (
                    <div className="text-xs text-[var(--cake-brown)] opacity-70">
                      {rel.category}
                    </div>
                  )}
                  <div
                    className={
                      rel.stock > 0
                        ? "text-xs text-green-700"
                        : "text-xs text-red-500"
                    }
                  >
                    {rel.stock > 0 ? "In stock" : "Out of stock"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* --- Related Products --- */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6 text-[var(--cake-brown)]">
            Related Cakes
          </h2>
          <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {related.map((rel) => (
              <Link
                href={`/products/${rel.id}`}
                key={rel.id}
                className="group relative rounded-2xl border border-gray-100 bg-white shadow hover:shadow-xl transition overflow-hidden flex flex-col min-h-[340px]"
                tabIndex={0}
                aria-label={rel.name}
              >
                <div className="relative aspect-square w-full bg-[var(--cake-yellow)]/20">
                  <Image
                    src={rel.image_url}
                    alt={rel.name}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  {rel.stock <= 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow">
                      Out of stock
                    </span>
                  )}
                </div>
                <div className="flex-1 p-4 flex flex-col gap-2">
                  <div className="font-semibold text-lg text-[var(--cake-brown)] truncate">
                    {rel.name}
                  </div>
                  <div className="text-[var(--cake-pink)] font-bold text-xl">
                    ${rel.price.toFixed(2)}
                  </div>
                  {rel.category && (
                    <div className="text-xs text-[var(--cake-brown)] opacity-70">
                      {rel.category}
                    </div>
                  )}
                  <div
                    className={
                      rel.stock > 0
                        ? "text-xs text-green-700"
                        : "text-xs text-red-500"
                    }
                  >
                    {rel.stock > 0 ? "In stock" : "Out of stock"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
