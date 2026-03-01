import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router"; // Menggunakan 'react-router' sesuai SSR-mu
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  ArrowRight,
  LayoutDashboard,
  Star,
  Lock,
} from "lucide-react";

export default function CobaGratisResult() {
  const { label } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // State untuk modal pancingan daftar
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Menangkap data hasil dari CobaGratisAttempt
  const results = location.state?.results;

  // Feedback dinamis berdasarkan skor
  const feedback = useMemo(() => {
    if (!results) return null;
    const score = results.score || 0;
    if (score >= 80)
      return {
        title: "Luar Biasa!",
        desc: "Kamu menguasai materi ini dengan sangat baik. Pertahankan!",
        color: "text-emerald-500",
        bg: "bg-emerald-50",
      };
    if (score >= 60)
      return {
        title: "Kerja Bagus!",
        desc: "Hasil yang cukup solid, sedikit lagi kamu akan mencapai sempurna.",
        color: "text-blue-500",
        bg: "bg-blue-50",
      };
    return {
      title: "Tetap Semangat!",
      desc: "Jangan menyerah, coba tinjau kembali pembahasan dan asah kemampuanmu.",
      color: "text-amber-500",
      bg: "bg-amber-50",
    };
  }, [results]);

  // Jika user langsung akses URL tanpa pengerjaan
  if (!results) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 font-sans p-6 text-center">
        <div className="bg-white p-10 rounded-[32px] border shadow-sm max-w-md">
          <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="font-bold text-slate-500 text-lg mb-2">
            Oops! Skor tidak ditemukan.
          </p>
          <p className="text-sm text-slate-400 mb-8">
            Silakan kerjakan simulasi terlebih dahulu untuk melihat hasil
            pengerjaanmu.
          </p>
          <button
            onClick={() => navigate("/coba-gratis")}
            className="inline-block w-full px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all hover:bg-blue-700"
          >
            Kembali ke Daftar Paket
          </button>
        </div>
      </div>
    );
  }

  // Format label dari URL agar enak dibaca (Misal: paket-soal-1 -> Paket Soal 1)
  const displayTitle = label
    ? label
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Hasil Simulasi";

  return (
    <div className="w-full min-h-screen bg-slate-50/50 font-sans antialiased pb-20 relative">
      <nav className="w-full px-8 py-4 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="w-12">
            <img src="/interexam-logo.svg" className="w-full" alt="Logo" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Demo Report Card
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-5 md:px-8 pt-8 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* INFO BANNER DEMO */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-center text-center gap-2 text-blue-800 text-sm font-bold">
          💡 Ini adalah mode Coba Gratis. Progresmu tidak akan disimpan
          permanen.
        </div>

        {/* SECTION 1: CIRCULAR SCORE & TITLE */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center gap-10 md:gap-12">
          <div className="relative flex items-center justify-center shrink-0">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100" // Viewbox statis agar responsifnya rapi
            >
              {/* Lingkaran Background (Abu-abu) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-100"
              />
              {/* Lingkaran Progress (Biru) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2" // Rumus: 2 * Math.PI * r (2 * 3.14 * 40)
                strokeDashoffset={251.2 - (251.2 * (results.score || 0)) / 100}
                className="text-blue-500 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-slate-900 leading-none">
                {results.score}
              </span>
              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Skor Akhir
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${feedback.bg} ${feedback.color} mb-4`}
            >
              <Trophy size={16} />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {feedback.title}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tighter leading-tight">
              {displayTitle}
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed tracking-tight max-w-md mx-auto md:mx-0">
              {feedback.desc}
            </p>
          </div>
        </div>

        {/* SECTION 2: STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            icon={<CheckCircle2 size={24} className="text-emerald-500" />}
            label="Jawaban Benar"
            value={results.correct}
            total={results.totalSoal}
            subLabel="Soal"
          />
          <StatCard
            icon={<XCircle size={24} className="text-red-500" />}
            label="Jawaban Salah"
            value={results.wrong}
            total={results.totalSoal}
            subLabel="Soal"
          />
          <StatCard
            icon={<HelpCircle size={24} className="text-slate-400" />}
            label="Dilewati"
            value={results.blank}
            total={results.totalSoal}
            subLabel="Soal"
          />
        </div>

        {/* SECTION 3: ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 mb-8">
          <button
            onClick={() => navigate("/coba-gratis")}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-slate-900 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all hover:bg-slate-800"
          >
            <LayoutDashboard size={20} /> Daftar Latihan
          </button>

          {/* TOMBOL PANCINGAN */}
          <button
            onClick={() => setShowRegisterModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl bg-white active:scale-95 transition-all hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
          >
            Lihat Pembahasan <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* --- MODAL PANCINGAN DAFTAR AKUN (BUILT-IN) --- */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Modal Content */}
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header Modal */}
            <div className="bg-blue-600 p-8 text-center relative">
              {/* Tombol Close */}
              <button
                onClick={() => setShowRegisterModal(false)}
                className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors"
              >
                <XCircle size={24} />
              </button>

              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30">
                <Lock size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">
                Akses Terkunci
              </h2>
              <p className="text-blue-100 text-sm px-4">
                Pembahasan hanya tersedia untuk pengguna terdaftar.
              </p>
            </div>

            {/* Body Modal */}
            <div className="p-8 text-center bg-slate-50">
              <div className="flex items-center justify-center gap-1 text-yellow-500 mb-4">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-slate-600 font-medium mb-6 leading-relaxed">
                Ingin tahu di mana letak kesalahanmu dan menemukan cara cepat
                menjawabnya? Yuk, buat akun gratismu sekarang!
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/login/registrasi")}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Daftar Akun Gratis <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="w-full py-3.5 bg-white border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-100 active:scale-95 transition-all"
                >
                  Nanti Saja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// KOMPONEN CARD KECIL
function StatCard({ icon, label, value, total, subLabel }) {
  return (
    <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-[24px] md:rounded-[28px] flex items-center gap-4 md:gap-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl md:text-2xl font-black text-slate-900">
            {value}
          </span>
          <span className="text-xs md:text-sm font-bold text-slate-300">
            / {total} {subLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
