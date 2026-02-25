import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"; // Pastikan react-router-dom
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { useFolder } from "../../../../context/FolderContext";

export default function ResultExam() {
  const { label } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { folders } = useFolder();

  // State untuk menggantikan loader
  const [config, setConfig] = useState({ mode: "package", id: null });

  // Data Skor dari Backend melalui state navigation
  const results = location.state?.results;

  useEffect(() => {
    // Identifikasi Mode Berdasarkan URL
    const isFolderMode = window.location.pathname.includes(
      "/dashboard-subscriber/tersimpan/",
    );
    setConfig({
      mode: isFolderMode ? "folder" : "package",
      id: label,
    });
  }, [label]);

  const displayTitle = useMemo(() => {
    if (config.mode === "folder") {
      const folder = folders.find(
        (f) => String(f.id_folder) === String(config.id),
      );
      return folder?.folder_name || "Hasil Latihan Folder";
    }
    return results?.examLabel || "Hasil Ujian";
  }, [config, folders, results]);

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

  if (!results) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 font-sans p-6 text-center">
        <div className="bg-white p-10 rounded-[32px] border shadow-sm max-w-md">
          <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="font-bold text-slate-500 text-lg mb-2">
            Oops! Skor tidak ditemukan.
          </p>
          <p className="text-sm text-slate-400 mb-8">
            Silakan kerjakan ujian terlebih dahulu untuk melihat hasil
            pengerjaanmu.
          </p>
          <Link
            to="/dashboard-subscriber"
            className="inline-block w-full px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // --- FUNGSI NAVIGASI PEMBAHASAN ---
  const handleLihatPembahasan = () => {
    // Karena kita pakai slug/label, kita kirim user ke route yang sudah dibuat tadi
    navigate(`/dashboard-subscriber/latihan/${label}/discussion`);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 font-sans antialiased pb-20">
      <nav className="w-full px-8 py-4 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="w-12">
            <img src="/interexam-logo.svg" className="w-full" alt="Logo" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Exam Report Card
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 pt-8 flex flex-col gap-8">
        <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm flex flex-col md:flex-row items-center gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative flex items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={552.9}
                strokeDashoffset={552.9 - (552.9 * (results.score || 0)) / 100}
                className="text-primary transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black text-slate-900 leading-none">
                {results.score}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
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
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter leading-tight">
              {displayTitle}
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed tracking-tight max-w-md">
              {feedback.desc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
            value={results.unanswered}
            total={results.totalSoal}
            subLabel="Soal"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <button
            onClick={() => navigate("/dashboard-subscriber")}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all hover:bg-slate-800"
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>

          <button
            onClick={handleLihatPembahasan}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl bg-white active:scale-95 transition-all hover:bg-slate-50 hover:border-slate-300"
          >
            Lihat Pembahasan <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, total, subLabel }) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-[28px] flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-900">{value}</span>
          <span className="text-sm font-bold text-slate-300">
            / {total} {subLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
