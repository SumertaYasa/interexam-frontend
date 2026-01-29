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

  // Ambil statistik ringkas (ujian, skor, waktu belajar, XP)
  getStatisticsSummary: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/statistics/summary`,
        getAuthHeader(),
      );
      return response.data.data || {};
    } catch (error) {
      console.error("Gagal ambil statistik:", error);
      // Fallback data
      return {
        totalExamsCompleted: 0,
        averageScore: 0,
        studyTime: { hours: 0, minutes: 0, fullText: "0 jam 0 menit" },
        experience: {
          level: 1,
          label: "Pemula",
          currentXP: 0,
          maxXP: 500,
          percentage: 0,
        },
        comparedToPreviousWeek: {
          exams: 0,
          scoreIncrease: 0,
          studyTimeIncrease: 0,
        },
      };
    }
  },

  // Ambil streak dan target mingguan (Untuk Widget Dashboard Utama)
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

  // --- [BARU] AMBIL ANALITIK PERKEMBANGAN (HARI INI / MINGGUAN) ---
  // Fungsi ini dipanggil saat tombol "Hari Ini" atau "Mingguan" diklik
  getProgressAnalytics: async (period = "weekly") => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/statistics/progress`,
        {
          ...getAuthHeader(),
          params: { period }, // Mengirim query ?period=today atau ?period=weekly
        },
      );
      return response.data.data || {};
    } catch (error) {
      console.error("Gagal ambil analytics:", error);
      // Fallback Data agar grafik tidak crash
      return {
        exams: { current: 0, diff: 0 },
        score: { current: 0, diff: 0 },
        studyTime: { current: 0, diff: 0, formatted: "0m" },
        chart: { labels: [], data: [], unit: "" },
        logs: [],
      };
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
