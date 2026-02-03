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

export const subscriptionService = {

    createPackage: async (formData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/admin/subscription/package`, formData);
            return response.data;
        } catch (error) {
            console.error("Error create package:", error);
            throw error;
        }
    },

    getAllPackages: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/subscription/packages`);
            return response.data;
        } catch (error) {
            console.error("Error get packages:", error);
            throw error;
        }
    },

    getCategories: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/categories`);
            return response.data;
        } catch (error) {
            console.error("Error get categories:", error);
            throw error;
        }
    },
    setDiscount: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/admin/subscription/discount`, data);
            return response.data;
        } catch (error) {
            console.error("Error set discount:", error);
            throw error;
        }
    },
    deletePackage: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/admin/subscription/package/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error delete package:", error);
            throw error;
        }
    },
    getPackageById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/subscription/package/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error get package by id:", error);
            throw error;
        }
    },

    updatePackage: async (id, formData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/admin/subscription/package/${id}`, formData);
            return response.data;
        } catch (error) {
            console.error("Error update package:", error);
            throw error;
        }
    }
};