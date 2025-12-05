import React from "react";
import { Link } from "react-router";
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
  { id: 1, link: "#", name: "Dashboard", icon: <LayoutDashboard /> },
  { id: 2, link: "#", name: "Latihan", icon: <Book /> },
  { id: 3, link: "#", name: "Perkembangan", icon: <ChartBar /> },
  { id: 4, link: "#", name: "Pencapaian", icon: <Award /> },
  { id: 5, link: "#", name: "Tersimpan", icon: <Bookmark /> },
  { id: 6, link: "#", name: "Pengaturan", icon: <Settings /> },
];
function Sidebar({ profile = "/person.jpg" }) {
  return (
    <aside className="h-screen">
      <div className="px-[30px] pt-[20px] flex flex-col gap-[150px] items-center ">
        <div className="flex flex-col gap-[30px] ">
          {sideMenuLists.map((sideMenu) => (
            <div key={sideMenu.id}>
              <Link to={sideMenu.link}>{sideMenu.icon}</Link>
              <span className="hidden">{sideMenu.name}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-10">
          <div>
            <Link to="/logout">
              <LogOut />
            </Link>
            <span className="hidden">Logout</span>
          </div>
          <div className="h-7-5 w-7-5 border overflow-hidden rounded-full">
            <img src={profile} alt={profile.split("/").pop().split(".")[0]} />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
