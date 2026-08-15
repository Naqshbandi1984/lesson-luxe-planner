import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = import.meta.env["VITE_SUPABASE_URL"];
const publishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

if (!url || !publishableKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY — check .env.local.");
}

/** Anon/publishable-key client only — never import a service-role key into client code. */
export const supabase = createClient<Database>(url, publishableKey);
