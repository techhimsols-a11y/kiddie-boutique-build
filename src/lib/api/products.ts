import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  category?: string | null;
  age_group?: string | null;
  rating?: number | null;
  review_count?: number | null;
  featured?: boolean | null;
  image_url?: string | null;
  images?: string[] | null;
  sizes?: string[] | null;
  colors?: string[] | null;
  stock?: number | null;
};

export async function listProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price,original_price,category,age_group,rating,review_count,featured,image_url,images,sizes,colors,stock")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price,original_price,category,age_group,rating,review_count,featured,image_url,images,sizes,colors,stock")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? null;
}
