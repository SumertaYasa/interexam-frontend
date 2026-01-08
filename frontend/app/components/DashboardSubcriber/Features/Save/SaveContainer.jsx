import React, { useState, useMemo } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useFolder } from "../../../../context/FolderContext";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import { Link } from "react-router";
import ActionModal from "../../Common/ActionModal";
import CreateFolderModal from "./Components/CreateFolderModal";

function SaveContainer() {
  const { showAlert } = useAuth();
  const { folders, addFolder, deleteFolder } = useFolder();

  // --- STATE ---
  const [activeModal, setActiveModal] = useState(null); // 'create' atau 'delete'
  const [newFolderName, setNewFolderName] = useState("");
  const [targetFolder, setTargetFolder] = useState(null);

  const uniqueFolders = useMemo(() => {
    return folders.reduce((acc, current) => {
      const existing = acc.find((item) => item.id_folder === current.id_folder);
      if (!existing) {
        const count = folders.filter(
          (f) => f.id_folder === current.id_folder && f.id_soal !== null
        ).length;
        acc.push({ ...current, count });
      }
      return acc;
    }, []);
  }, [folders]);

  // Handlers
  const handleConfirmCreate = () => {
    if (newFolderName.trim() === "") {
      showAlert("Nama folder tidak boleh kosong!", "error");
      return;
    }
    addFolder(newFolderName);
    setNewFolderName("");
    setActiveModal(null);
    showAlert("Folder berhasil dibuat", "success");
  };

  const handleConfirmDelete = () => {
    if (targetFolder) {
      deleteFolder(targetFolder.id_folder);
      setActiveModal(null);
      setTargetFolder(null);
      showAlert("Folder berhasil dihapus", "success");
    }
  };

  return (
    <div className="p-8 w-full relative min-h-screen font-sans antialiased">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex justify-start items-center">
          <button
            onClick={() => setActiveModal("create")}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 font-bold active:scale-95"
          >
            <Plus size={20} />
            <span>Buat Folder</span>
          </button>
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {uniqueFolders.map((folder) => (
          <div key={folder.id_folder} className="group relative">
            <Link
              to={`/dashboard-subscriber/tersimpan/${folder.id_folder}`}
              className="block border border-slate-100 rounded-[24px] overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all bg-white"
            >
              <div className="relative h-44 w-full bg-slate-50 overflow-hidden">
                <img
                  src="/imagecontoh.jpg"
                  alt={folder.folder_name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-black text-slate-800 line-clamp-1 leading-tight tracking-tight mb-1">
                  {folder.folder_name}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {folder.count} Soal Tersimpan
                </p>
              </div>
            </Link>

            {/* Tombol Hapus Cepat (Demonstrasi ActionModal) */}
            <button
              onClick={(e) => {
                setTargetFolder(folder);
                setActiveModal("delete");
              }}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all active:scale-90"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {uniqueFolders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-slate-300">
          <FolderOpen size={64} strokeWidth={1} className="mb-4 opacity-20" />
          <p className="font-bold tracking-tight">
            Belum ada folder yang dibuat.
          </p>
        </div>
      )}

      {/* --- MODALS SECTION --- */}

      {/* A. Modal Spesifik: Buat Folder */}
      <CreateFolderModal
        isOpen={activeModal === "create"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleConfirmCreate}
        value={newFolderName}
        onChange={setNewFolderName}
      />

      {/* B. Modal Reusable: Konfirmasi Hapus Folder */}
      <ActionModal
        isOpen={activeModal === "delete"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Folder Koleksi?"
        description={`Apakah kamu yakin ingin menghapus folder "${targetFolder?.folder_name}"? Semua soal di dalamnya akan ikut terhapus.`}
        icon={Trash2}
        iconClass="bg-red-50 text-red-500"
        confirmText="Ya, Hapus Folder"
        confirmClass="bg-red-500 shadow-red-200"
      />
    </div>
  );
}

export default SaveContainer;
