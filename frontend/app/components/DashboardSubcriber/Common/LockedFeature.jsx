import React from "react";
import { Lock, Crown, ChevronRight } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

function LockedFeature({
  title = "Fitur Premium",
  description = "Upgrade paket langganan Anda untuk mengakses fitur eksklusif ini.",
  children,
  isLocked,
  minHeight = "min-h-[300px]",
  className = "",
}) {
  // Ambil status premium dari context sebagai fallback agar komponen
  // bereaksi terhadap perubahan isPremium secara langsung.
  const { isPremium, isLoading } = useAuth();

  // Hitung status terkunci final: terkunci HANYA jika paket berbayar (isLocked=true) AND user tidak premium
  const effectiveLocked = isLocked && !isPremium;

  // DEBUG: Log kondisi locked dan sumbernya
  console.log(
    `[LockedFeature] ${title} - prop.isLocked:`,
    isLocked,
    "| context.isPremium:",
    isPremium,
    "| effectiveLocked:",
    effectiveLocked,
  );

  // Fungsi redirect ke halaman harga/payment
  const handleUpgrade = () => {
    window.location.href = "/paket";
  };

  if (!effectiveLocked) {
    return <>{children}</>;
  }

  return (
    <div
      className={`relative w-full ${minHeight} rounded-xl overflow-hidden border border-slate-200 bg-slate-50 ${className}`}
    >
      {/* 1. BACKGROUND CONTENT (DIBLUR) */}
      {/* Kita render children tapi dikasih filter blur biar kelihatan 'menggoda' */}
      <div className="absolute inset-0 p-6 opacity-30 blur-sm select-none pointer-events-none filter grayscale">
        {children || (
          // Placeholder pattern jika tidak ada children (Standalone mode)
          <div className="grid grid-cols-3 gap-4 h-full animate-pulse">
            <div className="h-full bg-slate-300 rounded-lg col-span-2"></div>
            <div className="h-full bg-slate-300 rounded-lg"></div>
            <div className="h-24 bg-slate-300 rounded-lg col-span-3"></div>
            <div className="h-full bg-slate-300 rounded-lg"></div>
            <div className="h-full bg-slate-300 rounded-lg col-span-2"></div>
          </div>
        )}
      </div>

      {/* 2. OVERLAY LOCK UI (POSISI TENGAH) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-white/40 backdrop-blur-[2px]">
        {/* Icon Gembok & Mahkota */}
        <div
          className="relative mb-4 group cursor-pointer"
          onClick={handleUpgrade}
        >
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl border border-yellow-200 shadow-sm">
            <Lock className="w-8 h-8 text-yellow-600" />
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1 rounded-full shadow-md">
              <Crown className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Text */}
        <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">
          {title}
        </h3>
        <p className="text-sm text-slate-600 max-w-xs mb-6 leading-relaxed">
          {description}
        </p>

        {/* Button Action */}
        <button
          onClick={handleUpgrade}
          className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 bg-gradient-to-r from-slate-900 to-slate-800 rounded-full hover:from-slate-800 hover:to-slate-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
        >
          <span>Buka Akses Premium</span>
          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

export default LockedFeature;
