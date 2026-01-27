import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { slugify, humanizeSlug } from "../../../../utils/slugify";
import QuestionCard from "./Components/QuestionCard";
import GuideModal from "../../Common/GuideModal";
import ActionModal from "../../Common/ActionModal";
import SaveToFolderModal from "./Components/SaveToFolderModal";
import ReportModal from "./Components/ReportModal";
import { useAuth } from "../../../../context/AuthContext";
import { useFolder } from "../../../../context/FolderContext";
import { courseService } from "../../../../services/subscriber";
import { HelpCircle, Timer, CheckCircle2 } from "lucide-react";

function LoadingQuestions() {
  return (
    <div className="w-full py-20 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold text-lg animate-pulse">
          Memuat soal...
        </p>
      </div>
    </div>
  );
}

export default function ExamAttempt() {
  const navigate = useNavigate();
  const { label } = useParams();
  const location = useLocation();
  const { showAlert } = useAuth();
  const {
    folders,
    saveQuestionToFolder,
    addFolder,
    setProgress,
    saveExamAnswers,
    getExamAnswers,
    clearExamAnswers,
  } = useFolder();

  const [answers, setAnswers] = useState({});
  const [targetQuestionId, setTargetQuestionId] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [reportQuestionIdx, setReportQuestionIdx] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [paketData, setPaketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paketId, setPaketId] = useState(null);

  const getMode = () => {
    if (
      location.pathname.includes("/dashboard-subscriber/status-ujian-terakhir/")
    ) {
      return "status";
    } else if (location.pathname.includes("/dashboard-subscriber/tersimpan/")) {
      return "folder";
    }
    return "latihan";
  };

  const mode = getMode();

  // --- FETCH QUESTIONS FROM PACKAGE ---
  // PERBAIKAN: Hapus getExamAnswers dari dependency array agar tidak re-fetch saat menjawab
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await courseService.getAllPaketsWithProgress();
        const items =
          response && Array.isArray(response.data) ? response.data : [];

        const paket = items.find(
          (item) => slugify(item.label || item.nama_paket) === label,
        );

        if (!paket) {
          setError("Paket soal tidak ditemukan");
          setLoading(false);
          return;
        }

        const currentPaketId = paket.id || paket.id_paket_soal;
        setPaketId(currentPaketId);
        setPaketData(paket);

        const paketDetail = await courseService.getPaketDetail(currentPaketId);

        if (paketDetail && paketDetail.soal_paket_soal) {
          const formattedQuestions = paketDetail.soal_paket_soal.map(
            (item, index) => {
              const soal = item.soal;
              return {
                id: soal.id_soal,
                index: index,
                text_soal: soal.text_soal,
                options: [
                  soal.option_a || "",
                  soal.option_b || "",
                  soal.option_c || "",
                  soal.option_d || "",
                  soal.option_e || "",
                ].filter((opt) => opt !== ""),
                correctAnswer: 0,
                deskripsi: soal.deskripsi || "",
                paketId: currentPaketId,
              };
            },
          );

          setQuestions(formattedQuestions);

          // Restore saved answers HANYA sekali saat paket pertama kali dimuat
          const savedAnswers = getExamAnswers(String(currentPaketId));
          if (Object.keys(savedAnswers).length > 0) {
            setAnswers(savedAnswers);
          }
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.message || "Gagal memuat soal");
      } finally {
        setLoading(false);
      }
    };

    if (label) {
      fetchQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]); // Hanya berjalan jika label berubah (pindah paket)

  // --- HANDLER JAWABAN ---
  const handleAnswerChange = useCallback(
    (idx, val) => {
      // Update state lokal secara instan tanpa memicu loading
      setAnswers((prev) => {
        const next = { ...prev, [idx]: val };
        // Simpan ke context setelah state terupdate
        if (paketId) {
          saveExamAnswers(String(paketId), next);
        }
        return next;
      });
    },
    [paketId, saveExamAnswers],
  );

  // --- HANDLERS LAINNYA ---
  const handleFinishSave = async () => {
    if (selectedFolder && targetQuestionId) {
      try {
        saveQuestionToFolder(
          targetQuestionId,
          selectedFolder.id_folder,
          selectedFolder.folder_name,
        );
        setActiveModal(null);
        setSelectedFolder(null);
        showAlert("Soal berhasil disimpan!", "success");
      } catch (err) {
        showAlert("Gagal menyimpan soal", "error");
      }
    }
  };

  const handleConfirmExit = async () => {
    try {
      if (mode !== "folder" && paketId) {
        await courseService.saveProgress(paketId, answers);
      }
      if (paketId) setProgress(String(paketId), Object.keys(answers).length);
      navigate(-1);
      showAlert("Progres pengerjaan disimpan!", "success");
    } catch (err) {
      navigate(-1);
    }
  };

  const handleSubmitExam = async () => {
    try {
      setLoading(true);
      const response = await courseService.submitExam(paketId, answers);

      if (response.status === "success") {
        const results = {
          ...response.data,
          examLabel: displayTitle,
          paketId: paketId,
        };

        if (paketId) {
          clearExamAnswers(String(paketId));
          setProgress(String(paketId), Object.keys(answers).length);
        }

        navigate("../result", { state: { results }, relative: "path" });
      }
    } catch (err) {
      showAlert("Gagal mengumpulkan jawaban. Coba lagi.", "error");
    } finally {
      setLoading(false);
      setActiveModal(null);
    }
  };

  const handleSendReport = (data) => {
    showAlert("Laporan berhasil dikirim, terima kasih!", "success");
    setActiveModal(null);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsCounting(false), 500);
    }
  }, [countdown]);

  const uniqueFolders = useMemo(() => {
    return folders.reduce((acc, current) => {
      if (!acc.find((item) => item.id_folder === current.id_folder)) {
        const count = folders.filter(
          (f) => f.id_folder === current.id_folder && f.id_soal !== null,
        ).length;
        acc.push({ ...current, count });
      }
      return acc;
    }, []);
  }, [folders]);

  const displayedQuestions = useMemo(() => {
    if (mode === "folder") {
      const folderSoalIds = folders
        .filter(
          (f) => String(f.id_folder) === String(label) && f.id_soal !== null,
        )
        .map((f) => String(f.id_soal));
      return questions.filter((q) => folderSoalIds.includes(String(q.id)));
    }
    return questions;
  }, [mode, label, questions, folders]);

  const displayTitle =
    mode === "folder"
      ? folders.find((f) => String(f.id_folder) === String(label))
          ?.folder_name || "Latihan Folder"
      : paketData?.label || paketData?.nama_paket || "Paket Soal";

  if (loading && !isCounting) return <LoadingQuestions />;

  return (
    <div className="w-full relative min-h-screen bg-slate-50/30 font-sans antialiased pb-20">
      {isCounting && (
        <div className="fixed inset-0 z-[500] bg-white flex flex-col items-center justify-center transition-all">
          <div
            key={countdown}
            className="text-[12rem] font-black text-primary animate-in zoom-in duration-500"
          >
            {countdown > 0 ? countdown : "GO!"}
          </div>
        </div>
      )}

      <button
        className="block m-7.5 text-gray-500 hover:text-primary font-bold text-sm p-4"
        onClick={() => setActiveModal("exit")}
      >
        Kembali
      </button>

      <div className="px-7.5 py-5 flex flex-col gap-5">
        <div className="w-full border py-6 px-8 rounded-[10px] bg-white flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-bold uppercase text-slate-800">
            {displayTitle}
          </h1>
          <button
            onClick={() => setActiveModal("guide")}
            className="p-1 text-slate-400 hover:text-primary transition-all"
          >
            <HelpCircle size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {displayedQuestions.map((q, i) => (
            <QuestionCard
              key={q.id}
              index={i}
              question={q}
              onAnswer={handleAnswerChange}
              selectedAnswer={answers[i]}
              onBookmark={(id) => {
                setTargetQuestionId(id);
                setActiveModal("save");
              }}
              onReport={(idx) => {
                setReportQuestionIdx(idx);
                setActiveModal("report");
              }}
            />
          ))}
        </div>

        <div className="w-full flex justify-end py-5">
          <button
            onClick={() => setActiveModal("submit")}
            disabled={questions.length === 0}
            className="px-12 py-4 bg-primary text-white font-bold rounded-xl active:scale-95 disabled:bg-slate-300"
          >
            Selesai
          </button>
        </div>
      </div>

      <SaveToFolderModal
        isOpen={activeModal === "save"}
        onClose={() => setActiveModal(null)}
        folders={uniqueFolders}
        onAddFolder={addFolder}
        onSelectFolder={setSelectedFolder}
        selectedFolder={selectedFolder}
        onSave={handleFinishSave}
      />
      <ActionModal
        isOpen={activeModal === "submit"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleSubmitExam}
        title="Kumpulkan Jawaban?"
        description={`Kamu telah menjawab ${Object.keys(answers).length} dari ${questions.length} soal.`}
        icon={CheckCircle2}
        iconClass="bg-emerald-50 text-emerald-500"
        confirmText="Ya, Kumpulkan"
        confirmClass="bg-emerald-500"
      />
      <ActionModal
        isOpen={activeModal === "exit"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleConfirmExit}
        title="Keluar dari Ujian?"
        description="Progres Anda akan disimpan secara otomatis di database agar bisa dilanjutkan nanti."
        icon={HelpCircle}
        iconClass="bg-amber-50 text-amber-500"
        confirmText="Simpan & Keluar"
        confirmClass="bg-slate-900"
      />
      {activeModal === "guide" && (
        <GuideModal onClose={() => setActiveModal(null)} />
      )}
      <ReportModal
        isOpen={activeModal === "report"}
        onClose={() => setActiveModal(null)}
        questionIndex={reportQuestionIdx}
        examTitle={displayTitle}
        onSubmit={handleSendReport}
      />
    </div>
  );
}
