const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const subjectService = {
    getAllSubjects: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/subjects`, {
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal mengambil data");
            return result.data;
        } catch (error) {
            throw error;
        }
    },

    createSubject: async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/subject`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            return result;
        } catch (error) {
            throw error;
        }
    },

    updateSubject: async (id, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/subject/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            return result;
        } catch (error) {
            throw error;
        }
    },

    deleteSubject: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/subject/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "Gagal menghapus");
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};