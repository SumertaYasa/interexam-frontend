import { useEffect, useState } from "react";
import { initFlowbite } from "flowbite";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }) {

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
      <Sidebar isWide={isWide}/>

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