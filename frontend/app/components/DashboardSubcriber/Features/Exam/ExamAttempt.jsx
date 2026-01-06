import React, { useState, useMemo, useEffect } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { slugify, humanizeSlug } from "../../../../utils/slugify";
import QuestionCard from "./QuestionCard";
import GuideModal from "../../Common/GuideModal";
import { useAuth } from "../../../../context/AuthContext";
import { useFolder } from "../../../../context/FolderContext";
import { Plus, Check, HelpCircle, Timer } from "lucide-react";

const DATA_UJIAN_LATIHAN = [
  { id: "lat-1", label: "Tes Bahasa Inggris: Structure & Usage" },
  { id: "lat-2", label: "Tryout Matematika Saintek" },
];

const DATA_UJIAN_STATUS = [
  { id: "st-1", label: "Paket Soal 1 - Logika Dasar" },
  { id: "st-2", label: "Paket Soal 2 - TPA Kuantitatif" },
  { id: "st-3", label: "Ujian Logika Dasar Sekolah Menengah Atas" },
];

export async function loader({ params }) {
  const labelParam = params.label;

  // Mencari data asli berdasarkan slug dari URL
  const allExams = [...DATA_UJIAN_LATIHAN, ...DATA_UJIAN_STATUS];
  const examFound = allExams.find((e) => slugify(e.label) === labelParam);

  return {
    // Hanya mengirim data exam, soal diambil dari FolderContext di dalam komponen
    exam: examFound || { label: params.label },
  };
}

export default function ExamAttempt() {
  const navigate = useNavigate();
  const { exam } = useLoaderData() || { exam: {} };
  // context
  const { showAlert } = useAuth();
  const {
    availableQuestions,
    folders,
    saveQuestionToFolder,
    addFolder,
    setProgress,
  } = useFolder();

  // state soal
  const [answers, setAnswers] = useState({});
  const [targetQuestionId, setTargetQuestionId] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // state modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // state countdown
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(true);

  const uniqueFolders = useMemo(() => {
    return folders.reduce((acc, current) => {
      const existing = acc.find((item) => item.id_folder === current.id_folder);
      if (!existing) {
        const count = folders.filter(
          (f) => f.id_folder === current.id_folder && f.id_soal !== null
        ).length;
        acc.push({ ...current, count });
      }
      return acc;
    }, []);
  }, [folders]);

  const handleFinishSave = () => {
    if (selectedFolder && targetQuestionId) {
      const questionData = availableQuestions.find(
        (q) => q.id === targetQuestionId
      );

      if (!questionData) {
        showAlert("Data soal tidak ditemukan", "error");
        return;
      }

      saveQuestionToFolder(
        questionData.id,
        selectedFolder.id_folder,
        selectedFolder.folder_name
      );

      setShowSaveModal(false);
      setSelectedFolder(null);
      setTargetQuestionId(null);
    }
  };

  const totalAnswered = Object.keys(answers).length;

  const handleConfirmExit = () => {
    if (exam.id) {
      setProgress(exam.id, totalAnswered);
    }
    navigate(-1);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const startTimer = setTimeout(() => setIsCounting(false), 500);
      return () => clearTimeout(startTimer);
    }
  }, [countdown]);

  const displayTitle = exam.id
    ? exam.label
    : humanizeSlug(exam.label, { capitalize: true });

  return (
    <div className="w-full relative min-h-screen bg-slate-50/30 font-sans antialiased">
      {isCounting && (
        <div className="fixed inset-0 z-[500] bg-white flex flex-col items-center justify-center transition-all">
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
              Ujian akan dimulai dalam
            </span>
            <div
              key={countdown}
              className="text-[12rem] font-black text-primary leading-none animate-in zoom-in fade-in duration-500"
            >
              {countdown > 0 ? countdown : "GO!"}
            </div>
            <div className="mt-12 flex items-center gap-2 text-slate-400">
              <Timer size={18} />
              <span className="text-xs font-bold uppercase tracking-widest italic">
                Prepare Yourself
              </span>
            </div>
          </div>
        </div>
      )}
      <button
        className="block m-7-5 text-gray-500 hover:text-primary transition-colors font-bold text-sm tracking-tight px-7.5 py-4"
        onClick={() => setShowExitModal(true)}
      >
        Kembali
      </button>

      <div className="px-7.5 py-5 flex flex-col gap-5">
        <div className="w-full border py-6 px-8 rounded-[10px] bg-white flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-bold uppercase text-slate-800 leading-none">
            {displayTitle}
          </h1>
          <div className="group relative flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Panduan tes
            </span>
            <button
              onClick={() => setShowGuideModal(true)}
              className="p-1 text-slate-400 hover:text-primary transition-all"
            >
              <HelpCircle size={22} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Render soal dari availableQuestions milik FolderContext */}
          {availableQuestions.map((q, i) => (
            <QuestionCard
              key={q.id}
              index={i}
              question={q}
              onAnswer={(idx, val) => setAnswers((s) => ({ ...s, [idx]: val }))}
              selectedAnswer={answers[i]}
              onBookmark={(id) => {
                setTargetQuestionId(id);
                setShowSaveModal(true);
              }}
            />
          ))}
        </div>

        <div className="w-full flex justify-end py-5 px-2">
          <button
            onClick={() => showAlert("Ujian selesai dikerjakan!")}
            className="px-12 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all tracking-tight"
          >
            Selesai
          </button>
        </div>
      </div>

      {showGuideModal && (
        <GuideModal onClose={() => setShowGuideModal(false)} />
      )}

      {/* Modal Simpan tetap sama */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-[380px] bg-white rounded-3xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6 text-slate-900 tracking-tight">
              Simpan ke Folder
            </h2>
            {/* ... isi modal simpan ... */}
            <button
              onClick={() => {
                const name = prompt("Nama folder baru:");
                if (name) addFolder(name);
              }}
              className="flex items-center gap-3 w-full p-4 hover:bg-primary/5 rounded-2xl mb-6 text-primary font-bold text-sm border-2 border-dashed border-primary/20 transition-all tracking-tight"
            >
              <Plus size={20} /> Buat folder baru
            </button>

            <div className="max-h-[250px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {uniqueFolders.map((folder) => (
                <div
                  key={folder.id_folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`flex justify-between items-center p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                    selectedFolder?.id_folder === folder.id_folder
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-800 tracking-tight leading-none mb-1">
                      {folder.folder_name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium tracking-tight uppercase">
                      {folder.count} soal tersimpan
                    </p>
                  </div>
                  {selectedFolder?.id_folder === folder.id_folder && (
                    <div className="bg-primary p-1 rounded-full">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setSelectedFolder(null);
                }}
                className="flex-1 py-4 text-slate-400 font-bold text-sm tracking-tight hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleFinishSave}
                disabled={!selectedFolder}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm tracking-tight shadow-lg transition-all active:scale-95 ${
                  selectedFolder
                    ? "bg-primary text-white shadow-primary/20"
                    : "bg-slate-100 text-slate-300 shadow-none cursor-not-allowed"
                }`}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {showExitModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-[400px] bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle size={32} className="text-amber-500" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
              Keluar dari Ujian?
            </h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Anda telah menjawab <strong>{totalAnswered} soal</strong>. Progres
              Anda akan disimpan di halaman detail paket.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-3.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-xl transition-all"
              >
                Lanjutkan
              </button>
              <button
                onClick={handleConfirmExit}
                className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
              >
                Simpan & Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
