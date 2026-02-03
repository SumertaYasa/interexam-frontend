import React, { useState } from "react";
import { Plus, Check, X, Folder, LayoutGrid } from "lucide-react";

export default function SaveToFolderModal({
  isOpen,
  onClose,
  folders = [], // Data dari API
  onAddFolder, // Fungsi Async
  onSelectFolder,
  selectedFolder,
  onSave,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      setIsCreating(true);
      // Panggil fungsi create dan tunggu hasilnya
      await onAddFolder(newFolderName);
      setNewFolderName("");
      setIsCreating(false);
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-[380px] bg-white rounded-3xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Simpan ke Folder
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* INPUT FOLDER BARU */}
        <div className="shrink-0">
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-3 w-full p-4 hover:bg-primary/5 rounded-2xl mb-4 text-primary font-bold text-sm border-2 border-dashed border-primary/20 transition-all hover:border-primary/50"
            >
              <Plus size={20} /> Buat folder baru
            </button>
          ) : (
            <div className="mb-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="Nama folder baru..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                  disabled={isCreating}
                  className="w-full p-4 bg-slate-50 border-2 border-primary/30 rounded-2xl outline-none focus:border-primary text-sm font-bold transition-all disabled:opacity-50"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  disabled={isCreating}
                  className="flex-1 py-2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim() || isCreating}
                  className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-all active:scale-95"
                >
                  {isCreating ? "Menyimpan..." : "Simpan Folder"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LIST FOLDER */}
        <div className="overflow-y-auto pr-1 custom-scrollbar -mr-2  flex-1 min-h-0">
          <div className="space-y-2">
            {/* OPSI 1: FAVORIT UMUM (Tanpa Folder) */}
            <div
              onClick={() => onSelectFolder(null)}
              className={`flex justify-between items-center p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                selectedFolder === null
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${selectedFolder === null ? "bg-primary text-white" : "bg-slate-200 text-slate-400"}`}
                >
                  <LayoutGrid size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">
                    Favorit Umum
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase">
                    Tanpa folder
                  </p>
                </div>
              </div>
              {selectedFolder === null && (
                <div className="bg-primary p-1 rounded-full">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
              )}
            </div>

            {/* SEPARATOR */}
            <div className="h-px bg-slate-100 my-2"></div>

            {/* LIST FOLDER DARI API */}
            {folders.length === 0 ? (
              <p className="text-center text-slate-400 text-xs py-4 italic">
                Belum ada folder tambahan.
              </p>
            ) : (
              folders.map((folder) => {
                // Normalisasi Data (Handle API vs Legacy)
                const id = folder.id || folder.id_folder;
                const name = folder.nama || folder.folder_name;
                const count =
                  folder.total_item !== undefined
                    ? folder.total_item
                    : folder.count || 0;

                // Cek apakah terpilih
                const isSelected =
                  selectedFolder &&
                  (selectedFolder.id === id || selectedFolder.id_folder === id);

                return (
                  <div
                    key={id}
                    onClick={() => onSelectFolder(folder)}
                    className={`flex justify-between items-center p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${isSelected ? "bg-primary/20 text-primary" : "bg-slate-200 text-slate-400"}`}
                      >
                        <Folder size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 tracking-tight leading-none mb-1 text-sm">
                          {name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium tracking-tight uppercase">
                          {count} item
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="bg-primary p-1 rounded-full">
                        <Check
                          size={12}
                          className="text-white"
                          strokeWidth={3}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex gap-4 shrink-0 pt-4 border-t border-slate-50">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-slate-400 font-bold text-sm tracking-tight hover:bg-slate-50 rounded-2xl transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            // Tombol selalu aktif (karena null/Umum adalah pilihan valid), kecuali sedang loading
            disabled={isCreating}
            className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-sm tracking-tight shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
