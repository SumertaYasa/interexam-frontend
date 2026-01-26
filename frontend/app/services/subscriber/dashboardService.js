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
      return {
        totalExams: 0,
        examsTrend: "+0",
        avgScore: 0,
        scoreTrend: "0%",
        studyTime: "0j 0m",
        timeTrend: "+0m",
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
      return (
        response.data.data || { streak: 0, weeklyProgress: 0, weeklyTarget: 10 }
      );
    } catch (error) {
      console.error("Gagal ambil streak:", error);
      return { streak: 0, weeklyProgress: 0, weeklyTarget: 10 };
    }
  },
};
