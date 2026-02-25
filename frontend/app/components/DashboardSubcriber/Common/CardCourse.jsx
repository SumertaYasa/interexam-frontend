import React from "react";
import { Link } from "react-router-dom";
import { Star, Lock } from "lucide-react";
import Card from "./Card";

function SmallBadge({ children, className = "" }) {
  return (
    <span
      className={`text-[13px] font-bold py-1 px-2 rounded-full border flex items-center gap-1 border-gray-200 bg-white text-gray-700 tracking-tight leading-none ${className}`}
    >
      {children}
    </span>
  );
}

function CardCourse({
  title = "Judul Paket Soal",
  image = "/person.jpg",
  rating = 4.8,
  totalSoal = 50,
  participants,
  category = "Bahasa Inggris",
  path = "#",
  linkState = null,
  jenisPaket = "gratis",
  lockedReason = null, // Prop baru untuk pesan gembok spesifik
}) {
  const formatAlt = image.split("/").pop().split(".")[0];

  const isPremium = jenisPaket?.toLowerCase() === "berbayar";

  // Penentuan Status Terkunci
  // Terkunci jika parent mengirim jenisPaket="locked" ATAU jika ada lockedReason dari Event
  const isLocked = jenisPaket === "locked" || !!lockedReason;

  const toProp =
    typeof path === "string"
      ? linkState
        ? { pathname: path, state: linkState }
        : path
      : path;

  // Isi konten dipisah agar tidak duplikasi antara Link dan Div
  const cardContent = (
    <>
      {/* CONTAINER GAMBAR */}
      <div className="w-full h-[150px] overflow-hidden relative">
        <img
          src={image}
          alt={formatAlt}
          className={`w-full h-full object-cover transition-transform duration-500 ${isLocked ? "" : "group-hover:scale-105"}`}
        />

        {/* --- LABEL PREMIUM (OVERLAY) --- */}
        {isPremium && !isLocked && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-md flex items-center gap-1 z-10">
            <Lock size={12} />
            <span>PREMIUM</span>
          </div>
        )}

        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
          {category}
        </div>
      </div>

      {/* CONTAINER KONTEN */}
      <div className="px-5 py-4 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight line-clamp-2 mb-3">
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

          {/* Peserta */}
          <SmallBadge>
            {participants?.toLocaleString("id-ID") || 0} Pengerjaan
          </SmallBadge>
        </div>
      </div>

      {/* --- OVERLAY GEMBOK KHUSUS (EVENT / LOCKED) --- */}
      {isLocked && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-white p-3 rounded-full shadow-md mb-3">
            <Lock size={24} className="text-slate-400" />
          </div>
          <span className="font-bold text-slate-700 text-xs bg-white/95 px-4 py-2 rounded-full shadow-sm border border-slate-200">
            {lockedReason || "Konten Terkunci"}
          </span>
        </div>
      )}
    </>
  );

  return (
    <Card
      className={`overflow-hidden w-[400px] h-[350px] relative transition-all duration-300 ${
        isLocked
          ? "cursor-not-allowed opacity-90 grayscale-[10%]"
          : "group hover:shadow-lg cursor-pointer"
      }`}
    >
      {/* Jika terkunci, MENCEGAH KLIK dengan menggunakan <div>. Jika terbuka, gunakan <Link> */}
      {isLocked ? (
        <div className="w-full h-full flex flex-col relative">
          {cardContent}
        </div>
      ) : (
        <Link to={toProp} className="w-full h-full flex flex-col relative">
          {cardContent}
        </Link>
      )}
    </Card>
  );
}

export default CardCourse;
