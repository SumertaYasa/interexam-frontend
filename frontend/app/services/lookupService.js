import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper untuk ambil token dari localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

export const lookupService = {
    // 1. Ambil Mapel berdasarkan keahlian kontributor (kompetensiUser)
    getSubjects: async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/contributor/lookup/my-subjects`, {
                headers: getAuthHeader()
            });
            // Pastikan backend mengembalikan { status: "success", data: [...] }
            return res.data.data || []; 
        } catch (error) {
            console.error("Gagal load keahlian contributor:", error);
            return [];
        }
    },

    // 2. FUNGSI TAMBAHAN: Ambil daftar Jenjang (Dibutuhkan di AddTopik.jsx)
    getJenjang: async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/contributor/lookup/jenjang`, {
                headers: getAuthHeader()
            });
            return res.data.data || [];
        } catch (error) {
            console.error("Gagal load jenjang:", error);
            return [];
        }
    },

    // 3. Ambil Topik berdasarkan ID Subject
    getTopicsBySubject: async (subjectId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/contributor/lookup/topics/${subjectId}`, {
                headers: getAuthHeader()
            });
            return res.data.data || [];
        } catch (error) {
            console.error("Gagal load topics:", error);
            return [];
        }
    },

    // 4. Ambil enum Level Kesulitan
    getLevelKesulitan: async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/contributor/lookup/levels`, {
                headers: getAuthHeader()
            });
            return res.data.data || [];
        } catch (error) {
            console.error("Gagal load levels:", error);
            return [];
        }
    }
};