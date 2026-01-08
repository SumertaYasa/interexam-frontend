import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router";
import { useFolder } from "../../../../context/FolderContext";
import {
  Info,
  Trash2,
  X,
  Pencil,
  Save,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import BreadCrumbs from "../../Common/BreadCrumbs";
import ActionModal from "../../Common/ActionModal";
import Pagination from "../../Common/Pagination"; // Import Komponen Global

export default function DetailSave() {
  const { id } = useParams();
  const { folders, deleteQuestionFromFolder, updateQuestionNote } = useFolder();

  // --- STATE MANAGEMENT ---
  const [activeModal, setActiveModal] = useState(null); // 'delete-bulk', 'delete-single', 'note', 'guide'
  const [selectedIds, setSelectedIds] = useState([]);
  const [tempNote, setTempNote] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    targetId: null,
  });

  // Ambil Data Folder Ini
  const currentFolderQuestions = useMemo(() => {
    return folders.filter(
      (f) => String(f.id_folder) === String(id) && f.id_soal !== null
    );
  }, [folders, id]);

  //  LOGIKA PAGINATION (SLICING DATA)
  const totalPages = Math.ceil(currentFolderQuestions.length / itemsPerPage);

  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return currentFolderQuestions.slice(startIndex, startIndex + itemsPerPage);
  }, [currentFolderQuestions, currentPage]);

  //  Reset halaman jika data berkurang
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const folderInfo = useMemo(() => {
    return folders.find((f) => String(f.id_folder) === String(id));
  }, [folders, id]);

  const folderName = folderInfo?.folder_name || "Detail Folder";
  const attemptPath = `/dashboard-subscriber/tersimpan/${id}/attempt`;

  // --- HANDLERS ---
  const handleConfirmSingleDelete = () => {
    if (contextMenu.targetId) {
      deleteQuestionFromFolder(contextMenu.targetId, id);
      setSelectedIds((prev) =>
        prev.filter((sid) => sid !== contextMenu.targetId)
      );
      setActiveModal(null);
    }
  };

  const handleConfirmBulkDelete = () => {
    selectedIds.forEach((sid) => deleteQuestionFromFolder(sid, id));
    setSelectedIds([]);
    setActiveModal(null);
  };

  const handleSaveNote = () => {
    updateQuestionNote(contextMenu.targetId, id, tempNote);
    setActiveModal(null);
  };

  const handleContextMenu = (e, q) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      targetId: q.id_soal,
    });
    setTempNote(q.note || "");
  };

  useEffect(() => {
    const handleOutsideClick = () =>
      setContextMenu((prev) => ({ ...prev, show: false }));
    if (contextMenu.show) window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [contextMenu.show]);

  return (
    <div className="w-full flex flex-col gap-8 bg-white px-8 py-4 min-h-screen relative font-sans antialiased pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <BreadCrumbs />
          <h1 className="text-4xl font-black text-slate-900 mt-4 mb-6 tracking-tighter">
            {folderName}
          </h1>
          <div className="flex gap-3">
            <Link
              to={currentFolderQuestions.length > 0 ? attemptPath : "#"}
              className={`px-8 py-3 flex items-center gap-2 font-bold rounded-xl shadow-lg transition-all active:scale-95 ${
                currentFolderQuestions.length > 0
                  ? "bg-primary text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              <PlayCircle size={20} /> Kerjakan Kembali
            </Link>

            {selectedIds.length > 0 && (
              <button
                onClick={() => setActiveModal("delete-bulk")}
                className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-left-4"
              >
                <Trash2 size={16} /> Hapus {selectedIds.length} Soal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="border border-slate-200 rounded-[24px] overflow-hidden shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                <th className="p-5 w-12 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary cursor-pointer focus:ring-0"
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? currentFolderQuestions.map((q) => q.id_soal)
                          : []
                      )
                    }
                    checked={
                      selectedIds.length === currentFolderQuestions.length &&
                      currentFolderQuestions.length > 0
                    }
                  />
                </th>
                <th className="p-5 w-16 text-center">No</th>
                <th className="p-5 w-48">Mata Pelajaran</th>
                <th className="p-5">Soal</th>
                <th className="p-5">Catatan</th>
                <th className="p-5 w-14 text-right">
                  <button
                    onClick={() => setActiveModal("guide")}
                    className="hover:bg-slate-200 p-1.5 rounded-full transition-colors"
                  >
                    <Info size={18} className="text-slate-400" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedQuestions.map((q, index) => {
                const globalIndex =
                  (currentPage - 1) * itemsPerPage + index + 1;
                const isSelected = selectedIds.includes(q.id_soal);
                return (
                  <tr
                    key={q.id_soal}
                    onContextMenu={(e) => handleContextMenu(e, q)}
                    className={`${isSelected ? "bg-primary/5" : "hover:bg-slate-50/80"} transition-colors cursor-default`}
                  >
                    <td className="p-5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          setSelectedIds((prev) =>
                            isSelected
                              ? prev.filter((i) => i !== q.id_soal)
                              : [...prev, q.id_soal]
                          )
                        }
                        className="w-4 h-4 rounded text-primary cursor-pointer focus:ring-0"
                      />
                    </td>
                    <td className="p-5 text-center font-black text-slate-900">
                      {globalIndex}
                    </td>
                    <td className="p-5 text-sm font-medium text-slate-600">
                      {q.subject || "Umum"}
                    </td>
                    <td className="p-5 text-sm font-bold text-slate-800 leading-relaxed line-clamp-2">
                      {q.question_text}
                    </td>
                    <td className="p-5 text-sm font-medium text-slate-400 italic">
                      <span className="line-clamp-1">{q.note || "-"}</span>
                    </td>
                    <td className="p-5"></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {currentFolderQuestions.length === 0 && (
          <div className="py-24 text-center font-bold text-slate-400 italic">
            Belum ada soal di folder ini.
          </div>
        )}
      </div>

      {/* --- MODALS SECTION --- */}
      <ActionModal
        isOpen={activeModal === "delete-bulk"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleConfirmBulkDelete}
        title="Hapus Soal Terpilih?"
        description={`Apakah kamu yakin ingin menghapus ${selectedIds.length} soal dari folder ini?`}
        icon={Trash2}
        iconClass="bg-red-50 text-red-600"
        confirmText="Ya, Hapus Semua"
        confirmClass="bg-red-500 shadow-red-200"
      />

      <ActionModal
        isOpen={activeModal === "delete-single"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Hapus Soal?"
        description="Soal akan dikeluarkan dari folder koleksi tersimpan."
        icon={AlertCircle}
        iconClass="bg-amber-50 text-amber-500"
        confirmText="Ya, Hapus"
        confirmClass="bg-slate-900"
      />

      {/* Modal Catatan */}
      {activeModal === "note" && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-[420px] rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Pencil size={20} className="text-primary" /> Catatan Soal
            </h2>
            <textarea
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              placeholder="Tulis catatan penting..."
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
            />
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNote}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <Save size={16} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Panduan */}
      {activeModal === "guide" && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-[380px] rounded-3xl shadow-2xl p-8 relative animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Panduan</h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 text-sm font-medium text-slate-700 leading-relaxed">
              Gunakan klik kanan pada baris soal untuk menambah catatan atau
              menghapus soal satu per satu.
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="mt-8 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold active:scale-95"
            >
              Saya mengerti
            </button>
          </div>
        </div>
      )}

      {/* CONTEXT MENU */}
      {contextMenu.show && (
        <div
          className="fixed z-[300] bg-white border border-slate-100 shadow-2xl rounded-xl py-2 w-56 animate-in zoom-in-95 duration-150"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setActiveModal("note");
              setContextMenu({ ...contextMenu, show: false });
            }}
            className="w-full px-5 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Pencil size={16} className="text-slate-400" />
            <span className="text-xs font-bold">Tambah/Ubah Catatan</span>
          </button>
          <div className="h-[1px] bg-slate-100 my-1 mx-2" />
          <button
            onClick={() => {
              setActiveModal("delete-single");
              setContextMenu({ ...contextMenu, show: false });
            }}
            className="w-full px-5 py-3 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
            <span className="text-xs font-bold">Hapus dari folder</span>
          </button>
        </div>
      )}
    </div>
  );
}
