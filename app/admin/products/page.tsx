/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import {
  Plus,
  Pencil,
  Trash,
  Search,
  X,
  CheckSquare,
  Square,
} from "lucide-react";
// Import your real ProductModal!
import ProductModal from "@/components/ProductModal";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  category?: string;
  is_active?: boolean;
  created_at?: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Bulk selection state
  const [selected, setSelected] = useState<string[]>([]);

  // Search and pagination
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const [actionLoading, setActionLoading] = useState(false);

  // Modal logic
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Refetch function
  const fetchProducts = async (qsearch = search, qpage = page) => {
    setLoading(true);
    setErrorMsg(null);
    const from = (qpage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    if (qsearch) {
      query = query.ilike("name", `%${qsearch}%`);
    }
    const { data, error } = await query;
    if (error) setErrorMsg(error.message);
    setProducts(data || []);
    setLoading(false);
    setSelected([]);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, modalOpen]); // refetch on modal close (after save)

  // Bulk Actions
  async function handleBulkDelete() {
    if (!selected.length) return;
    if (!window.confirm(`Delete ${selected.length} products?`)) return;
    setActionLoading(true);
    const { error } = await supabase
      .from("products")
      .delete()
      .in("id", selected);
    if (error) setErrorMsg(error.message);
    await fetchProducts();
    setActionLoading(false);
  }

  async function handleBulkActivate(active: boolean) {
    if (!selected.length) return;
    setActionLoading(true);
    const { error } = await supabase
      .from("products")
      .update({ is_active: active })
      .in("id", selected);
    if (error) setErrorMsg(error.message);
    await fetchProducts();
    setActionLoading(false);
  }

  // "Select all on this page"
  const allSelected =
    products.length > 0 && selected.length === products.length;

  // Modal triggers
  function openAddModal() {
    setEditingProduct(null);
    setModalOpen(true);
  }
  function openEditModal(product: Product) {
    setEditingProduct(product);
    setModalOpen(true);
  }
  function closeModal(refresh = false) {
    setModalOpen(false);
    setEditingProduct(null);
    if (refresh) fetchProducts();
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[var(--cake-brown)]">
          Products
        </h1>
        <button
          className="flex gap-2 items-center bg-[var(--cake-pink)] text-[var(--cake-brown)] px-4 py-2 rounded-xl shadow hover:bg-[var(--cake-mint)] transition font-semibold"
          onClick={openAddModal}
          type="button"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Error display */}
      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          Error: {errorMsg}
        </div>
      )}

      {/* Search */}
      <div className="relative w-full max-w-xs mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cake-brown)] opacity-70 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9 pr-8 py-2 rounded border border-gray-200 shadow w-full focus:ring-2 focus:ring-[var(--cake-pink)] focus:border-[var(--cake-pink)] transition-colors text-sm outline-none"
          placeholder="Search cakes…"
        />
        {!!searchInput && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--cake-yellow)]/30"
            onClick={() => setSearchInput("")}
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-[var(--cake-brown)] opacity-70" />
          </button>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center bg-[var(--cake-yellow)]/70 border border-[var(--cake-shadow)] shadow px-4 py-3 mb-6 rounded-xl animate-in fade-in">
          <span className="font-medium text-[var(--cake-brown)]">
            {selected.length} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="flex gap-1 items-center bg-red-100 text-red-800 font-semibold px-4 py-2 rounded hover:bg-red-200 transition disabled:opacity-60"
            disabled={actionLoading || loading}
          >
            <Trash className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={() => handleBulkActivate(true)}
            className="flex gap-1 items-center bg-[var(--cake-mint)]/80 text-[var(--cake-brown)] font-semibold px-4 py-2 rounded hover:bg-[var(--cake-mint)] transition disabled:opacity-60"
            disabled={actionLoading || loading}
          >
            <CheckSquare className="w-4 h-4" />
            Activate
          </button>
          <button
            onClick={() => handleBulkActivate(false)}
            className="flex gap-1 items-center bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-400 transition disabled:opacity-60"
            disabled={actionLoading || loading}
          >
            <Square className="w-4 h-4" />
            Deactivate
          </button>
        </div>
      )}

      {/* Select all on page */}
      {!loading && products.length > 0 && (
        <div className="col-span-full flex items-center mb-2">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => {
              if (e.target.checked) {
                setSelected(products.map((p) => p.id));
              } else {
                setSelected([]);
              }
            }}
            className="mr-2 w-5 h-5 accent-[var(--cake-pink)]"
            aria-label="Select all products on page"
          />
          <span className="text-[var(--cake-brown)] text-xs">
            Select all on page
          </span>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading && (
          <div className="col-span-full text-center opacity-60 py-12">
            Loading…
          </div>
        )}
        {!loading && products.length === 0 && (
          <div className="col-span-full text-center opacity-50 py-10">
            No products found.
          </div>
        )}
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-white border border-gray-100 rounded-xl shadow p-4 flex flex-col gap-3 relative"
          >
            {/* Bulk checkbox */}
            <input
              type="checkbox"
              checked={selected.includes(prod.id)}
              onChange={(e) =>
                setSelected((sel) =>
                  e.target.checked
                    ? [...sel, prod.id]
                    : sel.filter((id) => id !== prod.id)
                )
              }
              className="absolute top-3 left-3 w-5 h-5 accent-[var(--cake-pink)] z-10"
              aria-label={`Select product ${prod.name}`}
            />

            <div className="relative w-full aspect-[4/3] bg-[var(--cake-yellow)]/20 rounded-xl overflow-hidden">
              {prod.image_url ? (
                <Image
                  src={prod.image_url}
                  alt={prod.name}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--cake-brown)] opacity-40">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg text-[var(--cake-brown)]">
                {prod.name}
              </div>
              <div className="opacity-70 text-sm">${prod.price.toFixed(2)}</div>
              <div className="opacity-60 text-xs">{prod.category}</div>
              <div className="opacity-60 text-xs">
                Stock: {prod.stock ?? "N/A"}
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--cake-mint)]/70 rounded text-xs text-[var(--cake-brown)] hover:bg-[var(--cake-mint)] font-semibold"
                onClick={() => openEditModal(prod)}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </div>
            {!prod.is_active && (
              <span className="absolute top-3 right-3 px-2 py-1 rounded-xl bg-gray-300 text-[var(--cake-brown)] text-xs font-semibold">
                Inactive
              </span>
            )}
          </div>
        ))}
      </div>

      {/* MODAL: show at root level, state-based */}
      <ProductModal
        open={modalOpen}
        initial={editingProduct}
        onClose={() => closeModal()}
        onSaved={() => closeModal(true)}
      />
    </div>
  );
}
