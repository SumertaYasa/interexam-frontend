import React from "react";
import { NavLink } from "react-router";

function Preview() {
  return (
    <div className="">
      <div className="flex flex-col md:flex-row px-[20px] gap-5 pt-[100px] md:pt-[120px] md:px-[30px]">
        <div className="flex flex-col gap-[15px] mb-[30px] md:mb-0 ">
          <h1 className="text-heading-3 md:text-heading-2 font-bold">
            Setiap langkah punya artinya.
          </h1>
          <p className="text-body-s-regular md:text-body-sm-regular text-justify">
            Dengan dashboard InterExam, kamu bisa melihat sejauh mana usahamu
            berkembang setiap hari. Mulai pantau kemajuanmu dan rasakan
            bagaimana latihan kecil setiap hari membentuk hasil besar di akhir
            perjalananmu.
          </p>
          <NavLink
            to={"/login"}
            className="place-self-start px-[20px] py-[10px] bg-primary rounded-full text-white"
          >
            Coba Dashboard Sekarang
          </NavLink>
        </div>
        <div>
          <img
            src="/dashboard-preview.png"
            alt="dashboard preview"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Preview;
