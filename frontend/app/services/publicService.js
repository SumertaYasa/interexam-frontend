import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const publicService = {
  /**
   * Mengambil data paket soal untuk fitur "Coba Gratis" di Landing Page
   */
  getDemoExam: async () => {
    try {
      // Perhatikan: Tidak memanggil getAuthHeader()
      const response = await axios.get(`${API_BASE_URL}/public/coba-gratis`);
      return response.data.data;
    } catch (error) {
      console.error(
        "Gagal mengambil soal demo:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
