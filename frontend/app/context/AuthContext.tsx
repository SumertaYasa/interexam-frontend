import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// 1. Definisikan tipe data untuk User
interface User {
  id: string | number;
  nama: string;
  email_user?: string;
  email_subscriber?: string;
  role: "admin" | "validator" | "contributor" | "subscriber";
  foto?: string;
  status?: string;
}

// 2. Definisikan tipe data untuk Context kita
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

// 3. Inisialisasi Context dengan tipe data tersebut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login-internal";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Hook custom dengan pengecekan keamanan TypeScript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
