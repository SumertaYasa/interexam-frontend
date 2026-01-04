import React, { useState } from "react";
import { X, Save, Bookmark, AlertCircle, CheckSquare } from "lucide-react";

const GUIDE_STEPS = [
  {
    title: "Simpan Jawaban",
    desc: "Jawaban tersimpan otomatis saat kamu memilih opsi. Pastikan koneksi tetap stabil untuk menghindari kehilangan data.",
    icon: <Save size={48} className="text-blue-500" />,
    color: "bg-blue-500",
    buttonText: "Berikutnya",
  },
  {
    title: "Simpan Soal",
    desc: "Gunakan fitur Simpan Soal untuk menandai soal yang ingin kamu pelajari kembali atau kerjakan nanti. Soal yang disimpan akan muncul di halaman 'Tersimpan'.",
    icon: <Bookmark size={48} className="text-purple-500" />,
    color: "bg-purple-500",
    buttonText: "Berikutnya",
  },
  {
    title: "Laporkan Soal",
    desc: "Gunakan fitur Laporkan Soal bila terjadi pertanyaan yang tidak benar atau tidak adanya jawaban yang benar.",
    icon: <AlertCircle size={48} className="text-emerald-400" />,
    color: "bg-emerald-400",
    buttonText: "Berikutnya",
  },
  {
    title: "Selesai Tes",
    desc: "Tekan tombol Selesai Tes di bagian bawah setelah yakin semua soal sudah diisi. Setelah dikirim, jawaban tidak dapat diubah.",
    icon: <CheckSquare size={48} className="text-pink-500" />,
    color: "bg-pink-500",
    buttonText: "Selesai",
  },
];

export default function GuideModal({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = GUIDE_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header Warna Dinamis */}
        <div
          className={`h-12 w-full ${step.color} flex justify-end items-center px-4`}
        >
          <button onClick={onClose} className="text-white hover:opacity-80">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 flex flex-col items-center text-center gap-6">
          {/* Ikon Besar */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            {step.icon}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
            <p className="text-gray-500 leading-relaxed text-sm px-4">
              {step.desc}
            </p>
          </div>

          <div className="w-full flex justify-end mt-4">
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {step.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
