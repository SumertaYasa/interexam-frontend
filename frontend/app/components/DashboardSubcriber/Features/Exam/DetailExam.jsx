import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router";
import { useFolder } from "../../../../context/FolderContext.tsx";
import BreadCrumbs from "../../Common/BreadCrumbs";
import RankingTable from "../../Common/RankingTable";
import ProgressBar from "../../Common/ProgressBar";
import { slugify } from "../../../../utils/slugify.ts";
import { courseService } from "../../../../services/subscriber";
import { getAssetUrl } from "../../../../utils/assetHelpper.ts";

function LoadingDetail() {
  return (
    <div className="w-full py-20 flex justify-center items-center">
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
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // Ambil semua paket dari API
        const response = await courseService.getAllPaketsWithProgress();
        const items =
          response && Array.isArray(response.data) ? response.data : [];

        // Cari paket yang sesuai dengan label dari URL
        const found = items.find(
          (item) => slugify(item.label || item.nama_paket) === label,
        );

        if (!found) {
          setError("Paket soal tidak ditemukan");
          setExamData(null);
          return;
        }

        const processed = {
          id: found.id || found.id_paket_soal,
          label: found.label || found.nama_paket || "Paket Soal",
          description: found.deskripsi || "Deskripsi tidak tersedia",
          image: getAssetUrl(found.image),
          totalSoal: found.soal_count || found.totalSoal || 0,
          progress: {
            answered: found.progress?.answered || 0,
            totalSoal: found.soal_count || found.totalSoal || 0,
          },
          category: found.category || "Umum",
        };

        setExamData(processed);
      } catch (err) {
        console.error("Error fetching exam data:", err);
        setError(err.message || "Gagal memuat data paket soal");
      } finally {
        setLoading(false);
      }
    };

    if (label) {
      fetchExamData();
    }
  }, [label]);

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

  return (
    <div className="w-full font-sans antialiased">
      <nav className="w-full px-7-5 py-3.5">
        <div className="w-12">
          <img src="/interexam-logo.svg" className="w-full" alt="Logo" />
        </div>
      </nav>

      <div className="px-7-5 py-5 flex flex-col gap-5">
        <BreadCrumbs />
        <div className="flex gap-5 w-full">
          <div className="w-[600px] h-[400px] overflow-hidden rounded-[10px]">
            <img
              src={examData.image}
              className="w-full h-full object-cover"
              alt="Ujian"
            />
          </div>
          <div className="flex flex-col justify-between items-start w-[60%]">
            <div className="flex flex-col gap-6 w-full">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                {examData.label}
              </h1>
              <div className="flex items-center gap-5 w-[60%]">
                <span className="text-xs font-bold text-slate-700 border border-slate-200 px-3 py-1.5 rounded tracking-tight leading-none">
                  {examData.totalSoal} soal
                </span>
                <ProgressBar
                  answered={answeredCount}
                  total={examData.totalSoal}
                />
              </div>
            </div>

            <Link
              to={attemptPath}
              state={{ from: mode }}
              className="rounded px-6 py-3 bg-primary hover:bg-primary/80 text-white font-bold text-sm tracking-tight transition-all duration-300 active:scale-95 shadow-lg shadow-primary/20"
            >
              Mulai kerjakan
            </Link>
          </div>
        </div>

        <div className="py-5">
          <p className="text-justify text-sm font-medium text-slate-500 w-full max-w-[1000px] leading-relaxed tracking-tight">
            {examData.description}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
            Peringkat
          </h2>
          <RankingTable />
        </div>
      </div>
    </div>
  );
}

export default DetailExam;
