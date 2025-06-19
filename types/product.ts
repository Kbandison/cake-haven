export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  ingredients: string[];
  stock: number;
  category: string | null;
  is_active: boolean;
  tags: string[];
  created_at: string;
};
