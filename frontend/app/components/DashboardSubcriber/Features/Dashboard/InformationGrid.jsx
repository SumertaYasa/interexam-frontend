import React, { useState, useEffect } from "react";
import { CircleCheckBig, TrendingUp, Clock } from "lucide-react";
import CardInformation from "../../Common/CardInformation";
import { dashboardService } from "../../../../services/subscriber";

export function InformationGrid() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStatisticsSummary();
        setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dataCardInformation = [
    {
      id: 1,
      icon: CircleCheckBig,
      label: "total ujian diselesaikan",
      value: stats?.totalExamsCompleted || 0,
      messageInformation: `+${stats?.comparedToPreviousWeek?.exams || 0} minggu ini`,
      messageAlert: "Pertahankan ritmemu minggu ini.",
    },
    {
      id: 2,
      icon: TrendingUp,
      label: "rata-rata skor",
      value:
        stats?.averageScore !== undefined ? `${stats.averageScore}%` : "0%",
      messageInformation: `+${stats?.comparedToPreviousWeek?.scoreIncrease || 0}% dari minggu lalu`,
      messageAlert: "Fokus dan presisi terus meningkat.",
    },
    {
      id: 3,
      icon: Clock,
      label: "waktu belajar aktif",
      // --- PERBAIKAN DISINI ---
      // Kita ambil dari object stats.studyTime, lalu format manual jadi "Xj Ym" agar singkat
      value: stats?.studyTime
        ? `${stats.studyTime.hours}j ${stats.studyTime.minutes}m`
        : "0j 0m",

      messageInformation: `+${stats?.comparedToPreviousWeek?.studyTimeIncrease || 0}m dari minggu lalu`,
      messageAlert: "Konsistensi adalah kunci kemajuanmu",
    },
  ];

  const slideSpeeds = {
    1: "slide-in-from-bottom-[2%]",
    2: "slide-in-from-bottom-[4%]",
    3: "slide-in-from-bottom-[6%]",
  };

  if (loading) {
    return (
      <div className="w-full flex items-center gap-5 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full h-32 bg-slate-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center gap-5">
      {dataCardInformation.map((card) => (
        <CardInformation
          key={card.id}
          icon={card.icon}
          label={card.label}
          value={card.value}
          messageInformation={card.messageInformation}
          messageAlert={card.messageAlert}
          className={`animate-in fade-in duration-500 ${slideSpeeds[card.id] || ""}`}
        />
      ))}
    </div>
  );
}

export default InformationGrid;
