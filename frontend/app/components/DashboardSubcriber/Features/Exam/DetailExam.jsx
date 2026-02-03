import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router";
import { useFolder } from "../../../../context/FolderContext";
import BreadCrumbs from "../../Common/BreadCrumbs";
import RankingTable from "../../Common/RankingTable";
import ProgressBar from "../../Common/ProgressBar";
import { slugify } from "../../../../utils/slugify";
import { courseService } from "../../../../services/subscriber";
import { getAssetUrl } from "../../../../utils/assetHelpper";
// Import Icons agar tampilan mirip Public Detail
import { Star, BookOpen, Play, CheckCircle, FileText } from "lucide-react";

function LoadingDetail() {
  return (
    <div className="w-full py-20 flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold text-lg animate-pulse">
          Memuat detail paket soal...
        </p>
      </div>
    </div>
  );
}

function DetailExam() {
  const { label } = useParams();
  const location = useLocation();
  const { examProgress } = useFolder();

  // State
  const [examData, setExamData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Menentukan mode navigasi
  const getMode = () => {
    if (
      location.pathname.includes("/dashboard-subscriber/status-ujian-terakhir/")
    ) {
      return "status";
    } else if (location.pathname.includes("/dashboard-subscriber/tersimpan/")) {
      return "folder";
    }
    return "latihan";
  };

  const mode = getMode();

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await courseService.getAllPaketsWithProgress();
        const items =
          response && Array.isArray(response.data) ? response.data : [];

        const found = items.find(
          (item) => slugify(item.label || item.nama_paket) === label,
        );

        if (!found) {
          setError("Paket soal tidak ditemukan");
          setExamData(null);
          return;
        }

        const currentId = found.id || found.id_paket_soal;

        const processed = {
          id: currentId,
          label: found.label || found.nama_paket || "Paket Soal",
          description:
            found.deskripsi ||
            "Deskripsi tidak tersedia. Silakan kerjakan soal untuk melatih kemampuanmu.",
          image: getAssetUrl(found.image),
          totalSoal: found.soal_count || found.totalSoal || 0,
          progress: {
            answered: found.progress?.answered || 0,
            totalSoal: found.soal_count || found.totalSoal || 0,
          },
          category: found.category || "Umum",
          rating: 4.8, // Default rating visual
        };

        setExamData(processed);

        const rankingResponse =
          await courseService.getExamLeaderboard(currentId);
        setLeaderboardData(rankingResponse);
      } catch (err) {
        console.error("Error fetching exam detail:", err);
        setError(err.message || "Gagal memuat data paket soal");
      } finally {
        setLoading(false);
      }
    };

    if (label) {
      fetchExamData();
    }
  }, [label]);

  // --- RENDERING ---

  if (loading) {
    return (
      <div className="w-full font-sans antialiased">
        <nav className="w-full px-7-5 py-3.5">
          <div className="w-12">
            <img src="/interexam-logo.svg" className="w-full" alt="Logo" />
          </div>
        </nav>
        <LoadingDetail />
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="w-full font-sans antialiased">
        <nav className="w-full px-7-5 py-3.5">
          <div className="w-12">
            <img src="/interexam-logo.svg" className="w-full" alt="Logo" />
          </div>
        </nav>
        <div className="w-full px-7-5 py-10 text-center font-bold text-slate-500">
          {error || "Paket soal tidak ditemukan."}
        </div>
      </div>
    );
  }

  // Hitung progress
  const answeredCount =
    examProgress[examData.id] !== undefined
      ? examProgress[examData.id]
      : examData.progress?.answered || 0;

  const slug = slugify(examData.label);
  const originPath =
    mode === "status"
      ? "status-ujian-terakhir"
      : mode === "folder"
        ? "tersimpan"
        : "latihan";
  const attemptPath = `/dashboard-subscriber/${originPath}/${slug}/attempt`;

  const isFinished =
    answeredCount >= examData.totalSoal && examData.totalSoal > 0;

  return (
    <div className="w-full font-sans antialiased pb-20">
      <nav className="w-full px-7-5 py-3.5">
        <div className="w-12">
          <img src="/interexam-logo.svg" className="w-full" alt="Logo" />
        </div>
      </nav>

      {/* Container utama dibuat max-width agar rapi di tengah seperti Public */}
      <div className="pt-5 px-5 md:px-7-5 max-w-screen-xl mx-auto flex flex-col gap-5">
        <BreadCrumbs />

        {/* SECTION 1: DETAIL PAKET (Header Card Style) */}
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Kiri: Gambar (Style sama dengan Public) */}
          <div className="w-[400px] md:w-[400px] h-[300px] md:h-[400px] rounded-xl overflow-hidden shrink-0 shadow-md relative group">
            <img
              src={examData.image}
              alt={examData.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
          </div>

          {/* Kanan: Info */}
          <div className="flex flex-col justify-center w-full">
            {/* Badge Category & Rating */}
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                {examData.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                <Star size={14} fill="currentColor" />{" "}
                {examData.rating || "4.8"}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              {examData.label}
            </h1>

            {/* Statistik Grid & Progress (Digabungkan agar rapi) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Box 1: Total Soal */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="p-2.5 bg-white rounded-full text-primary shadow-sm">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Total Soal
                  </p>
                  <p className="text-lg font-black text-slate-800">
                    {examData.totalSoal} Butir
                  </p>
                </div>
              </div>

              {/* Box 2: Progress User (Tetap Ada) */}
              <div className="flex flex-col justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Progress Kamu
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {answeredCount} / {examData.totalSoal}
                  </span>
                </div>
                {/* ProgressBar Component Existing */}
                <ProgressBar
                  answered={answeredCount}
                  total={examData.totalSoal}
                />
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col gap-3 mt-auto">
              <Link
                to={attemptPath}
                state={{ from: mode }}
                className={`w-full md:w-fit text-center px-8 py-3.5 rounded-lg font-bold text-base transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
                  isFinished
                    ? "bg-green-600 hover:bg-green-700 shadow-green-600/20 text-white"
                    : "bg-primary hover:bg-primary/90 shadow-primary/20 text-white"
                }`}
              >
                {isFinished ? (
                  <CheckCircle size={18} />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
                {isFinished
                  ? "Lihat Hasil / Ulangi"
                  : answeredCount > 0
                    ? "Lanjutkan Pengerjaan"
                    : "Mulai Kerjakan Sekarang"}
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 2: DESKRIPSI (Layout Baru) */}
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Deskripsi Paket
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify">
              {examData.description}
            </p>
          </div>
        </div>

        {/* SECTION 3: RANKING (Layout Baru) */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Peringkat Tertinggi
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Top 10 Leaderboard
            </span>
          </div>

          {/* Ranking Table Component Existing */}
          <RankingTable data={leaderboardData} />
        </div>
      </div>
    </div>
  );
}

export default DetailExam;
