import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const profileService = {
  /**
   * Mengambil data profil subscriber saat ini
   */
  getProfile: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriber/profile_subscriber`,
        getAuthHeader(),
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "Gagal memuat profil:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  /**
   * Mengupdate data profil subscriber (termasuk foto)
   * @param {FormData} payload - Data form yang berisi nama dan file foto
   */
  updateProfile: async (payload) => {
    try {
      const authHeader = getAuthHeader();
      const config = {
        headers: {
          ...authHeader.headers,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.put(
        `${API_BASE_URL}/subscriber/profile_subscriber`,
        payload,
        config,
      );
      return response.data;
    } catch (error) {
      console.error(
        "Gagal update profil:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  /**
   * Update email subscriber
   * @param {string} newEmail - Email baru
   * @param {string} password - Password untuk verifikasi
   */
  updateEmail: async (newEmail, password) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/subscriber/update-email`,
        { newEmail, password },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error(
        "Gagal update email:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  /**
   * Update nomor telepon subscriber
   * @param {string} newPhone - Nomor telepon baru
   */
  updatePhone: async (newPhone) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/subscriber/update-phone`,
        { newPhone },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error(
        "Gagal update telepon:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  /**
   * Ganti password subscriber
   * @param {string} oldPassword - Password lama
   * @param {string} newPassword - Password baru
   * @param {string} confirmPassword - Konfirmasi password baru
   */
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/subscriber/change-password`,
        { oldPassword, newPassword, confirmPassword },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error(
        "Gagal ganti password:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
