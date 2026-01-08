import React, { useState, useMemo, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { slugify, humanizeSlug } from "../../../../utils/slugify";
import QuestionCard from "./Components/QuestionCard";
import GuideModal from "../../Common/GuideModal";
import ActionModal from "../../Common/ActionModal";
import SaveToFolderModal from "./Components/SaveToFolderModal";
import { useAuth } from "../../../../context/AuthContext";
import { useFolder } from "../../../../context/FolderContext";
import { HelpCircle, Timer, CheckCircle2 } from "lucide-react";

// Dataset Statis tetap diperlukan
const DATA_UJIAN_LATIHAN = [
  { id: "lat-1", label: "Tes Bahasa Inggris: Structure & Usage" },
  { id: "lat-2", label: "Tryout Matematika Saintek" },
];

const DATA_UJIAN_STATUS = [
  { id: "st-1", label: "Paket Soal 1 - Logika Dasar" },
  { id: "st-2", label: "Paket Soal 2 - TPA Kuantitatif" },
  { id: "st-3", label: "Ujian Logika Dasar Sekolah Menengah Atas" },
];

export async function loader({ params, request }) {
  const labelParam = params.label;
  const url = request?.url ?? "";
  if (url.includes("/dashboard-subscriber/tersimpan/")) {
    return { mode: "folder", folderId: labelParam };
  }
  const allExams = [...DATA_UJIAN_LATIHAN, ...DATA_UJIAN_STATUS];
  const examFound = allExams.find((e) => slugify(e.label) === labelParam);
  return { mode: "package", exam: examFound || { label: params.label } };
}

export default function ExamAttempt() {
  const navigate = useNavigate();
  const loaderResult = useLoaderData();
  const { showAlert } = useAuth();
  const {
    availableQuestions,
    folders,
    saveQuestionToFolder,
    addFolder,
    setProgress,
  } = useFolder();

  // State
  const [answers, setAnswers] = useState({});
  const [targetQuestionId, setTargetQuestionId] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'save', 'exit', 'submit', 'guide'
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(true);

  const displayedQuestions = useMemo(() => {
    if (loaderResult.mode === "folder") {
      const folderSoalIds = folders
        .filter(
          (f) =>
            String(f.id_folder) === String(loaderResult.folderId) &&
            f.id_soal !== null
        )
        .map((f) => String(f.id_soal));
      return availableQuestions.filter((q) =>
        folderSoalIds.includes(String(q.id))
      );
    }
    return availableQuestions;
  }, [loaderResult, availableQuestions, folders]);

  const uniqueFolders = useMemo(() => {
    return folders.reduce((acc, current) => {
      if (!acc.find((item) => item.id_folder === current.id_folder)) {
        const count = folders.filter(
          (f) => f.id_folder === current.id_folder && f.id_soal !== null
        ).length;
        acc.push({ ...current, count });
      }
      return acc;
    }, []);
  }, [folders]);

  const totalQuestions = displayedQuestions.length;
  const totalAnswered = Object.keys(answers).length;
  const displayTitle =
    loaderResult.mode === "folder"
      ? folders.find(
          (f) => String(f.id_folder) === String(loaderResult.folderId)
        )?.folder_name || "Latihan Folder"
      : loaderResult.exam?.id
        ? loaderResult.exam.label
        : humanizeSlug(loaderResult.exam?.label, { capitalize: true });

  // --- HANDLERS ---
  const handleFinishSave = () => {
    if (selectedFolder && targetQuestionId) {
      saveQuestionToFolder(
        targetQuestionId,
        selectedFolder.id_folder,
        selectedFolder.folder_name
      );
      setActiveModal(null);
      setSelectedFolder(null);
      showAlert("Soal berhasil disimpan!", "success");
    }
  };

  const handleConfirmExit = () => {
    const id =
      loaderResult.mode === "folder"
        ? loaderResult.folderId
        : loaderResult.exam?.id;
    if (id) setProgress(id, totalAnswered);
    navigate(-1);
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    displayedQuestions.forEach((q, index) => {
      if (answers[index] === q.options[q.correctAnswer]) correctCount++;
    });
    const results = {
      score: Math.round((correctCount / totalQuestions) * 100),
      correct: correctCount,
      wrong: totalAnswered - correctCount,
      unanswered: totalQuestions - totalAnswered,
      totalSoal: totalQuestions,
      examLabel: displayTitle,
    };
    const id =
      loaderResult.mode === "folder"
        ? loaderResult.folderId
        : loaderResult.exam?.id;
    if (id) setProgress(id, totalAnswered);
    navigate("../result", { state: { results }, relative: "path" });
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsCounting(false), 500);
    }
  }, [countdown]);

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
              onAnswer={(idx, val) => setAnswers((s) => ({ ...s, [idx]: val }))}
              selectedAnswer={answers[i]}
              onBookmark={(id) => {
                setTargetQuestionId(id);
                setActiveModal("save");
              }}
            />
          ))}
        </div>

        <div className="w-full flex justify-end py-5">
          <button
            onClick={() => setActiveModal("submit")}
            disabled={totalQuestions === 0}
            className="px-12 py-4 bg-primary text-white font-bold rounded-xl active:scale-95 disabled:bg-slate-300"
          >
            Selesai
          </button>
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      <SaveToFolderModal
        isOpen={activeModal === "save"}
        onClose={() => setActiveModal(null)}
        folders={uniqueFolders}
        onAddFolder={(name) => addFolder(name)}
        onSelectFolder={setSelectedFolder}
        selectedFolder={selectedFolder}
        onSave={handleFinishSave}
      />

      <ActionModal
        isOpen={activeModal === "submit"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleSubmitExam}
        title="Kumpulkan Jawaban?"
        description={`Kamu telah menjawab ${totalAnswered} dari ${totalQuestions} soal.`}
        icon={CheckCircle2}
        iconClass="bg-emerald-50 text-emerald-500"
        confirmText="Ya, Kumpulkan"
        confirmClass="bg-emerald-500 shadow-emerald-200"
      />

      <ActionModal
        isOpen={activeModal === "exit"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleConfirmExit}
        title="Keluar dari Ujian?"
        description={`Progres Anda ${totalAnswered} soal akan disimpan secara otomatis.`}
        icon={HelpCircle}
        iconClass="bg-amber-50 text-amber-500"
        confirmText="Simpan & Keluar"
        confirmClass="bg-slate-900 shadow-slate-200"
      />

      {activeModal === "guide" && (
        <GuideModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
