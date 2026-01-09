const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});

export const topicService = {
    // Ambil semua topik
    getAllTopics: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/topics`, {
                headers: getAuthHeaders()
            });
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || "Gagal mengambil data topik");
            }
            return result.data;
        } catch (error) {
            console.error("Error fetch topics:", error);
            throw error;
        }
    },

    // Hapus topik
    deleteTopic: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/topics/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders() 
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Gagal menghapus topik");
            }
            return result;
        } catch (error) {
            console.error("Error delete topic:", error);
            throw error;
        }
    },

    // Get Topic By ID
    getTopicById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/topics/${id}`, {
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Topik tidak ditemukan");
            return result.data;
        } catch (error) {
            throw error;
        }
    },

    // Create Topic
    createTopic: async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/topics`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            if (!response.ok) throw new Error(result.error || "Gagal membuat topik");
            return result;
        } catch (error) {
            console.error("Error create topic:", error);
            throw error;
        }
    },

    // Update Topic
    updateTopic: async (id, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/topics/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Gagal update topik");
            return result;
        } catch (error) {
            throw error;
        }
    },
};