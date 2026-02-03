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

// Inisialisasi Context dengan tipe undefined agar aman saat pengecekan di hook
const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const { user, showAlert } = useAuth();

  // State untuk Folder (Data dari API)
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [loadingFolders, setLoadingFolders] = useState<boolean>(false);

  // State untuk Progress Ujian (Tetap Local/Session)
  const [examProgress, setExamProgress] = useState<Record<string, number>>({});
  const [examAnswers, setExamAnswers] = useState<
    Record<string, Record<string, string>>
  >({});

  // ==========================================
  // 1. MANAJEMEN FOLDER (API)
  // ==========================================

  // Fetch Folders dari Backend
  const refreshFolders = useCallback(async () => {
    if (!user) return;
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

  // Load folder saat pertama kali mount
  useEffect(() => {
    refreshFolders();
  }, [refreshFolders]);

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
      // Optimistic update: filter folder yang dihapus dari state lokal
      setFolders((prev) => prev.filter((f) => f.id !== id));
      showAlert("Folder dihapus", "success");
    } catch (error) {
      showAlert("Gagal menghapus folder", "error");
    }
  };

  // Simpan Soal (Bookmark + Masuk Folder)
  const saveQuestionToFolder = async (
    idSoalInput: number | string | { id: number | string },
    idFolder: number | string | null = null,
    folderName: string = "",
  ) => {
    try {
      // idSoalInput bisa berupa object atau string ID, kita ambil ID-nya saja
      const realIdSoal =
        typeof idSoalInput === "object" ? idSoalInput.id : idSoalInput;

      // 1. Simpan ke Favorites dulu
      const saveResponse = await saveService.saveSoal(realIdSoal);
      const idFavorite = saveResponse.data?.id_favorite;

      // 2. Jika user memilih folder, pindahkan item ke folder tersebut
      if (idFolder && idFavorite) {
        await saveService.moveItemToFolder(idFavorite, Number(idFolder));
        showAlert(`Soal disimpan ke folder ${folderName}!`, "success");
      } else {
        showAlert("Soal berhasil disimpan ke favorit!", "success");
      }

      // 3. Refresh data folder
      await refreshFolders();
      return true;
    } catch (error: any) {
      // Handle jika error karena duplikat
      if (error.response?.status === 400) {
        // Note: showAlert mungkin hanya menerima "success" | "error" di AuthContext kamu.
        // Jadi kita gunakan "error" atau "info" jika didukung.
        // Saya ganti ke "error" agar aman sesuai pesan error VSCode kamu.
        showAlert("Soal sudah ada di daftar favorit Anda.", "error");
      } else {
        showAlert("Gagal menyimpan soal.", "error");
      }
      return false;
    }
  };

  // Hapus Soal dari Folder
  const deleteQuestionFromFolder = async (idFavorite: number | string) => {
    try {
      await saveService.removeSoal(idFavorite);
      await refreshFolders();
      showAlert("Soal dihapus dari folder.", "success");
    } catch (error) {
      showAlert("Gagal menghapus soal.", "error");
    }
  };

  // ==========================================
  // 2. PROGRESS UJIAN (SESSION STORAGE)
  // ==========================================

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
