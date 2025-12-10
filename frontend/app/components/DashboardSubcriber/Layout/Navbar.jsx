import React from "react";
import { Bell } from "lucide-react";

function Navbar({ Name }) {
  return (
    <nav className="w-full shadow">
      <div className="flex justify-between items-center px-[45px] py-5 ">
        <div className="flex justify-center items-center gap-[45px]">
          <div className="w-7-5 ">
            <img src="/interexam-logo.svg" />
          </div>
          <div className="flex justify-center items-center gap-2.5">
            <span className="text-body-m-semibold ">
              Selamat datang, {Name}!
            </span>
            <p className="text-body-s-demilight">
              Mari tingkatkan persiapan dan point dengan tes bersama aku!
            </p>
          </div>
        </div>
        <Bell />
      </div>
    </nav>
  );
}

export default Navbar;
