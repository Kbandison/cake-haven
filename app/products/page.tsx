"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Loader, Search, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  stock: number;
  category?: string;
  is_active: boolean;
  quantity?: number;
};

const PRODUCTS_PER_PAGE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Track quantity per product (by id)
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Category list
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .filter((p) => !!p.category)
            .map((p) => p.category?.trim())
            .filter(Boolean)
        )
      ) as string[],
    [products]
  );

  // Cart
  const { addToCart } = useCart();

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset page to 1 if filters/search change
  useEffect(() => {
    setPage(1);
  }, [category, search]);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .gt("stock", 0)
        .order("created_at", { ascending: false });
      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Filtering
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
    }
    return filtered;
  }, [products, category, search]);

  // Pagination logic
  const pageCount = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice(
        (page - 1) * PRODUCTS_PER_PAGE,
        page * PRODUCTS_PER_PAGE
      ),
    [filteredProducts, page]
  );

  // Quantity state per product
  const handleQuantityChange = (id: string, nextQty: number, max: number) => {
    setQuantities((q) => ({
      ...q,
      [id]: Math.max(1, Math.min(nextQty, max)),
    }));
  };

  return (
    <main className="max-w-6xl mx-auto py-8 px-2 sm:px-4 mt-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-12 text-[var(--cake-brown)]">
        Shop Cakes
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--cake-brown)] opacity-50" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search cakes…"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow text-sm focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
            aria-label="Search products"
          />
        </div>
        {/* Category dropdown */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="category" className="sr-only">
              Filter by category
            </label>
            <select
              id="category"
              value={category || ""}
              onChange={(e) => setCategory(e.target.value || null)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm bg-white text-[var(--cake-brown)] focus:ring-2 focus:ring-[var(--cake-pink)] shadow"
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
        <span className="text-xs opacity-70 ml-auto">
          {filteredProducts.length} product
          {filteredProducts.length !== 1 && "s"}
        </span>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader className="animate-spin w-8 h-8 text-[var(--cake-pink)]" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 mt-12">
            {paginatedProducts.map((product) => {
              const qty = quantities[product.id] || 1;
              return (
                <div
                  key={product.id}
                  className={cn(
                    "group relative rounded-2xl border border-gray-100 bg-white shadow hover:shadow-xl transition overflow-hidden flex flex-col text-[var(--cake-brown)]"
                  )}
                  tabIndex={0}
                  aria-label={product.name}
                >
                  {/* Product image + stock badge */}
                  <Link
                    href={`/products/${product.id}`}
                    className="block relative aspect-square w-full bg-[var(--cake-yellow)]/20 transition-transform group-hover:scale-[1.03]"
                    tabIndex={-1}
                  >
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="350px"
                      priority={false}
                    />
                    {product.stock <= 0 && (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                        Out of stock
                      </Badge>
                    )}
                  </Link>
                  <div className="flex-1 px-5 pt-5 flex flex-col gap-2 min-h-[110px]">
                    <div className="font-semibold text-lg sm:text-xl truncate">
                      {product.name}
                    </div>
                    <div className="text-[var(--cake-pink)] font-bold text-xl ">
                      ${product.price.toFixed(2)}
                    </div>
                    {product.category && (
                      <div className="text-xs text-[var(--cake-brown)] opacity-70">
                        {product.category}
                      </div>
                    )}
                  </div>
                  <div className="p-5 pt-0 flex flex-col gap-3">
                    {/* Inline quantity selector */}
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className="w-6 h-6 rounded border bg-gray-100 flex items-center justify-center font-bold hover:bg-[var(--cake-yellow)]/60 transition disabled:opacity-30"
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            qty - 1,
                            product.stock
                          )
                        }
                        disabled={qty <= 1}
                        tabIndex={product.stock > 0 ? 0 : -1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={product.stock}
                        value={qty}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            parseInt(e.target.value, 10) || 1,
                            product.stock
                          )
                        }
                        className="w-10 px-2 py-1 rounded border text-center text-base"
                        disabled={product.stock <= 0}
                        aria-label="Quantity"
                        tabIndex={product.stock > 0 ? 0 : -1}
                      />
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        className="w-6 h-6 rounded border bg-gray-100 flex items-center justify-center font-bold hover:bg-[var(--cake-yellow)]/60 transition disabled:opacity-30"
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            qty + 1,
                            product.stock
                          )
                        }
                        disabled={qty >= product.stock}
                        tabIndex={product.stock > 0 ? 0 : -1}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <span className="ml-auto text-xs opacity-60">
                        {product.stock} in stock
                      </span>
                    </div>
                    <button
                      type="button"
                      className={cn(
                        "w-full rounded-xl py-3 font-semibold shadow transition text-base",
                        product.stock > 0
                          ? "bg-[var(--cake-pink)] text-[var(--cake-brown)] hover:bg-[var(--cake-mint)]"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      )}
                      onClick={() =>
                        addToCart({ ...product, image: product.image_url }, qty)
                      }
                      disabled={product.stock <= 0}
                      aria-disabled={product.stock <= 0}
                      tabIndex={product.stock > 0 ? 0 : -1}
                    >
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Pagination controls */}
          {pageCount > 1 && (
            <nav
              className="flex justify-center mt-10 gap-2"
              aria-label="Pagination"
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-[var(--cake-brown)] font-bold shadow hover:bg-[var(--cake-pink)]/40 disabled:opacity-40"
                aria-label="Previous page"
              >
                &larr;
              </button>
              {Array.from({ length: pageCount }).map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setPage(idx + 1)}
                  className={cn(
                    "px-3 py-2 rounded-lg font-bold shadow border",
                    page === idx + 1
                      ? "bg-[var(--cake-pink)] text-[var(--cake-brown)] border-[var(--cake-pink)]"
                      : "bg-white text-[var(--cake-brown)] border-gray-300 hover:bg-[var(--cake-yellow)]/40"
                  )}
                  aria-current={page === idx + 1 ? "page" : undefined}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-[var(--cake-brown)] font-bold shadow hover:bg-[var(--cake-pink)]/40 disabled:opacity-40"
                aria-label="Next page"
              >
                &rarr;
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
