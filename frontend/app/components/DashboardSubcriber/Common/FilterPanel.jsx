import React from "react";

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
      className="absolute left-0 mt-5 w-64 bg-white border rounded shadow p-3 z-30"
    >
      <div className="mb-2">
        <label className="text-xs text-gray-500">Kategori</label>
        <select
          className="w-full mt-1 p-2 border rounded"
          value={filters.category}
          onChange={(e) =>
            setFilters((f) => ({ ...f, category: e.target.value }))
          }
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Semua" : cat}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="text-xs text-gray-500">Rating minimal</label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating}
          onChange={(e) =>
            setFilters((f) => ({ ...f, minRating: Number(e.target.value) }))
          }
        />
        <div className="text-sm text-gray-600">{filters.minRating} ★</div>
      </div>

      <div className="mb-3">
        <label className="text-xs text-gray-500">Urutkan</label>
        <select
          className="w-full mt-1 p-2 border rounded"
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((f) => ({ ...f, sortBy: e.target.value }))
          }
        >
          <option value="relevance">Relevansi</option>
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="rating">Rating tertinggi</option>
          <option value="questions">Jumlah soal (desc)</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          className="flex-1 px-3 py-2 border rounded text-sm"
          onClick={onClear}
        >
          Reset
        </button>
        <button
          className="flex-1 px-3 py-2 bg-primary-600 text-white rounded text-sm"
          onClick={onClose}
        >
          Terapkan
        </button>
      </div>
    </div>
  );
}
