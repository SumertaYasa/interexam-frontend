import React from "react";
import { X } from "lucide-react";

export default function ActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  icon: Icon,
  iconClass,
  confirmText,
  confirmClass,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-[400px] bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200 text-center relative">
        <div
          className={`w-16 h-16 ${iconClass} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          <Icon size={32} />
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed px-4">
          {description}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-xl transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3.5 ${confirmClass} text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
