const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const subjectService = {
    // Ambil semua mata pelajaran
    getAllSubjects: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/subjects`);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || "Gagal mengambil data mata pelajaran");
            }
            return result.data;
        } catch (error) {
            console.error("Error fetching subjects:", error);
            throw error;
        }
    },

    // Hapus mata pelajaran
    deleteSubject: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/subject/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal menghapus mata pelajaran");
            }
            return result;
        } catch (error) {
            console.error("Error deleting subject:", error);
            throw error;
        }
    },

    // Tambah Mata Pelajaran
    createSubject: async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/subject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            return result;
        } catch (error) {
            throw error;
        }
    },

    // Update Mata Pelajaran
    updateSubject: async (id, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/subject/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            return result;
        } catch (error) {
            throw error;
        }
    },

    // Get Subject By ID
    getSubjectById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/subject/${id}`);
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            return result.data;
        } catch (error) {
            throw error;
        }
    }
};