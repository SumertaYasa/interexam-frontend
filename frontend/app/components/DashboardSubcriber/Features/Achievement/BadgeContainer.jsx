import React, { useMemo } from "react";
import {
  Award,
  Zap,
  BookOpen,
  Target,
  Flame,
  Star,
  Trophy,
} from "lucide-react";
import BadgeCard from "./Components/BadgeCard";
import BreadCrumbs from "../../Common/BreadCrumbs";

const DATA_LENCANA = [
  {
    id: 1,
    title: "Early Bird",
    description: "Menyelesaikan ujian sebelum jam 7 pagi.",
    date: "12 Des 2025",
    isUnlocked: true,
    color: "bg-amber-400",
    icon: Zap,
  },
  {
    id: 2,
    title: "Ambisius Tinggi",
    description: "Belajar selama 5 jam tanpa henti.",
    date: "15 Des 2025",
    isUnlocked: true,
    color: "bg-indigo-500",
    icon: Flame,
  },
  {
    id: 3,
    title: "Master Logika",
    description: "Skor 100 pada kategori ujian Logika.",
    date: "20 Des 2025",
    isUnlocked: true,
    color: "bg-emerald-500",
    icon: Target,
  },
  {
    id: 4,
    title: "Penjelajah Soal",
    description: "Menyimpan 50 soal ke dalam folder koleksi.",
    isUnlocked: false,
    color: "bg-blue-500",
    icon: BookOpen,
  },
  {
    id: 5,
    title: "Bintang Kelas",
    description: "Mencapai peringkat 1 di Ranking Global.",
    isUnlocked: false,
    color: "bg-purple-500",
    icon: Star,
  },
  {
    id: 6,
    title: "Legenda InterExam",
    description: "Menyelesaikan total 100 paket soal.",
    isUnlocked: false,
    color: "bg-rose-500",
    icon: Trophy,
  },
];

export default function BadgesContainer() {
  const achievedCount = useMemo(
    () => DATA_LENCANA.filter((b) => b.isUnlocked).length,
    []
  );

  return (
    <div className="w-full min-h-screen bg-white p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <BreadCrumbs />
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              Koleksi Lencana
            </h1>
            <p className="text-slate-400 font-medium">
              Kumpulkan semua tanda kehormatan dari petualangan belajarmu.
            </p>
          </div>

          <div className="bg-slate-900 text-white px-8 py-5 rounded-[2rem] flex items-center gap-6 shadow-xl shadow-slate-200">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                Progress
              </span>
              <span className="text-2xl font-black">
                {achievedCount} / {DATA_LENCANA.length}
              </span>
            </div>
            <div className="w-[2px] h-10 bg-white/20" />
            <Award className="text-amber-400" size={32} />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {DATA_LENCANA.map((badge) => (
            <BadgeCard key={badge.id} {...badge} />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-20 p-10 bg-slate-50 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold text-sm">
            Teruslah belajar untuk membuka lencana baru dan tingkatkan
            peringkatmu!
          </p>
        </div>
      </div>
    </div>
  );
}
