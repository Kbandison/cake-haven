"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";

type Product = {
  id?: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  category?: string;
  is_active?: boolean;
};

type ProductModalProps = {
  open: boolean;
  initial: Product | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function ProductModal({
  open,
  initial,
  onClose,
  onSaved,
}: ProductModalProps) {
  const [form, setForm] = useState<Product>({
    name: "",
    price: 0,
    stock: 1,
    image_url: "",
    category: "",
    is_active: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(
      initial ?? {
        name: "",
        price: 0,
        stock: 1,
        image_url: "",
        category: "",
        is_active: true,
      }
    );
    setFile(null);
    setPreviewUrl(initial?.image_url ?? undefined);
    setErrorMsg(null);
    setLoading(false);
  }, [open, initial]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    let image_url = form.image_url || "";

    // 1. Upload image to Supabase Storage if file is selected
    if (file) {
      const ext = file.name.split(".").pop();
      const filename =
        (form.name.replace(/\s+/g, "-").toLowerCase() || "product") +
        "-" +
        Math.random().toString(36).substring(2, 8) +
        "." +
        ext;
      const filePath = `products/${filename}`;

      // --- This is the correct bucket! ---
      const { error: uploadError } = await supabase.storage
        .from("product-images") // <<<< use your bucket name
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        setErrorMsg("Image upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      image_url = urlData.publicUrl;
    }

    // 2. Upsert to Supabase table
    const productPayload = {
      ...form,
      image_url,
    };
    let result, error;
    if (form.id) {
      // Update existing
      ({ data: result, error } = await supabase
        .from("products")
        .update(productPayload)
        .eq("id", form.id)
        .select()
        .single());
    } else {
      // Create new
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ data: result, error } = await supabase
        .from("products")
        .insert([productPayload])
        .select()
        .single());
    }

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSaved();
    onClose();
  }

  function handleFileChange(file: File | null) {
    setFile(file);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/30 flex items-center justify-center backdrop-blur">
      <div className="relative bg-white max-w-md w-full rounded-2xl shadow-2xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded hover:bg-[var(--cake-yellow)]/50 focus:ring-2 focus:ring-[var(--cake-pink)]"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-5 text-[var(--cake-brown)]">
          {form.id ? "Edit Product" : "Add Product"}
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Image Uploader */}
          <label
            htmlFor="product-image"
            tabIndex={0}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileChange(file);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="block mx-auto mb-4 aspect-square w-40 h-40 flex items-center justify-center border-2 border-dashed border-[var(--cake-pink)] bg-[var(--cake-yellow)]/30 rounded-2xl cursor-pointer overflow-hidden group focus:ring-2 focus:ring-[var(--cake-pink)] transition relative"
            style={{ position: "relative" }}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-[var(--cake-brown)]">
                <svg
                  className="w-8 h-8 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="font-medium text-sm opacity-80">
                  Upload Image
                </span>
              </div>
            )}
            <input
              id="product-image"
              type="file"
              accept="image/*"
              className="hidden"
              tabIndex={-1}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
            />
          </label>
          {/* Remove Image Button */}
          {previewUrl && (
            <button
              type="button"
              className="text-xs underline text-red-500 mb-2"
              onClick={() => {
                setFile(null);
                setPreviewUrl(undefined);
                setForm((f) => ({ ...f, image_url: "" }));
              }}
            >
              Remove Image
            </button>
          )}

          <div>
            <label className="block text-sm font-semibold text-[var(--cake-brown)] mb-1">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded px-3 py-2 border focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[var(--cake-brown)] mb-1">
                Price
              </label>
              <input
                name="price"
                type="number"
                min={0}
                step=".01"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded px-3 py-2 border focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--cake-brown)] mb-1">
                Stock
              </label>
              <input
                name="stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={handleChange}
                required
                className="w-full rounded px-3 py-2 border focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--cake-brown)] mb-1">
              Category
            </label>
            <input
              name="category"
              value={form.category || ""}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 border focus:ring-2 focus:ring-[var(--cake-pink)] text-[var(--cake-brown)]"
              placeholder="(Optional)"
            />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <input
              type="checkbox"
              name="is_active"
              checked={!!form.is_active}
              onChange={handleChange}
              className="accent-[var(--cake-pink)] w-4 h-4"
              id="active-switch"
            />
            <label
              htmlFor="active-switch"
              className="text-sm text-[var(--cake-brown)]"
            >
              Active
            </label>
          </div>

          {errorMsg && (
            <div className="text-red-500 text-sm mt-2">{errorMsg}</div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--cake-pink)] hover:bg-[var(--cake-mint)] text-[var(--cake-brown)] font-bold py-2 px-6 rounded-xl shadow focus:ring-2 focus:ring-[var(--cake-mint)] transition disabled:opacity-60"
            >
              {loading ? "Saving…" : form.id ? "Save Changes" : "Add Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--cake-brown)] underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
