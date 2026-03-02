import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Loader2,
  Filter,
} from "lucide-react";
import { courseService } from "../../../../../services/subscriber";

export default function EventDiscussion() {
  // Menangkap dua parameter dari URL
  const { eventLabel, paketLabel } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discussionData, setDiscussionData] = useState(null);
  const [filterWrongOnly, setFilterWrongOnly] = useState(false);

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Cari ID Event berdasarkan eventLabel
        const allEvents = await courseService.getAllEvents();
        const targetEvent = allEvents.find(
          (e) => e.title.toLowerCase().replace(/\s+/g, "-") === eventLabel,
        );
        if (!targetEvent)
          throw new Error(`Event "${eventLabel}" tidak ditemukan.`);
        const eventId = targetEvent.id;

        // 2. Cari ID Paket berdasarkan paketLabel
        const responsePaket = await courseService.getAllPaketsWithProgress();
        const allPaket = responsePaket.data || [];
        const targetPaket = allPaket.find(
          (p) => p.nama_paket.toLowerCase().replace(/\s+/g, "-") === paketLabel,
        );
        if (!targetPaket)
          throw new Error(`Paket "${paketLabel}" tidak ditemukan.`);
        const paketId = targetPaket.id_paket_soal;

        // 3. Tembak API Pembahasan DENGAN menyertakan eventId
        const data = await courseService.getAttemptDiscussion(paketId, eventId);
        setDiscussionData(data);
      } catch (err) {
        console.error("Gagal memuat pembahasan event:", err);
        setError(
          err.message ||
            err.response?.data?.message ||
            "Gagal memuat data pembahasan.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (eventLabel && paketLabel) fetchDiscussion();
  }, [eventLabel, paketLabel]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">
          Memuat Pembahasan Event...
        </p>
      </div>
    );
  }

  if (error || !discussionData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-5 text-center">
        <XCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          Oops! Gagal Memuat
        </h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)} // Kembali ke Result Detail
          className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
        >
          Kembali ke Hasil Event
        </button>
      </div>
    );
  }

  const { paket, summary, pembahasan } = discussionData;

  const displayedQuestions = filterWrongOnly
    ? pembahasan.filter((q) => q.status_jawaban === "salah")
    : pembahasan;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 line-clamp-1">
              Pembahasan: {paket}
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Event Discussion
            </p>
          </div>
        </div>
      </nav>

      {/* --- KONTEN UTAMA --- */}
      <div className="max-w-4xl mx-auto mt-8 px-6 flex flex-col gap-8">
        {/* --- HEADER STATISTIK & FILTER --- */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="bg-green-50 rounded-xl px-4 py-2 border border-green-100 text-center">
              <span className="block text-xl font-black text-green-600 leading-none mb-1">
                {summary.benar}
              </span>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                Benar
              </span>
            </div>
            <div className="bg-red-50 rounded-xl px-4 py-2 border border-red-100 text-center">
              <span className="block text-xl font-black text-red-600 leading-none mb-1">
                {summary.salah}
              </span>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                Salah
              </span>
            </div>
            <div className="bg-slate-100 rounded-xl px-4 py-2 border border-slate-200 text-center">
              <span className="block text-xl font-black text-slate-600 leading-none mb-1">
                {summary.dilewati}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Lewat
              </span>
            </div>
          </div>

          <button
            onClick={() => setFilterWrongOnly(!filterWrongOnly)}
            className={`py-3 px-6 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              filterWrongOnly
                ? "bg-red-50 border border-red-200 text-red-600 shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter size={16} />
            {filterWrongOnly
              ? "Tampilkan Semua Soal"
              : "Fokus Tampilkan Soal Salah"}
          </button>
        </div>

        {/* --- LIST SEMUA SOAL --- */}
        <div className="flex flex-col gap-10">
          {displayedQuestions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
              <p className="font-medium text-lg">
                Tidak ada soal yang sesuai dengan filter.
              </p>
              {filterWrongOnly && (
                <p className="text-sm mt-2">
                  Keren banget! Tidak ada jawaban yang salah.
                </p>
              )}
            </div>
          ) : (
            displayedQuestions.map((question) => (
              <div key={question.id_soal} className="flex flex-col gap-4">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-600 font-black rounded-lg text-sm">
                        Soal No. {question.no_soal}
                      </span>
                      {question.status_jawaban === "benar" && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                          <CheckCircle2 size={14} /> Jawaban Benar
                        </span>
                      )}
                      {question.status_jawaban === "salah" && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                          <XCircle size={14} /> Jawaban Salah
                        </span>
                      )}
                      {question.status_jawaban === "dilewati" && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                          <HelpCircle size={14} /> Tidak Dijawab
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="text-slate-800 font-medium text-lg leading-relaxed mb-8"
                    dangerouslySetInnerHTML={{ __html: question.text_soal }}
                  />

                  <div className="flex flex-col gap-3">
                    {question.opsi_jawaban.map((opsi) => {
                      const isCorrectAnswer = opsi.is_correct;

                      // Handle jawaban_user bisa berupa array (multiple_answer) atau object (single answer)
                      let isUserChoice = false;
                      if (Array.isArray(question.jawaban_user)) {
                        // Multiple Answer: jawaban_user adalah array
                        isUserChoice = question.jawaban_user.some(
                          (ans) => ans.id_jawaban === opsi.id_jawaban,
                        );
                      } else if (question.jawaban_user) {
                        // Single Answer: jawaban_user adalah object
                        isUserChoice =
                          question.jawaban_user.id_jawaban === opsi.id_jawaban;
                      }

                      let optionStyle =
                        "border-slate-200 bg-white text-slate-700";
                      let IconToShow = null;

                      if (isCorrectAnswer) {
                        optionStyle =
                          "border-green-500 bg-green-50 text-green-800 shadow-sm ring-1 ring-green-500";
                        IconToShow = (
                          <CheckCircle2 size={18} className="text-green-600" />
                        );
                      } else if (isUserChoice && !isCorrectAnswer) {
                        optionStyle = "border-red-400 bg-red-50 text-red-700";
                        IconToShow = (
                          <XCircle size={18} className="text-red-500" />
                        );
                      }

                      return (
                        <div
                          key={opsi.id_jawaban}
                          className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${optionStyle}`}
                        >
                          <span className="font-medium">{opsi.teks}</span>
                          {IconToShow && <div>{IconToShow}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 md:p-8 shadow-inner relative overflow-hidden ml-4 md:ml-8 mb-4">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                  <h3 className="text-blue-600 font-black text-lg flex items-center gap-2 mb-4">
                    <Lightbulb size={22} className="text-yellow-500" />
                    Pembahasan
                  </h3>
                  <div
                    className="text-slate-700 font-medium leading-relaxed prose prose-slate max-w-none text-sm md:text-base"
                    dangerouslySetInnerHTML={{
                      __html: question.pembahasan,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
