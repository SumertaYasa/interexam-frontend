import React from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Book,
  ChartBar,
  Award,
  Bookmark,
  Settings,
  LogOut,
} from "lucide-react";

const sideMenuLists = [
  {
    id: 1,
    link: "/dashboard-subscriber",
    name: "Dashboard",
    icon: <LayoutDashboard />,
  },
  { id: 2, link: "/latihan", name: "Latihan", icon: <Book /> },
  { id: 3, link: "/perkembangan", name: "Perkembangan", icon: <ChartBar /> },
  { id: 4, link: "/pencapaian", name: "Pencapaian", icon: <Award /> },
  { id: 5, link: "/tersimpan", name: "Tersimpan", icon: <Bookmark /> },
  { id: 6, link: "/pengaturan", name: "Pengaturan", icon: <Settings /> },
];

function Sidebar({ profile = "/person.jpg" }) {
  const { pathname } = useLocation();

  return (
    <aside className="h-screen">
      <div className="px-[30px] pt-[20px] flex flex-col  items-center gap-10">
        {/* MENU LIST */}
        <div className="flex flex-col gap-7-5">
          {sideMenuLists.map((menu) => {
            const isActive = pathname === menu.link;

            return (
              <div key={menu.id} className="relative group ">
                <Link
                  to={menu.link}
                  className={`p-2 rounded-xl transition h-10 w-10 flex justify-center items-center
                    ${isActive ? "border  border-blue-500 bg-blue-100" : ""}
                  `}
                >
                  {menu.icon}
                </Link>

                {/* Tooltip */}
                <div
                  className="absolute left-12 top-1/2 -translate-y-1/2 
                  opacity-0 group-hover:opacity-100 
                  pointer-events-none transition
                  bg-white shadow-lg px-3 py-1 rounded-md text-sm 
                  whitespace-nowrap z-50"
                >
                  {menu.name}

                  {/* Arrow */}
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 
                    -translate-x-full border-8 border-transparent 
                    border-r-white"
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM AREA */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative pt-5">
            <Link
              to="/logout"
              className="p-2 rounded-xl border border-red-500 w-10 h-10 flex justify-center bg-red-100 text-red-500"
            >
              <LogOut />
            </Link>
          </div>

          {/* PROFILE */}
          <div className="h-7-5 w-7-5 border overflow-hidden rounded-full">
            <img src={profile} alt={profile.split("/").pop().split(".")[0]} />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
