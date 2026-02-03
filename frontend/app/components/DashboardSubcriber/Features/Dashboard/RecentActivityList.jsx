import React, { useState, useEffect } from "react";
import Card from "../../Common/Card";
import { Flame } from "lucide-react";
import CircularProgress from "../../Common/CircularProgress";
import { dashboardService } from "../../../../services/subscriber";

function RecentActivityList({ value }) {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStreakAndTarget();
        setStreakData(data);
      } catch (error) {
        console.error("Error fetching streak data:", error);
        setStreakData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStreakData();
  }, []);

  const currentStreak = streakData?.currentStreak || 0;
  const weeklyTarget = streakData?.weeklyTarget || 10;
  const completed = streakData?.completedThisWeek || 0;
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 w-full ">
      {/* Kartu Rekor (Ritme Belajar) */}
      <Card className="w-full flex justify-between px-8 items-center h-[160px] bg-white border rounded-[10px] shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-700 slide-in-from-bottom-4">
        <div className="max-w-[60%]">
          <h1 className="text-body-m-bold text-slate-900 leading-tight mb-2">
            Ritme Belajar Mingguan
          </h1>
          <p className="text-xs font-medium text-slate-400 leading-relaxed">
            Pertahankan rekor belajarmu agar tetap menyala!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-5xl font-black text-orange-500 tracking-tighter block mb-1">
              {loading ? "-" : currentStreak}
            </span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Rekor saat ini
            </p>
          </div>
          {/* Ikon Api dengan gradasi manual */}
          <div className="relative">
            <Flame
              size={72}
              className="text-orange-500 fill-orange-50 animate-pulse"
            />
            <div className="absolute inset-0 blur-2xl bg-orange-200/30 -z-10 rounded-full"></div>
          </div>
        </div>
      </Card>

      {/* Kartu Target (Progres Tes) */}
      <Card className="w-full flex justify-between px-8 items-center h-[160px] bg-white border rounded-[10px] shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-700 slide-in-from-bottom-8">
        <div className="max-w-[60%]">
          <h1 className="text-body-m-bold text-slate-900 leading-tight mb-2">
            Ritme Belajar Mingguan
          </h1>
          <p className="text-xs font-medium text-slate-400 leading-relaxed">
            Ayo selesaikan sisa paket soalmu minggu ini!
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <span className="text-5xl font-black text-green-600 tracking-tighter block mb-1">
              {loading ? "-" : completed}
            </span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Tes Selesai
            </p>
          </div>
          <CircularProgress
            value={loading ? 0 : completed}
            maxValue={loading ? 10 : weeklyTarget}
            size={90}
            strokeWidth={10}
          />
        </div>
      </Card>
    </div>
  );
}

export default RecentActivityList;
