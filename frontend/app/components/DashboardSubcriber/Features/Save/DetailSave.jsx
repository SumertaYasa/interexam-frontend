import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router";
import { useFolder } from "../../../../context/FolderContext";
import { saveService } from "../../../../services/subscriber/saveService";
import {
  Info,
  Trash2,
  Pencil,
  Save,
  PlayCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import BreadCrumbs from "../../Common/BreadCrumbs";
import ActionModal from "../../Common/ActionModal";
import Pagination from "../../Common/Pagination";
import { slugify } from "../../../../utils/slugify";

export default function DetailSave() {
  // 1. Ambil LABEL dari URL (Slug)
  const { label } = useParams();
  const { folders, deleteQuestionFromFolder } = useFolder();

  // --- STATE ---
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeModal, setActiveModal] = useState(null);
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

  // --- 2. CARI FOLDER INFO BERDASARKAN SLUG (LABEL) ---
  const isGeneral = label === "umum";

  const folderInfo = useMemo(() => {
    if (isGeneral) return { id: null, nama: "Favorit Umum" };

    // Cari folder yang slug-nya cocok dengan label di URL
    // Contoh: slugify("Matematika Dasar") -> "matematika-dasar"
    return folders.find((f) => slugify(f.nama) === label);
  }, [folders, label, isGeneral]);

  const folderName = folderInfo?.nama || "Detail Folder";
  const folderId = folderInfo?.id; // Ambil ID asli untuk API

  // --- 3. FETCH DATA SOAL ---
  const fetchQuestions = useCallback(async () => {
    // Jika bukan umum dan folderId belum ketemu (misal data folders belum load), jangan fetch
    if (!isGeneral && !folderId) return;

    try {
      setLoading(true);

      // Tentukan param untuk API
      const folderParam = isGeneral ? "null" : folderId;

      const response = await saveService.getFavoriteSoal({
        folderId: folderParam,
        limit: 100,
      });

      if (response.data) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.error("Gagal load detail folder:", error);
    } finally {
      setLoading(false);
    }
  }, [folderId, isGeneral]); // Dependency gunakan folderId, bukan id

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // --- LOGIKA PAGINATION ---
  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return questions.slice(startIndex, startIndex + itemsPerPage);
  }, [questions, currentPage]);

  const attemptPath = `/dashboard-subscriber/tersimpan/${label}/attempt`;

  // --- HANDLERS ---
  const handleConfirmSingleDelete = async () => {
    if (contextMenu.targetId) {
      await deleteQuestionFromFolder(contextMenu.targetId);
      setQuestions((prev) =>
        prev.filter((q) => q.id_favorite !== contextMenu.targetId),
      );
      setSelectedIds((prev) =>
        prev.filter((sid) => sid !== contextMenu.targetId),
      );
      setActiveModal(null);
    }
  };

  const handleConfirmBulkDelete = async () => {
    for (const favId of selectedIds) {
      await deleteQuestionFromFolder(favId);
    }
    setQuestions((prev) =>
      prev.filter((q) => !selectedIds.includes(q.id_favorite)),
    );
    setSelectedIds([]);
    setActiveModal(null);
  };

  const handleContextMenu = (e, q) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      targetId: q.id_favorite,
    });
    setTempNote(q.note || "");
  };

  useEffect(() => {
    const handleOutsideClick = () =>
      setContextMenu((prev) => ({ ...prev, show: false }));
    if (contextMenu.show) window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [contextMenu.show]);

  // Handle Loading State
  // Tampilkan loading jika data masih diambil ATAU jika folderId belum ketemu (kecuali umum)
  if (loading || (!isGeneral && !folderId && folders.length > 0)) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  // Handle jika folder tidak ditemukan (User masukin URL ngawur)
  if (!isGeneral && !folderId && folders.length > 0 && !loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <AlertCircle size={48} className="text-red-400" />
        <h2 className="text-xl font-bold text-slate-700">
          Folder Tidak Ditemukan
        </h2>
        <Link
          to="/dashboard-subscriber/tersimpan"
          className="text-primary hover:underline"
        >
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

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
              to={questions.length > 0 ? attemptPath : "#"}
              className={`px-8 py-3 flex items-center gap-2 font-bold rounded-xl shadow-lg transition-all active:scale-95 ${
                questions.length > 0
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
                          ? questions.map((q) => q.id_favorite)
                          : [],
                      )
                    }
                    checked={
                      selectedIds.length === questions.length &&
                      questions.length > 0
                    }
                  />
                </th>
                <th className="p-5 w-16 text-center">No</th>
                <th className="p-5 w-48">Mata Pelajaran</th>
                <th className="p-5">Soal</th>
                <th className="p-5">Catatan</th>
                <th className="p-5 w-14 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedQuestions.map((q, index) => {
                const globalIndex =
                  (currentPage - 1) * itemsPerPage + index + 1;
                const isSelected = selectedIds.includes(q.id_favorite);
                return (
                  <tr
                    key={q.id_favorite}
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
                              ? prev.filter((i) => i !== q.id_favorite)
                              : [...prev, q.id_favorite],
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
                    <td className="p-5 text-right">
                      <button onClick={() => setActiveModal("guide")}>
                        <Info
                          size={18}
                          className="text-slate-300 hover:text-primary"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {questions.length === 0 && (
          <div className="py-24 text-center font-bold text-slate-400 italic">
            {isGeneral
              ? "Belum ada soal favorit yang tersimpan."
              : "Belum ada soal di folder ini. Coba cek 'Favorit Umum'."}
          </div>
        )}
      </div>

      {/* MODALS */}
      <ActionModal
        isOpen={activeModal === "delete-bulk"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleConfirmBulkDelete}
        title="Hapus Soal Terpilih?"
        description={`Yakin hapus ${selectedIds.length} soal?`}
        icon={Trash2}
        iconClass="bg-red-50 text-red-600"
        confirmText="Ya, Hapus"
        confirmClass="bg-red-500 shadow-red-200"
      />

      <ActionModal
        isOpen={activeModal === "delete-single"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Hapus Soal?"
        description="Soal akan dihapus dari favorit."
        icon={AlertCircle}
        iconClass="bg-amber-50 text-amber-500"
        confirmText="Ya, Hapus"
        confirmClass="bg-slate-900"
      />

      {contextMenu.show && (
        <div
          className="fixed z-[300] bg-white border border-slate-100 shadow-2xl rounded-xl py-2 w-56 animate-in zoom-in-95 duration-150"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
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
