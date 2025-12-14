const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const userService = {
    // Ambil semua data user
    getAllUsers: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users`);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || "Gagal mengambil data user");
            }
            return result.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    // CREATE USER
    createUser: async (formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || "Gagal menambah user");
            }
            return result;
        } catch (error) {
            console.error("Error create user:", error);
            throw error;
        }
    },

    // Mengambil user berdasarkan user id
    getUserById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user/${id}`);
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "User tidak ditemukan");
            return result.data;
        } catch (error) {
            console.error("Error get user:", error);
            throw error;
        }
    },

    // UPDATE USER
    updateUser: async (id, formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user/${id}`, {
                method: 'PUT',
                body: formData
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal update user");
            return result;
        } catch (error) {
            console.error("Error update user:", error);
            throw error;
        }
    },

    // Hapus user berdasarkan ID
    deleteUser: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error("Gagal menghapus user");
            }
            return true; 
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }
};