import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Filter,
  AlertTriangle, // Tambahan icon untuk jaga-jaga
} from "lucide-react";

export default function FolderDiscussion() {
  const location = useLocation();
  const navigate = useNavigate();

  const [filterWrongOnly, setFilterWrongOnly] = useState(false);

  const details = location.state?.details || [];
  const examLabel = location.state?.examLabel || "Latihan Folder";

  // LOG DETEKTIF TETAP ADA UNTUK MEMUDAHKANMU
  console.log("Data Pembahasan dari State:", details);

  if (!details || details.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-5 text-center">
        <XCircle className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          Data Tidak Ditemukan
        </h2>
        <p className="text-slate-500 mb-6">
          Sistem tidak menemukan data pembahasan untuk sesi latihan ini.
        </p>
        <button
          onClick={() => navigate("/dashboard-subscriber/tersimpan")}
          className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
        >
          Kembali ke Folder Tersimpan
        </button>
      </div>
    );
  }

  const summary = details.reduce(
    (acc, curr) => {
      // Pengecekan yang lebih robust: user_answer harus number atau numeric string yang valid
      const userAnswerNum = parseInt(curr.user_answer);
      const hasValidAnswer = !isNaN(userAnswerNum);

      if (!hasValidAnswer) {
        acc.dilewati++;
      } else if (curr.is_correct) {
        acc.benar++;
      } else {
        acc.salah++;
      }
      return acc;
    },
    { benar: 0, salah: 0, dilewati: 0 },
  );

  const displayedQuestions = filterWrongOnly
    ? details.filter((q) => !q.is_correct && q.user_answer !== null)
    : details;

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
              Pembahasan: {examLabel}
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              Practice Mode
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
            </div>
          ) : (
            displayedQuestions.map((question, index) => {
              let statusLabel = "";
              let StatusIcon = null;
              let statusStyle = "";

              // Pengecekan yang lebih robust: user_answer harus number atau numeric string yang valid
              const userAnswerNum = parseInt(question.user_answer);
              const hasValidAnswer = !isNaN(userAnswerNum);

              if (!hasValidAnswer) {
                statusLabel = "Tidak Dijawab";
                StatusIcon = HelpCircle;
                statusStyle = "text-slate-500 bg-slate-100 border-slate-200";
              } else if (question.is_correct) {
                statusLabel = "Jawaban Benar";
                StatusIcon = CheckCircle2;
                statusStyle = "text-green-600 bg-green-50 border-green-200";
              } else {
                statusLabel = "Jawaban Salah";
                StatusIcon = XCircle;
                statusStyle = "text-red-600 bg-red-50 border-red-200";
              }

              return (
                <div
                  key={question.id_soal || index}
                  className="flex flex-col gap-4"
                >
                  {/* Kotak Soal */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 font-black rounded-lg text-sm">
                          Soal No. {index + 1}
                        </span>

                        <span
                          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${statusStyle}`}
                        >
                          <StatusIcon size={14} /> {statusLabel}
                        </span>
                      </div>
                    </div>

                    {/* Teks Soal */}
                    <div
                      className="text-slate-800 font-medium text-lg leading-relaxed mb-8"
                      dangerouslySetInnerHTML={{ __html: question.text_soal }}
                    />

                    {/* DAFTAR OPSI JAWABAN LENGKAP */}
                    <div className="flex flex-col gap-3">
                      {/* GUARD: Pastikan array options tersedia sebelum di-map */}
                      {question.options && Array.isArray(question.options) ? (
                        question.options.map((opsi) => {
                          const isCorrectAnswer = opsi.is_correct;

                          // PENTING: Cek dahulu apakah user_answer valid sebelum parseInt
                          const userAnswerNum =
                            question.user_answer !== null &&
                            question.user_answer !== undefined
                              ? parseInt(question.user_answer)
                              : NaN;

                          const isUserChoice =
                            !isNaN(userAnswerNum) &&
                            userAnswerNum === parseInt(opsi.id_jawaban);

                          let optionStyle =
                            "border-slate-200 bg-white text-slate-700";
                          let IconToShow = null;

                          // Jika Opsi ini adalah jawaban yang benar
                          if (isCorrectAnswer) {
                            optionStyle =
                              "border-green-500 bg-green-50 text-green-800 shadow-sm ring-1 ring-green-500";
                            IconToShow = (
                              <CheckCircle2
                                size={18}
                                className="text-green-600"
                              />
                            );
                          }
                          // Jika Opsi ini dipilih user TAPI salah
                          else if (isUserChoice && !isCorrectAnswer) {
                            optionStyle =
                              "border-red-400 bg-red-50 text-red-700";
                            IconToShow = (
                              <XCircle size={18} className="text-red-500" />
                            );
                          }

                          return (
                            <div
                              key={opsi.id_jawaban}
                              className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${optionStyle}`}
                            >
                              <span
                                className="font-medium"
                                dangerouslySetInnerHTML={{ __html: opsi.teks }}
                              />
                              {IconToShow && <div>{IconToShow}</div>}
                            </div>
                          );
                        })
                      ) : (
                        // JIKA DATA OPTIONS KOSONG DARI BACKEND
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-600 flex items-center gap-3">
                          <AlertTriangle size={20} />
                          <p className="text-sm font-medium">
                            Data opsi jawaban tidak ditemukan dari server.
                            Silakan lakukan latihan ulang.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kotak Pembahasan */}
                  <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 md:p-8 shadow-inner relative overflow-hidden ml-4 md:ml-8 mb-4">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                    <h3 className="text-blue-600 font-black text-lg flex items-center gap-2 mb-4">
                      <Lightbulb size={22} className="text-yellow-500" />
                      Pembahasan
                    </h3>

                    <div
                      className="text-slate-700 font-medium leading-relaxed prose prose-slate max-w-none text-sm md:text-base"
                      dangerouslySetInnerHTML={{
                        __html:
                          question.pembahasan_text ||
                          "Tidak ada detail pembahasan untuk soal ini.",
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
