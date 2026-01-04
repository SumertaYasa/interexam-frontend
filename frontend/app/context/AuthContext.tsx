import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import Alert from "../components/Common/Alert";
interface User {
  id: string | number;
  nama: string;
  email_user?: string;
  email_subscriber?: string;
  role: "admin" | "validator" | "contributor" | "subscriber";
  foto?: string;
  status?: string;
}

interface FolderItem {
  id_folder: number | string;
  id_subscriber: number | string;
  id_soal: number | string | null;
  date: string;
  folder_name: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  folders: FolderItem[];
  setFolders: React.Dispatch<React.SetStateAction<FolderItem[]>>;
  addFolder: (name: string) => void;
  deleteFolder: (id: string | number) => void;
  saveQuestionToFolder: (
    idSoal: string | number,
    idFolder: string | number,
    folderName: string
  ) => void;
  alert: { message: string; type: "success" | "error" } | null;
  showAlert: (message: string, type?: "success" | "error") => void;
  setAlert: React.Dispatch<
    React.SetStateAction<{ message: string; type: "success" | "error" } | null>
  >;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [folders, setFolders] = useState<FolderItem[]>([
    {
      id_folder: 1,
      id_subscriber: 5,
      id_soal: 101,
      date: new Date().toISOString(),
      folder_name: "Soal Bahasa Inggris Part 1",
    },
    {
      id_folder: 2,
      id_subscriber: 5,
      id_soal: 202,
      date: new Date().toISOString(),
      folder_name: "Soal UTBK",
    },
  ]);

  const showAlert = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setAlert({ message, type });
  };

  const addFolder = (name: string) => {
    if (!name || name.trim() === "") return;

    const newFolder: FolderItem = {
      id_folder: Date.now(),
      id_subscriber: user?.id || "unknown",
      id_soal: null,
      date: new Date().toISOString(),
      folder_name: name,
    };
    setFolders((prev) => [...prev, newFolder]);
    showAlert("Folder berhasil dibuat!");
  };

  const deleteFolder = (id: string | number) => {
    const getIdFolder = folders.filter((f) => f.id_folder !== id);
    setFolders(getIdFolder);
  };

  const saveQuestionToFolder = (
    idSoal: string | number,
    idFolder: string | number,
    folderName: string
  ) => {
    setFolders((prev) => {
      // Periksa duplikasi id_soal di folder yang sama
      const isAlreadySaved = prev.some(
        (item) => item.id_folder === idFolder && item.id_soal === idSoal
      );

      if (isAlreadySaved) {
        showAlert("Soal ini sudah ada di folder tersebut!", "error");
        return prev;
      }

      const newEntry: FolderItem = {
        id_folder: idFolder,
        id_subscriber: user?.id || 5,
        id_soal: idSoal,
        date: new Date().toISOString(),
        folder_name: folderName,
      };

      showAlert("Berhasil menyimpan soal!");
      return [...prev, newEntry];
    });
  };

  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);

    if (location.pathname.includes("/dashboard-subscriber")) {
      navigate("/login");
    } else {
      navigate("/login-internal");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        folders,
        setFolders,
        addFolder,
        deleteFolder,
        saveQuestionToFolder,
        alert,
        showAlert,
        setAlert,
      }}
    >
      {/* Merender konten aplikasi */}
      {children}

      {/* Merender Alert global jika state alert tidak null */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
