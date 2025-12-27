/**
 * Create a URL-friendly slug from a string.
 * Pure, deterministic, framework-agnostic utility.
 *
 * Examples:
 *   slugify("Paket Soal 1"); // "paket-soal-1"
 *
 * @param value - the input string to convert into a slug
 * @param options - optional settings (separator)
 * @returns a normalized, lowercase slug with only alphanumeric characters and the separator
 */
export function slugify(
  value: string,
  options?: { separator?: string }
): string {
  const separator = options?.separator ?? "-";
  if (typeof value !== "string") return "";

  // Normalize unicode to decompose diacritics, then remove them
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "");
}

// Example usage (clean and self-documenting):
// import { slugify } from "~/utils/slugify";
// const path = `/dashboard-subscriber/latihan/${slugify("Paket Soal 1")}`;

/**
 * Convert a slug (e.g. "paket-soal-1") back into a readable label (e.g. "Paket Soal 1").
 * This function is pure and framework-agnostic.
 *
 * @param value - the slug string to humanize
 * @param options.separator - the separator used in the slug (default "-")
 * @param options.capitalize - whether to capitalize each word (default false)
 */
export function humanizeSlug(
  value: string,
  options?: { separator?: string; capitalize?: boolean }
): string {
  if (typeof value !== "string") return "";
  const separator = options?.separator ?? "-";

  const parts = String(value)
    .split(new RegExp(`[${separator}]+`))
    .filter(Boolean)
    .map((part) => part.replace(/[^a-z0-9]/gi, ""));

  if (options?.capitalize) {
    return parts
      .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
  }

  return parts.join(" ");
}
