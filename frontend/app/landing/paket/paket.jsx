import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"; 
import Navbar from "../../components/landing/Navbar/Navbar";
import { subscriptionService } from "../../services/subscriptionService";

// --- HELPERS ---
const formatIDR = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
};

const PaketCard = ({ data, theme, onBuy }) => {
  
  const today = new Date();
  const activeDiscount = data.diskonPaket?.find(d => {
    const start = new Date(d.tanggal_mulai_diskon);
    const end = new Date(d.tanggal_selesai_diskon);
    return today >= start && today <= end;
  });

  const hargaAsli = data.harga || 0;
  let hargaFinal = hargaAsli;
  let diskonPersen = 0;

  if (activeDiscount) {
    diskonPersen = activeDiscount.diskon; 
    const nominalDiskon = hargaAsli * (diskonPersen / 100);
    hargaFinal = hargaAsli - nominalDiskon;
  }

  const periode = data.nama_periode || "bulan";
  const periodeText = periode.charAt(0).toUpperCase() + periode.slice(1);

  return (
    <div
      className={`border p-5 w-[350px] min-h-[520px] rounded-[15px] flex flex-col justify-between shadow-lg hover:scale-105 transition-transform duration-300 ${theme.textColor} ${theme.borderColor}`}
      style={{ background: theme.backgroundTheme }}
    >
      {/* BAGIAN ATAS: Header & Info */}
      <div className="flex flex-col gap-4">
        {/* Header Nama Paket */}
        <div className="flex items-center gap-3">
          <div
            className="w-[24px] h-[24px] rounded-full shadow-md"
            style={{ background: theme.cardTheme }}
          ></div>
          <h1 className="text-2xl font-bold font-sora tracking-wide">
            {data.nama_paket}
          </h1>
        </div>

        {/* Durasi */}
        <div className="bg-white/10 p-2 rounded-lg inline-block w-fit">
          <p className="text-sm font-medium opacity-90">
            ⏳ Masa Aktif: <span className="font-bold">{data.masa_berlaku} {periodeText}</span>
          </p>
        </div>

        <hr className="border-white/20 my-2" />

        {/* BAGIAN HARGA */}
        <div className="flex flex-col">
          {activeDiscount ? (
            // TAMPILAN JIKA ADA DISKON
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm line-through text-gray-300 opacity-70">
                  {formatIDR(hargaAsli)}
                </span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  HEMAT {diskonPersen}%
                </span>
              </div>
              <p className="text-3xl font-bold font-sora">
                {formatIDR(hargaFinal)}
              </p>
            </>
          ) : (
            // TAMPILAN HARGA NORMAL
            <p className="text-3xl font-bold font-sora">
              {formatIDR(hargaAsli)}
            </p>
          )}
          
          <span className="text-xs opacity-70 mt-1">/ {data.masa_berlaku} {periodeText}</span>
        </div>
      </div>

      {/* BAGIAN TENGAH: Fitur */}
      <div className="my-6">
        <p className="font-semibold mb-4 font-sora text-lg border-b border-white/20 pb-2">
          Benefit Langganan:
        </p>
        <ul className="flex flex-col gap-3 text-sm">
          {/* Fitur Statis  */}
          {[
            "Akses Ribuan Paket Soal",
            "Pembahasan Materi Lengkap",
            "Analisis Statistik Nilai"
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <div className="min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center bg-white text-purple-700">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="opacity-90">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tombol Aksi */}
      <button
        onClick={() => onBuy(data.id_paket_langganan)}
        className={`text-lg font-bold flex justify-center items-center gap-2 rounded-xl py-3 w-full ${theme.buttonTextColor} hover:shadow-xl hover:brightness-110 active:scale-95 transition-all duration-200`}
        style={{ background: theme.cardTheme }}
      >
        <span>Beli Sekarang</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
      </button>
    </div>
  );
};

function Paket() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  // Tema Global
  const theme = {
    backgroundTheme: "linear-gradient(146deg,rgba(62, 19, 143, 1) 0%, rgba(234, 156, 255, 1) 50%)",
    cardTheme: "linear-gradient(146deg,rgba(255, 255, 255, 1) 0%, rgba(240, 240, 255, 1) 100%)", // Sedikit saya tweak biar kontras
    textColor: "text-white", 
    borderColor: "border-0",
    buttonTextColor: "text-purple-700"
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await subscriptionService.getAllPackages();
        // Filter yang aktif
        const active = response.data.filter(p => p.status === "active" || p.status === "Aktif");
        setPackages(active);
      } catch (error) {
        console.error("Gagal load paket", error);
      }
    };
    fetchPackages();
  }, []);

  const handleBuy = async (paketId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Silakan Login terlebih dahulu!");
        navigate("/login"); 
        return;
    }

    try {
      const data = await subscriptionService.createTransaction(paketId);
      // @ts-ignore
      window.snap.pay(data.token, {
        onSuccess: () => { alert("Pembayaran Berhasil!"); navigate("/dashboard-subscriber"); },
        onPending: () => { alert("Menunggu Pembayaran..."); navigate("/dashboard-subscriber"); },
        onError: () => alert("Pembayaran Gagal!"),
        onClose: () => console.log("Popup closed")
      });
    } catch (error) {
      console.error(error);
      alert("Gagal memproses transaksi.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="absolute z-20 top-[100px] md:top-[120px] w-full mb-20">
        <div className="px-5 md:px-7-5 pb-5 md:pb-7-5 flex flex-col justify-center items-center gap-10">
          
          {/* Section Header */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold font-sora text-gray-900 mb-4">
              Rencanakan Belajarmu, Capai Lebih Banyak.
            </h1>
            <p className="text-gray-600 md:w-[600px] mx-auto text-xs md:text-lg">
              Pilih paket belajar yang sesuai dengan ritmemu. Setiap langkah membawa kamu lebih dekat ke hasil terbaikmu.
            </p>
          </div>

          {/* Grid Paket */}
          <div className="flex flex-col md:flex-row gap-8 flex-wrap justify-center items-stretch">
            {packages.length === 0 && (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
                    <p className="text-gray-500">Memuat pilihan paket...</p>
                </div>
            )}

            {packages.map((pkg) => (
              <PaketCard 
                key={pkg.id_paket_langganan} 
                data={pkg} 
                theme={theme} 
                onBuy={handleBuy} 
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Paket;