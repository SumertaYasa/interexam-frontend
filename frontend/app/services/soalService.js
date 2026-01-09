import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const soalService = {

    getMyQuestions: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/contributor/my-questions`);
            return response.data;
        } catch (error) {
            console.error("Error get questions:", error);
            throw error;
        }
    },

    // Ambil Detail Satu Soal
    getQuestionById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/contributor/question/${id}`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching question detail:", error);
            throw error;
        }
    },

    // Tambah Soal Baru
    createQuestion: async (formData) => {
        try {

            const response = await axios.post(`${API_BASE_URL}/contributor/question`, formData);
            return response.data;
        } catch (error) {
            console.error("Error create question:", error);
            throw error;
        }
    },

    // Update Soal
    updateQuestion: async (id, formData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/contributor/question/${id}`, formData);
            return response.data;
        } catch (error) {
            console.error("Error updating question:", error);
            throw error;
        }
    },

    // Hapus Soal
    deleteQuestion: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/contributor/question/${id}`);
            return true;
        } catch (error) {
            console.error("Error delete question:", error);
            throw error;
        }
    },

    //  Duplikat Soal
    duplicateQuestions: async (ids, dataSoal) => {
        try {
            const promises = ids.map(async (id) => {
                const itemToCopy = dataSoal.find(item => item.id === id);
                if (!itemToCopy) return;

                const formData = new FormData();
                const tipeBackend = itemToCopy.tipe_soal === "multiple_choice" ? "pilihan_ganda" : "multi_jawaban";
                
                // Logic Gambar Lama
                if (itemToCopy.gambar) formData.append("old_image_soal", itemToCopy.gambar);
                if (itemToCopy.gambar_pembahasan) formData.append("old_image_pembahasan", itemToCopy.gambar_pembahasan);
                
                formData.append("tipe_soal", tipeBackend);
                formData.append("text_soal", `(Salinan) ${itemToCopy.text_soal}`);
                formData.append("id_topik", itemToCopy.id_topik || "1");
                formData.append("level_kesulitan", itemToCopy.level_kesulitan);
                formData.append("pembahasan_umum", itemToCopy.pembahasan_umum || "");
                formData.append("action_type", "Draft");

                // Logic Opsi Jawaban
                if (itemToCopy.list_jawaban && itemToCopy.list_jawaban.length > 0) {
                    const formattedOpsi = itemToCopy.list_jawaban.map(jw => ({
                        text: jw.opsi_jawaban_text,
                        is_correct: jw.status,
                        has_image: false,
                        old_path: jw.path_gambar_jawaban
                    }));
                    formData.append("opsi_jawaban", JSON.stringify(formattedOpsi));
                }

                return axios.post(`${API_BASE_URL}/contributor/question`, formData);
            });

            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error("Error duplicate:", error);
            throw error;
        }
    },

    // Helper URL Gambar
    getAssetUrl: (path) => {
        if (!path) return null;
        
        const rootUrl = API_BASE_URL.replace('/api/v1', '');
        const cleanPath = path.replace(/\\/g, "/");
        return `${rootUrl}/${cleanPath}`;
    }
};