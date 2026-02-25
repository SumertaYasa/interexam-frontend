import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  LayoutGrid,
  ArrowRight,
  Trophy,
  ChevronDown,
  Loader2, // Icon tambahan untuk loading
} from "lucide-react";
import { courseService } from "../../../../../services/subscriber"; // Sesuaikan path-nya

// --- KOMPONEN BANTUAN: LINGKARAN SKOR ---
function CircularScore({ score }) {
  const strokeDasharray = `${score}, 100`;

  return (
    <div className="relative w-36 h-36 flex items-center justify-center shrink-0 transition-all duration-700">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <path
          className="text-slate-100"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          className="text-[#2B4C7E] transition-all duration-1000 ease-out"
          strokeDasharray={strokeDasharray}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
          {score}
        </span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Skor Akhir
        </span>
      </div>
    </div>
  );
}

// --- KOMPONEN BANTUAN: MINI RANKING TABLE ---
function MiniRankingTable({ eventId, title, rankingType }) {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        let reqPaketId = "all";
        if (rankingType !== "all") {
          reqPaketId = rankingType.split("_")[1];
        }

        const data = await courseService.getEventLeaderboard(
          eventId,
          reqPaketId,
        );
        // Ambil 3 teratas saja untuk mini table
        setLeaderboard(data.slice(0, 3));
      } catch (err) {
        console.error("Gagal load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchLeaderboard();
  }, [eventId, rankingType]);

  // --- HELPER UNTUK FORMAT URL FOTO PROFIL ---
  const getAvatarUrl = (path) => {
    if (!path || path === "/person.jpg") return "/person.jpg";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`; // Pastikan port sesuai dengan backend-mu
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Peringkat <span className="font-medium text-slate-500">{title}</span>
          {loading && (
            <Loader2 className="w-4 h-4 text-slate-300 animate-spin" />
          )}
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Top Leaderboard
        </span>
      </div>

      <div className="w-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="flex items-center px-5 py-3 border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <div className="w-10">No</div>
          <div className="flex-1">Nama</div>
          <div className="w-24 text-right">Statistik</div>
          <div className="w-16 text-right">Skor</div>
        </div>

        <div className="p-2 flex flex-col gap-2 bg-slate-50/30 min-h-[140px] justify-center">
          {loading ? (
            <div className="text-center text-sm text-slate-400 font-medium">
              Memuat peringkat...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center text-sm text-slate-400 font-medium">
              Belum ada peringkat tercatat.
            </div>
          ) : (
            leaderboard.map((user, idx) => (
              <div
                key={idx}
                className={`flex items-center px-4 py-3 rounded-lg border ${
                  user.isMe
                    ? "bg-[#FFFCE8] border-[#FDEB82]"
                    : "bg-white border-slate-100"
                }`}
              >
                <div className="w-10 font-bold text-slate-700">{user.no}</div>
                <div className="flex-1 flex items-center gap-3">
                  {/* --- UBAH SRC IMAGE DI SINI MENGGUNAKAN HELPER --- */}
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt={user.name}
                    className="w-7 h-7 rounded-full border border-slate-200 object-cover bg-slate-50"
                  />
                  <span className="font-bold text-slate-800 text-sm line-clamp-1">
                    {user.name}
                  </span>
                </div>
                <div className="w-24 text-right text-xs font-medium text-slate-500">
                  {user.stats}
                </div>
                <div className="w-16 text-right font-black text-slate-900">
                  {user.score}
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate(`ranking/${rankingType}`)}
          className="w-full py-3 bg-white border-t border-slate-100 text-sm font-bold text-primary hover:bg-slate-50 transition-colors"
        >
          Lihat Peringkat Selengkapnya
        </button>
      </div>
    </div>
  );
}

// --- MAIN PAGE: EVENT RESULT DETAIL ---
export default function EventResultDetail() {
  const navigate = useNavigate();
  const { label } = useParams();

  // STATE
  const [reportData, setReportData] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventId, setEventId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);

        // 1. Karena kita memakai slug/label di URL, kita harus cari tahu ID event-nya dulu
        const allEvents = await courseService.getAllEvents();
        // Asumsikan kamu menggunakan util slugify yang sama di frontend
        const targetEvent = allEvents.find(
          (e) => e.title.toLowerCase().replace(/\s+/g, "-") === label,
        );

        if (!targetEvent) throw new Error("Event tidak ditemukan");

        const id = targetEvent.id;
        setEventId(id);

        // 2. Tembak API Report
        const response = await courseService.getEventUserReport(id);

        setEventTitle(response.event_title);
        setReportData(response.report);
      } catch (error) {
        console.error("Gagal load report event:", error);
      } finally {
        setLoading(false);
      }
    };

    if (label) fetchReport();
  }, [label]);

  // Jika Data Masih Loading
  if (loading || !reportData) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">
          Menyiapkan Laporan Rapor...
        </p>
      </div>
    );
  }

  // Pointer ke Data Aktif sesuai Dropdown
  const currentData = reportData[selectedFilter];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans antialiased pb-20">
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-40 relative">
        <div className="w-8 md:w-10">
          <img src="/interexam-logo.svg" className="w-full" alt="Logo" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Exam Report Card
        </span>
      </nav>

      <div className="max-w-screen-md mx-auto mt-8 px-5 flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {eventTitle}
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium">
              Laporan Hasil Pengerjaan
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl font-bold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
            >
              {/* Render Opsi Dropdown Secara Dinamis dari object keys API */}
              {Object.keys(reportData).map((key) => (
                <option key={key} value={key}>
                  {key === "all"
                    ? "📊 Keseluruhan Paket"
                    : `📖 ${reportData[key].title}`}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        <div className="w-full bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-sm mb-6 transition-all duration-300">
          <CircularScore score={currentData.score} />

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-4">
              <Trophy size={12} /> Hasil Laporan
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-3">
              {currentData.title}
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-sm">
              {currentData.score >= 70
                ? "Hasil yang luar biasa! Pertahankan konsistensimu."
                : "Masih banyak ruang untuk berkembang. Jangan menyerah dan perbanyak latihan!"}
            </p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-green-50 text-green-500 rounded-full border border-green-100">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Jawaban Benar
              </span>
              <div className="text-slate-800 font-medium text-xs">
                <span className="text-xl font-black">{currentData.benar}</span>{" "}
                / {currentData.totalSoal} Soal
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-red-50 text-red-500 rounded-full border border-red-100">
              <XCircle size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Jawaban Salah
              </span>
              <div className="text-slate-800 font-medium text-xs">
                <span className="text-xl font-black">{currentData.salah}</span>{" "}
                / {currentData.totalSoal} Soal
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
              <HelpCircle size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Dilewati
              </span>
              <div className="text-slate-800 font-medium text-xs">
                <span className="text-xl font-black">{currentData.lewat}</span>{" "}
                / {currentData.totalSoal} Soal
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 w-full mb-12">
          <button
            onClick={() => navigate("/dashboard-subscriber")}
            className="px-8 py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-md shadow-slate-900/10"
          >
            <LayoutGrid size={18} /> Dashboard
          </button>

          {selectedFilter !== "all" && (
            <button
              onClick={() =>
                // URL baru yang membawa label event dan slug paket
                navigate(
                  `/dashboard-subscriber/latihan/events/results/${label}/discussion/${currentData.slug}`,
                )
              }
              className="px-8 py-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
            >
              Lihat Pembahasan {currentData.title.split(":")[0]}{" "}
              <ArrowRight size={18} />
            </button>
          )}
        </div>

        <div className="w-full flex flex-col gap-2">
          {selectedFilter === "all" ? (
            <>
              {/* Render Semua Tabel Leaderboard berdasarkan list paket yang ada */}
              {Object.keys(reportData).map((key) => (
                <MiniRankingTable
                  key={key}
                  eventId={eventId}
                  title={reportData[key].title}
                  rankingType={key}
                />
              ))}
            </>
          ) : (
            <MiniRankingTable
              eventId={eventId}
              title={currentData.title}
              rankingType={selectedFilter}
            />
          )}
        </div>
      </div>
    </div>
  );
}
