import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../../context/AuthContext";
import { AUTH_API_URL } from "../../../utils/apiUrl";

function DashboardLayout() {
  const { user, setUser } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${AUTH_API_URL}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Jika token kadaluwarsa atau tidak valid, hapus dan redirect [cite: 32]
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        console.error("Session check failed:", err);
        navigate("/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
  }, [navigate, setUser]);

  // Tampilkan loading sebentar agar komponen tidak "berkedip" saat data belum siap
  if (isChecking) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="animate-pulse text-gray-500">Memuat Sesi...</p>
      </div>
    );
  }

  return (
    <section className="w-full h-screen flex flex-col overflow-hidden">
      <div className="z-10 flex-none">
        <Navbar Name={user?.nama || "User"} />
      </div>

      <div className="flex flex-1 overflow-hidden w-full">
        <Sidebar userRole={user?.role} />

        <main className="flex-1 overflow-y-scroll scroll-smooth">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
}

export default DashboardLayout;
