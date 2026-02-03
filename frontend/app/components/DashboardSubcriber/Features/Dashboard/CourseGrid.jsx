import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import CardProgress from "../../Common/CardProgress";
import { slugify } from "../../../../utils/slugify.ts";
import { dashboardService } from "../../../../services/subscriber";
import { getAssetUrl } from "../../../../utils/assetHelpper.ts";

function CourseGrid() {
  const [pakets, setPakets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPakets = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getRecentPakets();
        setPakets(data || []);
      } catch (error) {
        console.error("Error fetching recent pakets:", error);
        setPakets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPakets();
  }, []);

  // Filter pakets yang sudah memiliki progress (sudah diambil exam) dan mapping data
  const dataCardProgress = pakets
    .filter((paket) => {
      // Hanya tampilkan paket yang sudah pernah diambil exam (answered > 0)
      return paket.progress?.answered > 0;
    })
    .map((paket) => ({
      id: paket.id,
      label: paket.label,
      image: getAssetUrl(paket.image),
      progress: {
        answered: paket.progress?.answered || 0,
        totalSoal: paket.progress?.totalSoal || 0,
      },
    }));

  const slideSpeeds = {
    1: "slide-in-from-bottom-[2%]",
    2: "slide-in-from-bottom-[4%]",
    3: "slide-in-from-bottom-[6%]",
    4: "slide-in-from-bottom-[8%]",
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-2.5 font-noto-sans">
        <div className="h-8 bg-slate-100 rounded w-32 animate-pulse" />
        <div className="flex justify-center items-center gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full h-48 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2.5 font-noto-sans">
      <div className="flex justify-between items-center">
        <h1 className="text-heading-5 font-semibold">Status Ujian Terakhir</h1>
        <Link
          to={"/dashboard-subscriber/status-ujian-terakhir"}
          className="underline font-semibold"
        >
          Lihat Semua
        </Link>
      </div>
      <div className="flex justify-start items-center h-[230px] gap-5">
        {dataCardProgress.length === 0 ? (
          <div className="w-full py-12 flex justify-center items-center text-center">
            <p className="text-slate-400 font-medium">
              Belum ada paket soal yang diselesaikan
            </p>
          </div>
        ) : (
          dataCardProgress.map((card) => (
            <CardProgress
              key={card.id}
              label={card.label}
              path={`/dashboard-subscriber/status-ujian-terakhir/${slugify(card.label)}`}
              linkState={{
                from: "status",
                badge: {
                  label: "Status Ujian Terakhir",
                  classes: "border-yellow-300 bg-yellow-50 text-yellow-800",
                },
              }}
              image={card.image}
              progress={card.progress}
              className={`animate-in fade-in duration-500 ${slideSpeeds[card.id] || ""}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CourseGrid;
