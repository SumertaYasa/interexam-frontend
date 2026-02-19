const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const notificationService = {
    getNotifications: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/workflow/alerts`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal mengambil notifikasi");
            return result; 
        } catch (error) {
            console.error("Kesalahan API Notifikasi:", error);
            throw error;
        }
    },

    markAllAsRead: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/workflow/alerts/read`, {
                method: 'PUT', 
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal update status");
            return result;
        } catch (error) {
            console.error("Kesalahan API Update:", error);
            throw error;
        }
    },
    markSingleAsRead: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/workflow/alerts/read/${id}`, {
                method: 'PUT', 
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal update status");
            return result;
        } catch (error) {
            console.error("Kesalahan API Update Single:", error);
            throw error;
        }
    },
    deleteAllNotifications: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/workflow/alerts`, {
                method: 'DELETE', 
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal menghapus notifikasi");
            return result;
        } catch (error) {
            console.error("Kesalahan API Delete All:", error);
            throw error;
        }
    }
};