import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import InfoCards from "./Components/InfoCards";
import BarChart from "./Components/BarChart";
import ActivitySummary from "./Components/ActivitySummary";
import { dashboardService } from "../../../../services/subscriber";
import LockedFeature from "../../Common/LockedFeature";

export default function ProgressContainer() {
  const { isPremium } = useAuth();
  const [mode, setMode] = useState("Mingguan");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiPeriod = mode === "Mingguan" ? "weekly" : "today";

        const response = await dashboardService.getProgressAnalytics(apiPeriod);

        if (response) {
          setData(response);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mode]);

  const processedCards = data
    ? {
        exams: data.exams.current,
        examsTrend: (data.exams.diff >= 0 ? "+" : "") + data.exams.diff,

        avgScore: data.score.current,
        scoreTrend: (data.score.diff >= 0 ? "+" : "") + data.score.diff + "%",

        studyTime: data.studyTime.formatted,
        timeTrend:
          (data.studyTime.diff >= 0 ? "+" : "") + data.studyTime.diff + "m",
      }
    : {
        exams: 0,
        examsTrend: "+0",
        avgScore: 0,
        scoreTrend: "+0%",
        studyTime: "0m",
        timeTrend: "+0m",
      };

  const processedChart =
    data?.chart?.labels.map((label, index) => ({
      label: label,
      value: data.chart.data[index],
    })) || [];

  const processedSummary = {
    // Ambil log sistem dari API
    highlights: data?.logs?.map((log) => log.text) || [
      "Belum ada aktivitas yang cukup untuk dianalisa.",
    ],
    // Milestone bisa diambil dari logic lain atau hardcode dulu
    milestones:
      mode === "Mingguan"
        ? ["Menjaga streak belajar", "Menyelesaikan target mingguan"]
        : ["Login hari ini", "Mulai belajar"],
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/30 font-sans [scrollbar-gutter:stable]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-5">
        {/* Header Section (Tab Switcher) */}
        <div>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setMode("Harian")}
              className={`text-sm font-bold transition-all ${
                mode === "Harian"
                  ? "text-slate-900 border-b-2 border-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Hari ini
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setMode("Mingguan")}
              className={`text-sm font-bold transition-all ${
                mode === "Mingguan"
                  ? "text-slate-900 border-b-2 border-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Mingguan
            </button>
          </div>
        </div>

        {loading ? (
          // Skeleton Loading Sederhana
          <div className="w-full h-64 flex items-center justify-center text-slate-400 animate-pulse">
            Memuat data perkembangan...
          </div>
        ) : (
          <>
            {/* Top Section: Information Cards */}
            <InfoCards mode={mode} data={processedCards} />

            {/* Bottom Section: Chart & Summary */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch pb-10">
              <LockedFeature title="Fitur Grafik" isLocked={!isPremium}>
                <BarChart mode={mode} data={processedChart} />
              </LockedFeature>
              {/* Pastikan ActivitySummary bisa menerima prop summaries */}
              <LockedFeature
                title="Fitur Ringkasan Aktivitas"
                isLocked={!isPremium}
              >
                <ActivitySummary mode={mode} summaries={processedSummary} />
              </LockedFeature>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
