import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-8 py-5 bg-slate-50/50 border-t border-slate-100">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Halaman <span className="text-slate-900">{currentPage}</span> dari{" "}
        <span className="text-slate-900">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        {/* Tombol Previous */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2.5 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-600"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Nomor Halaman */}
        <div className="flex gap-1">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                currentPage === page
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-400 hover:bg-white hover:text-primary border border-transparent hover:border-slate-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Tombol Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2.5 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-600"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
