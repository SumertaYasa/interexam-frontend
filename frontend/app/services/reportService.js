import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const reportService = {
    getStats: async (period) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/report/stats?period=${period}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
            return response.data;
        } catch (error) {
            console.error("Error fetching report stats:", error);
            throw error;
        }
    }
};