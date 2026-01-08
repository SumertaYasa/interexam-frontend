import React from "react";
import { X } from "lucide-react";

export default function CreateFolderModal({ isOpen, onClose, onConfirm, value, onChange }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-[400px] rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Buat Folder Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-2 mb-8">
          <label className="text-sm font-semibold text-gray-700">Nama Folder</label>
          <input
            type="text"
            placeholder="Contoh: Soal Matematika Sulit"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-colors">
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}