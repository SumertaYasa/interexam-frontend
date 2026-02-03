const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const ASSET_URL = API_BASE.replace("/api/v1", "");

/**
 * Mengubah path gambar dari backend menjadi URL lengkap yang valid
 * @param path - Path mentah dari database (misal: uploads\\paket\\gambar.jpg)
 * @param fallback - Gambar default jika path kosong
 * @returns String URL lengkap
 */
export const getAssetUrl = (
  path: string | null | undefined,
  fallback: string = "/person.jpg",
): string => {
  if (!path) return fallback;

  // Bersihkan backslash menjadi forward slash agar bisa dibaca browser
  const cleanPath = path.replace(/\\/g, "/");

  // Jika path sudah berupa URL lengkap (http/https), kembalikan langsung
  if (cleanPath.startsWith("http")) {
    return cleanPath;
  }

  // Gabungkan dengan Asset URL server.
  // Pastikan tidak ada double slash (//) di tengah
  const slash = cleanPath.startsWith("/") ? "" : "/";

  return `${ASSET_URL}${slash}${cleanPath}`;
};
