import React, { useState } from "react";
import { X } from "lucide-react";

export default function ReportModal({
  isOpen,
  onClose,
  questionIndex,
  examTitle,
  onSubmit,
}) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ category, description, questionIndex });
    // Reset state and close
    setCategory("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">Laporkan Soal</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold text-primary mb-1">
              Soal nomor {questionIndex + 1}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-medium text-slate-800">{examTitle}</span>{" "}
              dilaporkan mengalami masalah olehmu.
            </p>
            <p className="text-xs text-slate-400 mt-2 italic">
              Tim kami akan meninjau laporan ini untuk memastikan kualitas soal
              tetap baik.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Pilih Kategori
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm bg-slate-50"
              >
                <option value="" disabled>
                  Pilih Kategori
                </option>
                <option value="typo">Kesalahan Penulisan (Typo)</option>
                <option value="wrong_answer">Kunci Jawaban Salah</option>
                <option value="image_error">Gambar Tidak Muncul</option>
                <option value="other">Masalah Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Deskripsi Masalah
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan masalah yang kamu temui di soal ini..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm resize-none bg-slate-50"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
              Kirim Laporan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 active:scale-[0.98] transition-all"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
