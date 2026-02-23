import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  LayoutGrid,
  ArrowRight,
  Trophy,
  ChevronDown,
} from "lucide-react";

// --- KOMPONEN BANTUAN: LINGKARAN SKOR ---
function CircularScore({ score }) {
  const strokeDasharray = `${score}, 100`;

  return (
    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <path
          className="text-slate-100"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          className="text-[#2B4C7E]"
          strokeDasharray={strokeDasharray}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
          {score}
        </span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Skor Akhir
        </span>
      </div>
    </div>
  );
}

// --- KOMPONEN BANTUAN: MINI RANKING TABLE ---
// Tambahkan parameter "rankingType" untuk dikirim ke URL
function MiniRankingTable({ title, rankingType }) {
  const navigate = useNavigate();

  const dummyTopData = [
    {
      no: 1,
      name: "I Nengah Sumerta Yasa (Yasa)",
      stats: "5/5",
      score: 100,
      isMe: true,
    },
    { no: 2, name: "John Doe", stats: "4/5", score: 80, isMe: false },
    { no: 3, name: "Jane Smith", stats: "3/5", score: 60, isMe: false },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Peringkat{" "}
          <span className="font-medium text-slate-500 ml-1">{title}</span>
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Top Leaderboard
        </span>
      </div>

      <div className="w-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="flex items-center px-5 py-3 border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <div className="w-10">No</div>
          <div className="flex-1">Nama</div>
          <div className="w-24 text-right">Statistik</div>
          <div className="w-16 text-right">Skor</div>
        </div>

        <div className="p-2 flex flex-col gap-2 bg-slate-50/30">
          {dummyTopData.map((user, idx) => (
            <div
              key={idx}
              className={`flex items-center px-4 py-3 rounded-lg border ${
                user.isMe
                  ? "bg-[#FFFCE8] border-[#FDEB82]"
                  : "bg-white border-slate-100"
              }`}
            >
              <div className="w-10 font-bold text-slate-700">{user.no}</div>
              <div className="flex-1 flex items-center gap-3">
                <img
                  src="/person.jpg"
                  alt="Avatar"
                  className="w-7 h-7 rounded-full border border-slate-200"
                />
                <span className="font-bold text-slate-800 text-sm line-clamp-1">
                  {user.name}
                </span>
              </div>
              <div className="w-24 text-right text-xs font-medium text-slate-500">
                {user.stats}
              </div>
              <div className="w-16 text-right font-black text-slate-900">
                {user.score}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate(`ranking/${rankingType}`)}
          className="w-full py-3 bg-white border-t border-slate-100 text-sm font-bold text-primary hover:bg-slate-50 transition-colors"
        >
          Lihat Peringkat Selengkapnya
        </button>
      </div>
    </div>
  );
}

// --- MAIN PAGE: EVENT RESULT DETAIL ---
export default function EventResultDetail() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const dummyReportData = {
    all: {
      title: "Rata-rata Keseluruhan Event",
      score: 60,
      benar: 15,
      salah: 5,
      lewat: 0,
      totalSoal: 20,
    },
    paket1: {
      title: "Paket 1: Penalaran Umum",
      score: 80,
      benar: 8,
      salah: 2,
      lewat: 0,
      totalSoal: 10,
    },
    paket2: {
      title: "Paket 2: Literasi Bahasa",
      score: 40,
      benar: 4,
      salah: 6,
      lewat: 0,
      totalSoal: 10,
    },
  };

  const currentData = dummyReportData[selectedFilter];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans antialiased pb-20">
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-40 relative">
        <div className="w-8 md:w-10">
          <img src="/interexam-logo.svg" className="w-full" alt="Logo" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Exam Report Card
        </span>
      </nav>

      <div className="max-w-screen-md mx-auto mt-8 px-5 flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Tryout Akbar UTBK SNBT 2026
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium">
              Laporan Hasil Pengerjaan
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl font-bold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
            >
              <option value="all">📊 Keseluruhan Paket</option>
              <option value="paket1">📖 Paket 1: Penalaran Umum</option>
              <option value="paket2">🔠 Paket 2: Literasi Bahasa</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        <div className="w-full bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-sm mb-6 transition-all duration-300">
          <CircularScore score={currentData.score} />

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-4">
              <Trophy size={12} /> Hasil Laporan
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-3">
              {currentData.title}
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-sm">
              {currentData.score >= 70
                ? "Hasil yang luar biasa! Pertahankan konsistensimu."
                : "Masih banyak ruang untuk berkembang. Jangan menyerah dan perbanyak latihan!"}
            </p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Benar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-green-50 text-green-500 rounded-full border border-green-100">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Jawaban Benar
              </span>
              <div className="text-slate-800 font-medium text-xs">
                <span className="text-xl font-black">{currentData.benar}</span>{" "}
                / {currentData.totalSoal} Soal
              </div>
            </div>
          </div>

          {/* Salah */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-red-50 text-red-500 rounded-full border border-red-100">
              <XCircle size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Jawaban Salah
              </span>
              <div className="text-slate-800 font-medium text-xs">
                <span className="text-xl font-black">{currentData.salah}</span>{" "}
                / {currentData.totalSoal} Soal
              </div>
            </div>
          </div>

          {/* Dilewati */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
              <HelpCircle size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Dilewati
              </span>
              <div className="text-slate-800 font-medium text-xs">
                <span className="text-xl font-black">{currentData.lewat}</span>{" "}
                / {currentData.totalSoal} Soal
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 w-full mb-12">
          <button
            onClick={() => navigate("/dashboard-subscriber")}
            className="px-8 py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-md shadow-slate-900/10"
          >
            <LayoutGrid size={18} /> Dashboard
          </button>

          {selectedFilter !== "all" && (
            <button className="px-8 py-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm">
              Lihat Pembahasan {currentData.title.split(":")[0]}{" "}
              <ArrowRight size={18} />
            </button>
          )}
        </div>

        <div className="w-full flex flex-col gap-2">
          {selectedFilter === "all" ? (
            <>
              {/* Tambahkan rankingType yang sesuai ke masing-masing komponen */}
              <MiniRankingTable title="Total (Semua Paket)" rankingType="all" />
              <MiniRankingTable
                title="Paket 1: Penalaran Umum"
                rankingType="paket1"
              />
              <MiniRankingTable
                title="Paket 2: Literasi Bahasa"
                rankingType="paket2"
              />
            </>
          ) : (
            <MiniRankingTable
              title={currentData.title}
              rankingType={selectedFilter}
            />
          )}
        </div>
      </div>
    </div>
  );
}
