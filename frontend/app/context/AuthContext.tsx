import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import Alert from "../components/Common/Alert";

interface User {
  id: string | number;
  nama: string;
  role: "admin" | "validator" | "contributor" | "subscriber";
  // ... field lainnya
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  alert: { message: string; type: "success" | "error" } | null;
  showAlert: (message: string, type?: "success" | "error") => void;
  setAlert: React.Dispatch<
    React.SetStateAction<{ message: string; type: "success" | "error" } | null>
  >;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Nanti diisi data riil dari login
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const showAlert = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setAlert({ message, type });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    const target = location.pathname.includes("/dashboard-subscriber")
      ? "/login"
      : "/login-internal";
    navigate(target);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, alert, showAlert, setAlert }}
    >
      {children}
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
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
