import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BANK_SOAL_API = `${API_BASE_URL}/bank-soal`;

export const bankSoalService = {
  
  // 1. GET DASHBOARD BANK SOAL
  // Mengambil token setiap kali request untuk menghindari Error 401
  getBankSoal: async () => {
    try {
      const token = localStorage.getItem("token"); // Pastikan key di localStorage adalah 'token'
      const response = await axios.get(`${BANK_SOAL_API}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching bank soal:", error);
      throw error.response?.data || error.message;
    }
  },

  // 2. GET DETAIL SOAL
  getSoalDetail: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BANK_SOAL_API}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching detail:", error);
      throw error.response?.data || error.message;
    }
  },

  // 3. UPDATE / VALIDASI SOAL
  updateSoal: async (id, payload) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${BANK_SOAL_API}/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error update/validate soal:", error);
      throw error.response?.data || error.message;
    }
  },

  // 4. DELETE SOAL
  deleteSoal: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${BANK_SOAL_API}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error delete soal:", error);
      throw error.response?.data || error.message;
    }
  },

  // 5. LOOKUP PAKET
  getLookupPackets: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BANK_SOAL_API}/lookup/packets`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error("Error lookup packets:", error);
      return [];
    }
  }
};