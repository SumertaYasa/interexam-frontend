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

// --- 1. UPDATE INTERFACE ---
interface User {
  id_subscriber: string | number;
  nama_subscriber: string;
  role: "admin" | "validator" | "contributor" | "subscriber";
  foto?: string;

  // Field baru khusus Subscriber
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

  // Helper untuk cek apakah user adalah premium
  // Admin/Internal dianggap "Premium" agar bisa akses semua (opsional)
  const isPremium = useMemo(() => {
    if (!user) return false;
    // Jika Internal, anggap true (unlocked)
    if (user.role !== "subscriber") return true;
    // Jika Subscriber, cek flag isPremium
    return !!user.isPremium;
  }, [user]);

  // Fungsi Fetch User Utama
  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let userData = response.data.user;

      // ============================================================
      // 🛡️ LOGIC KHUSUS SUBSCRIBER
      // ============================================================
      if (userData && userData.role === "subscriber") {
        try {
          // OPSI A: Jika Backend /auth/me sudah mengirim field 'active_subscription'
          // const hasActiveSub = userData.active_subscription && new Date(userData.active_subscription.tanggal_selesai) > new Date();

          // OPSI B: Fetch Status Terpisah (Lebih Aman untuk memastikan data terbaru)
          // Kita panggil endpoint ringan, misal check-status
          const subResponse = await axios.get(
            "http://localhost:5000/api/v1/subscriber/check-status",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          // Asumsi endpoint balikin { status: 'active', is_premium: true }
          userData.isPremium = subResponse.data.is_premium;
        } catch (error) {
          // Jika 404 atau error, berarti Gratisan (Not Premium)
          console.log("User status: Free Member");
          userData.isPremium = false;
        }
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      if (error.response?.status === 401) {
        doLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      await fetchUser(token);
    };

    checkAuth();
  }, []);

  const refreshSubscription = async () => {
    const token = localStorage.getItem("token");
    if (token) await fetchUser(token);
  };

  const showAlert = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setAlert({ message, type });
  };

  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const logout = () => {
    doLogout();
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
        isPremium, // <--- Value ini yang dipakai di UI Gembok
        isLoading,
        setUser,
        logout,
        refreshSubscription,
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
