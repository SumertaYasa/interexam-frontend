import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useFolder } from "../../../../context/FolderContext";
import { Plus, Trash2, FolderOpen, LayoutGrid } from "lucide-react";
import { Link } from "react-router";
import ActionModal from "../../Common/ActionModal";
import CreateFolderModal from "./Components/CreateFolderModal";
import LockedFeature from "../../Common/LockedFeature";
import { slugify } from "../../../../utils/slugify";

function SaveContainer() {
  const { showAlert, isPremium, isLoading } = useAuth();
  const { folders, addFolder, deleteFolder } = useFolder();

  // --- STATE ---
  const [activeModal, setActiveModal] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [targetFolder, setTargetFolder] = useState(null);

  // Handlers
  const handleConfirmCreate = async () => {
    if (newFolderName.trim() === "") {
      showAlert("Nama folder tidak boleh kosong!", "error");
      return;
    }
    await addFolder(newFolderName);
    setNewFolderName("");
    setActiveModal(null);
  };

  const handleConfirmDelete = async () => {
    if (targetFolder) {
      await deleteFolder(targetFolder.id);
      setActiveModal(null);
      setTargetFolder(null);
    }
  };

  // 🔥 GATEKEEPER: Wait for auth to load before showing content
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-50/30">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-bold animate-pulse">
          Memverifikasi akses Premium...
        </p>
      </div>
    );
  }

  return (
    <LockedFeature isLocked={!isPremium} minHeight="min-h-screen">
      <div className="p-8 w-full relative min-h-screen font-sans antialiased">
        {/* HEADER */}
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
          {/* --- 1. CARD FAVORIT UMUM (STATIC) --- */}
          <div className="group relative">
            <Link
              to={`/dashboard-subscriber/tersimpan/umum`} // Slug statis: 'umum'
              className="block border border-slate-100 rounded-[24px] overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all bg-white h-full"
            >
              <div className="relative h-44 w-full bg-slate-50 overflow-hidden flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                  <LayoutGrid size={40} />
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-black text-slate-800 line-clamp-1 leading-tight tracking-tight mb-1">
                  Favorit Umum
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Koleksi Tanpa Folder
                </p>
              </div>
            </Link>
          </div>

          {/* --- 2. CARD FOLDER DARI API --- */}
          {folders.map((folder) => (
            <div key={folder.id} className="group relative">
              <Link
                to={`/dashboard-subscriber/tersimpan/${slugify(folder.nama)}`}
                className="block border border-slate-100 rounded-[24px] overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all bg-white"
              >
                <div className="relative h-44 w-full bg-slate-50 overflow-hidden">
                  <div className="w-full h-full bg-amber-50 flex items-center justify-center">
                    <FolderOpen size={48} className="text-amber-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-black text-slate-800 line-clamp-1 leading-tight tracking-tight mb-1">
                    {folder.nama}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {folder.total_item} Soal Tersimpan
                  </p>
                </div>
              </Link>

              <button
                onClick={(e) => {
                  e.stopPropagation();
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

        {/* MODALS */}
        <CreateFolderModal
          isOpen={activeModal === "create"}
          onClose={() => setActiveModal(null)}
          onConfirm={handleConfirmCreate}
          value={newFolderName}
          onChange={setNewFolderName}
        />

        <ActionModal
          isOpen={activeModal === "delete"}
          onClose={() => setActiveModal(null)}
          onConfirm={handleConfirmDelete}
          title="Hapus Folder?"
          description={`Menghapus folder "${targetFolder?.nama}" tidak akan menghapus soal di dalamnya. Soal akan pindah ke Favorit Umum.`}
          icon={Trash2}
          iconClass="bg-red-50 text-red-500"
          confirmText="Ya, Hapus"
          confirmClass="bg-red-500 shadow-red-200"
        />
      </div>
    </LockedFeature>
  );
}

export default SaveContainer;
