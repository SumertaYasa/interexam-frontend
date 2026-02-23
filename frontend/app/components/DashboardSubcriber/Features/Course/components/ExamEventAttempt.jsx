import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { slugify } from "../../../../../utils/slugify";
import QuestionCard from "../../Exam/Components/QuestionCard";
import GuideModal from "../../../Common/GuideModal";
import ActionModal from "../../../Common/ActionModal";
import { useAuth } from "../../../../../context/AuthContext";
import { useFolder } from "../../../../../context/FolderContext";
import { courseService } from "../../../../../services/subscriber";
import { HelpCircle, CheckCircle2, Clock, AlertCircle } from "lucide-react";

function LoadingQuestions() {
  return (
    <div className="w-full py-20 flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold text-lg animate-pulse">
          Mempersiapkan soal & waktu...
        </p>
      </div>
    </div>
  );
}

export default function ExamEventAttempt() {
  const navigate = useNavigate();
  const { eventLabel, label } = useParams();
  const { showAlert } = useAuth();

  const { setProgress, saveExamAnswers, getExamAnswers, clearExamAnswers } =
    useFolder();

  const [answers, setAnswers] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [paketData, setPaketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [paketId, setPaketId] = useState(null);
  const [eventId, setEventId] = useState(null);

  // --- TIMER STATE ---
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH QUESTIONS & TIME ---
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Dapatkan ID Event dari slug
        const allEvents = await courseService.getAllEvents();
        const currentEvent = allEvents.find(
          (e) => slugify(e.title) === eventLabel,
        );

        if (!currentEvent) throw new Error("Event tidak ditemukan");
        setEventId(currentEvent.id);

        // 2. Dapatkan ID Paket dari slug
        const responseList = await courseService.getAllPaketsWithProgress();
        const items =
          responseList && Array.isArray(responseList.data)
            ? responseList.data
            : [];
        const currentPaket = items.find(
          (item) => slugify(item.label || item.nama_paket) === label,
        );

        if (!currentPaket) throw new Error("Paket soal tidak ditemukan");

        const currentPaketId = currentPaket.id || currentPaket.id_paket_soal;
        setPaketId(currentPaketId);
        setPaketData(currentPaket);

        // 3. Panggil Endpoint Khusus Event (Membawa Global Timer)
        const detailResponse = await courseService.getEventPaketDetail(
          currentEvent.id,
          currentPaketId,
        );

        if (detailResponse.status === "error" || detailResponse.is_locked) {
          showAlert(detailResponse.message || "Akses ditolak.", "error");
          navigate(-1);
          return;
        }

        if (detailResponse.is_time_up) {
          showAlert("Waktu pengerjaan event telah habis.", "error");
          navigate(-1);
          return;
        }

        // Set Waktu dari Backend
        setTimeRemaining(detailResponse.data.sisa_waktu_detik);

        // Format Soal
        if (detailResponse.data && detailResponse.data.soal_paket_soal) {
          const formattedQuestions = detailResponse.data.soal_paket_soal.map(
            (item, index) => {
              const soal = item.soal;
              return {
                id: soal.id_soal,
                index: index,
                text_soal: soal.text_soal,
                jenis_soal: soal.jenis_soal,
                options: soal.options || [],
                correctAnswer: 0,
                deskripsi: soal.deskripsi || "",
                paketId: currentPaketId,
              };
            },
          );

          setQuestions(formattedQuestions);

          // Load Jawaban Tersimpan (Resume Local)
          const savedAnswers = getExamAnswers(String(currentPaketId));
          if (Object.keys(savedAnswers).length > 0) {
            setAnswers(savedAnswers);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Gagal memuat soal ujian");
      } finally {
        setLoading(false);
      }
    };

    if (label && eventLabel) fetchEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, eventLabel]);

  // --- LOGIC GLOBAL TIMER MENGHITUNG MUNDUR ---
  useEffect(() => {
    // Jangan mulai timer jika masih loading, countdown awal, atau sedang disubmit
    if (timeRemaining === null || isCounting || isSubmitting) return;

    if (timeRemaining <= 0) {
      handleAutoSubmit();
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeRemaining, isCounting, isSubmitting]);

  // --- FORMAT TIMER UNTUK UI ---
  const formatTime = (seconds) => {
    if (seconds === null || seconds < 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h.toString().padStart(2, "0") + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- HANDLER ANSWERS ---
  const handleAnswerChange = useCallback(
    (idx, val) => {
      const newAnswers = { ...answers, [idx]: val };
      setAnswers(newAnswers);
      if (paketId) saveExamAnswers(String(paketId), newAnswers);
      // Optional: Auto-save ke backend secara silent setiap beberapa jawaban
      // if (Object.keys(newAnswers).length % 5 === 0) courseService.saveProgress(paketId, newAnswers);
    },
    [answers, paketId, saveExamAnswers],
  );

  // --- SUBMIT LOGIC ---
  const executeSubmit = async (isAutoSubmit = false) => {
    try {
      setIsSubmitting(true);
      if (!isAutoSubmit) setLoading(true);

      const response = await courseService.submitExam(
        paketId,
        answers,
        eventId,
      );

      if (response.status === "success") {
        if (paketId) {
          clearExamAnswers(String(paketId));
          setProgress(String(paketId), Object.keys(answers).length);
        }

        if (isAutoSubmit) {
          showAlert("Waktu Habis! Jawaban otomatis dikumpulkan.", "warning");
        } else {
          showAlert("Ujian berhasil dikumpulkan!", "success");
        }

        navigate(-1);
      }
    } catch (err) {
      showAlert(
        "Gagal mengumpulkan jawaban. Sistem akan mencoba lagi.",
        "error",
      );
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleSubmitExam = () => {
    setActiveModal(null);
    executeSubmit(false);
  };

  const handleAutoSubmit = () => {
    if (!isSubmitting) {
      executeSubmit(true);
    }
  };

  // --- COUNTDOWN AWAL (GO!) ---
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsCounting(false), 500);
    }
  }, [countdown]);

  // --- RENDERING ---
  const displayTitle =
    paketData?.label || paketData?.nama_paket || "Paket Soal Event";

  if (loading && !isCounting && !isSubmitting) return <LoadingQuestions />;

  if (error && !loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-lg font-bold text-slate-700">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
        >
          Kembali
        </button>
      </div>
    );
  }

  const isTimeCritical = timeRemaining !== null && timeRemaining <= 300; // Merah jika sisa <= 5 menit

  return (
    <div className="w-full relative min-h-screen bg-slate-50/30 font-sans antialiased pb-24">
      {/* OVERLAY COUNTDOWN & SUBMITTING */}
      {(isCounting || isSubmitting) && (
        <div className="fixed inset-0 z-[500] bg-white flex flex-col items-center justify-center transition-all">
          {isCounting ? (
            <div className="text-[12rem] font-black text-primary animate-in zoom-in duration-500">
              {countdown > 0 ? countdown : "GO!"}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 animate-in fade-in">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl font-bold text-slate-700">
                Mengumpulkan jawaban Anda...
              </p>
            </div>
          )}
        </div>
      )}

      {/* STICKY HEADER & TIMER */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm px-4 md:px-7.5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 md:w-10">
            <img src="/interexam-logo.svg" className="w-full" alt="Logo" />
          </div>
          <h1 className="text-lg md:text-xl font-bold uppercase text-slate-800 hidden md:block line-clamp-1">
            {displayTitle}
          </h1>
        </div>

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg md:text-xl transition-colors ${
            isTimeCritical
              ? "bg-red-100 text-red-600 animate-pulse"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          <Clock
            size={20}
            className={isTimeCritical ? "text-red-500" : "text-slate-500"}
          />
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* CONTENT SOAL */}
      <div className="px-4 md:px-7.5 py-8 flex flex-col gap-6 max-w-screen-lg mx-auto">
        {/* Header Title (Mobile) */}
        <div className="md:hidden flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold uppercase text-slate-800 line-clamp-2">
            {displayTitle}
          </h1>
          <button
            onClick={() => setActiveModal("guide")}
            className="p-2 text-slate-400 hover:text-primary bg-white rounded-full shadow-sm"
          >
            <HelpCircle size={20} />
          </button>
        </div>

        {/* Bantuan (Desktop) ditaruh di atas soal pertama */}
        <div className="hidden md:flex justify-end w-full">
          <button
            onClick={() => setActiveModal("guide")}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
          >
            <HelpCircle size={16} /> Petunjuk Pengerjaan
          </button>
        </div>

        {/* List Soal */}
        <div className="flex flex-col gap-5">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              index={i}
              question={q}
              onAnswer={handleAnswerChange}
              selectedAnswer={answers[i]}
              hideActions={true}
              onBookmark={() => {}}
              onReport={() => {}}
            />
          ))}
        </div>
      </div>

      {/* FLOATING SUBMIT BUTTON (Bottom) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 px-4 md:px-7.5 flex justify-between items-center z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="text-sm font-medium text-slate-500">
          Terjawab:{" "}
          <span className="font-bold text-slate-800">
            {Object.keys(answers).length}
          </span>{" "}
          / {questions.length}
        </div>
        <button
          onClick={() => setActiveModal("submit")}
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl active:scale-95 hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          Selesai Mengerjakan
        </button>
      </div>

      {/* MODAL KUMPULKAN JAWABAN */}
      <ActionModal
        isOpen={activeModal === "submit"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleSubmitExam}
        title="Kumpulkan Ujian Sekarang?"
        description={`Kamu telah menjawab ${Object.keys(answers).length} dari ${questions.length} soal. Waktu sisa Anda: ${formatTime(timeRemaining)}. Pastikan semua jawaban sudah benar.`}
        icon={CheckCircle2}
        iconClass="bg-emerald-50 text-emerald-500"
        confirmText="Ya, Kumpulkan"
        confirmClass="bg-emerald-500"
      />

      {/* MODAL PANDUAN */}
      {activeModal === "guide" && (
        <GuideModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
