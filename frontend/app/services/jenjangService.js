const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const jenjangService = {
    // GET ALL
    getAllJenjang: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/jenjang`, {
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || result.error || "Gagal mengambil data");
            return result.data;
        } catch (error) {
            throw error;
        }
    },

    // CREATE
    createJenjang: async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/jenjang`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || result.error || "Gagal membuat jenjang");
            return result;
        } catch (error) {
            throw error;
        }
    },

    // UPDATE
    updateJenjang: async (id, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/jenjang/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || result.error || "Gagal update jenjang");
            return result;
        } catch (error) {
            throw error;
        }
    },

    // DELETE
    deleteJenjang: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/jenjang/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || result.error || "Gagal menghapus");
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
};