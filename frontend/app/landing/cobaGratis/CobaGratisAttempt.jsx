import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { slugify } from "../../utils/slugify";
import QuestionCard from "../../components/DashboardSubcriber/Features/Exam/Components/QuestionCard";
import { publicService } from "../../services/publicService";
import { AlertCircle } from "lucide-react";

// --- KOMPONEN LOADING ---
function LoadingQuestions() {
  return (
    <div className="w-full py-20 flex justify-center items-center h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold text-lg animate-pulse">
          Menyiapkan Simulasi...
        </p>
      </div>
    </div>
  );
}

export default function CobaGratisAttempt() {
  const navigate = useNavigate();
  const { label } = useParams();

  // State Lokal (Tanpa Context Database)
  const [answers, setAnswers] = useState({});
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [paketData, setPaketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH QUESTIONS DARI PUBLIC API ---
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const responseList = await publicService.getDemoExam();
        const paketFound = responseList.find(
          (item) => slugify(item.nama_paket) === label,
        );

        if (!paketFound) {
          setError("Paket coba gratis tidak ditemukan");
          setLoading(false);
          return;
        }

        setPaketData(paketFound);

        // Map soal dari API publik & Batasi maksimal 10 soal untuk demo
        const formattedQuestions = paketFound.soal
          .slice(0, 10)
          .map((soal, index) => {
            return {
              id: soal.id_soal,
              index: index,
              text_soal: soal.text_soal,
              jenis_soal: soal.jenis_soal,
              options:
                soal.opsi_jawaban.map((opt) => ({
                  id_jawaban: opt.id_jawaban,
                  opsi_jawaban_text: opt.teks,
                  is_correct: opt.is_correct, // Disimpan diam-diam di state untuk Local Grading
                })) || [],
              deskripsi: soal.deskripsi || "",
              paketId: paketFound.id_paket,
            };
          });

        setQuestions(formattedQuestions);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat soal simulasi");
      } finally {
        setLoading(false);
      }
    };

    if (label) fetchQuestions();
  }, [label]);

  // --- HANDLERS DENGAN BROWSER NATIVE ALERT/CONFIRM ---

  const handleAnswerChange = useCallback((idx, val) => {
    // Hanya simpan di state memori browser
    setAnswers((prev) => ({ ...prev, [idx]: val }));
  }, []);

  const handleConfirmExit = () => {
    const isConfirmed = window.confirm(
      "Yakin ingin keluar?\n\nKarena ini adalah mode Coba Gratis, progres pengerjaanmu tidak akan disimpan.",
    );
    if (isConfirmed) {
      navigate("/coba-gratis");
    }
  };

  const handleSubmitExam = () => {
    // 1. LOCAL GRADING (Penilaian di Frontend)
    let correctCount = 0;
    let wrongCount = 0;
    let blankCount = 0;
    const totalQuestions = questions.length;

    questions.forEach((q, i) => {
      const userAnswerId = answers[i];
      if (!userAnswerId) {
        blankCount++;
      } else {
        const correctOption = q.options.find((opt) => opt.is_correct);
        if (correctOption && correctOption.id_jawaban === userAnswerId) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    const finalScore =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;

    const resultData = {
      score: finalScore,
      correct: correctCount,
      wrong: wrongCount,
      blank: blankCount,
      totalSoal: totalQuestions,
    };

    // 2. Arahkan ke Halaman Result
    navigate(`/coba-gratis/${label}/result`, {
      state: { results: resultData },
    });
  };

  // --- COUNTDOWN ANIMATION ---
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsCounting(false), 500);
    }
  }, [countdown]);

  const displayTitle = paketData?.nama_paket || "Demo Simulasi";

  // --- RENDER CONDITIONAL ---
  if (loading && !isCounting) return <LoadingQuestions />;

  if (error && !loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <AlertCircle size={48} className="text-red-400 mb-2" />
        <p className="text-lg font-bold text-slate-600">{error}</p>
        <button
          onClick={() => navigate("/coba-gratis")}
          className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-screen bg-slate-50 font-sans antialiased pb-20">
      {/* OVERLAY COUNTDOWN */}
      {isCounting && (
        <div className="fixed inset-0 z-[500] bg-white flex flex-col items-center justify-center transition-all">
          <div className="text-[12rem] font-black text-blue-600 animate-in zoom-in duration-500">
            {countdown > 0 ? countdown : "GO!"}
          </div>
          <p className="text-slate-500 font-bold mt-4 uppercase tracking-widest">
            Mode Coba Gratis
          </p>
        </div>
      )}

      {/* HEADER & KEMBALI */}
      <nav className="w-full px-5 md:px-7.5 py-4 border-b border-slate-200 bg-white sticky top-0 z-40 flex justify-between items-center shadow-sm">
        <button
          className="text-slate-500 hover:text-blue-600 font-bold text-sm flex items-center gap-2 transition-colors"
          onClick={handleConfirmExit}
        >
          ← Keluar Simulasi
        </button>
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md uppercase tracking-widest border border-blue-100">
          Demo Mode
        </span>
      </nav>

      <div className="px-5 md:px-7.5 py-8 flex flex-col gap-6 max-w-4xl mx-auto">
        {/* JUDUL PAKET */}
        <div className="w-full border border-slate-200 py-6 px-8 rounded-2xl bg-white flex justify-between items-center shadow-sm">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">
              Paket Soal
            </span>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">
              {displayTitle}
            </h1>
          </div>
        </div>

        {/* LIST SOAL MENGGUNAKAN COMPONENT ASLI */}
        <div className="flex flex-col gap-5">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              index={i}
              question={q}
              onAnswer={handleAnswerChange}
              selectedAnswer={answers[i]} // Karena kita pakai index sbg key
              hideActions={true}
              onBookmark={() => {}}
              onReport={() => {}}
            />
          ))}
        </div>

        {/* TOMBOL SUBMIT */}
        <div className="w-full flex justify-end py-5 mt-4">
          <button
            onClick={handleSubmitExam}
            disabled={questions.length === 0}
            className="w-full md:w-auto px-12 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 active:scale-95 disabled:bg-slate-300 transition-all"
          >
            Selesai & Cek Nilai
          </button>
        </div>
      </div>
    </div>
  );
}
