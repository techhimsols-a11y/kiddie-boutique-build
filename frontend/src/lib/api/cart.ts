import { supabase } from "../supabaseClient";

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

async function getAuthHeader(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  stock?: number | null;
};

export type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
  product?: CartProduct | null;
};

export async function getCart(): Promise<CartItem[]> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/api/cart`, { headers });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addToCart(input: { product_id: string; quantity: number; size?: string; color?: string }): Promise<CartItem> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}

export async function updateCartItem(id: string, quantity: number): Promise<CartItem> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/api/cart/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update cart item");
  return res.json();
}

export async function removeCartItem(id: string): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/api/cart/${id}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error("Failed to remove cart item");
}


