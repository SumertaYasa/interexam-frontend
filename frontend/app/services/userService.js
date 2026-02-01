const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = (isFormData = false) => {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

export const userService = {
    // Ambil semua subject untuk dropdown Keahlian
    getSubjectsForDropdown: async () => {
        try {

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

    // Ambil semua data user
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

    // CREATE USER
    createUser: async (formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user`, {
                method: 'POST',
                headers: getAuthHeaders(true), 
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

    // Mengambil user berdasarkan ID
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

    // UPDATE USER
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

    // Hapus user
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
    },

    // Ubah status user (aktif/non-aktif)
    changeStatus: async (id, status, reason = "") => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user/${id}/status`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status, reason })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal mengubah status user");
            return result;
        } catch (error) {
            console.error("Error changing status:", error);
            throw error;
        }
    },

    getMe: async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) throw new Error("User tidak ditemukan di local storage");
            
            const response = await fetch(`${API_BASE_URL}/admin/user/${user.id_user}`, {
                headers: getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            return result.data;
        } catch (error) {
            console.error("Error fetch profile:", error);
            throw error;
        }
    },

    // [BARU] Update Profile Sendiri
    updateProfile: async (id, formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/user/${id}`, { // Endpoint sama dengan update user biasa
                method: 'PUT',
                headers: getAuthHeaders(true), // true karena pakai FormData (Multipart)
                body: formData
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            
            // Jika berhasil, update juga data user di localStorage agar header berubah
            const localUser = JSON.parse(localStorage.getItem("user"));
            if (result.data) {
                const updatedUser = { 
                    ...localUser, 
                    nama_user: result.data.nama_user,
                    foto: result.data.foto 
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
            
            return result;
        } catch (error) {
            console.error("Error update profile:", error);
            throw error;
        }
    }
};