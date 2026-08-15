/**
 * Normalizes UK phone numbers to a consistent "+44..." form so a booking made
 * with one format (e.g. "07825 031594") matches a lookup typed differently
 * later (e.g. "+44 7825 031594"). Applied both when a booking is created and
 * when the customer dashboard looks one up, so matching stays consistent
 * regardless of how either was typed.
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return raw.trim();
  if (digits.startsWith("44")) return `+${digits}`;
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  return `+44${digits}`;
}
