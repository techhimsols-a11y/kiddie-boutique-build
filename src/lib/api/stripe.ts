import { supabase } from "../supabaseClient";

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

async function getAuthHeader(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createCheckoutSession(): Promise<{ id: string; url?: string | null }> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/api/stripe/checkout`, { method: "POST", headers });
  if (!res.ok) throw new Error("Failed to create checkout session");
  return res.json();
}


