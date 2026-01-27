import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const courseService = {
  // Mengambil paket pengerjaan khusus subscriber
  getAllPaketsWithProgress: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriber/pakets`, {
        params: {
          search: params.search || "",
          category: params.category || "all",
          page: params.page || 1,
          limit: params.limit || 100,
          sortBy: params.sortBy || "newest",
        },
        ...getAuthHeader(),
      });
      return response.data; // Mengembalikan { status, data, meta }
    } catch (error) {
      console.error(
        "Gagal ambil paket:",
        error.response?.data || error.message,
      );
      return { status: "error", data: [] };
    }
  },

  getPaketDetail: async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/pakets/${id}`,
        getAuthHeader(),
      );
      return response.data.data;
    } catch (error) {
      console.error("Gagal ambil detail:", error);
      return null;
    }
  },

  // Simpan soal ke folder
  saveQuestionToFolder: async (soalId, folderId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/folders/save-question`,
        { id_soal: soalId, id_folder: folderId },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error("Gagal simpan soal:", error);
      throw error;
    }
  },

  // Submit ujian
  submitExam: async (paketId, answers) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriber/pakets/submit`,
        { id_paket_soal: paketId, answers }, // Kirim paketId dan answers terbaru
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error(
        "Gagal submit ujian:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
  saveProgress: async (paketId, answers) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriber/pakets/save-progress`,
        { id_paket_soal: paketId, answers },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error("Gagal simpan progres:", error);
      throw error;
    }
  },
};
