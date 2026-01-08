import React from "react";
import { Lock, Award } from "lucide-react";

export default function BadgeCard({
  title,
  description,
  date,
  isUnlocked,
  color,
  icon: Icon,
}) {
  return (
    <div
      className={`relative group p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${
        isUnlocked
          ? "bg-white border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2"
          : "bg-slate-50 border-transparent opacity-60"
      }`}
    >
      {/* Icon Lencana */}
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 relative transition-transform duration-700 ${isUnlocked ? "group-hover:rotate-[12deg]" : ""}`}
        >
          {/* Background Lingkaran Lencana */}
          <div
            className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${color}`}
          />

          <div
            className={`relative w-full h-full rounded-full flex items-center justify-center shadow-inner ${
              isUnlocked
                ? `${color} text-white`
                : "bg-slate-200 text-slate-400 grayscale"
            }`}
          >
            {Icon ? <Icon size={40} strokeWidth={2.5} /> : <Award size={40} />}
          </div>

          {/* Overlay Gembok jika terkunci */}
          {!isUnlocked && (
            <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md text-slate-400">
              <Lock size={16} fill="currentColor" />
            </div>
          )}
        </div>

        {/* Teks Informasi */}
        <h4
          className={`text-lg font-black tracking-tight mb-2 ${isUnlocked ? "text-slate-900" : "text-slate-400"}`}
        >
          {title}
        </h4>
        <p className="text-xs font-medium text-slate-400 leading-relaxed px-2">
          {description}
        </p>

        {/* Tanggal didapatkan (Jika Unlocked) */}
        {isUnlocked && (
          <div className="mt-6 px-4 py-1.5 bg-slate-50 rounded-full">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Didapat: {date}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
