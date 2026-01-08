import React from "react";
import { Lock, Award } from "lucide-react";

export default function BadgeItem({
  title,
  description,
  date,
  isUnlocked,
  color,
  icon: Icon,
}) {
  return (
    <div
      className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${
        isUnlocked
          ? "bg-white border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2"
          : "bg-slate-50 border-transparent opacity-60 grayscale-[0.8]"
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative group">
          <div
            className={`absolute inset-0 rounded-full blur-2xl opacity-20 transition-opacity duration-500 ${
              isUnlocked ? color : "bg-slate-300"
            }`}
          />

          <div
            className={`relative w-full h-full rounded-full flex items-center justify-center shadow-inner transition-transform duration-700 ${
              isUnlocked
                ? `${color} text-white group-hover:rotate-[12deg]`
                : "bg-slate-200 text-slate-400"
            }`}
          >
            {Icon ? <Icon size={40} strokeWidth={2.5} /> : <Award size={40} />}
          </div>

          {!isUnlocked && (
            <div className="absolute -bottom-1 -right-1 bg-white p-2.5 rounded-full shadow-lg text-slate-400">
              <Lock size={14} fill="currentColor" />
            </div>
          )}
        </div>

        <h4
          className={`text-lg font-black mb-2 tracking-tight ${isUnlocked ? "text-slate-900" : "text-slate-400"}`}
        >
          {title}
        </h4>
        <p className="text-xs font-medium text-slate-400 leading-relaxed px-2">
          {description}
        </p>

        {isUnlocked && (
          <div className="mt-6 px-1 py-2 w-full bg-slate-50 rounded-full border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              {date}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
