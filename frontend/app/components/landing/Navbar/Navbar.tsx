import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const menuLists = [
  { id: 1, link: "/", name: "beranda", end: true },
  { id: 2, link: "/tes", name: "tes" },
  { id: 3, link: "/paket", name: "paket" },
  { id: 4, link: "/tentang-kami", name: "tentang kami" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!tl.current) {
      tl.current = gsap.timeline({ paused: true });

      tl.current.to(menuRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power4.out",
        display: "flex",
      });

      tl.current.from(
        ".mobile-nav-item",
        {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.4,
        },
        "<0.2"
      );
    }

    // CONTROL TIMELINE BERDASARKAN STATE
    if (isMenuOpen) {
      tl.current.play();
    } else {
      tl.current.reverse(); // Animasi mundur (tutup)
    }
  }, [isMenuOpen]); // Jalankan setiap kali isMenuOpen berubah

  return (
    <nav
      id="main-navbar"
      className={`capitalize cursor-pointer font-sora w-full z-50 fixed top-0 left-0 transition-colors duration-300`}
    >
      <div className="mx-[20px] my-[10px] md:mx-[100px] md:my-[30px] flex justify-between items-center relative z-50">
        {/* LOGO */}
        <div className="flex justify-center items-center gap-2.5">
          <img
            className="w-[40px] h-full"
            src="/interexam-logo.svg"
            alt="interexam logo"
          />
          <h1 className="hidden md:block text-body-m-semibold">
            Inter<span className="text-secondary">E</span>xam
          </h1>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex md:gap-[30px] ">
          {menuLists.map((item) => (
            <li key={item.id} className="relative">
              <NavLink
                to={item.link}
                end={item.end}
                className={({ isActive }) =>
                  `text-body-m-semibold transition-colors ${
                    isActive ? "text-primary" : " hover:text-primary"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex md:gap-[20px]">
          <span className="text-body-m-bold text-primary hover:text-primary/80">
            <NavLink to="/coba-gratis">coba gratis</NavLink>
          </span>
          <NavLink className="text-body-m-semibold" to="/login">
            masuk
          </NavLink>
        </div>

        {/* HAMBURGER BUTTON */}
        <div id="hamburger-btn" className="md:hidden z-50 relative font-bold ">
          {isMenuOpen ? (
            <X
              onClick={() => setIsMenuOpen(false)}
              className="w-[30px] h-[30px] "
            />
          ) : (
            <Menu
              onClick={() => setIsMenuOpen(true)}
              className="w-[30px] h-[30px]"
            />
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className="fixed inset-0 w-full h-screen bg-blue-200 z-40 flex flex-col justify-center px-[20px] gap-10 translate-x-full opacity-0 "
        style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}
      >
        <ul className="flex flex-col gap-[30px] border-b">
          {menuLists.map((item) => (
            <li key={item.id} className="mobile-nav-item">
              <NavLink
                to={item.link}
                onClick={() => setIsMenuOpen(false)}
                className="text-heading-2 font-bold "
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-[20px] w-full border-b ">
          <NavLink
            to="/coba-gratis"
            onClick={() => setIsMenuOpen(false)}
            className="mobile-nav-item w-full text-heading-2 font-bold text-primary"
          >
            Coba Gratis
          </NavLink>
          <NavLink
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="mobile-nav-item text-heading-2 font-semibold"
          >
            Masuk
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
