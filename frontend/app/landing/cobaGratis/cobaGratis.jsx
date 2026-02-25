import React, { useState, useEffect } from "react";
import Navbar from "../../components/landing/Navbar/Navbar";
import { publicService } from "../../services/publicService";
import { Loader2, AlertCircle } from "lucide-react";
import CardCobaGratisCourse from "./CardCobaGratisCourse";
import { getAssetUrl } from "../../utils/assetHelpper";

function CobaGratisList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemoPackages = async () => {
      try {
        setLoading(true);
        const data = await publicService.getDemoExam();
        setPackages(data);
      } catch (err) {
        setError(
          "Gagal memuat daftar paket coba gratis. Silakan coba lagi nanti.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDemoPackages();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />

      <section className="pt-[120px] w-full relative z-20">
        <div className="max-w-6xl mx-auto px-5">
          {loading && (
            <div className="flex flex-col items-center justify-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100 mt-10 max-w-4xl mx-auto">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 font-bold animate-pulse">
                Memuat Daftar Latihan...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 mt-10 text-center max-w-4xl mx-auto">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-slate-800 mb-2">Oops!</h2>
              <p className="text-slate-500">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div>
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                  Pilih Paket Coba Gratis
                </h1>
                <p className="text-slate-500 font-medium">
                  Uji kemampuanmu sekarang. Pilih salah satu materi di bawah ini
                  untuk memulai simulasi!
                </p>
              </div>

              {/* GRID KARTU MENGGUNAKAN KOMPONEN BARU */}
              <div className="flex flex-wrap justify-center gap-8">
                {packages.map((pkg) => {
                  const slug = pkg.nama_paket
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  return (
                    <CardCobaGratisCourse
                      key={pkg.id_paket}
                      title={pkg.nama_paket}
                      image={getAssetUrl(pkg.image) || "/person.jpg"}
                      category={pkg.category?.nama_category || "Latihan Demo"}
                      totalSoal={pkg.soal?.length || 0}
                      durasi={pkg.durasi || 15}
                      path={`/coba-gratis/${slug}`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CobaGratisList;
