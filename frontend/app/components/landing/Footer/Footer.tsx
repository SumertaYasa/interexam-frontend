import React from "react";
import { NavLink } from "react-router";
import { ArrowRight, Facebook, Instagram, Linkedin } from "lucide-react";

const menuLists = [
  { id: 1, link: "/", name: "beranda", end: true },
  { id: 2, link: "/tes", name: "tes" },
  { id: 3, link: "/paket", name: "paket" },
  { id: 4, link: "/tentang-kami", name: "tentang kami" },
];

const socialmedia = [
  { id: 1, link: "/instagram", name: "instagram", icon: <Instagram /> },
  { id: 2, link: "/linkedin", name: "linkedin", icon: <Linkedin /> },
  { id: 3, link: "/facebook", name: "facebook", icon: <Facebook /> },
];

function Footer() {
  return (
    <footer>
      <div className="px-5 pt-[100px] pb-[20px] md:pt-[120px] md:px-7-5 md:pb-[30px] w-full text-white flex flex-col gap-5 *:rounded-[10px] *:p-5 *:md:p-10">
        <div className="bg-primary  ">
          <h1 className="text-heading-5 md:text-heading-2 pb-5 font-semibold">
            Belajar efisien? Kami bantu wujudkan.
          </h1>
          <p className="text-body-s-demilight md:text-body-m-demilight">
            Dengan InterExam, setiap latihan jadi langkah nyata menuju hasil
            terbaikmu.
          </p>
        </div>
        <div className="bg-primary flex flex-col gap-2.5 md:gap-5">
          <h1 className="text-heading-5 md:text-heading-2 font-semibold">
            Mulai perjalanan belajarmu hari ini.
          </h1>
          <div className="flex justify-between items-center gap-1 border-b p-2.5">
            <NavLink to={"/login"} className=" md:text-heading-3 font-semibold">
              Coba Sekarang
            </NavLink>
            <ArrowRight className="border rounded-full p-1 md:p-2.5 md:w-[40px] md:h-[40px] " />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between gap-5">
            <div className="flex flex-col gap-2.5">
              <div>
                <p>
                  <span className="font-semibold">Masih ragu?</span> Hubungi
                  kami untuk berdiskusi.
                </p>
                <NavLink to={""}></NavLink>
              </div>
              <NavLink to={""}>0361 997 6450</NavLink>
              <p>Denpasar, Bali</p>
            </div>
            <div className="flex flex-col gap-2.5 ">
              <NavLink to={""}>Ketentuan layanan</NavLink>
              <NavLink to={""}>Kebijakan privasi</NavLink>

              <p>© 2025 InterExam. Semua hak dilindungi.</p>
            </div>
          </div>
        </div>
        <div className="bg-primary flex flex-col md:flex-row justify-between gap-5">
          <ul>
            {menuLists.map((menu) => (
              <li key={menu.id}>
                <NavLink to={menu.link} end={menu.end}>
                  {menu.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className="flex gap-4">
            {socialmedia.map((social) => (
              <li key={social.id}>
                <NavLink to={social.link}>{social.icon}</NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
