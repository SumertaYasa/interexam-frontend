import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useFolder } from "../../../../context/FolderContext";
import { Info, Trash2, X, Pencil, Save } from "lucide-react";
import BreadCrumbs from "../../Common/BreadCrumbs";

export default function DetailSave() {
  const { id } = useParams();
  const { folders, deleteQuestionFromFolder, updateQuestionNote } = useFolder();

  const [selectedIds, setSelectedIds] = useState([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false); // State Panduan
  const [tempNote, setTempNote] = useState("");
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    targetId: null,
  });

  const currentFolderQuestions = folders.filter(
    (f) => String(f.id_folder) === String(id) && f.id_soal !== null
  );

  const folderName =
    folders.find((f) => String(f.id_folder) === String(id))?.folder_name ||
    "Detail Folder";

  useEffect(() => {
    const handleOutsideClick = () =>
      setContextMenu((prev) => ({ ...prev, show: false }));
    if (contextMenu.show) window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [contextMenu.show]);

  const handleSelectAll = (e) => {
    setSelectedIds(
      e.target.checked ? currentFolderQuestions.map((q) => q.id_soal) : []
    );
  };

  const handleSelectItem = (id_soal) => {
    setSelectedIds((prev) =>
      prev.includes(id_soal)
        ? prev.filter((i) => i !== id_soal)
        : [...prev, id_soal]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Hapus ${selectedIds.length} soal yang dipilih?`)) {
      const idsToRemove = [...selectedIds];
      idsToRemove.forEach((sid) => {
        deleteQuestionFromFolder(sid, id);
      });
      setSelectedIds([]);
    }
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

  const handleSaveNote = () => {
    updateQuestionNote(contextMenu.targetId, id, tempNote);
    setIsNoteModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-8 bg-white px-8 py-4 min-h-screen relative font-sans antialiased">
      <div className="flex justify-between items-end mb-4">
        <div>
          <BreadCrumbs />
          <h1 className="text-4xl font-black text-slate-900 mt-4 mb-6 tracking-tighter">
            {folderName}
          </h1>
          <div className="flex gap-3">
            <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all">
              Kerjakan Kembali
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-left-4"
              >
                <Trash2 size={16} /> Hapus {selectedIds.length} Soal
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border border-blue-400 rounded-2xl overflow-hidden shadow-sm bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-widest text-slate-500">
              <th className="p-5 w-12 text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-primary cursor-pointer"
                  onChange={handleSelectAll}
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
                  onClick={() => setIsGuideOpen(true)}
                  className="hover:bg-slate-200 p-1 rounded-full transition-colors"
                >
                  <Info
                    size={18}
                    className="text-slate-400 inline-block cursor-help"
                  />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentFolderQuestions.map((q, index) => {
              const isSelected = selectedIds.includes(q.id_soal);
              return (
                <tr
                  key={q.id_soal}
                  onContextMenu={(e) => handleContextMenu(e, q)}
                  className={`${
                    isSelected ? "bg-blue-100/50" : "hover:bg-slate-50"
                  } transition-colors duration-200`}
                >
                  <td className="p-5 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectItem(q.id_soal)}
                      className="w-4 h-4 rounded text-primary cursor-pointer"
                    />
                  </td>
                  <td className="p-5 text-center font-black text-slate-900">
                    {index + 1}
                  </td>
                  <td className="p-5 text-sm font-medium text-slate-600">
                    {q.subject || "Umum"}
                  </td>
                  <td className="p-5 text-sm font-bold text-slate-800 leading-relaxed">
                    {q.question_text || "Teks soal tidak tersedia"}
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
        {currentFolderQuestions.length === 0 && (
          <div className="py-20 text-center font-bold text-slate-400">
            Belum ada soal di folder ini.
          </div>
        )}
      </div>

      {/* MODAL PANDUAN */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-[380px] rounded-3xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Panduan Tindakan
              </h2>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
              <p className="text-sm font-medium text-slate-700 leading-relaxed tracking-tight">
                Klik kanan pada soal untuk membuka menu tindakan seperti
                menambah catatan atau menghapus soal secara spesifik.
              </p>
            </div>

            <button
              onClick={() => setIsGuideOpen(false)}
              className="mt-8 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-tight shadow-lg active:scale-95 transition-all"
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
              setIsNoteModalOpen(true);
              setContextMenu({ ...contextMenu, show: false });
            }}
            className="w-full px-5 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50"
          >
            <Pencil size={16} className="text-slate-400" />
            <span className="text-xs font-bold">Tambah/Ubah Catatan</span>
          </button>
          <div className="h-[1px] bg-slate-100 my-1 mx-2" />
          <button
            onClick={() => {
              deleteQuestionFromFolder(contextMenu.targetId, id);
              setContextMenu({ ...contextMenu, show: false });
              setSelectedIds((prev) =>
                prev.filter((sid) => sid !== contextMenu.targetId)
              );
            }}
            className="w-full px-5 py-3 flex items-center gap-3 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={16} />
            <span className="text-xs font-bold">Hapus dari folder</span>
          </button>
        </div>
      )}

      {/* MODAL CATATAN */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-[420px] rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Pencil size={20} className="text-primary" /> Catatan Soal
            </h2>
            <textarea
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Tulis catatan..."
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
            />
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNote}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <Save size={16} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
