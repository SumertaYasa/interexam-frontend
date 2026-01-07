const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper untuk mengambil token dan membuat header
const getAuthHeaders = (isFormData = false) => {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    // Jika bukan FormData (seperti GET), tambahkan Content-Type JSON
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

export const userService = {
    // 1. FUNGSI BARU: Ambil semua subject untuk dropdown Keahlian
    getSubjectsForDropdown: async () => {
        try {
            // Gunakan endpoint subjects-list yang sudah kita buat di routes
            const response = await fetch(`${API_BASE_URL}/admin/subjects-list`, {
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal mengambil daftar keahlian");
            return result.data; // Mengembalikan array [{id_subject, nama_subject}, ...]
        } catch (error) {
            console.error("Error fetching subject dropdown:", error);
            throw error;
        }
    },

    // 2. Ambil semua data user
    getAllUsers: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users`, {
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal mengambil data user");
            return result.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    // 3. CREATE USER (Menggunakan FormData untuk upload foto)
    createUser: async (formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user`, {
                method: 'POST',
                headers: getAuthHeaders(true), // true karena mengirim FormData
                body: formData
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal menambah user");
            return result;
        } catch (error) {
            console.error("Error create user:", error);
            throw error;
        }
    },

    // 4. Mengambil user berdasarkan ID
    getUserById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user/${id}`, {
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "User tidak ditemukan");
            return result.data;
        } catch (error) {
            console.error("Error get user:", error);
            throw error;
        }
    },

    // 5. UPDATE USER
    updateUser: async (id, formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(true),
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

    // 6. Hapus user
    deleteUser: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error("Gagal menghapus user");
            return true; 
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }
};