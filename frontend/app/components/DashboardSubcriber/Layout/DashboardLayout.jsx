import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";

function DashboardLayout() {
  return (
    <section className="w-full h-screen flex flex-col overflow-hidden ">
      <div className="z-10  flex-none">
        <Navbar Name={"joe"} />
      </div>

      <div className="flex flex-1 overflow-hidden w-full">
        <Sidebar />

        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
}

export default DashboardLayout;
