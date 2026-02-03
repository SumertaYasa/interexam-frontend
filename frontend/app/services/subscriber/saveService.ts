import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- INTERFACES ---

interface AuthHeader {
  headers: {
    Authorization: string;
  };
}

// Tipe standar response API kita
interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Parameter untuk filter pencarian
interface BankSoalParams {
  search?: string;
  matapelajaran?: string;
  jenjang?: string;
  level?: string;
  page?: number;
  limit?: number;
  folderId?: number | string | null;
}

// Tipe data Folder (Sesuai Controller getMyFolders)
export interface FolderData {
  id: number;
  nama: string;
  keterangan: string;
  total_item: number;
  created_at: string;
}

// --- HELPER ---

const getAuthHeader = (): AuthHeader => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// --- SERVICE ---

export const saveService = {
  // ==========================================
  // 1. BANK SOAL & LISTING
  // ==========================================

  getBankSoal: async (
    params: BankSoalParams = {},
  ): Promise<ApiResponse<any[]>> => {
    try {
      const response = await axios.get<ApiResponse<any[]>>(
        `${API_BASE_URL}/subscriber/bank-soal`,
        {
          params: {
            search: params.search || "",
            matapelajaran: params.matapelajaran || "all",
            jenjang: params.jenjang || "all",
            level: params.level || "all",
            page: params.page || 1,
            limit: params.limit || 10,
          },
          ...getAuthHeader(),
        },
      );
      return response.data;
    } catch (error) {
      console.error("Gagal ambil bank soal:", error);
      return {
        status: "error",
        data: [],
        meta: { total: 0, page: 1, limit: 10 },
      };
    }
  },

  getFavoriteSoal: async (
    params: BankSoalParams = {},
  ): Promise<ApiResponse<any[]>> => {
    try {
      const response = await axios.get<ApiResponse<any[]>>(
        `${API_BASE_URL}/subscriber/favorites`,
        {
          params: {
            search: params.search || "",
            page: params.page || 1,
            limit: params.limit || 10,
            folderId: params.folderId || null,
          },
          ...getAuthHeader(),
        },
      );
      return response.data;
    } catch (error) {
      console.error("Gagal ambil soal favorit:", error);
      return {
        status: "error",
        data: [],
        meta: { total: 0, page: 1, limit: 10 },
      };
    }
  },

  // ==========================================
  // 2. AKSI SIMPAN (SAVE/REMOVE)
  // ==========================================

  saveSoal: async (
    idSoal: number | string,
  ): Promise<ApiResponse<{ id_favorite: number }>> => {
    try {
      const response = await axios.post<ApiResponse<{ id_favorite: number }>>(
        `${API_BASE_URL}/subscriber/favorites`,
        { id_soal: idSoal },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error("Gagal simpan soal:", error);
      throw error;
    }
  },

  removeSoal: async (idSoal: number | string): Promise<ApiResponse> => {
    try {
      const response = await axios.delete<ApiResponse>(
        `${API_BASE_URL}/subscriber/favorites/${idSoal}`,
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error("Gagal hapus soal:", error);
      throw error;
    }
  },

  toggleFavorite: async (
    idSoal: number | string,
  ): Promise<ApiResponse<{ is_favorited: boolean }>> => {
    try {
      const response = await axios.post<ApiResponse<{ is_favorited: boolean }>>(
        `${API_BASE_URL}/subscriber/favorites/toggle`,
        { id_soal: idSoal },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error("Gagal toggle favorite:", error);
      throw error;
    }
  },

  // ==========================================
  // 3. MANAJEMEN FOLDER
  // ==========================================

  getFolders: async (): Promise<FolderData[]> => {
    try {
      const response = await axios.get<ApiResponse<FolderData[]>>(
        `${API_BASE_URL}/subscriber/folders`,
        getAuthHeader(),
      );
      // Backend mengembalikan { status: "success", data: [...] }
      return response.data.data || [];
    } catch (error) {
      console.error("Gagal ambil folder:", error);
      return [];
    }
  },

  createFolder: async (
    namaFolder: string,
    keterangan: string = "",
  ): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>(
        `${API_BASE_URL}/subscriber/folders`,
        { nama_folder: namaFolder, keterangan },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error("Gagal buat folder:", error);
      throw error;
    }
  },

  deleteFolder: async (idFolder: number | string): Promise<ApiResponse> => {
    try {
      const response = await axios.delete<ApiResponse>(
        `${API_BASE_URL}/subscriber/folders/${idFolder}`,
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error("Gagal hapus folder:", error);
      throw error;
    }
  },

  moveItemToFolder: async (
    idFavorite: number,
    idFolder: number | null,
  ): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>(
        `${API_BASE_URL}/subscriber/folders/add-item`,
        { id_favorite: idFavorite, id_folder: idFolder },
        getAuthHeader(),
      );
      return response.data;
    } catch (error) {
      console.error("Gagal memindahkan ke folder:", error);
      throw error;
    }
  },
};
