import React, { useMemo } from "react";
import { Link, useLocation, useNavigate, useLoaderData } from "react-router";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import BreadCrumbs from "../../Common/BreadCrumbs";
import { slugify } from "../../../../utils/slugify.ts";
import { useFolder } from "../../../../context/FolderContext.tsx";

// Dataset Statis agar sinkron dengan file Exam lainnya
const DATA_UJIAN_LATIHAN = [
  { id: "lat-1", label: "Tes Bahasa Inggris: Structure & Usage" },
  { id: "lat-2", label: "Tryout Matematika Saintek" },
];

const DATA_UJIAN_STATUS = [
  { id: "st-1", label: "Paket Soal 1 - Logika Dasar" },
  { id: "st-2", label: "Paket Soal 2 - TPA Kuantitatif" },
  { id: "st-3", label: "Ujian Logika Dasar Sekolah Menengah Atas" },
];

export async function loader({ params, request }) {
  const labelParam = params.label;
  const url = request?.url ?? "";

  // Identifikasi Mode Berdasarkan URL
  if (url.includes("/dashboard-subscriber/tersimpan/")) {
    return { mode: "folder", id: labelParam };
  }

  const allExams = [...DATA_UJIAN_LATIHAN, ...DATA_UJIAN_STATUS];
  const examFound = allExams.find((e) => slugify(e.label) === labelParam);

  return {
    mode: "package",
    exam: examFound || { label: params.label },
  };
}

export default function ResultExam() {
  const loaderResult = useLoaderData();
  const { folders } = useFolder();
  const location = useLocation();
  const navigate = useNavigate();

  // Mengambil data skor yang dikirim via state
  const results = location.state?.results;

  const displayTitle = useMemo(() => {
    if (loaderResult.mode === "folder") {
      const folder = folders.find(
        (f) => String(f.id_folder) === String(loaderResult.id)
      );
      return folder?.folder_name || "Hasil Latihan Folder";
    }
    return loaderResult.exam?.label || "Hasil Ujian";
  }, [loaderResult, folders]);

  // Proteksi jika data skor kosong (akibat refresh)
  if (!results) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 font-sans">
        <div className="text-center">
          <p className="font-bold text-slate-500 mb-2">
            Oops! Skor tidak ditemukan.
          </p>
          <p className="text-sm text-slate-400">
            Silakan kerjakan ujian terlebih dahulu untuk melihat hasil.
          </p>
        </div>
        <Link
          to="/dashboard-subscriber"
          className="px-8 py-3 bg-primary text-white rounded-2xl font-bold active:scale-95 transition-all shadow-lg"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const feedback = useMemo(() => {
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
  }, [results.score]);

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
        <BreadCrumbs />

        {/* HERO SECTION */}
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

        {/* STATS GRID */}
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

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <button
            onClick={() => navigate("/dashboard-subscriber")}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl bg-white active:scale-95 transition-all">
            Lihat Pembahasan <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, total, subLabel }) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-[28px] flex items-center gap-5 shadow-sm">
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
