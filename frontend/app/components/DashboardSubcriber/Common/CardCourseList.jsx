import React from "react";
import { Link } from "react-router-dom"; // Pastikan import dari 'react-router-dom' atau 'react-router' sesuai versimu
import { Star, Lock } from "lucide-react"; // Tambahkan import Lock
import Card from "./Card";

function SmallBadge({ children }) {
  return (
    <span className="text-[13px] font-bold py-1 px-2 rounded-full border flex items-center gap-1 border-gray-200 bg-white text-gray-700 tracking-tight leading-none">
      {children}
    </span>
  );
}

function CardCourseList({
  id,
  title = "Judul Paket Soal",
  image = "/person.jpg",
  rating = 4.8,
  totalSoal = 50,
  participants = 1234,
  category = "Bahasa Inggris",
  path = "#",
  linkState = null,
  jenisPaket = "gratis",
}) {
  const formatAlt = image ? image.split("/").pop().split(".")[0] : "course";

  // --- LOGIKA PREMIUM (Sama dengan CardCourse) ---
  const isPremium = jenisPaket === "berbayar";

  const toProp =
    typeof path === "string"
      ? linkState
        ? { pathname: path, state: linkState }
        : path
      : path;

  return (
    <Card className="w-full group hover:shadow-md transition-shadow duration-200">
      <Link
        to={toProp}
        className="flex items-start md:items-center gap-4 px-4 py-3"
      >
        {/* --- CONTAINER GAMBAR (Diperbesar sedikit agar overlay muat) --- */}
        <div className="relative w-[120px] h-[80px] flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <img
            src={image}
            alt={formatAlt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* --- LABEL PREMIUM (OVERLAY) --- */}
          {isPremium && (
            <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5 z-10">
              <Lock size={10} />
              <span>PREMIUM</span>
            </div>
          )}

          {/* --- LABEL CATEGORY (OVERLAY) --- */}
          <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            {category}
          </div>
        </div>

        {/* --- KONTEN TENGAH --- */}
        <div className="flex-1 flex flex-col justify-center h-full gap-1">
          <h3 className="font-bold text-lg text-slate-900 tracking-tight leading-tight line-clamp-2">
            {title}
          </h3>

          {/* Info Bar */}
          <div className="flex items-center flex-wrap gap-2 mt-1">
            <SmallBadge>
              <Star size={14} className="text-orange-400 fill-orange-400" />
              <span className="ml-0.5">{rating}</span>
            </SmallBadge>

            <SmallBadge>{totalSoal} Soal</SmallBadge>

            <SmallBadge>
              {participants.toLocaleString("id-ID")} Peserta
            </SmallBadge>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default CardCourseList;
