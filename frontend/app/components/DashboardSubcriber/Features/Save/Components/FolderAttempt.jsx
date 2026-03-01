import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionCard from "../../Exam/Components/QuestionCard";
import GuideModal from "../../../Common/GuideModal";
import ActionModal from "../../../Common/ActionModal";
import { useAuth } from "../../../../../context/AuthContext";
import { useFolder } from "../../../../../context/FolderContext";
import { saveService } from "../../../../../services/subscriber";
import { HelpCircle, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

function LoadingQuestions() {
  return (
    <div className="w-full py-20 flex justify-center items-center h-screen bg-slate-50/30">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold text-lg animate-pulse">
          Mempersiapkan soal latihan...
        </p>
      </div>
    </div>
  );
}

export default function FolderAttempt() {
  const navigate = useNavigate();
  const { label } = useParams();
  const slug = label;
  const { showAlert } = useAuth();

  const { saveExamAnswers, getExamAnswers, clearExamAnswers } = useFolder();

  const [answers, setAnswers] = useState({});
  const [activeModal, setActiveModal] = useState(null);

  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [folderData, setFolderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH QUESTIONS DARI FOLDER ---
  useEffect(() => {
    const fetchFolderQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await saveService.getFolderQuestions(slug);

        if (response.status === "error") {
          throw new Error(response.message || "Gagal memuat soal folder.");
        }

        setFolderData({
          id: response.data.folderId,
          name:
            response.data.folderName ||
            (slug === "umum" ? "Favorit Umum" : "Folder Latihan"),
        });

        if (response.data && response.data.soal) {
          const formattedQuestions = response.data.soal.map((soal, index) => {
            return {
              id: soal.id_soal,
              index: index,
              text_soal: soal.text_soal,
              jenis_soal: soal.jenis_soal,
              options: soal.options || [],
              correctAnswer: 0,
              deskripsi: soal.deskripsi || "",
            };
          });

          setQuestions(formattedQuestions);

          // Resume dari LocalStorage
          const savedAnswers = getExamAnswers(`folder-${slug}`);
          if (savedAnswers && Object.keys(savedAnswers).length > 0) {
            setAnswers(savedAnswers);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Gagal memuat soal latihan.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchFolderQuestions();
  }, [slug]); // Hanya re-run jika slug berubah, jangan tambahkan getExamAnswers di mari

  // --- HANDLER ANSWERS ---
  const handleAnswerChange = useCallback(
    (idx, val) => {
      // PERBAIKAN 1: Gunakan callback updater function untuk memastikan state selalu up-to-date
      setAnswers((prevAnswers) => {
        const newAnswers = { ...prevAnswers, [idx]: val };
        saveExamAnswers(`folder-${slug}`, newAnswers);
        return newAnswers;
      });
    },
    [slug, saveExamAnswers],
  );

  // --- SUBMIT LOGIC ---
  const executeSubmit = async () => {
    try {
      setIsSubmitting(true);

      // PERBAIKAN 2: Jika state 'answers' kosong karena delay render,
      // ambil nilai terakhir yang terekam di LocalStorage.
      let finalAnswersToSubmit = answers;
      if (Object.keys(finalAnswersToSubmit).length === 0) {
        finalAnswersToSubmit = getExamAnswers(`folder-${slug}`) || {};
      }

      console.log("Menyerahkan jawaban (Frontend):", finalAnswersToSubmit);

      const payload = {
        folderSlug: slug,
        answers: finalAnswersToSubmit,
      };

      const response = await saveService.submitFolderPractice(payload);

      if (response.status === "success") {
        clearExamAnswers(`folder-${slug}`);
        showAlert("Latihan selesai! Mari lihat hasilnya.", "success");

        navigate(`/dashboard-subscriber/tersimpan/${slug}/result`, {
          state: {
            results: response.data,
            examLabel: `Latihan: ${folderData?.name}`,
            isPracticeMode: true,
          },
        });
      }
    } catch (err) {
      console.error("Gagal submit:", err);
      showAlert("Gagal mengoreksi jawaban. Coba lagi.", "error");
      setIsSubmitting(false);
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
  const displayTitle = folderData?.name
    ? `Latihan: ${folderData.name}`
    : "Latihan Folder";

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
          Kembali ke Folder
        </button>
      </div>
    );
  }

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
                Mengoreksi jawaban Anda...
              </p>
            </div>
          )}
        </div>
      )}

      {/* STICKY HEADER TANPA TIMER */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm px-4 md:px-7.5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveModal("exit")}
            className="p-2 -ml-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-50"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
          <h1 className="text-lg md:text-xl font-bold text-slate-800 line-clamp-1">
            {displayTitle}
          </h1>
        </div>

        {/* Label Mode Latihan Santai */}
        <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider hidden md:block">
          Practice Mode
        </div>
      </div>

      {/* CONTENT SOAL */}
      <div className="px-4 md:px-7.5 py-8 flex flex-col gap-6 max-w-screen-lg mx-auto">
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
              onAnswer={(idx, val) => handleAnswerChange(q.id, val)}
              selectedAnswer={answers[q.id]}
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
          Selesai Latihan
        </button>
      </div>

      {/* MODAL KUMPULKAN JAWABAN */}
      <ActionModal
        isOpen={activeModal === "submit"}
        onClose={() => setActiveModal(null)}
        onConfirm={() => {
          setActiveModal(null);
          executeSubmit();
        }}
        title="Kumpulkan Latihan?"
        description={`Kamu telah menjawab ${Object.keys(answers).length} dari ${questions.length} soal. Nilai latihan ini tidak akan direkam di riwayat utamamu.`}
        icon={CheckCircle2}
        iconClass="bg-emerald-50 text-emerald-500"
        confirmText="Ya, Lihat Hasil"
        confirmClass="bg-emerald-500"
      />

      {/* MODAL KELUAR */}
      <ActionModal
        isOpen={activeModal === "exit"}
        onClose={() => setActiveModal(null)}
        onConfirm={() => navigate(-1)}
        title="Akhiri Latihan?"
        description="Jawabanmu saat ini tersimpan di browser, tapi belum dikoreksi."
        icon={HelpCircle}
        iconClass="bg-amber-50 text-amber-500"
        confirmText="Keluar"
        confirmClass="bg-slate-900"
      />

      {/* MODAL PANDUAN */}
      {activeModal === "guide" && (
        <GuideModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
