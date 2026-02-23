import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy } from "lucide-react";

export default function RankingDetailPage() {
  const navigate = useNavigate();
  // Kita menangkap parameter dari URL (misal: 'all', 'paket1', 'paket2')
  const { rankingType } = useParams();

  // Mapping judul berdasarkan tipe ranking
  const titleMap = {
    all: "Total (Semua Paket)",
    paket1: "Paket 1: Penalaran Umum",
    paket2: "Paket 2: Literasi Bahasa",
  };
  const title = titleMap[rankingType] || "Peringkat Lengkap";

  // Data Dummy Panjang (Misal 50 orang)
  const dummyFullLeaderboard = Array.from({ length: 50 }, (_, i) => ({
    no: i + 1,
    name: i === 14 ? "I Nengah Sumerta Yasa (Yasa)" : `Peserta Ujian ${i + 1}`,
    stats: "3/5",
    score: 100 - Math.floor(i * 1.5), // Simulasi skor menurun
    isMe: i === 14, // Posisi kamu
    avatar: "/person.jpg",
  }));

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans antialiased pb-20">
      {/* Navbar Minimalis */}
      <nav className="w-full bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
          className="p-2 -ml-2 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
            Peringkat Lengkap
          </h1>
          <span className="text-xs font-medium text-slate-500">{title}</span>
        </div>
        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
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
            {dummyFullLeaderboard.length === 0 ? (
              <div className="text-center py-10 text-slate-500 font-medium">
                Belum ada data peringkat.
              </div>
            ) : (
              dummyFullLeaderboard.map((user, idx) => (
                <div
                  key={idx}
                  className={`flex items-center px-4 py-3 md:py-4 rounded-xl border ${
                    user.isMe
                      ? "bg-[#FFFCE8] border-[#FDEB82] shadow-sm sticky top-2 bottom-2 z-10" // Sticky agar tidak hilang saat di-scroll
                      : "bg-white border-slate-100"
                  }`}
                >
                  <div className="w-10 font-black text-slate-400">
                    {user.no}
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-200 object-cover bg-white"
                    />
                    <div className="flex flex-col">
                      <span
                        className={`font-bold text-sm md:text-base leading-tight ${
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
