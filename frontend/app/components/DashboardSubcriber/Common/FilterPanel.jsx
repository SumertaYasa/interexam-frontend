import React from "react";
import { ChevronDown, Star } from "lucide-react";

export default function FilterPanel({
  filters,
  setFilters,
  categories,
  onClose,
  onClear,
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full bg-white border border-slate-100 rounded-[2.5rem] shadow-xl p-8 my-4 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      {/* CSS Kustom untuk Slider Pointer (Thumb) agar muncul kembali */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #2563eb;
          cursor: pointer;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #2563eb;
          cursor: pointer;
          border-radius: 50%;
          border: 3px solid white;
        }
      `,
        }}
      />

      <div className="flex flex-wrap items-end gap-10">
        {/* Kategori */}
        <div className="flex-1 min-w-[220px]">
          <label className="block text-slate-400 text-xs font-bold mb-3 ml-2 uppercase tracking-widest">
            Kategori
          </label>
          <div className="relative">
            <select
              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-800 appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer text-sm font-bold"
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value }))
              }
              style={{ backgroundImage: "none" }} // FIX: Menghapus double arrow bawaan browser
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "Semua Kategori" : cat}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={20}
            />
          </div>
        </div>

        {/* Rating Minimal */}
        <div className="flex-1 min-w-[220px]">
          <div className="flex justify-between items-center mb-3 px-2">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Rating Minimal
            </label>
            <span className="flex items-center gap-1 text-blue-600 font-bold text-sm">
              {filters.minRating} <Star size={14} className="fill-blue-600" />
            </span>
          </div>
          <div className="flex items-center h-12 px-2">
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer outline-none accent-blue-600"
              value={filters.minRating}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minRating: Number(e.target.value) }))
              }
            />
          </div>
        </div>

        {/* Urutkan */}
        <div className="flex-1 min-w-[220px]">
          <label className="block text-slate-400 text-xs font-bold mb-3 ml-2 uppercase tracking-widest">
            Urutkan
          </label>
          <div className="relative">
            <select
              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-800 appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer text-sm font-bold"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((f) => ({ ...f, sortBy: e.target.value }))
              }
              style={{ backgroundImage: "none" }}
            >
              <option value="relevance">Relevansi</option>
              <option value="newest">Terbaru</option>
              <option value="rating">Progres Tertinggi</option>
            </select>
            <ChevronDown
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={20}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 ml-auto pt-4 lg:pt-0">
          <button
            className="px-8 py-4 text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all text-sm uppercase tracking-tighter"
            onClick={onClear}
          >
            Reset
          </button>
          <button
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95 text-sm uppercase"
            onClick={onClose}
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
