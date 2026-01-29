import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router"; // React Router v6
import Navbar from "../../components/landing/Navbar/Navbar";
import { landingService } from "../../services/landingService";
import { slugify } from "../../utils/slugify";
import { getAssetUrl } from "../../utils/assetHelpper";
import { Star, Users, BookOpen, Lock, FileText } from "lucide-react";

function LoadingDetail() {
  return (
    <div className="w-full py-20 flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold text-lg animate-pulse">
          Memuat detail paket...
        </p>
      </div>
    </div>
  );
}

function PublicDetailExam() {
  const { slug } = useParams();
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA PUBLIK ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const allPackages = await landingService.getPublicPackages();
        const found = allPackages.find((item) => slugify(item.label) === slug);

        if (found) {
          setExamData({
            ...found,
            image: getAssetUrl(found.image),
          });
        }
      } catch (error) {
        console.error("Error loading detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  // --- RENDER LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 font-sans">
        <Navbar />
        <LoadingDetail />
      </div>
    );
  }

  // --- RENDER DATA TIDAK DITEMUKAN ---
  if (!examData) {
    return (
      <div className="min-h-screen bg-neutral-50 font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-bold text-slate-800">
            Paket Tidak Ditemukan
          </h2>
          <Link
            to="/tes"
            className="mt-4 text-primary font-bold hover:underline"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans pb-20">
      <Navbar />

      <div className="pt-[120px] px-5 md:px-7-5 max-w-screen-xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500 font-medium">
          <Link to="/" className="hover:text-primary">
            Beranda
          </Link>{" "}
          /{" "}
          <Link to="/tes" className="hover:text-primary">
            Tes
          </Link>{" "}
          / <span className="text-slate-800 font-bold">{examData.label}</span>
        </div>

        {/* SECTION 1: DETAIL PAKET (Header) */}
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Kiri: Gambar */}
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

            {/* Statistik Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl transition-colors hover:bg-slate-100">
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
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl transition-colors hover:bg-slate-100">
                <div className="p-2.5 bg-white rounded-full text-primary shadow-sm">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Peserta
                  </p>
                  <p className="text-lg font-black text-slate-800">
                    {examData.participants} Orang
                  </p>
                </div>
              </div>
            </div>

            {/* LOGIKA UTAMA: TOMBOL LOGIN (Langsung di bawah stats) */}
            <div className="flex flex-col gap-3 mt-auto">
              <Link
                to="/login"
                className="w-full md:w-fit bg-primary hover:bg-primary/90 text-white text-center px-8 py-3.5 rounded-lg font-bold text-base transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                Masuk untuk Mengerjakan
              </Link>
              <p className="text-xs text-slate-400 font-medium">
                * Kamu harus memiliki akun untuk mengakses ujian dan melihat
                pembahasan.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: DESKRIPSI (Baru dipindah kesini) */}
        <div className="mt-8">
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
              {examData.description ||
                "Deskripsi paket soal ini belum tersedia secara publik. Silakan masuk untuk melihat detail lengkapnya."}
            </p>
          </div>
        </div>

        {/* SECTION 3: PERINGKAT TERKUNCI */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Peringkat Tertinggi
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Top 10 Leaderboard
            </span>
          </div>

          {/* Area Terkunci / Blur */}
          <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-slate-200 bg-white">
            {/* Background Blur Effect */}
            <div className="absolute inset-0 bg-slate-50 blur-[6px] opacity-60 flex flex-col p-4 gap-3 select-none">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>

            {/* Overlay Pesan */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-10">
              <div className="p-4 bg-white rounded-full shadow-lg mb-4">
                <Lock size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Peringkat Terkunci
              </h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md text-center">
                Masuk atau daftar sekarang untuk melihat peringkat global dan
                bersaing dengan ribuan peserta lainnya.
              </p>
              <Link
                to="/login"
                className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-black transition-colors"
              >
                Buka Peringkat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicDetailExam;
