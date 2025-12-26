import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const categoryService = {
    getAllCategories: async () => {
        try {
            // URL: http://localhost:5000/api/v1/admin/categories
            // Sesuai dengan app.use('/api/v1/admin/categories', ...) di backend
            const response = await axios.get(`${API_BASE_URL}/admin/categories`, getAuthHeader());
            return response.data.data;
        } catch (error) {
            console.error("Gagal load categories:", error);
            return [];
        }
    }
};