import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const lookupService = {
    // Ambil Mata Pelajaran
    getSubjects: async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/contributor/lookup/subjects`);
            return res.data.data || [];
        } catch (error) {
            console.error("Gagal load subjects:", error);
            return [];
        }
    },

    // Ambil Topik berdasarkan ID Mapel
    getTopicsBySubject: async (subjectId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/contributor/lookup/topics/${subjectId}`);
            return res.data.data || [];
        } catch (error) {
            console.error("Gagal load topik:", error);
            return [];
        }
    },

    getJenjang: async () => { return []; } 
};