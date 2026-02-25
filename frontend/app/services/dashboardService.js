import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const dashboardService = {
    getStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem("token")}` 
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            throw error;
        }
    }
};