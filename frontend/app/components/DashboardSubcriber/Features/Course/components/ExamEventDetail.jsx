import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { courseService } from "../../../../../services/subscriber";
import { slugify } from "../../../../../utils/slugify";
import { getAssetUrl } from "../../../../../utils/assetHelpper";
import BreadCrumbs from "../../../Common/BreadCrumbs";
import {
  BookOpen,
  Play,
  Clock,
  AlertTriangle,
  FileText,
  Lock,
  CheckCircle, // <-- Tambahkan icon ini
} from "lucide-react";

function LoadingDetail() {
  return (
    <div className="w-full py-20 flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold text-lg animate-pulse">
          Mempersiapkan ruang ujian...
        </p>
      </div>
    </div>
  );
}

function ExamEventDetail() {
  const { eventLabel, label } = useParams();

  const [examData, setExamData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsLocked(false);

        // 1. Validasi Event
        const allEvents = await courseService.getAllEvents();
        const currentEvent = allEvents.find(
          (e) => slugify(e.title) === eventLabel,
        );

        if (!currentEvent) {
          throw new Error("Event tidak ditemukan.");
        }

        // 2. Ambil Detail Event Lengkap
        const detailEvent = await courseService.getEventDetail(currentEvent.id);

        if (!detailEvent || !detailEvent.user_status?.is_registered) {
          throw new Error("Akses ditolak. Anda belum mendaftar di event ini.");
        }
        setEventData(detailEvent);

        // 3. --- VALIDASI GEMBOK BERANTAI (SEQUENTIAL LOCK) ---
        const currentCourseInEvent = detailEvent.courses.find(
          (c) => slugify(c.title) === label,
        );

        if (!currentCourseInEvent) {
          throw new Error("Paket soal tidak ditemukan dalam event ini.");
        }

        // Jika paket terkunci karena belum menyelesaikan paket sebelumnya
        if (currentCourseInEvent.is_locked) {
          setIsLocked(true);
          throw new Error(
            currentCourseInEvent.locked_reason ||
              "Anda harus menyelesaikan paket soal sebelumnya terlebih dahulu.",
          );
        }

        // 4. Susun data untuk UI jika lolos semua validasi
        setExamData({
          id: currentCourseInEvent.id,
          label: currentCourseInEvent.title,
          description:
            "Kerjakan soal sebaik mungkin untuk mendapatkan skor tertinggi di event ini. Waktu Anda akan diawasi secara ketat oleh sistem.",
          image: getAssetUrl(currentCourseInEvent.image),
          totalSoal: currentCourseInEvent.total_soal || 0,
          category: detailEvent.category || "Event",

          // --- TANGKAP STATUS PENGERJAAN DARI BACKEND ---
          statusPengerjaan: currentCourseInEvent.status_pengerjaan,
        });
      } catch (err) {
        console.error("Error fetching event exam detail:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    if (label && eventLabel) {
      fetchData();
    }
  }, [label, eventLabel]);

  // --- RENDERING ERROR / LOCKED STATE ---
  if (loading) {
    return (
      <div className="w-full font-sans antialiased">
        <nav className="w-full px-7-5 py-3.5">
          <img src="/interexam-logo.svg" className="w-12" alt="Logo" />
        </nav>
        <LoadingDetail />
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="w-full font-sans antialiased min-h-screen bg-slate-50">
        <nav className="w-full px-7-5 py-3.5 bg-white shadow-sm">
          <img src="/interexam-logo.svg" className="w-12" alt="Logo" />
        </nav>
        <div className="w-full max-w-lg mx-auto mt-20 px-5 text-center flex flex-col items-center gap-5">
          <div
            className={`p-5 rounded-full ${isLocked ? "bg-amber-100 text-amber-500" : "bg-red-100 text-red-500"}`}
          >
            {isLocked ? <Lock size={40} /> : <AlertTriangle size={40} />}
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            {isLocked ? "Paket Terkunci" : "Akses Ditolak"}
          </h2>
          <p className="font-medium text-slate-600 leading-relaxed">{error}</p>
          <Link
            to={`/dashboard-subscriber/latihan/events/${eventLabel}`}
            className="mt-4 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
          >
            Kembali ke Daftar Paket
          </Link>
        </div>
      </div>
    );
  }

  // --- LOGIC TIME & STATUS GATEKEEPER ---
  const now = new Date();
  const startDate = new Date(eventData?.date_start);
  const endDate = new Date(eventData?.date_end);

  const isUpcoming = now < startDate;
  const isExpired = now > endDate;

  // Deteksi apakah user sudah pernah menyelesaikan paket ini
  const isFinished = examData?.statusPengerjaan === "selesai";
  const isOngoingExam = examData?.statusPengerjaan === "sedang_mengerjakan";

  // --- RENDERING UTAMA ---
  const attemptPath = `/dashboard-subscriber/latihan/events/${eventLabel}/${label}/attempt`;

  return (
    <div className="w-full font-sans antialiased pb-20">
      <nav className="w-full px-7-5 py-3.5">
        <div className="w-12">
          <img src="/interexam-logo.svg" className="w-full" alt="Logo" />
        </div>
      </nav>

      <div className="pt-5 px-5 md:px-7-5 max-w-screen-xl mx-auto flex flex-col gap-5">
        <BreadCrumbs />

        {/* SECTION 1: HEADER CARD */}
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Kiri: Gambar */}
          <div className="w-[400px] md:w-[400px] h-[300px] md:h-[400px] rounded-xl overflow-hidden shrink-0 shadow-md relative group">
            <img
              src={examData.image}
              alt={examData.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />

            <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Official Event
            </div>
          </div>

          {/* Kanan: Info & Action */}
          <div className="flex flex-col justify-center w-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                {examData.category}
              </span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200">
                {eventData?.title}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              {examData.label}
            </h1>

            {/* Statistik Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
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

              <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="p-2.5 bg-white rounded-full text-orange-500 shadow-sm">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-orange-600/80 font-bold uppercase tracking-wider">
                    Sistem Waktu Berbagi
                  </p>
                  <p className="text-sm font-black text-orange-700 leading-tight mt-0.5">
                    Durasi Event Ketat
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3">
              <AlertTriangle
                className="text-red-500 shrink-0 mt-0.5"
                size={20}
              />
              <p className="text-sm text-red-800 leading-relaxed font-medium">
                Waktu akan <span className="font-bold">terus berjalan</span>{" "}
                sejak Anda pertama kali memulai paket soal apapun di event ini.
                Ujian akan{" "}
                <span className="font-bold">otomatis dikumpulkan</span> saat
                waktu habis. Pastikan koneksi internet Anda stabil.
              </p>
            </div>

            {/* Tombol Action (Disabled state logic yang sudah disempurnakan) */}
            <div className="flex flex-col gap-3 mt-auto">
              {isFinished ? (
                <button
                  disabled
                  className="w-full md:w-fit text-center px-10 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 bg-green-100 text-green-700 border border-green-200 cursor-not-allowed"
                >
                  <CheckCircle size={18} />
                  Paket Sudah Diselesaikan
                </button>
              ) : isExpired ? (
                <button
                  disabled
                  className="w-full md:w-fit text-center px-10 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 bg-slate-300 text-slate-500 cursor-not-allowed"
                >
                  <Lock size={18} />
                  Event Sudah Berakhir
                </button>
              ) : isUpcoming ? (
                <button
                  disabled
                  className="w-full md:w-fit text-center px-10 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 bg-slate-300 text-slate-500 cursor-not-allowed"
                >
                  <Lock size={18} />
                  Event Belum Mulai
                </button>
              ) : (
                <Link
                  to={attemptPath}
                  className="w-full md:w-fit text-center px-10 py-4 rounded-xl font-bold text-base transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 shadow-primary/20 text-white"
                >
                  <Play size={18} fill="currentColor" />
                  {isOngoingExam
                    ? "Lanjutkan Ujian Event"
                    : "Mulai Ujian Event"}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: DESKRIPSI */}
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Deskripsi Ujian
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify">
              {examData.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamEventDetail;
