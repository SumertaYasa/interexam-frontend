import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

interface Question {
  id: string;
  text: string;
  options: string[];
  subject?: string;
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
  availableQuestions: Question[];
  folders: FolderItem[];
  addFolder: (name: string) => void;
  deleteFolder: (id: string | number) => void;
  saveQuestionToFolder: (
    idSoalInput: any,
    idFolder: string | number,
    folderName: string
  ) => void;
  deleteQuestionFromFolder: (idSoal: string, idFolder: string | number) => void;
  updateQuestionNote: (
    idSoal: string,
    idFolder: string | number,
    note: string
  ) => void;
  examProgress: Record<string, number>;
  setProgress: (examId: string, count: number) => void;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, showAlert } = useAuth();

  const [availableQuestions] = useState<Question[]>([
    {
      id: "q1",
      text: "She _______ to the market when it started to rain.",
      options: ["go", "goes", "went", "was going"],
      subject: "Bahasa Inggris",
    },
    {
      id: "q2",
      text: "Choose the correct sentence:",
      options: ["He don't like coffee.", "He doesn't like coffee."],
      subject: "Bahasa Inggris",
    },
    {
      id: "q3",
      text: "If I _______ enough money, I would buy a new phone.",
      options: ["have", "had", "would have"],
      subject: "Bahasa Inggris",
    },
  ]);

  const [folders, setFolders] = useState<FolderItem[]>([]);

  const addFolder = (name: string) => {
    const newFolder: FolderItem = {
      id_folder: Date.now(),
      id_subscriber: user?.id || "guest",
      id_soal: null,
      date: new Date().toISOString(),
      folder_name: name,
    };
    setFolders((prev) => [...prev, newFolder]);
    showAlert("Folder berhasil dibuat!");
  };

  const deleteFolder = (id: string | number) => {
    setFolders((prev) => prev.filter((f) => f.id_folder !== id));
    showAlert("Folder dihapus");
  };

  const saveQuestionToFolder = (
    idSoalInput: any,
    idFolder: string | number,
    folderName: string
  ) => {
    // GUARD: Jika input berupa object, ambil ID-nya. Jika string, gunakan langsung.
    const idSoal =
      typeof idSoalInput === "object" ? idSoalInput.id : idSoalInput;

    const questionDetail = availableQuestions.find((q) => q.id === idSoal);

    if (!questionDetail) {
      console.error("ID Soal tidak ditemukan di Bank Soal:", idSoal);
      return showAlert("Data soal tidak ditemukan!", "error");
    }

    setFolders((prev) => {
      // Bandingkan ID sebagai string agar lebih aman
      const isAlreadySaved = prev.some(
        (f) =>
          String(f.id_folder) === String(idFolder) &&
          String(f.id_soal) === String(idSoal)
      );

      if (isAlreadySaved) {
        showAlert("Soal sudah ada di folder ini!", "error");
        return prev;
      }

      const newEntry: FolderItem = {
        id_folder: idFolder,
        id_subscriber: user?.id || 5,
        id_soal: idSoal,
        date: new Date().toISOString(),
        folder_name: folderName,
        question_text: questionDetail.text,
        subject: questionDetail.subject || "Umum",
        note: "",
      };

      showAlert("Berhasil menyimpan soal!");
      return [...prev, newEntry];
    });
  };

  const deleteQuestionFromFolder = (
    idSoal: string,
    idFolder: string | number
  ) => {
    setFolders((prev) =>
      prev.filter((f) => {
        const isMatch =
          String(f.id_soal) === String(idSoal) &&
          String(f.id_folder) === String(idFolder);

        return !isMatch;
      })
    );
  };

  const updateQuestionNote = (
    idSoal: string,
    idFolder: string | number,
    note: string
  ) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id_soal === idSoal && f.id_folder === idFolder ? { ...f, note } : f
      )
    );
    showAlert("Catatan berhasil diperbarui!");
  };

  const [examProgress, setExamProgress] = useState<Record<string, number>>({});

  const setProgress = (examId: string, count: number) => {
    setExamProgress((prev) => ({
      ...prev,
      [examId]: count,
    }));
  };

  return (
    <FolderContext.Provider
      value={{
        availableQuestions,
        folders,
        addFolder,
        deleteFolder,
        saveQuestionToFolder,
        deleteQuestionFromFolder,
        updateQuestionNote,
        examProgress,
        setProgress,
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
