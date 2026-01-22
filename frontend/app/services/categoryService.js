import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const categoryService = {
    getAllCategories: async () => {
        try {
            
            const response = await axios.get(`${API_BASE_URL}/categories`, getAuthHeader());
            return response.data.data;
        } catch (error) {
            console.error("Gagal load categories:", error);
            return [];
        }
    },

    // CREATE
    createCategory: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/categories`, data, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // DELETE
    deleteCategory: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/categories/${id}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // UPDATE
    updateCategory: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/categories/${id}`, data, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};