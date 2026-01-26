import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const saveService = {
  // Ambil bank soal yang bisa disimpan
  getBankSoal: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriber/bank-soal`, {
        params: {
          search: params.search || "",
          matapelajaran: params.matapelajaran || "all",
          jenjang: params.jenjang || "all",
          level: params.level || "all",
          page: params.page || 1,
          limit: params.limit || 10,
        },
        ...getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Gagal ambil bank soal:", error);
      return { status: "error", data: [], meta: { total: 0, page: 1 } };
    }
  },

  // Ambil daftar soal yang sudah disimpan
  getFavoriteSoal: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriber/favorites`, {
        params: {
          search: params.search || "",
          page: params.page || 1,
          limit: params.limit || 10,
        },
        ...getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Gagal ambil soal favorit:", error);
      return { status: "error", data: [], meta: { total: 0, page: 1 } };
    }
  },

  // Simpan soal ke favorites
  saveSoal: async (idSoal) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriber/favorites`,
        { id_soal: idSoal },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error("Gagal simpan soal:", error);
      throw error;
    }
  },

  // Hapus soal dari favorites
  removeSoal: async (idSoal) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/subscriber/favorites/${idSoal}`,
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error("Gagal hapus soal:", error);
      throw error;
    }
  },

  // Toggle favorite (simpan/hapus)
  toggleFavorite: async (idSoal) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriber/favorites/toggle`,
        { id_soal: idSoal },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error("Gagal toggle favorite:", error);
      throw error;
    }
  },
};
