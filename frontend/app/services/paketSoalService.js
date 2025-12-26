import axios from "axios";

// PENTING: Pastikan di .env VITE_API_BASE_URL=http://localhost:5000/api/v1 (Tanpa slash di akhir)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const paketSoalService = {
    // 1. Ambil List Paket
    getAllPaket: async () => {
        try {
            // URL: http://localhost:5000/api/v1/admin/paket-soal
            const response = await axios.get(`${API_BASE_URL}/admin/paket-soal`, getAuthHeader());
            return response.data.data;
        } catch (error) {
            console.error("Gagal ambil paket:", error);
            return [];
        }
    },

    // 2. Ambil Data Bank Soal (Untuk Modal)
    getBankSoal: async (params) => {
        try {
            // URL: http://localhost:5000/api/v1/admin/paket-soal/bank-soal
            // Pastikan di paketSoalRoutes.js ada router.get('/bank-soal', ...)
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

    // 3. Create Paket Soal
    createPaketSoal: async (formData) => {
        try {
            // URL: http://localhost:5000/api/v1/admin/paket-soal
            // Pastikan di paketSoalRoutes.js ada router.post('/', ...)
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
    }
};