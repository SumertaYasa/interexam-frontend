import React, { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { humanizeSlug } from "../../../../utils/slugify";
import QuestionCard from "./QuestionCard";
import GuideModal from "../../Common/GuideModal";
import { useAuth } from "../../../../context/AuthContext";
import { Plus, Check, HelpCircle } from "lucide-react";

const MOCK_QUESTIONS = [
  {
    id: "q1",
    text: "She _______ to the market when it started to rain.",
    options: ["go", "goes", "went", "was going"],
  },
  {
    id: "q2",
    text: "Choose the correct sentence:",
    options: ["He don't like coffee.", "He doesn't like coffee."],
  },
  {
    id: "q3",
    text: "If I _______ enough money, I would buy a new phone.",
    options: ["have", "had", "would have"],
  },
];

export async function loader({ params }) {
  return {
    exam: { label: params.label || "Ujian" },
    questions: MOCK_QUESTIONS,
  };
}

export default function ExamAttempt() {
  const { exam, questions } = useLoaderData() || { exam: {}, questions: [] };
  const { folders, saveQuestionToFolder, addFolder, showAlert } = useAuth();

  const [answers, setAnswers] = useState({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [targetQuestionId, setTargetQuestionId] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const uniqueFolders = folders.reduce((acc, current) => {
    const existing = acc.find((item) => item.id_folder === current.id_folder);
    if (!existing) {
      const count = folders.filter(
        (f) => f.id_folder === current.id_folder && f.id_soal !== null
      ).length;
      return acc.concat([{ ...current, count }]);
    }
    return acc;
  }, []);

  const handleFinishSave = () => {
    if (selectedFolder && targetQuestionId) {
      const isDuplicate = folders.some(
        (f) =>
          f.id_folder === selectedFolder.id_folder &&
          f.id_soal === targetQuestionId
      );

      if (isDuplicate) {
        showAlert(
          `Soal ini sudah tersimpan di folder ${selectedFolder.folder_name}`,
          "error"
        );
        return;
      }

      saveQuestionToFolder(
        targetQuestionId,
        selectedFolder.id_folder,
        selectedFolder.folder_name
      );
      setShowSaveModal(false);
      setSelectedFolder(null);
    }
  };

  let humanizedLabel = humanizeSlug(exam.label, { capitalize: true });

  return (
    <div className="w-full relative min-h-screen bg-slate-50/30">
      <Link
        className="block m-7-5 text-gray-500 hover:text-primary transition-colors font-medium"
        to={-1}
      >
        Kembali
      </Link>

      <div className="px-7.5 py-5 flex flex-col gap-5">
        {/* HEADER DENGAN IKON PANDUAN */}
        <div className="w-full border  py-5 px-7 rounded-xl bg-white flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-bold uppercase text-gray-800">
            {humanizedLabel}
          </h1>
          <div className="group relative flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Panduan tes
            </span>
            <button
              onClick={() => setShowGuideModal(true)}
              className="p-1 text-gray-500 hover:text-primary transition-all"
            >
              <HelpCircle size={22} />
            </button>
          </div>
        </div>

        {/* LIST PERTANYAAN */}
        <div className="flex flex-col gap-4">
          {questions.map((q, i) => (
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

        {/* TOMBOL SELESAI */}
        <div className="w-full flex justify-end py-5 px-2">
          <button className="px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            Selesai
          </button>
        </div>
      </div>

      {/* RENDER MODAL PANDUAN */}
      {showGuideModal && (
        <GuideModal onClose={() => setShowGuideModal(false)} />
      )}

      {/* RENDER MODAL SIMPAN */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-[380px] bg-white rounded-3xl shadow-2xl p-7 relative animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-5 text-gray-900">
              Simpan ke Folder
            </h2>

            <button
              onClick={() => {
                const name = prompt("Nama folder baru:");
                if (name) addFolder(name);
              }}
              className="flex items-center gap-3 w-full p-4 hover:bg-primary/5 rounded-2xl mb-5 text-primary font-bold border-2 border-dashed border-primary/20 transition-all"
            >
              <Plus size={20} /> Buat folder baru
            </button>

            <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {uniqueFolders.map((folder) => (
                <div
                  key={folder.id_folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`flex justify-between items-center p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                    selectedFolder?.id_folder === folder.id_folder
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div>
                    <p className="font-bold text-gray-800">
                      {folder.folder_name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
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
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-3.5 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleFinishSave}
                className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
