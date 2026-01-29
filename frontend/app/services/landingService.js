import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const landingService = {
  getPublicPackages: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/landing/pakets`, {
        params: {
          search: params.search || "",
          category: params.category || "all",
        },
      });
      return response.data.data || [];
    } catch (error) {
      console.error("Gagal ambil paket publik:", error);
      return [];
    }
  },
};
