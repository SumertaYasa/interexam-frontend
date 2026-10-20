// app/utils/apiUrl.ts

// Ambil URL dasar dari env atau gunakan Railway production sebagai default
const RAW_API_BASE: string =
  (import.meta.env.VITE_API_BASE_URL as string) ||
  "https://interexam-backend-production.up.railway.app/api/v1";

// URL untuk endpoint API v1 (misal: https://interexam-backend-production.up.railway.app/api/v1)
export const API_BASE_URL: string = RAW_API_BASE.replace(/\/+$/, "");

// URL root Backend tanpa "/api/v1" (misal: https://interexam-backend-production.up.railway.app)
export const BACKEND_URL: string = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

// URL untuk Auth routes (misal: https://interexam-backend-production.up.railway.app/api/auth)
export const AUTH_API_URL: string = `${BACKEND_URL}/api/auth`;
