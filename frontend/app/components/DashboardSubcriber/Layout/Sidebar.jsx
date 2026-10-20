import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { BACKEND_URL } from "../../../utils/apiUrl";
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
  {
    id: 2,
    link: "/dashboard-subscriber/latihan",
    name: "Latihan",
    icon: <Book />,
  },
  {
    id: 3,
    link: "/dashboard-subscriber/perkembangan",
    name: "Perkembangan",
    icon: <ChartBar />,
  },
  {
    id: 4,
    link: "/dashboard-subscriber/pencapaian",
    name: "Pencapaian",
    icon: <Award />,
  },
  {
    id: 5,
    link: "/dashboard-subscriber/tersimpan",
    name: "Tersimpan",
    icon: <Bookmark />,
  },
  {
    id: 6,
    link: "/dashboard-subscriber/pengaturan",
    name: "Pengaturan",
    icon: <Settings />,
  },
];

function Sidebar() {
  const { pathname } = useLocation();

  const { user } = useAuth();

  const [profileImage, setProfileImage] = useState("/person.jpg");

  useEffect(() => {
    if (user && user.foto) {
      const fotoUrl = user.foto.startsWith("http")
        ? user.foto
        : `${BACKEND_URL}${user.foto.startsWith("/") ? "" : "/"}${user.foto}`;
      setProfileImage(fotoUrl);
    } else {
      setProfileImage("/person.jpg");
    }
  }, [user]);

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
              className="p-2 rounded-xl border border-red-500 w-10 h-10 flex justify-center bg-red-100 text-red-500 cursor-pointer"
            >
              <LogOut />
            </Link>
          </div>

          {/* PROFILE */}
          <Link
            to="/dashboard-subscriber/pengaturan"
            className="w-11 h-11 rounded-full border-1 border-slate-100 overflow-hidden mt-2 hover:border-blue-500 transition-colors"
          >
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover bg-slate-50"
            />
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
