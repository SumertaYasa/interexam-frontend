import React, { useState } from "react";
import { Info, Calendar, Zap, X } from "lucide-react";

export default function ActivitySummary({ mode, summaries }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteDate, setNoteDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [allActivities, setAllActivities] = useState([
    ...summaries.highlights.map((text) => ({
      type: "system",
      text,
      date: "Sistem",
    })),
    ...summaries.milestones.map((text) => ({
      type: "user",
      text,
      date: "2026-01-06",
    })),
  ]);

  const handleSaveNote = () => {
    if (noteText.trim() !== "" && noteDate !== "") {
      const newNote = { type: "user", text: noteText, date: noteDate };
      setAllActivities([...allActivities, newNote]);
      setNoteText("");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full lg:w-96 flex flex-col gap-4 font-sans antialiased">
      <div className="bg-white border border-[#8A8A8A] rounded-[10px] p-6 shadow-sm h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
              Ringkasan Aktivitas {mode}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1 tracking-tight">
              Aliran aktivitas sistem dan catatan pribadimu.
            </p>
          </div>
          {/* Trigger Panduan */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="p-1 hover:bg-slate-50 rounded-full transition-colors"
          >
            <Info size={16} className="text-slate-300 cursor-help" />
          </button>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100 mb-6 tracking-tight flex-shrink-0"
        >
          Buat Note
        </button>

        {/* KONTAINER SCROLL UTAMA */}
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 custom-scrollbar">
          {allActivities.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-4 border shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 ${
                item.type === "system"
                  ? "bg-blue-50/50 border-blue-50"
                  : "bg-red-50/50 border-red-50"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div
                  className={`flex items-center justify-between ${item.type === "system" ? "text-blue-400" : "text-red-400"}`}
                >
                  <div className="flex items-center gap-1.5">
                    {item.type === "system" ? (
                      <Zap size={10} />
                    ) : (
                      <Calendar size={10} />
                    )}
                    <span className="text-[9px] font-black tracking-tighter uppercase">
                      {item.date}
                    </span>
                  </div>
                  <span
                    className={`text-[8px] font-bold uppercase tracking-widest ${item.type === "system" ? "text-blue-300" : "text-red-300"}`}
                  >
                    {item.type === "system"
                      ? "System Notification"
                      : "User Milestone"}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-700 tracking-tight leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL PANDUAN PENGGUNAAN */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-[420px] rounded-[2rem] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Panduan Activity Summary
              </h2>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <p className="text-sm font-medium text-slate-700 leading-relaxed tracking-tight">
                Bagian berwarna{" "}
                <span className="text-blue-500 font-bold">biru</span> berisi
                insight otomatis dari InterExam berdasarkan aktivitas belajarmu,
                sedangkan bagian{" "}
                <span className="text-red-500 font-bold">merah</span> berisi
                catatan pribadi yang kamu tulis sendiri untuk refleksi mingguan.
              </p>
            </div>

            <button
              onClick={() => setIsGuideOpen(false)}
              className="mt-8 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-tight shadow-lg shadow-slate-200 active:scale-95 transition-all"
            >
              Saya mengerti
            </button>
          </div>
        </div>
      )}

      {/* MODAL INPUT NOTE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-[380px] rounded-2xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">
              Buat Note Baru
            </h2>
            <div className="flex flex-col gap-5 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Tanggal
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none font-bold tracking-tighter text-sm text-slate-600 focus:ring-2 focus:ring-red-400 transition-all"
                  value={noteDate}
                  onChange={(e) => setNoteDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Isi Catatan
                </label>
                <textarea
                  placeholder="Apa yang kamu capai?"
                  className="w-full h-28 px-4 py-3 border border-slate-200 rounded-xl outline-none font-medium tracking-tight text-sm resize-none focus:ring-2 focus:ring-red-400 transition-all"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3.5 text-slate-400 font-bold text-sm tracking-tight hover:bg-slate-50 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNote}
                className="flex-1 py-3.5 bg-red-500 text-white rounded-xl font-bold text-sm tracking-tight shadow-lg shadow-red-200 active:scale-95 transition-all"
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
