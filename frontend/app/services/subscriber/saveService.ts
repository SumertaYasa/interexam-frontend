import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// --- 1. GLOBAL INTERFACES ---

interface AuthHeader {
  headers: {
    Authorization: string;
  };
}

// Tipe standar response API kita
export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// --- 2. FEATURE INTERFACES ---

export interface BankSoalParams {
  search?: string;
  matapelajaran?: string;
  jenjang?: string;
  level?: string;
  page?: number;
  limit?: number;
  folderId?: number | string | null;
}

export interface FolderData {
  id: number; // Terkadang backend mengirim 'id' atau 'id_folder'
  id_folder?: number;
  nama: string;
  nama_folder?: string;
  keterangan: string;
  total_item: number;
  created_at: string;
}

// Interface baru untuk Folder Practice
export interface FolderQuestionData {
  folderId: number | null;
  folderName: string;
  soal: any[]; // Bisa diganti dengan interface Soal yang lebih spesifik jika ada
}

export interface PracticePayload {
  folderSlug: string;
  answers: Record<string | number, any>;
}

export interface PracticeResultData {
  total_soal: number;
  terjawab: number;
  benar: number;
  salah: number;
  kosong: number;
  score: number;
  details: any[]; // Bisa diganti dengan interface Pembahasan jika ada
}

// --- 3. HELPER ---

const getAuthHeader = (): AuthHeader => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token || ""}` } };
};

// --- 4. SERVICE ---

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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
      return response.data.data || [];
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error("Gagal memindahkan ke folder:", error);
      throw error;
    }
  },

  // ==========================================
  // 4. LATIHAN FOLDER (PRACTICE MODE)
  // ==========================================

  // Mengambil soal dari folder favorit
  getFolderQuestions: async (
    slug: string,
  ): Promise<ApiResponse<FolderQuestionData>> => {
    try {
      const response = await axios.get<ApiResponse<FolderQuestionData>>(
        `${API_BASE_URL}/subscriber/folder/${slug}/questions`,
        getAuthHeader(),
      );
      return response.data;
    } catch (error: any) {
      console.error("Gagal ambil soal folder:", error);
      // Lempar error spesifik dari Axios jika ada, atau error default
      throw (error as AxiosError).response?.data || error;
    }
  },

  // Mengirim hasil latihan (koreksi murni)
  submitFolderPractice: async (
    payload: PracticePayload,
  ): Promise<ApiResponse<PracticeResultData>> => {
    try {
      const response = await axios.post<ApiResponse<PracticeResultData>>(
        `${API_BASE_URL}/subscriber/folder/submit-practice`,
        payload,
        getAuthHeader(),
      );
      return response.data;
    } catch (error: any) {
      console.error("Gagal submit latihan folder:", error);
      throw (error as AxiosError).response?.data || error;
    }
  },
};
