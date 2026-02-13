import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import Alert from "../components/Common/Alert";
import { googleLogout } from "@react-oauth/google";

interface User {
  id_subscriber: string | number;
  nama_subscriber: string;
  role: "admin" | "validator" | "contributor" | "subscriber";

  foto?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useMemo(() => !!user, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.user) {
          setUser(response.data.user);

          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");

          localStorage.removeItem("user");

          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const showAlert = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setAlert({ message, type });
  };

  const logout = () => {
    googleLogout();

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    setUser(null);
    const target = location.pathname.includes("/dashboard-subscriber")
      ? "/login"
      : "/login-internal";
    navigate(target, { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        setUser,
        logout,
        alert,
        showAlert,
        setAlert,
      }}
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
