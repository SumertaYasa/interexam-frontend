import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const dashboardService = {
  // Ambil 4 paket soal terbaru dengan progress
  getRecentPakets: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/pakets/recent`,
        getAuthHeader(),
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Gagal ambil paket terbaru:", error);
      return [];
    }
  },

  // Ambil statistik ringkas (ujian, skor, waktu belajar)
  getStatisticsSummary: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/statistics/summary`,
        getAuthHeader(),
      );
      return response.data.data || {};
    } catch (error) {
      console.error("Gagal ambil statistik:", error);
      // Fallback structure harus match dengan Frontend expectation
      return {
        totalExamsCompleted: 0,
        averageScore: 0,
        totalStudyTime: "0j 0m",
        comparedToPreviousWeek: {
          exams: 0,
          scoreIncrease: 0,
          studyTimeIncrease: 0,
        },
      };
    }
  },

  // Ambil streak dan target mingguan
  getStreakAndTarget: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/statistics/streak`,
        getAuthHeader(),
      );
      // Backend sekarang mengembalikan data flat langsung
      return (
        response.data.data || { streak: 0, weeklyProgress: 0, weeklyTarget: 10 }
      );
    } catch (error) {
      console.error("Gagal ambil streak:", error);
      return { streak: 0, weeklyProgress: 0, weeklyTarget: 10 };
    }
  },

  // Ambil semua paket soal dengan progress
  getAllPaketsWithProgress: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/pakets`,
        getAuthHeader(),
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Gagal ambil semua paket:", error);
      return [];
    }
  },
};
