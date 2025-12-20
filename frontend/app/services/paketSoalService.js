import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const paketSoalService = {
    // Ambil List Paket
    getAllPaket: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/paket-soal`);
            return response.data.data;
        } catch (error) {
            console.error("Gagal ambil paket:", error);
            return [];
        }
    },

    // Ambil Detail Paket
    getPaketById: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/admin/paket-soal/${id}`);
        return response.data.data;
    },

    // Tambahkan Soal ke Paket
    addQuestionToPacket: async (idPaket, idSoalBaru) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/paket-soal/${idPaket}`);
            const paketData = response.data.data;

            let currentSoalIds = paketData.list_soal.map(s => s.id);

            // Cek duplikasi (Kalau sudah ada, jangan ditambah)
            if (currentSoalIds.includes(parseInt(idSoalBaru))) {
                throw new Error("Soal ini sudah ada di paket tersebut.");
            }

            currentSoalIds.push(parseInt(idSoalBaru));

            const formData = new FormData();
            formData.append("nama_paket", paketData.nama_paket);
            formData.append("id_category", paketData.id_category);
            formData.append("status", paketData.status);
            formData.append("soal_ids", JSON.stringify(currentSoalIds));

            await axios.put(`${API_BASE_URL}/admin/paket-soal/${idPaket}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            return true;
        } catch (error) {
            console.error("Error add question to packet:", error);
            throw error.response?.data || error.message;
        }
    }
};