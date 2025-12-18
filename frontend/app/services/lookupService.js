import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const lookupService = {
    // 1. Ambil Subjects
    getSubjects: async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/contributor/lookup/subjects`);
            console.log("Subject Data:", res.data); // Debugging
            return res.data.data || [];
        } catch (error) {
            console.error("Gagal load subjects:", error);
            return [];
        }
    },

    // 2. Ambil Jenjang
    getJenjang: async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/contributor/lookup/jenjang`);
            return res.data.data || []; 
        } catch (error) {
            console.error("Gagal load jenjang:", error);
            return [];
        }
    },

    // 3. Ambil Topik by Subject ID (PENTING untuk Add Soal)
    getTopicsBySubject: async (subjectId) => {
        if (!subjectId) return [];
        try {
            // Ini memanggil route nomor 3 yang kita buat di Langkah 1
            const res = await axios.get(`${API_BASE_URL}/contributor/lookup/topics/${subjectId}`);
            return res.data.data || [];
        } catch (error) {
            console.error("Gagal load topik:", error);
            return [];
        }
    }
};