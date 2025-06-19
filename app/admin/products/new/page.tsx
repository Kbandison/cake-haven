/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image_url: "",
    category: "",
    ingredients: "",
    tags: "",
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === "checkbox" && "checked" in e.target) {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setForm((f) => ({
      ...f,
      [name]: newValue,
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    // Convert numeric and JSON fields as needed
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      ingredients: form.ingredients ? JSON.parse(form.ingredients) : [],
      tags: form.tags ? JSON.parse(form.tags) : [],
    };
    const { error } = await supabase.from("products").insert([payload]);
    setSaving(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/admin/products");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-xl mt-8">
      <h1 className="text-2xl font-bold text-[var(--cake-brown)] mb-4">
        Add New Product
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="input"
          placeholder="Name"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          step="0.01"
          required
          className="input"
          placeholder="Price"
        />
        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          type="number"
          min="0"
          required
          className="input"
          placeholder="Stock"
        />
        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          className="input"
          placeholder="Image URL"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input"
          placeholder="Category"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="input"
          placeholder="Description"
        />
        <input
          name="ingredients"
          value={form.ingredients}
          onChange={handleChange}
          className="input"
          placeholder='Ingredients (JSON: ["sugar","eggs"])'
        />
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="input"
          placeholder='Tags (JSON: ["chocolate","bestseller"])'
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Active
        </label>
        {errorMsg && <div className="text-red-500">{errorMsg}</div>}
        <button
          className="bg-[var(--cake-pink)] text-[var(--cake-brown)] py-2 px-4 rounded-xl font-bold hover:bg-[var(--cake-mint)] transition"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
