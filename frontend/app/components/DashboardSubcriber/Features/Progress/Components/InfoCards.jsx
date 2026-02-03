import React from "react";
import {
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function InfoCards({ mode, data }) {
  const cards = [
    {
      title: `Ujian Diselesaikan ${mode}`,
      value: data.exams,
      trend: data.examsTrend, // string "+2" or "-1"
      icon: <CheckCircle2 className="text-blue-600" />,
      subtext: "Total paket soal yang diselesaikan.",
    },
    {
      title: `Rata-rata Skor ${mode}`,
      value: `${data.avgScore}%`,
      trend: data.scoreTrend,
      icon: <TrendingUp className="text-blue-600" />,
      subtext: "Nilai rata-rata dari semua pengerjaan.",
    },
    {
      title: `Waktu Belajar ${mode}`,
      value: data.studyTime,
      trend: data.timeTrend,
      icon: <Clock className="text-blue-600" />,
      subtext: "Total durasi pengerjaan soal aktif.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        // Cek apakah trend positif atau negatif dari stringnya
        const isPositive = !card.trend.includes("-");

        return (
          <div
            key={idx}
            className="bg-white border border-[#8A8A8A] rounded-[10px] p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">{card.icon}</div>
              <h3 className="text-sm font-bold text-slate-800">{card.title}</h3>
            </div>

            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-black text-slate-900 leading-none">
                {card.value}
              </span>

              {/* Indikator Naik/Turun */}
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold mb-1 ${
                  isPositive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                <span>
                  {card.trend} dari {mode === "Mingguan" ? "minggu" : "hari"}{" "}
                  lalu
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-medium">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
