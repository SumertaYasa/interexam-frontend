import React, { useMemo } from "react";
import { Link } from "react-router";
import AchievementCard from "./Components/AchievementCard";
import ProgressCircle from "./Components/ProgressCircle";
import BadgeItem from "./Components/BadgeItem";
// Ambil data dari file terpisah agar ikon terdeteksi
import { DATA_LENCANA } from "./BadgeData";

export default function AchievementContainer() {
  // Hanya ambil lencana yang terbuka untuk dashboard
  const displayedBadges = useMemo(() => {
    return DATA_LENCANA?.filter((badge) => badge.isUnlocked).slice(0, 2) || [];
  }, []);

  return (
    <div className="w-full min-h-screen bg-white p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        {/* Row Statistik (Atas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-white">
          <AchievementCard className="bg-[#4338ca] overflow-hidden relative group">
            <p className="text-center text-sm font-bold opacity-80 mb-6 uppercase tracking-widest">
              Tingkat Pengalaman
            </p>
            <ProgressCircle percentage={65} level={1} label="Pemula" />
            <div className="mt-8 text-center text-[10px] font-black opacity-60 uppercase tracking-[0.2em]">
              320 / 500 XP
            </div>
          </AchievementCard>

          <AchievementCard className="bg-[#a78bfa] flex flex-col justify-center items-center">
            <p className="text-sm font-bold opacity-90 mb-8 uppercase tracking-widest">
              Waktu Belajar Total
            </p>
            <div className="bg-white/20 backdrop-blur-md px-10 py-5 rounded-[2.5rem] border border-white/30 shadow-xl mb-8">
              <h2 className="text-3xl font-black tracking-tight text-white">
                28 jam 12 menit
              </h2>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black mb-2">Amazing!</h3>
              <p className="text-xs font-medium opacity-80 leading-relaxed px-6">
                Waktu belajar kamu seperti orang serius!
              </p>
            </div>
          </AchievementCard>

          <AchievementCard className="bg-[#f2a289] flex flex-col items-center">
            <p className="text-sm font-bold opacity-90 mb-6 uppercase tracking-widest">
              Rata-rata Skor Tertinggi
            </p>
            <div className="w-40 h-40 bg-white/20 rounded-full flex flex-col items-center justify-center border-4 border-white/30 shadow-2xl mb-6 text-white">
              <span className="text-6xl font-black">92</span>
              <span className="text-xs font-bold opacity-70 uppercase">
                dari 100
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black mb-2">Wow!</h3>
              <p className="text-xs font-medium opacity-90 leading-relaxed px-4">
                Skor kamu lebih tinggi 72% dari rata-rata!
              </p>
            </div>
          </AchievementCard>
        </div>

        {/* Row Lencana (Bawah) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AchievementCard className="bg-[#66d079] text-white flex flex-col items-center justify-center">
            <h2 className="text-[8rem] font-black leading-none mb-4">12</h2>
            <h3 className="text-2xl font-black">Rekor Hari</h3>
          </AchievementCard>

          <AchievementCard className="bg-[#93c5fd] text-white flex flex-col items-center justify-center">
            <h2 className="text-[8rem] font-black leading-none mb-4">34</h2>
            <h3 className="text-2xl font-black">Tes Selesai</h3>
          </AchievementCard>

          <div className="bg-white border-2 border-[#f2a289]/30 rounded-[2.5rem] p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800">Lencana</h3>
              <Link
                to="/dashboard-subscriber/pencapaian/lencana"
                className="text-sm font-bold text-slate-900 border-b-2 border-slate-900"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1">
              {displayedBadges.map((badge) => (
                <BadgeItem
                  key={badge.id}
                  label={badge.title}
                  color={badge.color}
                  icon={badge.icon}
                  isUnlocked={badge.isUnlocked}
                  date={badge.date}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
