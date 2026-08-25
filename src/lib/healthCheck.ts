import { createServerFn } from "@tanstack/react-start";
import { createAuthedSupabaseClient } from "./supabase";
import { checkGoogleCalendarConnection, type ConnectionCheckResult } from "./googleCalendar";

export type ConnectionHealth = {
  supabase: ConnectionCheckResult;
  googleCalendar: ConnectionCheckResult;
  checkedAt: string;
};

/**
 * Admin-only, on-demand connection check for /admin/health. Requires the
 * caller's own Supabase access token (not the shared anon `supabase`
 * client) so is_admin() resolves auth.uid() to the actual signed-in user —
 * mirrors exactly how every other admin RPC (list_all_bookings etc.)
 * authorizes its caller.
 *
 * Deliberately fails closed: if the admin check itself can't be verified
 * (bad/expired token, or a genuine Supabase outage — the two are
 * indistinguishable from here), this throws before ever running the Google
 * Calendar check, rather than leaking a partial result to an unauthorized
 * or unauthenticated caller. A successful is_admin() call is itself the
 * proof Supabase is reachable, so there's no separate Supabase-only query.
 */
export const checkConnections = createServerFn({ method: "POST" })
  .validator((input: { accessToken: string }) => input)
  .handler(async ({ data }): Promise<ConnectionHealth> => {
    const authed = createAuthedSupabaseClient(data.accessToken);
    const { data: isAdmin, error: adminError } = await authed.rpc("is_admin");
    if (adminError || !isAdmin) {
      throw new Error("Not authorized.");
    }

    const googleCalendar = await checkGoogleCalendarConnection();

    return {
      supabase: { ok: true, detail: "Connected — admin check round-tripped successfully." },
      googleCalendar,
      checkedAt: new Date().toISOString(),
    };
  });
