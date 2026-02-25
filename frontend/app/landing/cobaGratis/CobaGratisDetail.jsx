import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { publicService } from "../../services/publicService";
import { Star, BookOpen, Play, FileText } from "lucide-react";
import { getAssetUrl } from "../../utils/assetHelpper"; // Pastikan ejaan 'assetHelpper' sesuai dengan nama file-mu
import { slugify } from "../../utils/slugify"; // TAMBAHKAN INI

function LoadingDetail() {
  return (
    <div className="w-full py-20 flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold text-lg animate-pulse">
          Memuat detail paket soal...
        </p>
      </div>
    </div>
  );
}

function CobaGratisDetail() {
  const { label } = useParams();
  const navigate = useNavigate();

  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Memanggil Public API
        const responseData = await publicService.getDemoExam();

        // Cari paket yang sesuai dengan label (slug) di URL MENGGUNAKAN SLUGIFY
        const found = responseData.find(
          (item) => slugify(item.nama_paket) === label,
        );

        if (!found) {
          setError("Paket soal demo tidak ditemukan");
          setExamData(null);
          return;
        }

        const processed = {
          id: found.id_paket,
          label: found.nama_paket,
          description:
            found.deskripsi ||
            "Coba rasakan pengalaman ujian di InterExam secara gratis. Hasil tidak akan disimpan, jadi kerjakan dengan santai!",
          image: getAssetUrl(found.image), // Menggunakan Helper dari Utils
          totalSoal: found.soal?.length || 0,
          category: found.category?.nama_category || "Latihan Demo",
          rating: 4.8,
          durasi: found.durasi,
        };

        setExamData(processed);
      } catch (err) {
        console.error("Error fetching demo exam detail:", err);
        setError("Gagal memuat data paket soal. Silakan coba lagi.");
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
      <div className="w-full font-sans antialiased pb-20 bg-slate-50 min-h-screen pt-[100px]">
        <LoadingDetail />
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="w-full font-sans antialiased pb-20 bg-slate-50 min-h-screen pt-[100px]">
        <div className="w-full px-5 py-20 text-center flex flex-col items-center">
          <p className="font-bold text-slate-500 text-xl mb-4">
            {error || "Paket soal tidak ditemukan."}
          </p>
          <button
            onClick={() => navigate("/coba-gratis")}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold"
          >
            Kembali ke Daftar Paket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans antialiased pb-20 bg-slate-50 min-h-screen pt-[100px]">
      {/* Container utama max-width agar rapi di tengah */}
      <div className="px-5 md:px-7-5 max-w-screen-xl mx-auto flex flex-col gap-5">
        {/* Tombol Kembali (Sebagai pengganti Breadcrumbs yang rumit) */}
        <button
          onClick={() => navigate("/coba-gratis")}
          className="text-slate-500 font-medium hover:text-blue-600 transition-colors self-start mb-2"
        >
          ← Kembali ke Daftar Latihan
        </button>

        {/* SECTION 1: DETAIL PAKET (Header Card Style) */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-4">
          {/* Kiri: Gambar */}
          <div className="w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-2xl overflow-hidden shrink-0 shadow-md relative group">
            <img
              src={examData.image}
              alt={examData.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
              COBA GRATIS
            </div>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
          </div>

          {/* Kanan: Info */}
          <div className="flex flex-col justify-center w-full">
            {/* Badge Category & Rating */}
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                {examData.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                <Star size={14} fill="currentColor" /> {examData.rating}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
              {examData.label}
            </h1>

            {/* Statistik Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Box 1: Total Soal */}
              <div className="flex flex-col gap-1 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <BookOpen size={14} /> Total Soal
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {examData.totalSoal} Butir
                </p>
              </div>

              {/* Box 2: Durasi */}
              <div className="flex flex-col gap-1 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  ⏱️ Estimasi Waktu
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {examData.durasi} Menit
                </p>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col mt-auto">
              <Link
                to={`/coba-gratis/${label}/attempt`}
                className="w-full md:w-fit text-center px-10 py-4 rounded-xl font-bold text-base transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Play size={18} fill="currentColor" />
                Mulai Simulasi Sekarang
              </Link>
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
              Deskripsi Paket
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify">
              {examData.description}
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm font-bold text-blue-800">
                💡 Catatan Simulasi:
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Karena ini adalah mode coba gratis, progres pengerjaan dan
                nilaimu tidak akan disimpan secara otomatis setelah tab browser
                ditutup. Pastikan kamu menyelesaikan simulasi hingga akhir untuk
                melihat skor sementaramu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CobaGratisDetail;
