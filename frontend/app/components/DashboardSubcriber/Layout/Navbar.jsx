import React, { useState, useEffect, useRef } from "react";
import { Bell, Construction, Info } from "lucide-react";

function Navbar({ Name }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="w-full shadow bg-white z-50 relative">
      <div className="flex justify-between items-center px-[45px] py-4">
        {/* Kiri: Logo & Sapaan */}
        <div className="flex justify-center items-center gap-[45px]">
          <div className="w-7-5">
            <img src="/interexam-logo.svg" alt="InterExam Logo" />
          </div>
          <div className="flex justify-center items-center gap-2.5">
            <span className="text-body-m-semibold text-slate-800">
              Selamat datang, {Name}!
            </span>
            <p className="text-body-s-demilight text-slate-500 hidden md:block">
              Mari tingkatkan persiapan dan point dengan tes bersama aku!
            </p>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-full transition-all duration-200 ${
              isOpen
                ? "bg-slate-100 text-primary"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Bell size={24} />
            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              {/* Header Pop-up */}
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Notifikasi</h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                  0 Baru
                </span>
              </div>

              <div className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                  <Construction size={24} />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  Fitur Sedang Dalam Proses
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed px-4">
                  Kami sedang menyiapkan sistem notifikasi terbaik untukmu.
                  Nantikan update selanjutnya ya!
                </p>
              </div>

              {/* Footer Pop-up */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 rounded-b-xl text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
