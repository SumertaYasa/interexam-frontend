import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const courseService = {
  // 1. Mengambil daftar paket (List)
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
      return response.data;
    } catch (error) {
      console.error(
        "Gagal ambil paket:",
        error.response?.data || error.message,
      );
      return { status: "error", data: [] };
    }
  },

  // 2. Mengambil Detail Paket & Soal (PENTING untuk ExamAttempt)
  getPaketDetail: async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/pakets/${id}`,
        getAuthHeader(),
      );

      const { data, is_locked } = response.data;

      return {
        ...data,
        is_locked: is_locked || false,
      };
    } catch (error) {
      console.error("Gagal ambil detail:", error);
      return null;
    }
  },

  // 3. Simpan Progress (Auto-save)
  saveProgress: async (paketId, answers) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriber/pakets/save-progress`,
        { id_paket_soal: paketId, answers },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      // Tidak perlu throw error agar tidak mengganggu user saat mengetik (silent fail)
      console.error("Gagal simpan progres (Silent):", error.message);
      return null;
    }
  },

  // 4. Submit Ujian (Selesai)
  submitExam: async (paketId, answers, eventId = null) => {
    try {
      // 1. Siapkan data dasar yang akan dikirim
      const payload = {
        id_paket_soal: paketId,
        answers: answers,
      };

      // 2. Jika fungsi dipanggil dari Event, tambahkan id_event ke dalam data
      if (eventId) {
        payload.id_event = eventId;
      }

      const response = await axios.post(
        `${API_BASE_URL}/subscriber/pakets/submit`,
        payload, // 3. Kirim payload yang sudah diperbarui
        getAuthHeader(),
      );

      return response.data;
    } catch (error) {
      console.error(
        "Gagal submit ujian:",
        error.response?.data || error.message,
      );
      throw error; // Throw agar UI bisa menampilkan pesan error
    }
  },

  // 5. Leaderboard
  getExamLeaderboard: async (paketId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/pakets/${paketId}/leaderboard`,
        getAuthHeader(),
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Gagal ambil leaderboard:", error);
      return [];
    }
  },

  /**
   * Mengambil data pembahasan (discussion) dari riwayat pengerjaan terakhir
   * @param {string|number} paketId - ID dari Paket Soal
   * @param {string|number} eventId - (Opsional) ID Event jika dikerjakan di dalam event
   * @returns {Promise<Object>} Data pembahasan beserta ringkasan
   */
  getAttemptDiscussion: async (paketId, eventId = null) => {
    try {
      const queryParam = eventId ? `?id_event=${eventId}` : "";

      // UBAH API_URL menjadi API_BASE_URL di sini!
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/attempt/${paketId}/discussion${queryParam}`,
        getAuthHeader(),
      );

      return response.data.data;
    } catch (error) {
      console.error(
        "Gagal memuat data pembahasan:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
  getAllEvents: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriber/events`, {
        params: {
          search: params.search || "",
          category: params.category || "all",
          page: params.page || 1,
          limit: params.limit || 10,
        },
        ...getAuthHeader(),
      });
      return response.data.data || [];
    } catch (error) {
      console.error("Gagal ambil events:", error);
      return [];
    }
  },

  // Mengambil Detail Event (Termasuk status user join/belum)
  getEventDetail: async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/events/${id}`,
        getAuthHeader(),
      );
      return response.data.data;
    } catch (error) {
      console.error("Gagal ambil detail event:", error);
      return null;
    }
  },

  // Mendaftar Event
  joinEvent: async (eventId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriber/events/join`,
        { id_event: eventId },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error("Gagal join event:", error);
      throw error;
    }
  },

  getEventPaketDetail: async (eventId, paketId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/events/${eventId}/pakets/${paketId}`,
        getAuthHeader(),
      );

      return response.data;
    } catch (error) {
      console.error(
        "Gagal ambil detail paket event:",
        error.response?.data || error.message,
      );

      return {
        status: "error",
        message: error.response?.data?.message || "Gagal memuat soal event.",
        is_locked: error.response?.data?.is_locked || false,
      };
    }
  },

  /**
   * Mengambil rapor pribadi user untuk sebuah event (akumulasi dan per paket)
   * @param {number|string} eventId - ID dari Event
   */
  getEventUserReport: async (eventId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/events/${eventId}/report`,
        getAuthHeader(),
      );
      return response.data.data; // Mengembalikan object { event_title, report: {...} }
    } catch (error) {
      console.error(
        "Gagal mengambil rapor event:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  /**
   * Mengambil leaderboard untuk sebuah event (bisa difilter per paket)
   * @param {number|string} eventId - ID dari Event
   * @param {number|string} paketId - "all" untuk keseluruhan, atau ID paket spesifik
   */
  getEventLeaderboard: async (eventId, paketId = "all") => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/events/${eventId}/leaderboard`,
        {
          ...getAuthHeader(),
          params: { paketId }, // Mengirim query params ?paketId=all
        },
      );
      return response.data.data; // Mengembalikan array of users
    } catch (error) {
      console.error(
        "Gagal mengambil leaderboard event:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
