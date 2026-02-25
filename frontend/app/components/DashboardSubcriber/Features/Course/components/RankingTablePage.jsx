import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Loader2 } from "lucide-react";
import { courseService } from "../../../../../services/subscriber";

export default function RankingDetailPage() {
  const navigate = useNavigate();
  // Tangkap eventLabel (slug event) dan rankingType (slug paket atau 'all')
  const { eventLabel, rankingType } = useParams();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [paketTitle, setPaketTitle] = useState("");

  useEffect(() => {
    const fetchFullLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Cari ID Event berdasarkan eventLabel
        const allEvents = await courseService.getAllEvents();
        const targetEvent = allEvents.find(
          (e) => e.title.toLowerCase().replace(/\s+/g, "-") === eventLabel,
        );

        if (!targetEvent) throw new Error("Event tidak ditemukan.");
        const eventId = targetEvent.id;
        setEventTitle(targetEvent.title);

        // 2. Tentukan ID Paket (reqPaketId) dan Judul Paket
        let reqPaketId = "all";

        if (rankingType === "all") {
          setPaketTitle("Total (Semua Paket)");
        } else {
          // Jika rankingType adalah slug paket, kita harus cari ID paketnya
          const responsePaket = await courseService.getAllPaketsWithProgress();
          const allPaket = responsePaket.data || [];

          // Kita cari berdasarkan slug (asumsi rankingType di URL adalah slug/label paket)
          const targetPaket = allPaket.find(
            (p) =>
              p.nama_paket.toLowerCase().replace(/\s+/g, "-") === rankingType,
          );

          if (targetPaket) {
            reqPaketId = targetPaket.id_paket_soal;
            setPaketTitle(targetPaket.nama_paket);
          } else {
            // Fallback jika tidak ketemu (misal URL format lama 'paket_45')
            reqPaketId = rankingType.includes("_")
              ? rankingType.split("_")[1]
              : rankingType;
            setPaketTitle(`Paket Detail`);
          }
        }

        // 3. Tarik data Leaderboard dari API
        const data = await courseService.getEventLeaderboard(
          eventId,
          reqPaketId,
        );
        setLeaderboard(data);
      } catch (err) {
        console.error("Gagal memuat ranking:", err);
        setError(err.message || "Terjadi kesalahan saat memuat peringkat.");
      } finally {
        setLoading(false);
      }
    };

    if (eventLabel && rankingType) {
      fetchFullLeaderboard();
    }
  }, [eventLabel, rankingType]);

  // Helper URL Foto (Sama dengan yang di MiniRankingTable)
  const getAvatarUrl = (path) => {
    if (!path || path === "/person.jpg") return "/person.jpg";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  // Rendering Loading State
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">
          Menyiapkan Peringkat...
        </p>
      </div>
    );
  }

  // Rendering Error State
  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-5 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <Trophy size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Gagal Memuat Peringkat
        </h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans antialiased pb-20">
      {/* Navbar Minimalis */}
      <nav className="w-full bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center gap-4 sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none line-clamp-1">
            {eventTitle}
          </h1>
          <span className="text-xs font-medium text-slate-500 line-clamp-1">
            {paketTitle}
          </span>
        </div>
        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
          <Trophy size={16} />
        </div>
      </nav>

      {/* Kontainer Utama */}
      <div className="max-w-screen-md mx-auto mt-6 px-4 md:px-5">
        <div className="w-full border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          {/* Header Tabel */}
          <div className="flex items-center px-5 py-4 border-b border-slate-100 bg-slate-50/80 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
            <div className="w-10">No</div>
            <div className="flex-1">Nama Peserta</div>
            <div className="w-20 md:w-24 text-right">Statistik</div>
            <div className="w-16 md:w-20 text-right">Skor</div>
          </div>

          {/* Body Tabel */}
          <div className="p-2 md:p-3 flex flex-col gap-2 bg-slate-50/30">
            {leaderboard.length === 0 ? (
              <div className="text-center py-10 text-slate-500 font-medium">
                Belum ada data peringkat untuk ujian ini.
              </div>
            ) : (
              leaderboard.map((user, idx) => (
                <div
                  key={idx}
                  className={`flex items-center px-4 py-3 md:py-4 rounded-xl border ${
                    user.isMe
                      ? "bg-[#FFFCE8] border-[#FDEB82] shadow-sm sticky top-2 bottom-2 z-10 ring-2 ring-yellow-400/20"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <div className="w-10 font-black text-slate-400">
                    {user.no}
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <img
                      src={getAvatarUrl(user.avatar)}
                      alt={user.name}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-200 object-cover bg-white"
                    />
                    <div className="flex flex-col">
                      <span
                        className={`font-bold text-sm md:text-base leading-tight line-clamp-1 ${
                          user.isMe ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {user.name}
                      </span>
                      {user.isMe && (
                        <span className="w-fit mt-1 text-[9px] bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                          Posisi Kamu
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-20 md:w-24 text-right text-xs md:text-sm font-medium text-slate-500">
                    {user.stats}
                  </div>
                  <div className="w-16 md:w-20 text-right font-black text-slate-900 text-lg md:text-xl">
                    {user.score}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
