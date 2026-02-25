import React from "react";
import { Link } from "react-router-dom";
import { Trophy, CalendarCheck } from "lucide-react";

export default function CardEventResult({ id, title, date, image, path }) {
  return (
    <div className="w-full md:w-[400px] bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      {/* Bagian Gambar */}
      <div className="w-full h-[140px] relative overflow-hidden bg-slate-100">
        <img 
          src={image || "/default-event.jpg"} 
          alt={title} 
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
          Event Selesai
        </div>
      </div>

      {/* Bagian Konten */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="font-bold text-lg text-slate-900 leading-tight line-clamp-2">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <CalendarCheck size={16} />
          <span>{date}</span>
        </div>

        <Link 
          to={path}
          className="mt-2 w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-colors"
        >
          <Trophy size={18} />
          Lihat Rapor Akhir
        </Link>
      </div>
    </div>
  );
}