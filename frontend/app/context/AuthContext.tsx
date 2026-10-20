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
import { AUTH_API_URL, API_BASE_URL } from "../utils/apiUrl";

// --- 1. UPDATE INTERFACE ---
interface User {
  id_subscriber: string | number;
  nama_subscriber: string;
  role: "admin" | "validator" | "contributor" | "subscriber";
  foto?: string;

  email_subscriber?: string;
  phone?: string;
  // Field baru khusus Subscriber
  is_premium?: boolean;
  isPremium?: boolean;
  // Opsional: simpan tanggal expired jika butuh countdown
  subscriptionExpiredAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;

  isPremium: boolean; // Helper state agar mudah diakses di UI
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  // Fungsi untuk memaksa refresh status (misal setelah bayar sukses)
  refreshSubscription: () => Promise<void>;
  // Fungsi polling untuk menunggu premium status (penting untuk post-payment)
  waitForPremiumStatus: (
    maxAttempts?: number,
    delayMs?: number,
  ) => Promise<boolean>;
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

  // ✅ SIMPLIFIED: Compute isPremium langsung dari user.isPremium (backend sudah handle)
  const isPremium = useMemo(() => {
    if (!user) return false;
    // Admin/Internal otomatis premium
    if (user.role && user.role !== "subscriber") return true;
    // Subscriber: gunakan isPremium field yang sudah ada dari /me endpoint
    return !!user.isPremium;
  }, [user]);

  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get(`${AUTH_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ SIMPLIFIED: Backend sudah return isPremium lengkap dari /me
      let userData = { ...response.data.user };

      console.log("[AUTH] User data from /me (includes isPremium):", {
        id: userData.id,
        nama: userData.nama,
        role: userData.role,
        isPremium: userData.isPremium,
      });

      // Simpan ke LocalStorage, baru SetState
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      await fetchUser(token);
    };
    checkAuth();
  }, []);

  // DEBUG: Log setiap kali state `user` berubah agar kita bisa melacak
  // kapan `isPremium` di-set atau di-overwrite.
  useEffect(() => {
    if (user) {
      console.log("🕵️ DETEKTIF: User state berubah menjadi:", {
        id: user.id_subscriber,
        isPremium: user.isPremium,
        is_premium: user.is_premium,
        source: "AuthContext Update",
      });
    }
  }, [user]);

  // ============================================================
  // 🔥 FUNGSI REFRESH DENGAN POLLING (CRITICAL FIX)
  // ============================================================
  // Refresh kuencian dan tunggu sampai isPremium = true
  const waitForPremiumStatus = async (
    maxAttempts: number = 10,
    delayMs: number = 1000,
  ): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const subResponse = await axios.get(
          `${API_BASE_URL}/subscriber/check-status`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { _t: new Date().getTime() },
          },
        );

        const isPremiumNow = !!subResponse.data.is_premium;

        if (isPremiumNow) {
          console.log("[AUTH] ✅ Premium status confirmed!");

          // Gunakan functional update (prev => ...) agar data user (nama, role) tidak hilang
          setUser((prevUser) => {
            if (!prevUser) return null;
            const updatedUser = {
              ...prevUser, // Jaga data lama (nama, role, foto)
              is_premium: true,
              isPremium: true,
              subscriptionExpiredAt:
                subResponse.data.subscription?.tanggal_selesai,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            return updatedUser;
          });

          return true;
        }

        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      } catch (error: any) {
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }
    return false;
  };

  const refreshSubscription = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("[AUTH] 🔄 Refreshing subscription status...");
      await fetchUser(token);
    }
  };

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
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isPremium,
        isLoading,
        setUser,
        logout,
        refreshSubscription,
        waitForPremiumStatus,
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
