import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

// (Opsional) Jika kamu punya komponen Card Wrapper, bisa di-import.
// Jika tidak, kita pakai div biasa dengan class yang sama.
// import Card from "./Card";

function SmallBadge({ children, className = "" }) {
  return (
    <span
      className={`text-[13px] font-bold py-1 px-2 rounded-full border flex items-center gap-1 border-gray-200 bg-white text-gray-700 tracking-tight leading-none ${className}`}
    >
      {children}
    </span>
  );
}

function CardCobaGratisCourse({
  title = "Judul Paket Soal",
  image = "/person.jpg",
  rating = 4.8,
  totalSoal = 50,
  durasi = 15,
  category = "Latihan Demo",
  path = "#", // Prop untuk navigasi
}) {
  const formatAlt = image.split("/").pop().split(".")[0];

  const cardContent = (
    <>
      {/* CONTAINER GAMBAR */}
      <div className="w-full h-[150px] overflow-hidden relative shrink-0">
        <img
          src={image}
          alt={formatAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* --- LABEL COBA GRATIS (OVERLAY) --- */}
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md flex items-center gap-1 z-10">
          <span>COBA GRATIS</span>
        </div>

        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
          {category}
        </div>
      </div>

      {/* CONTAINER KONTEN */}
      <div className="px-5 py-4 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <div className="flex items-center flex-wrap gap-2 mt-auto">
          {/* Rating */}
          <SmallBadge>
            <Star size={14} className="text-orange-400 fill-orange-400" />
            <span className="ml-0.5">{rating}</span>
          </SmallBadge>

          {/* Jumlah Soal */}
          <SmallBadge>{totalSoal} Soal</SmallBadge>

          {/* Durasi Pengerjaan */}
          <SmallBadge>{durasi} Menit</SmallBadge>
        </div>
      </div>
    </>
  );

  return (
    <Link
      to={path}
      className="overflow-hidden w-[400px] h-[350px] relative transition-all duration-300 group hover:shadow-lg cursor-pointer bg-white rounded-2xl border border-slate-200 flex flex-col block"
    >
      {cardContent}
    </Link>
  );
}

export default CardCobaGratisCourse;
