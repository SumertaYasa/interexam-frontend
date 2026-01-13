import React from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center font-sans">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-md w-full animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
          <ShieldAlert size={48} strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
          Akses Ditolak
        </h1>

        <p className="text-slate-500 font-medium leading-relaxed mb-8">
          Maaf, akun kamu tidak memiliki izin untuk mengakses halaman ini.
          Silakan hubungi admin jika ini adalah kesalahan.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200"
        >
          <ArrowLeft size={18} />
          Kembali Sekarang
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
