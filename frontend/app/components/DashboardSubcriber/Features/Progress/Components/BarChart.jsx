import React, { useMemo } from "react";

export default function BarChart({ mode, data }) {
  const { maxValue, yAxisTicks } = useMemo(() => {
    const values = data && data.length > 0 ? data.map((d) => d.value) : [0];
    const maxDataValue = Math.max(...values, 0);

    // Tentukan Max Value Grafik
    let limit = 10;
    if (maxDataValue > 10) {
      limit = Math.ceil(maxDataValue / 10) * 10;
    }

    // Buat 5 titik untuk Y-Axis
    const ticks = [];
    const step = limit / 5;
    for (let i = 5; i >= 0; i--) {
      ticks.push(Math.round(step * i));
    }

    return { maxValue: limit, yAxisTicks: ticks };
  }, [data]);

  return (
    <div className="bg-white border border-[#8A8A8A] rounded-[10px] p-8 shadow-sm flex-1 animate-in fade-in duration-500 min-w-0">
      <div className="mb-10">
        <h3 className="text-lg font-bold text-slate-900">Aktivitas {mode}</h3>
        <p className="text-xs text-slate-400 font-medium">
          Grafik waktu belajar aktif (dalam menit) selama{" "}
          {mode === "Mingguan" ? "minggu" : "hari"} ini.
        </p>
      </div>

      {/* Kontainer Grafik Utama */}
      <div className="relative h-64 flex flex-col justify-between">
        {/* Y-Axis Lines (Garis Bantu) */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {yAxisTicks.map((tick) => (
            <div key={tick} className="flex items-center w-full gap-4">
              <span className="text-[10px] font-bold text-slate-400 w-6 text-right">
                {tick}
              </span>
              <div className="flex-1 border-t border-slate-100"></div>
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="flex items-end justify-between h-full pl-10 pr-4 relative z-10 gap-2 md:gap-4">
          {data &&
            data.map((item, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col items-center flex-1 h-full justify-end"
              >
                {/* Tooltip on Hover */}
                <div className="absolute -top-10 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold z-20 whitespace-nowrap">
                  {item.value} menit
                </div>

                {/* Bar (Batang Grafik) */}
                <div
                  className="w-full max-w-[32px] bg-blue-500 rounded-t-sm transition-all duration-700 hover:bg-blue-600 cursor-pointer shadow-sm shadow-blue-100"
                  style={{
                    height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                    minHeight: item.value > 0 ? "4px" : "0",
                  }}
                ></div>

                {/* X-Axis Label */}
                <span className="absolute -bottom-8 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            ))}
        </div>
      </div>
      <div className="h-8"></div>
    </div>
  );
}
