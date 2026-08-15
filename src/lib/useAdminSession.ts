import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

/**
 * Only admins ever get a Supabase Auth account in this project — customers
 * are looked up by phone number, never signed in — so an active session here
 * is equivalent to "is an admin" for UI purposes. The real authorization
 * check still happens server-side inside every admin RPC (see the `admins`
 * table check in list_all_bookings etc.); this hook only controls whether
 * admin-only UI (the nav link, the dashboard) renders at all.
 *
 * undefined = still checking for an existing session, null = signed out.
 */
export function useAdminSession(): Session | null | undefined {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return session;
}
