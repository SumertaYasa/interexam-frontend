import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import { initFlowbite } from "flowbite";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../../../context/AuthContext";
import DashboardFooter from "./DashboardFooter";

import {
  ADMIN_MENU,
  CONTRIBUTOR_MENU,
  VALIDATOR_MENU,
} from "../../../config/menus";

export default function DashboardLayout({ children }) {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login-internal");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
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
          localStorage.removeItem("token");
          navigate("/login-internal");
        }
      } catch (error) {
        console.error("Session error:", error);
        navigate("/login-internal");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate, setUser]);

  const userRole = user?.role?.toLowerCase();

  let menuList;
  if (userRole === "admin") menuList = ADMIN_MENU;
  else if (userRole === "contributor") menuList = CONTRIBUTOR_MENU;
  else if (userRole === "validator") menuList = VALIDATOR_MENU;
  else menuList = [];

  const [isWide, setIsWide] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsWide(!isWide);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // useEffect(() => {
  //   initFlowbite();
  // }, []);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  const marginClass = isWide ? "sm:ml-64" : "sm:ml-20";

  return (
    <div className="antialiased bg-gray-50 min-h-screen">
      <Header
        toggleDesktopSidebar={toggleSidebar}
        toggleMobileSidebar={toggleMobileSidebar}
        username={user.nama || "User"}
        email={user.email_user}
        avatar={user.foto}
      />
      <Sidebar
        isWide={isWide}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        menuData={menuList}
        userRole={userRole}
      />

      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-30 sm:hidden"
        />
      )}

      <div
        id="main-content"
        className={`pt-20  transition-all duration-200 ease-in-out min-h-screen bg-gray-50 flex flex-col
       ${marginClass}`}
      >
        <main className=" p-2 flex-grow ">{children}</main>
        <DashboardFooter />
      </div>
    </div>
  );
}
