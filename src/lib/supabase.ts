import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = import.meta.env["VITE_SUPABASE_URL"];
const publishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

if (!url || !publishableKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY — check .env.local.");
}

/** Anon/publishable-key client only — never import a service-role key into client code. */
export const supabase = createClient<Database>(url, publishableKey);

/**
 * Server-only: a fresh client scoped to one caller's already-issued Supabase
 * access token, so a server function can run a query/RPC AS that specific
 * authenticated user (e.g. so auth.uid() resolves correctly inside an
 * admin-only RPC like is_admin()) — never mutate the shared `supabase`
 * singleton above for this, since it's a module-level instance reused
 * across concurrent requests.
 */
export function createAuthedSupabaseClient(accessToken: string) {
  return createClient<Database>(url, publishableKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
