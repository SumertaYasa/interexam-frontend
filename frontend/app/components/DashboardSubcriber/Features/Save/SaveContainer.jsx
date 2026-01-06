import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useFolder } from "../../../../context/FolderContext";
import { Plus, MoreVertical, X } from "lucide-react";
import { Link } from "react-router";
function SaveContainer() {
  const { showAlert } = useAuth();
  const { folders, addFolder } = useFolder();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const uniqueFolders = folders.reduce((acc, current) => {
    const existing = acc.find((item) => item.id_folder === current.id_folder);
    if (!existing) {
      const count = folders.filter(
        (f) => f.id_folder === current.id_folder && f.id_soal !== null
      ).length;
      acc.push({ ...current, count });
    }
    return acc;
  }, []);

  const handleConfirmCreate = () => {
    if (newFolderName.trim() === "") {
      showAlert("Nama folder tidak boleh kosong!", "error");
      return;
    }

    addFolder(newFolderName);
    setNewFolderName("");
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 w-full relative min-h-screen">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-start">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm font-semibold"
          >
            <Plus size={20} />
            <span>Buat folder</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {uniqueFolders.map((folder) => (
          <Link
            to={`/dashboard-subscriber/tersimpan/${folder.id_folder}`}
            key={folder.id_folder}
            className="group cursor-pointer border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white flex flex-col"
          >
            <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
              <img
                src="/imagecontoh.jpg"
                alt={folder.folder_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-5 flex justify-between items-start gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-slate-800 line-clamp-2 leading-tight tracking-tight">
                  {folder.folder_name}
                </h3>
                <p className="text-xs font-medium text-slate-400 tracking-tight">
                  {folder.count} soal
                </p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 p-1"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <MoreVertical size={20} />
              </button>
            </div>
          </Link>
        ))}
      </div>

      {uniqueFolders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p>Belum ada folder yang dibuat.</p>
        </div>
      )}

      {/* MODAL BUAT FOLDER KUSTOM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-[400px] rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Buat Folder Baru
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-8">
              <label className="text-sm font-semibold text-gray-700">
                Nama Folder
              </label>
              <input
                type="text"
                placeholder="Contoh: Soal Matematika Sulit"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmCreate}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SaveContainer;
