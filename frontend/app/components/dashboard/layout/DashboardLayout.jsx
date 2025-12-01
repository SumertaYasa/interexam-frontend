import { useEffect, useState } from "react";
import { initFlowbite } from "flowbite";
import Sidebar from "./Sidebar";
import Header from "./Header";

import { ADMIN_MENU, CONTRIBUTOR_MENU, VALIDATOR_MENU } from "../../../config/menus";


export default function DashboardLayout({ children }) {

  const userRole = "admin";

  let menuList;
  if(userRole === "admin") menuList = ADMIN_MENU;
  else if(userRole === "contributor") menuList = CONTRIBUTOR_MENU;
  else if(userRole === "validator") menuList = VALIDATOR_MENU;
  else menuList = [];

  const [isWide, setIsWide] = useState(true);

  // 2. Fungsi Toggle untuk Desktop
  const toggleSidebar = () => {
    setIsWide(!isWide);
  };

  useEffect(() => {
    initFlowbite();
  }, []);

  const marginClass = isWide ? "sm:ml-64" : "sm:ml-20";

  return (
    <div className="antialiased">
      <Header toggleDesktopSidebar={toggleSidebar} />
      <Sidebar isWide={isWide} menuData={menuList}/>

      <div id="main-content" 
      className={`h-s p-4  transition-all duration-200 ease-in-out py-20  h-screen bg-gray-50 
       ${marginClass}`}>

        <main className=" pt-15 ">
          {children}
        </main>

      </div>
      
    </div>
  );
}