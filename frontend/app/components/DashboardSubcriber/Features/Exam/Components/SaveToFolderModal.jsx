import React, { useState } from "react";
import { Plus, Check, X, FolderPlus } from "lucide-react";

export default function SaveToFolderModal({
  isOpen,
  onClose,
  folders,
  onAddFolder,
  onSelectFolder,
  selectedFolder,
  onSave,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  if (!isOpen) return null;

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName);
      setNewFolderName("");
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-[380px] bg-white rounded-3xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Simpan ke Folder
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* INPUT FOLDER BARU (Ganti Prompt) */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-3 w-full p-4 hover:bg-primary/5 rounded-2xl mb-6 text-primary font-bold text-sm border-2 border-dashed border-primary/20 transition-all"
          >
            <Plus size={20} /> Buat folder baru
          </button>
        ) : (
          <div className="mb-6 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Nama folder baru..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                className="w-full p-4 bg-slate-50 border-2 border-primary/30 rounded-2xl outline-none focus:border-primary text-sm font-bold transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-400"
              >
                Batal
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-bold disabled:opacity-50"
              >
                Simpan Folder
              </button>
            </div>
          </div>
        )}

        <div className="max-h-[250px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {folders.map((folder) => (
            <div
              key={folder.id_folder}
              onClick={() => onSelectFolder(folder)}
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
            onClick={onClose}
            className="flex-1 py-4 text-slate-400 font-bold text-sm tracking-tight hover:bg-slate-50 rounded-2xl"
          >
            Batal
          </button>
          <button
            onClick={onSave}
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
  );
}
