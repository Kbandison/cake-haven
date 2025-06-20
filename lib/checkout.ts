/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/checkout.ts
import { supabase } from "@/lib/supabaseClient";

export async function placeOrder({
  customer,
  items,
  total,
  notes, // <-- Added notes parameter
}: {
  customer: { name: string; email: string; phone: string; address: any };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  notes?: string; // <-- Notes is optional
}) {
  // 1. Insert into orders (get id)
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        customer_name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: JSON.stringify(customer.address),
        total,
        status: "pending",
        notes: notes || null, // <-- Save notes to db
      },
    ])
    .select()
    .single();

  if (orderError || !order?.id)
    throw new Error(orderError?.message || "Could not create order");

  // 2. Insert order items (batch insert)
  const itemsToInsert = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image_url: item.image,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);
  if (itemsError) throw new Error(itemsError.message);

  return order; // contains order.id, etc.
}
