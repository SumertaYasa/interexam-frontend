import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  saveService,
  type FolderData,
} from "../services/subscriber/saveService";

// --- DEFINISI TIPE (INTERFACE) ---

interface FolderContextType {
  folders: FolderData[];
  loadingFolders: boolean;
  refreshFolders: () => Promise<void>;
  addFolder: (name: string) => Promise<boolean>;
  deleteFolder: (id: number | string) => Promise<void>;
  saveQuestionToFolder: (
    idSoal: number | string | { id: number | string },
    idFolder?: number | string | null,
    folderName?: string,
  ) => Promise<boolean>;
  deleteQuestionFromFolder: (idFavorite: number | string) => Promise<void>;

  // Client-side Exam Progress
  examProgress: Record<string, number>;
  setProgress: (examId: string, count: number) => void;
  examAnswers: Record<string, Record<string, string>>;
  saveExamAnswers: (examId: string, answers: Record<string, string>) => void;
  getExamAnswers: (examId: string) => Record<string, string>;
  clearExamAnswers: (examId: string) => void;
}

// Inisialisasi Context
const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const { user, showAlert } = useAuth();

  // State untuk Folder (Data dari API)
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [loadingFolders, setLoadingFolders] = useState<boolean>(false);

  // State untuk Progress Ujian (Local/Session)
  const [examProgress, setExamProgress] = useState<Record<string, number>>({});
  const [examAnswers, setExamAnswers] = useState<
    Record<string, Record<string, string>>
  >({});

  // ==========================================
  // 1. MANAJEMEN FOLDER (API)
  // ==========================================

  // [PERBAIKAN 1] Tambahkan cek Role agar Admin tidak fetch API subscriber
  const refreshFolders = useCallback(async () => {
    // Pastikan user ada DAN role-nya subscriber
    if (!user || user.role !== "subscriber") return;

    try {
      setLoadingFolders(true);
      const data = await saveService.getFolders();
      setFolders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal load folder:", error);
    } finally {
      setLoadingFolders(false);
    }
  }, [user]);

  // Load folder saat pertama kali mount (Hanya jika subscriber)
  useEffect(() => {
    if (user?.role === "subscriber") {
      refreshFolders();
    }
  }, [refreshFolders, user]);

  // Buat Folder Baru
  const addFolder = async (name: string) => {
    try {
      await saveService.createFolder(name);
      await refreshFolders();
      showAlert("Folder berhasil dibuat!", "success");
      return true;
    } catch (error) {
      showAlert("Gagal membuat folder", "error");
      return false;
    }
  };

  // Hapus Folder
  const deleteFolder = async (id: number | string) => {
    try {
      await saveService.deleteFolder(id);
      // Optimistic update
      setFolders((prev) => prev.filter((f) => f.id !== id));
      showAlert("Folder dihapus", "success");
    } catch (error) {
      showAlert("Gagal menghapus folder", "error");
    }
  };

  // [PERBAIKAN 2] Logika Simpan Soal yang lebih robust
  const saveQuestionToFolder = async (
    idSoalInput: number | string | { id: number | string },
    idFolder: number | string | null = null,
    folderName: string = "",
  ) => {
    try {
      const realIdSoal =
        typeof idSoalInput === "object" ? idSoalInput.id : idSoalInput;

      // STEP 1: Simpan ke Favorites (Dapatkan ID Favorit)
      let idFavorite: number;

      try {
        const saveResponse = await saveService.saveSoal(realIdSoal);
        // Backend harus mengembalikan id_favorite meskipun data sudah ada (status 200)
        idFavorite = saveResponse.data?.id_favorite;
      } catch (saveError: any) {
        // Fallback: Jika backend error karena duplikat tapi tidak mengembalikan ID
        // Kita tidak bisa lanjut memindahkan folder karena butuh ID Favorit
        console.error("Save Error:", saveError);
        showAlert("Gagal menyimpan ke favorit utama.", "error");
        return false;
      }

      if (!idFavorite) {
        showAlert("Terjadi kesalahan sistem (ID tidak ditemukan).", "error");
        return false;
      }

      // STEP 2: Pindahkan ke Folder (Jika user memilih folder spesifik atau memilih 'Umum')
      // idFolder bisa berupa angka (Folder User) atau null (Folder Umum)
      if (idFolder !== undefined) {
        await saveService.moveItemToFolder(
          idFavorite,
          idFolder ? Number(idFolder) : null,
        );

        if (idFolder) {
          showAlert(`Tersimpan di folder ${folderName}!`, "success");
        } else {
          showAlert("Tersimpan di Favorit Umum!", "success");
        }
      } else {
        // Default behavior jika hanya klik bookmark tanpa milih folder
        showAlert("Soal berhasil disimpan!", "success");
      }

      // STEP 3: Refresh data folder untuk update counter
      await refreshFolders();
      return true;
    } catch (error: any) {
      console.error("Proses Simpan Gagal:", error);
      showAlert("Gagal memproses penyimpanan.", "error");
      return false;
    }
  };

  // Hapus Soal dari Folder
  const deleteQuestionFromFolder = async (idFavorite: number | string) => {
    try {
      // Pastikan kirim idFavorite (bukan idSoal)
      await saveService.removeSoal(idFavorite);
      await refreshFolders();
      showAlert("Soal berhasil dihapus.", "success");
    } catch (error) {
      console.error(error);
      showAlert("Gagal menghapus soal.", "error");
    }
  };

  // ==========================================
  // 2. PROGRESS UJIAN (SESSION STORAGE)
  // ==========================================
  // (Bagian ini tidak ada perubahan signifikan, sudah oke)

  const setProgress = (examId: string, count: number) => {
    setExamProgress((prev) => ({ ...prev, [examId]: count }));
  };

  const saveExamAnswers = useCallback(
    (examId: string, answers: Record<string, string>) => {
      setExamAnswers((prev) => {
        if (JSON.stringify(prev[examId]) === JSON.stringify(answers))
          return prev;
        return { ...prev, [examId]: answers };
      });

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `exam-answers-${examId}`,
          JSON.stringify(answers),
        );
      }
    },
    [],
  );

  const getExamAnswers = useCallback(
    (examId: string): Record<string, string> => {
      if (examAnswers[examId]) return examAnswers[examId];
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem(`exam-answers-${examId}`);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (e) {
            console.error("Error parsing exam answers:", e);
          }
        }
      }
      return {};
    },
    [examAnswers],
  );

  const clearExamAnswers = (examId: string) => {
    setExamAnswers((prev) => {
      const updated = { ...prev };
      delete updated[examId];
      return updated;
    });
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(`exam-answers-${examId}`);
    }
  };

  return (
    <FolderContext.Provider
      value={{
        folders,
        loadingFolders,
        refreshFolders,
        addFolder,
        deleteFolder,
        saveQuestionToFolder,
        deleteQuestionFromFolder,
        examProgress,
        setProgress,
        examAnswers,
        saveExamAnswers,
        getExamAnswers,
        clearExamAnswers,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export const useFolder = () => {
  const context = useContext(FolderContext);
  if (!context) throw new Error("useFolder must be used within FolderProvider");
  return context;
};
