import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { dashboardService } from "../../../../services/subscriber/dashboardService";
import { DATA_LENCANA } from "./BadgeData";
import { useAuth } from "../../../../context/AuthContext";
import AchievementCard from "./Components/AchievementCard";
import ProgressCircle from "./Components/ProgressCircle";
import BadgeItem from "./Components/BadgeItem";
import LockedFeature from "../../Common/LockedFeature";

export default function AchievementContainer() {
  const { isPremium, isLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("[Achievement] isPremium from useAuth:", isPremium);

  // --- 1. FETCH DATA DARI API ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Memanggil API baru yang sudah ada Gamification (XP & Level)
        const data = await dashboardService.getStatisticsSummary();
        setStats(data);
      } catch (error) {
        console.error("Gagal memuat statistik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --- 2. AMBIL LENCANA (Opsional: Nanti bisa dari API juga) ---
  const displayedBadges = useMemo(() => {
    return DATA_LENCANA?.filter((badge) => badge.isUnlocked).slice(0, 2) || [];
  }, []);

  // --- 3. LOADING STATE (SKELETON SEDERHANA) ---
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-50/30">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-bold animate-pulse">
          Memverifikasi akses Premium...
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white p-8 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold animate-pulse">
            Memuat pencapaianmu...
          </p>
        </div>
      </div>
    );
  }

  // Fallback data agar tidak crash jika API gagal
  const experience = stats?.experience || {
    level: 1,
    label: "Pemula",
    currentXP: 0,
    maxXP: 500,
    percentage: 0,
  };

  const studyTime = stats?.studyTime || { fullText: "0 jam 0 menit" };
  const avgScore = stats?.averageScore || 0;

  // Ambil streak (bisa dari stats.comparedToPreviousWeek atau API streak terpisah)
  // Untuk sementara kita pakai data dummy atau dari stats jika ada
  const streakDays = 0; // Nanti bisa ambil dari getStreakAndTarget

  return (
    <div className="w-full min-h-screen bg-white p-8 font-sans antialiased pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Row Statistik (Atas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-white">
          {/* CARD 1: TINGKAT PENGALAMAN (BIRU) */}
          <AchievementCard className="bg-[#4338ca] overflow-hidden relative group">
            <p className="text-center text-sm font-bold opacity-80 mb-6 uppercase tracking-widest">
              Tingkat Pengalaman
            </p>
            {/* Progress Circle Dynamic */}
            <ProgressCircle
              percentage={experience.percentage}
              level={experience.level}
              label={experience.label}
            />
            <div className="mt-8 text-center text-[10px] font-black opacity-60 uppercase tracking-[0.2em]">
              {experience.currentXP} / {experience.maxXP} XP
            </div>
          </AchievementCard>

          {/* CARD 2: WAKTU BELAJAR (UNGU) */}
          <AchievementCard className="bg-[#a78bfa] flex flex-col justify-center items-center">
            <p className="text-sm font-bold opacity-90 mb-8 uppercase tracking-widest">
              Waktu Belajar Total
            </p>
            <div className="bg-white/20 backdrop-blur-md px-10 py-5 rounded-[2.5rem] border border-white/30 shadow-xl mb-8">
              <h2 className="text-3xl font-black tracking-tight text-white whitespace-nowrap">
                {studyTime.fullText}
              </h2>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black mb-2">Amazing!</h3>
              <p className="text-xs font-medium opacity-80 leading-relaxed px-6">
                Waktu belajar kamu seperti orang serius!
              </p>
            </div>
          </AchievementCard>

          {/* CARD 3: RATA-RATA SKOR (ORANYE) */}
          <AchievementCard className="bg-[#f2a289] flex flex-col items-center">
            <p className="text-sm font-bold opacity-90 mb-6 uppercase tracking-widest">
              Rata-rata Skor Tertinggi
            </p>
            <div className="w-40 h-40 bg-white/20 rounded-full flex flex-col items-center justify-center border-4 border-white/30 shadow-2xl mb-6 text-white">
              <span className="text-6xl font-black">{avgScore}</span>
              <span className="text-xs font-bold opacity-70 uppercase">
                dari 100
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black mb-2">Wow!</h3>
              <p className="text-xs font-medium opacity-90 leading-relaxed px-4">
                {avgScore > 80
                  ? "Skor kamu sangat memuaskan, pertahankan!"
                  : "Terus berlatih untuk meningkatkan skormu!"}
              </p>
            </div>
          </AchievementCard>
        </div>

        {/* Row Lencana (Bawah) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 4: REKOR HARI (HIJAU) - Perlu Ambil dari API Streak jika mau akurat */}
          <AchievementCard className="bg-[#66d079] text-white flex flex-col items-center justify-center">
            {/* Sementara Hardcode atau ambil dari props jika ada */}
            <h2 className="text-[8rem] font-black leading-none mb-4">
              {/* Nanti bisa pakai data streak dari dashboardService.getStreakAndTarget */}
              ?
            </h2>
            <h3 className="text-2xl font-black">Rekor Hari</h3>
            <p className="text-xs font-medium opacity-80 mt-2">
              Data Streak Coming Soon
            </p>
          </AchievementCard>

          {/* CARD 5: TES SELESAI (BIRU MUDA) */}
          <AchievementCard className="bg-[#93c5fd] text-white flex flex-col items-center justify-center">
            <h2 className="text-[8rem] font-black leading-none mb-4">
              {stats?.totalExamsCompleted || 0}
            </h2>
            <h3 className="text-2xl font-black">Tes Selesai</h3>
          </AchievementCard>

          {/* CARD 6: LIST LENCANA (PUTIH) */}
          <LockedFeature title="Fitur Lencana" isLocked={!isPremium}>
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
          </LockedFeature>
        </div>
      </div>
    </div>
  );
}
