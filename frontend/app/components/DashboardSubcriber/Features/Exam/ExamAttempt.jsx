import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { slugify } from "../../../../utils/slugify";
import QuestionCard from "./Components/QuestionCard";
import GuideModal from "../../Common/GuideModal";
import ActionModal from "../../Common/ActionModal";
import SaveToFolderModal from "./Components/SaveToFolderModal";
import ReportModal from "./Components/ReportModal";
import { useAuth } from "../../../../context/AuthContext";
import { useFolder } from "../../../../context/FolderContext";
import { courseService } from "../../../../services/subscriber";
import { HelpCircle, CheckCircle2 } from "lucide-react";

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
    )
      return "status";
    if (location.pathname.includes("/dashboard-subscriber/tersimpan/"))
      return "folder";
    return "latihan";
  };
  const mode = getMode();

  // --- FETCH QUESTIONS (LOGIC UTAMA YANG DIUPDATE) ---
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Ambil List Paket untuk cari ID berdasarkan Label/Slug
        const responseList = await courseService.getAllPaketsWithProgress();
        const items =
          responseList && Array.isArray(responseList.data)
            ? responseList.data
            : [];

        const paketFound = items.find(
          (item) => slugify(item.label || item.nama_paket) === label,
        );

        if (!paketFound) {
          setError("Paket soal tidak ditemukan");
          setLoading(false);
          return;
        }

        const currentPaketId = paketFound.id || paketFound.id_paket_soal;
        setPaketId(currentPaketId);
        setPaketData(paketFound);

        // 2. Ambil DETAIL Soal (Mengandung jenis_soal & options dinamis)
        const detailResponse =
          await courseService.getPaketDetail(currentPaketId);

        // Cek Gembok / Locked
        if (detailResponse?.is_locked) {
          showAlert("Konten ini terkunci. Silakan berlangganan.", "error");
          navigate(-1);
          return;
        }

        if (detailResponse && detailResponse.soal_paket_soal) {
          const formattedQuestions = detailResponse.soal_paket_soal.map(
            (item, index) => {
              const soal = item.soal;

              return {
                id: soal.id_soal,
                index: index,
                text_soal: soal.text_soal,
                jenis_soal: soal.jenis_soal,
                options: soal.options || [],

                correctAnswer: 0, // Kunci jawaban disembunyikan di BE
                deskripsi: soal.deskripsi || "",
                paketId: currentPaketId,
              };
            },
          );

          setQuestions(formattedQuestions);

          // 3. Load Jawaban Tersimpan (Resume)
          // Prioritas: LocalStorage/Context
          const savedAnswers = getExamAnswers(String(currentPaketId));
          if (Object.keys(savedAnswers).length > 0) {
            setAnswers(savedAnswers);
          }
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat soal");
      } finally {
        setLoading(false);
      }
    };

    if (label) fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  const handleAnswerChange = useCallback(
    (idx, val) => {
      // val bisa berupa string (single choice/text) atau array (multiple answer)
      const newAnswers = { ...answers, [idx]: val };
      setAnswers(newAnswers);
      if (paketId) saveExamAnswers(String(paketId), newAnswers);
    },
    [answers, paketId, saveExamAnswers],
  );

  const handleFinishSave = async () => {
    if (!targetQuestionId) return;

    let folderId = null;
    let folderName = "";

    if (selectedFolder) {
      folderId = selectedFolder.id || selectedFolder.id_folder;
      folderName = selectedFolder.nama || selectedFolder.folder_name;
    }

    try {
      await saveQuestionToFolder(targetQuestionId, folderId, folderName);
      setActiveModal(null);
      setSelectedFolder(null);
    } catch (err) {
      showAlert("Gagal menyimpan soal", "error");
    }
  };

  const handleConfirmExit = async () => {
    try {
      if (mode !== "folder" && paketId)
        await courseService.saveProgress(paketId, answers);
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
      showAlert("Gagal mengumpulkan jawaban.", "error");
    } finally {
      setLoading(false);
      setActiveModal(null);
    }
  };

  const handleSendReport = (data) => {
    showAlert("Laporan berhasil dikirim!", "success");
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

  const displayTitle =
    paketData?.label || paketData?.nama_paket || "Paket Soal";

  if (loading && !isCounting) return <LoadingQuestions />;

  // Jika error (misal tidak ditemukan)
  if (error && !loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-bold text-slate-600">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-primary font-bold hover:underline"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-screen bg-slate-50/30 font-sans antialiased pb-20">
      {isCounting && (
        <div className="fixed inset-0 z-[500] bg-white flex flex-col items-center justify-center transition-all">
          <div className="text-[12rem] font-black text-primary animate-in zoom-in duration-500">
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
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              index={i}
              question={q} // Question sudah mengandung jenis_soal & options
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
        folders={folders}
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
        description="Progres Anda akan disimpan secara otomatis."
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
