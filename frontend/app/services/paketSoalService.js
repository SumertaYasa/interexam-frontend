import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const paketSoalService = {

    getAllPaket: async () => {
        try {

            const response = await axios.get(`${API_BASE_URL}/admin/paket-soal`, getAuthHeader());
            return response.data.data;
        } catch (error) {
            console.error("Gagal ambil paket:", error);
            return [];
        }
    },

    getBankSoal: async (params) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/paket-soal/bank-soal`, {
                params: params,
                ...getAuthHeader()
            });
            return response.data; 
        } catch (error) {
            console.error("Gagal mengambil bank soal:", error);
            throw error;
        }
    },

    // Create Paket Soal
    createPaketSoal: async (formData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/admin/paket-soal`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...getAuthHeader().headers
                }
            });
            return response.data;
        } catch (error) {
            console.error("Gagal membuat paket soal:", error);
            throw error;
        }
    },

    // Delete Paket Soal
    deletePaket: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/admin/paket-soal/${id}`, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error("Gagal menghapus paket soal:", error);
            throw error.response?.data || error.message;
        }
    },

    getPaketDetail: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/paket-soal/${id}`, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error("Gagal ambil detail paket:", error);
            throw error;
        }
    },

    // Update Paket Soal
    updatePaket: async (id, formData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/admin/paket-soal/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...getAuthHeader().headers
                }
            });
            return response.data;
        } catch (error) {
            console.error("Gagal update paket soal:", error);
            throw error;
        }
    }
};