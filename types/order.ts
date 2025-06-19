/* eslint-disable @typescript-eslint/no-explicit-any */
export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image_url: string | null;
  customizations?: any; // Or a more specific type if you have one!
};

export type Order = {
  id: string;
  customer_name: string;
  email: string;
  phone?: string;
  total: number;
  status: string;
  created_at: string;
  fulfilled_at?: string;
  notes?: string;
  admin_notes?: string;
  address?: string | Record<string, any>; // <-- Add this!
  // ...any other fields you use
  order_items?: OrderItem[];
};
