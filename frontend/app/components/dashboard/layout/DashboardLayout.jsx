import { useEffect, useState } from "react";
// import { initFlowbite } from "flowbite";
import Sidebar from "./Sidebar";
import Header from "./Header";

import {
  ADMIN_MENU,
  CONTRIBUTOR_MENU,
  VALIDATOR_MENU,
} from "../../../config/menus";

export default function DashboardLayout({ children }) {
  const userRole = "admin";

  let menuList;
  if (userRole === "admin") menuList = ADMIN_MENU;
  else if (userRole === "contributor") menuList = CONTRIBUTOR_MENU;
  else if (userRole === "validator") menuList = VALIDATOR_MENU;
  else menuList = [];

  const [isWide, setIsWide] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Fungsi Toggle untuk Desktop
  const toggleSidebar = () => {
    setIsWide(!isWide);
  };

  // Toggle Mobile
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // useEffect(() => {
  //   initFlowbite();
  // }, []);

  const marginClass = isWide ? "sm:ml-64" : "sm:ml-20";

  return (
    <div className="antialiased bg-gray-50 min-h-screen">
      <Header toggleDesktopSidebar={toggleSidebar} toggleMobileSidebar={toggleMobileSidebar} />
      <Sidebar isWide={isWide}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        menuData={menuList}
        userRole={userRole} />

      {isMobileOpen && (
        <div 
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-30 sm:hidden"
        />
      )}
      
      <div
        id="main-content"
        className={`h-s p-2  transition-all duration-200 ease-in-out py-20  min-h-screen bg-gray-50 
       ${marginClass}`}
      >
        <main className=" pt-18 ">{children}</main>
      </div>
    </div>
  );
}
