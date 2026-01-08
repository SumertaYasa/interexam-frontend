import React, { useState } from "react";
import InfoCards from "./Components/InfoCards";
import BarChart from "./Components/BarChart";
import ActivitySummary from "./Components/ActivitySummary";

const DUMMY_DATA = {
  Mingguan: {
    cards: {
      exams: 12,
      examsTrend: "+4",
      avgScore: 57,
      scoreTrend: "+5%",
      studyTime: "1j 36m",
      timeTrend: "+35m",
    },
    chart: [
      { label: "Minggu 1", value: 5 },
      { label: "Minggu 2", value: 6 },
      { label: "Minggu 3", value: 4 },
      { label: "Minggu 4", value: 5 },
      { label: "Minggu 5", value: 7.5 },
      { label: "Minggu 6", value: 6 },
      { label: "Minggu 7", value: 5 },
    ],
    summary: {
      highlights: [
        "Rata-rata Peningkatan Skor kamu naik 8% dari minggu lalu.",
        "Kamu sudah belajar 1 jam 36 menit minggu ini, lebih lama 35 menit dari minggu lalu.",
        "Minggu ini kamu mencapai puncak performamu, hasil latihanmu mulai menunjukkan konsistensi yang luar biasa.",
        "Kamu telah menjaga ritme belajar yang stabil selama 4 minggu berturut-turut.",
      ],
      milestones: [
        "Menamatkan 2 paket soal",
        "Mendapatkan rata-rata skor di atas 50%",
      ],
    },
  },
  Harian: {
    cards: {
      exams: 2,
      examsTrend: "+1",
      avgScore: 65,
      scoreTrend: "+10%",
      studyTime: "25m",
      timeTrend: "+5m",
    },
    chart: [
      { label: "Sen", value: 4 },
      { label: "Sel", value: 5 },
      { label: "Rab", value: 3 },
      { label: "Kam", value: 8 },
      { label: "Jum", value: 6 },
      { label: "Sab", value: 2 },
      { label: "Min", value: 0 },
    ],
    summary: {
      highlights: [
        "Fokus belajarmu meningkat di hari ini.",
        "Pencapaian skor harian stabil di angka 65%.",
      ],
      milestones: ["Menyelesaikan 1 modul Logika"],
    },
  },
};

export default function ProgressContainer() {
  const [mode, setMode] = useState("Mingguan");
  const currentData = DUMMY_DATA[mode];

  return (
    <div className="w-full min-h-screen bg-slate-50/30 font-sans [scrollbar-gutter:stable]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-5">
        {/* Header Section */}
        <div>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setMode("Harian")}
              className={`text-sm font-bold transition-all ${mode === "Harian" ? "text-slate-900 border-b-2 border-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              {" "}
              Hari ini{" "}
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setMode("Mingguan")}
              className={`text-sm font-bold transition-all ${mode === "Mingguan" ? "text-slate-900 border-b-2 border-slate-900" : "text-slate-400 hover:text-slate-600"}`}
            >
              {" "}
              Mingguan{" "}
            </button>
          </div>
        </div>

        {/* Top Section: Information Cards */}
        <InfoCards mode={mode} data={currentData.cards} />

        {/* Bottom Section: Chart & Summary */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <BarChart mode={mode} data={currentData.chart} />
          <ActivitySummary mode={mode} summaries={currentData.summary} />
        </div>
      </div>
    </div>
  );
}
