import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const eventService = {
    // 1. GET PACKAGES LOOKUP
    getPackagesLookup: async (params) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/event/packages-lookup`, {
                params: params,
                ...getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Gagal lookup paket:", error);
            throw error;
        }
    },

    // 2. CREATE EVENT
    createEvent: async (formData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/event`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...getAuthHeader().headers
                }
            });
            return response.data;
        } catch (error) {
            console.error("Gagal create event:", error);
            throw error;
        }
    },

    // 3. GET ALL EVENTS (LIST)
    getAllEvents: async (params) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/event`, {
                params: params,
                ...getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Gagal load events:", error);
            return { data: [] };
        }
    },

    // 4. GET DETAIL EVENT
    getEventDetail: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/event/${id}`, {
                ...getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Gagal load detail event:", error);
            throw error;
        }
    },

    // 5. UPDATE EVENT
    updateEvent: async (id, formData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/event/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...getAuthHeader().headers
                }
            });
            return response.data;
        } catch (error) {
            console.error("Gagal update event:", error);
            throw error;
        }
    },

    // 6. DELETE EVENT
    deleteEvent: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/event/${id}`, {
                ...getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Gagal delete event:", error);
            throw error;
        }
    }
};