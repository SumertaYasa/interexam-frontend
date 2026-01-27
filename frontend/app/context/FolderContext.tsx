import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

interface Question {
  id: string;
  text: string;
  options: string[];
  subject?: string;
  correctAnswer: number;
}

interface FolderItem {
  id_folder: number | string;
  id_subscriber: number | string;
  id_soal: string | null;
  date: string;
  folder_name: string;
  note?: string;
  question_text?: string;
  subject?: string;
}

interface FolderContextType {
  folders: FolderItem[];
  addFolder: (name: string) => void;
  deleteFolder: (id: string | number) => void;
  saveQuestionToFolder: (
    idSoalInput: any,
    idFolder: string | number,
    folderName: string,
  ) => void;
  deleteQuestionFromFolder: (idSoal: string, idFolder: string | number) => void;
  updateQuestionNote: (
    idSoal: string,
    idFolder: string | number,
    note: string,
  ) => void;
  examProgress: Record<string, number>;
  setProgress: (examId: string, count: number) => void;
  examAnswers: Record<string, Record<string, string>>;
  saveExamAnswers: (examId: string, answers: Record<string, string>) => void;
  getExamAnswers: (examId: string) => Record<string, string>;
  clearExamAnswers: (examId: string) => void;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, showAlert } = useAuth();

  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [examProgress, setExamProgress] = useState<Record<string, number>>({});
  const [examAnswers, setExamAnswers] = useState<
    Record<string, Record<string, string>>
  >({});

  // 1. Tambah Folder Baru
  const addFolder = (name: string) => {
    const newFolder: FolderItem = {
      id_folder: Date.now(),
      id_subscriber: user?.id_subscriber || "guest",
      id_soal: null,
      date: new Date().toISOString(),
      folder_name: name,
    };
    setFolders((prev) => [...prev, newFolder]);
    showAlert("Folder berhasil dibuat!");
  };

  // 2. Hapus Folder
  const deleteFolder = (id: string | number) => {
    setFolders((prev) => prev.filter((f) => f.id_folder !== id));
    showAlert("Folder dihapus");
  };

  // 3. Simpan Soal ke Folder (Bookmark)
  const saveQuestionToFolder = (
    idSoalInput: any,
    idFolder: string | number,
    folderName: string,
  ) => {
    const idSoal =
      typeof idSoalInput === "object" ? idSoalInput.id : idSoalInput;

    setFolders((prev) => {
      const isAlreadySaved = prev.some(
        (f) =>
          String(f.id_folder) === String(idFolder) &&
          String(f.id_soal) === String(idSoal),
      );

      if (isAlreadySaved) {
        showAlert("Soal sudah ada di folder ini!", "error");
        return prev;
      }

      const newEntry: FolderItem = {
        id_folder: idFolder,
        id_subscriber: user?.id_subscriber || "guest",
        id_soal: idSoal,
        date: new Date().toISOString(),
        folder_name: folderName,
        note: "",
      };

      showAlert("Berhasil menyimpan soal!");
      return [...prev, newEntry];
    });
  };

  // 4. Hapus Soal dari Folder
  const deleteQuestionFromFolder = (
    idSoal: string,
    idFolder: string | number,
  ) => {
    setFolders((prev) =>
      prev.filter(
        (f) =>
          String(f.id_soal) !== String(idSoal) ||
          String(f.id_folder) !== String(idFolder),
      ),
    );
  };

  // 5. Update Catatan Soal dalam Folder
  const updateQuestionNote = (
    idSoal: string,
    idFolder: string | number,
    note: string,
  ) => {
    setFolders((prev) =>
      prev.map((f) =>
        String(f.id_soal) === String(idSoal) &&
        String(f.id_folder) === String(idFolder)
          ? { ...f, note }
          : f,
      ),
    );
    showAlert("Catatan berhasil diperbarui!");
  };

  // 6. Progres Ujian (State Ringan)
  const setProgress = (examId: string, count: number) => {
    setExamProgress((prev) => ({ ...prev, [examId]: count }));
  };

  // 7. Simpan Jawaban (Gunakan useCallback untuk mencegah infinite loop)
  const saveExamAnswers = useCallback(
    (examId: string, answers: Record<string, string>) => {
      setExamAnswers((prev) => {
        // Hanya update jika data berubah secara stringify untuk performa
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

  // 8. Ambil Jawaban Tersimpan
  const getExamAnswers = useCallback(
    (examId: string) => {
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

  // 9. Bersihkan Jawaban
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
        addFolder,
        deleteFolder,
        saveQuestionToFolder,
        deleteQuestionFromFolder,
        updateQuestionNote,
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
