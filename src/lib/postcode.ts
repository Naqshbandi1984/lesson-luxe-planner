/** Standard UK postcode pattern (outward + inward code), case-insensitive,
 * tolerant of zero or more spaces between the two parts. */
const UK_POSTCODE_RE = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/i;

export function isValidUkPostcode(value: string): boolean {
  return UK_POSTCODE_RE.test(value.trim());
}

/** Uppercases and inserts a single space before the inward code
 * ("rg11ab" / "rg1 1ab" -> "RG1 1AB"). Returns the trimmed input unchanged
 * if it doesn't match the expected shape, rather than guessing. */
export function normalizeUkPostcode(value: string): string {
  const match = UK_POSTCODE_RE.exec(value.trim());
  if (!match) return value.trim().toUpperCase();
  return `${match[1]!.toUpperCase()} ${match[2]!.toUpperCase()}`;
}

/** The outward code ("RG1 1AB" -> "RG1") used to check area coverage. */
export function outwardCode(postcode: string): string | null {
  const match = UK_POSTCODE_RE.exec(postcode.trim());
  return match ? match[1]!.toUpperCase() : null;
}
