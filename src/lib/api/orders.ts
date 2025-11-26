import { supabase } from "../supabaseClient";

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

async function getAuthHeader(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: { id: string; name: string; image_url?: string | null } | null;
};

export type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number;
  currency: string;
  created_at: string;
  order_items?: OrderItem[] | null;
};

export async function listOrders(all = false): Promise<Order[]> {
  const headers = await getAuthHeader();
  const query = all ? "?all=1" : "";
  const res = await fetch(`${API_URL}/api/orders${query}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function createOrder(): Promise<Order> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/api/orders`, { method: "POST", headers });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}


