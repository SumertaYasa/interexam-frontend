import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const courseService = {
  // Ambil semua paket dengan filter dan sort
  getAllPakets: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriber/pakets`, {
        params: {
          search: params.search || "",
          category: params.category || "all",
          page: params.page || 1,
          limit: params.limit || 10,
          sortBy: params.sortBy || "newest",
        },
        ...getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Gagal ambil paket:", error);
      return {
        status: "error",
        data: [],
        meta: { total: 0, page: 1, limit: 10 },
      };
    }
  },

  // Ambil detail paket soal
  getPaketDetail: async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/pakets/${id}`,
        getAuthHeader(),
      );
      return response.data.data || null;
    } catch (error) {
      console.error("Gagal ambil detail paket:", error);
      return null;
    }
  },

  // Ambil kategori paket (optional - untuk filter)
  getCategories: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/categories`,
        getAuthHeader(),
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Gagal ambil kategori:", error);
      return [];
    }
  },
};
