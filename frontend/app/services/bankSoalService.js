import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BANK_SOAL_API = `${API_BASE_URL}/bank-soal`;

export const bankSoalService = {
  
  // GET DASHBOARD 
  getBankSoal: async (role = 'validator') => {
    try {
      const response = await axios.get(`${BANK_SOAL_API}?as_role=${role}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bank soal:", error);
      throw error.response?.data || error.message;
    }
  },

  // GET DETAIL SOAL
  getSoalDetail: async (id) => {
    try {
      const response = await axios.get(`${BANK_SOAL_API}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching detail:", error);
      throw error.response?.data || error.message;
    }
  },

  // UPDATE / VALIDASI SOAL
  updateSoal: async (id, payload) => {
    try {
      const response = await axios.put(`${BANK_SOAL_API}/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error update/validate soal:", error);
      throw error.response?.data || error.message;
    }
  },

  // 4. DELETE SOAL
  deleteSoal: async (id) => {
    try {
        const response = await axios.delete(`${BANK_SOAL_API}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error delete soal:", error);
        throw error.response?.data || error.message;
    }
  },

  // 5. Lookup Paket
  getLookupPackets: async () => {
    try {
        const response = await axios.get(`${BANK_SOAL_API}/lookup/packets`);
        return response.data.data;
    } catch (error) {
        return [];
    }
  }
};